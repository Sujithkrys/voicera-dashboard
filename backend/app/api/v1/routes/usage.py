from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.core.middleware import get_current_user
from supabase import create_client
from app.core.config import settings

router = APIRouter(prefix="/usage", tags=["usage"])

def get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

@router.get("", response_model=Dict[str, Any])
async def get_usage_stats(user=Depends(get_current_user)):
    client_id = user.get("client_id") if isinstance(user, dict) else getattr(user, "client_id", None)
    
    if not client_id:
        raise HTTPException(status_code=400, detail="User has no associated client_id")
        
    supabase = get_supabase()
    
    try:
        # Sum up tokens for the client
        # Wait, supabase-py doesn't have aggregate sum out of the box for python, 
        # so we will fetch all usage records for this client and sum them in Python.
        # For production with millions of rows, use a PostgreSQL RPC or raw SQL.
        response = supabase.table("api_usage").select("prompt_tokens, completion_tokens, total_tokens").eq("client_id", str(client_id)).execute()
        
        data = response.data or []
        
        prompt_tokens = sum(row.get("prompt_tokens", 0) for row in data)
        completion_tokens = sum(row.get("completion_tokens", 0) for row in data)
        total_tokens = sum(row.get("total_tokens", 0) for row in data)
        
        # Hardcode limits for visual purposes since we are on free tier API
        return {
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens,
            "monthly_limit": 100000000, # 100 Million tokens limit
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to fetch usage stats")
