from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
from app.services.shopify_service import shopify_service
import logging
import json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/shopify/webhooks", tags=["shopify", "webhooks"])

@router.post("/checkouts-create")
async def checkout_create_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body_bytes = await request.body()
    hmac_header = request.headers.get("X-Shopify-Hmac-Sha256", "")
    
    if not shopify_service.verify_webhook_hmac(body_bytes, hmac_header):
        raise HTTPException(status_code=401, detail="Invalid HMAC signature")
        
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    checkout_id = str(data.get("id", ""))
    token = data.get("token")

    customer = data.get("customer")
    phone = None
    name = ""

    if isinstance(customer, dict):
        phone = customer.get("phone")
        name = f"{customer.get('first_name', '')} {customer.get('last_name', '')}".strip()

    if not phone:
        shipping = data.get("shipping_address")
        if isinstance(shipping, list) and len(shipping) > 0 and isinstance(shipping[0], dict):
            phone = shipping[0].get("phone")
        elif isinstance(shipping, dict):
            phone = shipping.get("phone")
            
    if not phone:
        phone = data.get("phone")
    
    line_items = data.get("line_items", [])
    cart_items_json = json.dumps(line_items)
    cart_value = float(data.get("total_price", 0.0))
    
    logger.info(f"Checkout webhook check: checkout_id={data.get('id')!r}, token={data.get('token')!r}, full_keys={list(data.keys())}")

    if not checkout_id or not token:
        return {"status": "ignored", "reason": "Missing checkout ID or token"}

    check_query = text("SELECT id FROM pending_checkouts WHERE checkout_id = :checkout_id LIMIT 1")
    result = await db.execute(check_query, {"checkout_id": checkout_id})
    if result.scalar():
        return {"status": "ok", "message": "Already exists"}

    query = text("""
        INSERT INTO pending_checkouts (checkout_id, checkout_token, customer_phone, customer_name, cart_items, cart_value, status)
        VALUES (:checkout_id, :checkout_token, :customer_phone, :customer_name, :cart_items::jsonb, :cart_value, 'pending')
    """)
    
    try:
        await db.execute(query, {
            "checkout_id": checkout_id,
            "checkout_token": token,
            "customer_phone": phone,
            "customer_name": name,
            "cart_items": cart_items_json,
            "cart_value": cart_value
        })
        await db.commit()
    except Exception as e:
        logger.error(f"Error inserting pending checkout: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    try:
        await db.execute(text("INSERT INTO webhook_health (last_received_at) VALUES (NOW())"))
        await db.commit()
    except Exception:
        pass

    return {"status": "ok"}

@router.post("/orders-create")
async def order_create_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body_bytes = await request.body()
    hmac_header = request.headers.get("X-Shopify-Hmac-Sha256", "")
    
    if not shopify_service.verify_webhook_hmac(body_bytes, hmac_header):
        raise HTTPException(status_code=401, detail="Invalid HMAC signature")
        
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    checkout_token = data.get("checkout_token")
    if not checkout_token:
        return {"status": "ignored", "reason": "No checkout token"}

    query = text("""
        UPDATE pending_checkouts
        SET status = 'converted'
        WHERE checkout_token = :checkout_token AND status = 'pending'
    """)
    
    try:
        await db.execute(query, {"checkout_token": checkout_token})
        await db.commit()
    except Exception as e:
        logger.error(f"Error updating checkout status: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    try:
        await db.execute(text("INSERT INTO webhook_health (last_received_at) VALUES (NOW())"))
        await db.commit()
    except Exception:
        pass

    return {"status": "ok"}
