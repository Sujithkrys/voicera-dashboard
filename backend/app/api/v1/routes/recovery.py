from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
from app.core.middleware import require_admin
from app.services.shopify_service import shopify_service
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/recovery", tags=["recovery"])

@router.get("/checkouts")
async def get_recovery_checkouts(
    status: Optional[str] = None,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    try:
        query_str = """
            SELECT checkout_id, customer_name, customer_phone, cart_value, status, reason, call_attempts, created_at
            FROM pending_checkouts
        """
        params = {}
        if status and status != 'all':
            query_str += " WHERE status = :status"
            params['status'] = status
            
        query_str += " ORDER BY created_at DESC"
        
        result = await db.execute(text(query_str), params)
        rows = result.fetchall()
        
        checkouts = []
        for row in rows:
            # Mask phone number (e.g. +1234567890 -> +1******7890)
            masked_phone = None
            if row.customer_phone:
                phone = row.customer_phone
                if len(phone) > 6:
                    masked_phone = phone[:2] + '*' * (len(phone) - 6) + phone[-4:]
                else:
                    masked_phone = '***'

            checkouts.append({
                "checkout_id": row.checkout_id,
                "customer_name": row.customer_name,
                "customer_phone": masked_phone,
                "cart_value": float(row.cart_value) if row.cart_value else 0.0,
                "status": row.status,
                "reason": row.reason,
                "call_attempts": row.call_attempts,
                "created_at": row.created_at.isoformat() if row.created_at else None
            })
            
        return {"checkouts": checkouts}
    except Exception as e:
        logger.error(f"Error fetching recovery checkouts: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@router.get("/stats")
async def get_recovery_stats(
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    try:
        stats = {
            "total_triggered": 0,
            "converted_count": 0,
            "conversion_rate": 0.0,
            "revenue_recovered": 0.0,
            "dnd_skipped_count": 0
        }
        
        # Total triggered & Converted count
        res = await db.execute(text("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted_count,
                SUM(CASE WHEN status = 'converted' THEN cart_value ELSE 0 END) as revenue_recovered,
                SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as dnd_skipped_count
            FROM pending_checkouts
        """))
        row = res.fetchone()
        
        if row and row.total > 0:
            stats["total_triggered"] = row.total
            stats["converted_count"] = int(row.converted_count or 0)
            stats["revenue_recovered"] = float(row.revenue_recovered or 0.0)
            stats["conversion_rate"] = (stats["converted_count"] / stats["total_triggered"]) * 100
            stats["dnd_skipped_count"] = int(row.dnd_skipped_count or 0)
            
        return stats
    except Exception as e:
        logger.error(f"Error fetching recovery stats: {e}")
        raise HTTPException(status_code=500, detail="Database error")
