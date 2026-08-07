from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
from app.core.middleware import require_admin
from app.services.shopify_service import shopify_service
from app.tasks.samvaad_tasks import process_call_outcome
from app.api.v1.routes.agent_tools import verify_tool_key
import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/samvaad", tags=["samvaad", "webhooks"])

@router.post("/call-start-context")
async def call_start_context(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Called by Samvaad inbound deployment at ring time with caller's phone number.
    Must return a context object gracefully.
    """
    try:
        data = await request.json()
    except Exception:
        return {"agent_variables": {}}

    phone = data.get("phone_number")
    
    if not phone:
        return {"agent_variables": {}}

    query = text("""
        SELECT customer_name, status, cart_value
        FROM pending_checkouts
        WHERE customer_phone = :phone
        ORDER BY created_at DESC
        LIMIT 1
    """)
    
    try:
        result = await db.execute(query, {"phone": phone})
        row = result.fetchone()
        if row:
            agent_variables = {
                "name": row.customer_name,
                "recent_checkout_status": row.status,
                "recent_cart_value": str(row.cart_value)
            }
            return {"agent_variables": agent_variables}
    except Exception as e:
        logger.error(f"Error querying context for {phone}: {e}")

    return {"agent_variables": {}}

@router.post("/call-outcome")
async def call_outcome(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Receives call outcome/transcript summary.
    """
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    call_id = data.get("call_id")
    agent_type = data.get("agent_type", "unknown")
    phone_number = data.get("phone_number")
    outcome = "pending_fetch"
    transcript_summary = ""
    metadata = data.get("metadata", {})
    checkout_id = metadata.get("checkout_id")

    if not call_id:
        return {"status": "ignored", "reason": "Missing call_id"}

    query = text("""
        INSERT INTO call_outcomes (call_id, agent_type, phone_number, outcome, transcript_summary, checkout_id)
        VALUES (:call_id, :agent_type, :phone_number, :outcome, :transcript_summary, :checkout_id)
        ON CONFLICT (call_id) DO NOTHING
    """)
    
    try:
        await db.execute(query, {
            "call_id": call_id,
            "agent_type": agent_type,
            "phone_number": phone_number,
            "outcome": outcome,
            "transcript_summary": transcript_summary,
            "checkout_id": checkout_id
        })
        await db.commit()
        


    except Exception as e:
        logger.error(f"Error logging call outcome: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    return {"status": "ok"}

@router.get("/connection-health")
async def connection_health(
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    # Determine shopify_token_status
    token_status = "unknown"
    try:
        # if we can get a token, it's valid. The service handles expiry internally.
        if shopify_service._access_token:
            import time
            if time.time() > shopify_service._token_expires_at:
                token_status = "expired"
            elif (shopify_service._token_expires_at - time.time()) < 3600:
                token_status = "expiring_soon"
            else:
                token_status = "valid"
        else:
            token_status = "expired"
    except Exception:
        token_status = "expired"
        
    # Get last webhook timestamp
    last_received_at = None
    try:
        res = await db.execute(text("SELECT last_received_at FROM webhook_health ORDER BY last_received_at DESC LIMIT 1"))
        row = res.fetchone()
        if row and row.last_received_at:
            last_received_at = row.last_received_at.isoformat()
    except Exception:
        pass

    return {
        "shopify_webhook_last_received_at": last_received_at,
        "shopify_token_status": token_status,
        "last_checked_at": datetime.datetime.utcnow().isoformat()
    }

@router.get("/reconcile-pending-outcomes")
async def reconcile_pending_outcomes(
    request: Request, 
    verified: bool = Depends(verify_tool_key), 
    db: AsyncSession = Depends(get_db)
):
    query = text("""
        SELECT call_id FROM call_outcomes
        WHERE outcome = 'pending_fetch' 
          AND created_at < NOW() - INTERVAL '2 minutes'
    """)
    try:
        res = await db.execute(query)
        rows = res.fetchall()
        
        count = 0
        for row in rows:
            call_id = row.call_id
            try:
                await process_call_outcome(call_id)
                count += 1
            except Exception as e:
                logger.error(f"Failed to reconcile call {call_id}: {e}")
                
        return {"status": "ok", "reconciled_count": count}
    except Exception as e:
        logger.error(f"Database error in reconcile_pending_outcomes: {e}")
        raise HTTPException(status_code=500, detail="Database error")
