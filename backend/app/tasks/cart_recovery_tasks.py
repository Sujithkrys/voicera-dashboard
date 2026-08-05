import os
import asyncio
import asyncpg
import logging
from celery import shared_task
from app.services.shopify_service import shopify_service
from app.services.samvaad_service import samvaad_service

logger = logging.getLogger(__name__)

async def process_cart_recovery():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL not set for cart recovery task")
        return

    try:
        conn = await asyncpg.connect(db_url)
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return

    # Find pending_checkouts rows older than 12 minutes still in status 'pending'
    query = """
        SELECT id, checkout_token, checkout_id, customer_phone, customer_name, cart_items, cart_value
        FROM pending_checkouts
        WHERE status = 'pending' 
          AND created_at < NOW() - INTERVAL '12 minutes'
          AND call_attempts < 1
    """
    
    try:
        records = await conn.fetch(query)
    except Exception as e:
        logger.error(f"Failed to fetch pending checkouts: {e}")
        await conn.close()
        return

    for row in records:
        checkout_id = row['checkout_id']
        checkout_token = row['checkout_token']
        phone = row['customer_phone']
        
        # 1. Double check if order exists via Shopify
        order = await shopify_service.get_order_by_checkout_token(checkout_token)
        if order:
            await conn.execute("UPDATE pending_checkouts SET status = 'converted' WHERE id = $1", row['id'])
            continue
            
        reason = "unknown"
            
        # 2. Check DND
        if phone:
            is_dnd = await samvaad_service.check_dnd(phone)
            if is_dnd:
                logger.info(f"Skipping checkout {checkout_id}, phone is DND")
                await conn.execute("UPDATE pending_checkouts SET status = 'skipped', reason = $2 WHERE id = $1", row['id'], reason)
                continue
                
            # 3. Trigger Outbound Call
            opening_line = f"Hi {row['customer_name'] or 'there'}, we noticed you left something in your cart. Can we help you with your order?"
            
            agent_variables = {
                "name": row['customer_name'] or '',
                "cart_value": str(row['cart_value'])
            }
            
            call_id = await samvaad_service.trigger_outbound_call(
                phone_number=phone,
                agent_variables=agent_variables,
                opening_line=opening_line,
                entry_state="default",
                metadata={"checkout_id": checkout_id}
            )
            
            if call_id:
                logger.info(f"Triggered outbound call {call_id} for checkout {checkout_id}")
                await conn.execute(
                    "UPDATE pending_checkouts SET status = 'called', reason = $2, call_attempts = call_attempts + 1 WHERE id = $1", 
                    row['id'], reason
                )
            else:
                logger.error(f"Failed to trigger call for checkout {checkout_id}")
        else:
            logger.info(f"No phone number for checkout {checkout_id}, skipping")
            await conn.execute("UPDATE pending_checkouts SET status = 'skipped', reason = $2 WHERE id = $1", row['id'], reason)

    await conn.close()

@shared_task(name="app.tasks.cart_recovery_tasks.run_cart_recovery")
def run_cart_recovery():
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    loop.run_until_complete(process_cart_recovery())
