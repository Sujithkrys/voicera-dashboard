from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.core.middleware import get_current_user
from supabase import create_client, Client
from app.core.config import settings

router = APIRouter(prefix="/chat-history", tags=["chat-history"])

def get_supabase() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

class MessageModel(BaseModel):
    id: str
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ThreadModel(BaseModel):
    id: str
    title: str
    isPinned: Optional[bool] = False
    messages: List[MessageModel] = []
    createdAt: Optional[datetime] = None

@router.get("")
async def get_history(user=Depends(get_current_user)):
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    supabase = get_supabase()
    
    # Fetch threads
    threads_res = supabase.table("chat_threads").select("*").eq("user_id", str(user_id)).order("created_at", desc=True).execute()
    threads_data = threads_res.data or []
    
    if not threads_data:
        return []
        
    # Fetch messages for these threads
    thread_ids = [t["id"] for t in threads_data]
    messages_res = supabase.table("chat_messages").select("*").in_("thread_id", thread_ids).order("created_at", desc=False).execute()
    messages_data = messages_res.data or []
    
    # Group messages by thread_id
    from collections import defaultdict
    msgs_by_thread = defaultdict(list)
    for m in messages_data:
        msgs_by_thread[m["thread_id"]].append({
            "id": m["id"],
            "role": m["role"],
            "content": m["content"],
            "timestamp": m["created_at"]
        })
        
    result = []
    for t in threads_data:
        result.append({
            "id": t["id"],
            "title": t["title"],
            "isPinned": t["is_pinned"],
            "createdAt": t["created_at"],
            "messages": msgs_by_thread.get(t["id"], [])
        })
        
    return result

@router.post("/thread")
async def create_thread(thread: ThreadModel, user=Depends(get_current_user)):
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    client_id = user.get("client_id") if isinstance(user, dict) else getattr(user, "client_id", None)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    supabase = get_supabase()
    
    payload = {
        "id": thread.id,
        "user_id": str(user_id),
        "title": thread.title,
        "is_pinned": thread.isPinned
    }
    if client_id:
        payload["client_id"] = str(client_id)
        
    res = supabase.table("chat_threads").insert(payload).execute()
    return {"status": "ok"}

@router.delete("/thread/{thread_id}")
async def delete_thread(thread_id: str, user=Depends(get_current_user)):
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    supabase = get_supabase()
    supabase.table("chat_threads").delete().eq("id", thread_id).eq("user_id", str(user_id)).execute()
    return {"status": "ok"}

@router.patch("/thread/{thread_id}/pin")
async def toggle_pin_thread(thread_id: str, payload: dict, user=Depends(get_current_user)):
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    is_pinned = payload.get("isPinned", False)
    supabase = get_supabase()
    supabase.table("chat_threads").update({"is_pinned": is_pinned}).eq("id", thread_id).eq("user_id", str(user_id)).execute()
    return {"status": "ok"}

@router.post("/thread/{thread_id}/message")
async def add_message(thread_id: str, message: MessageModel, user=Depends(get_current_user)):
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    supabase = get_supabase()
    
    # Insert message
    msg_payload = {
        "id": message.id,
        "thread_id": thread_id,
        "role": message.role,
        "content": message.content
    }
    supabase.table("chat_messages").insert(msg_payload).execute()
    return {"status": "ok"}
