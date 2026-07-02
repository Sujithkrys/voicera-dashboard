from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.mcp.client import mcp_manager
from app.mcp.tool_loop import run_tool_loop, format_mcp_tools_for_grok
from app.core.middleware import get_current_user
from supabase import create_client
from app.core.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])

def get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

class ChatRequest(BaseModel):
    messages: list[dict]
    enabled_tools: Optional[list[str]] = []

@router.post("/")
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    user_id = user["id"] if isinstance(user, dict) else user.id
    supabase = get_supabase()
    
    all_mcp_tools = []
    tool_server_map = {}

    for tool_name in (request.enabled_tools or []):
        provider = "google" if tool_name != "notion" else "notion"
        
        token_row = supabase.table("user_integrations")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("provider", provider)\
            .execute()

        if not token_row.data:
            continue

        tokens = {
            "refresh_token": token_row.data[0].get("refresh_token"),
            "notion_token": token_row.data[0].get("access_token"),
        }

        server = await mcp_manager.get_or_create_session(str(user_id), tool_name, tokens)

        for tool in server.tools:
            all_mcp_tools.append(tool)
            tool_server_map[tool["name"]] = server

    grok_tools = format_mcp_tools_for_grok(all_mcp_tools)

    async def tool_executor(t_name: str, arguments: dict):
        if t_name not in tool_server_map:
            raise ValueError(f"Unknown tool: {t_name}")
        server = tool_server_map[t_name]
        result = await server.call_tool(t_name, arguments)
        return result

    try:
        reply = await run_tool_loop(
            messages=request.messages,
            available_tools=grok_tools,
            tool_executor=tool_executor
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"reply": reply}
