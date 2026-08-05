from fastapi import APIRouter, Request, HTTPException, Depends
from app.core.config import settings
from app.services.shopify_service import shopify_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/agent-tools", tags=["agent-tools"])

def verify_tool_key(request: Request):
    key = request.headers.get("X-Tool-Key")
    # If not configured, deny all
    if not settings.AGENT_TOOLS_API_KEY or key != settings.AGENT_TOOLS_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@router.post("/order-lookup")
async def order_lookup(request: Request, verified: bool = Depends(verify_tool_key)):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
        
    order_id = data.get("order_id")
    if not order_id:
        raise HTTPException(status_code=400, detail="Missing order_id")
        
    order = await shopify_service.get_order_by_id(str(order_id))
    
    if not order:
        return {"status": "not_found"}
        
    items = [
        {
            "name": item.get("name"), 
            "quantity": item.get("quantity")
        } for item in order.get("line_items", [])
    ]
    
    return {
        "status": order.get("financial_status") or "unknown",
        "fulfillment_status": order.get("fulfillment_status") or "unfulfilled",
        "items": items
    }

@router.post("/stock-lookup")
async def stock_lookup(request: Request, verified: bool = Depends(verify_tool_key)):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
        
    product_name = data.get("product_name")
    size = data.get("size")
    color = data.get("color")
    
    if not product_name:
        raise HTTPException(status_code=400, detail="Missing product_name")
        
    result = await shopify_service.search_product_stock(product_name, size, color)
    return result
