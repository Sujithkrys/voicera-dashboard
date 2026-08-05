from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
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
    outcome = data.get("outcome", "unknown")
    transcript_summary = data.get("transcript_summary", "")
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
