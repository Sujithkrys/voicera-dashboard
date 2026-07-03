from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.mcp.client import mcp_manager
from app.mcp.tool_loop import run_tool_loop, format_mcp_tools_for_grok
from app.core.middleware import get_current_user
from supabase import create_client
from app.core.config import settings
from datetime import datetime, timedelta

router = APIRouter(prefix="/chat", tags=["chat"])

def get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

class ChatRequest(BaseModel):
    messages: list[dict]
    enabled_tools: Optional[list[str]] = []

@router.post("")
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    client_id = user.get("client_id") if isinstance(user, dict) else getattr(user, "client_id", None)
    supabase = get_supabase()
    
    try:
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
                if provider == "notion":
                    if tool["name"] not in ["API-post-search", "API-post-page", "API-patch-block-children"]:
                        continue
                        
                    # Simplify massive schemas to avoid Groq 12k TPM limits
                    if tool["name"] == "API-post-search":
                        tool["inputSchema"] = {
                            "type": "object",
                            "properties": {
                                "query": {"type": "string"}
                            },
                            "required": ["query"]
                        }
                    elif tool["name"] == "API-post-page":
                        tool["inputSchema"] = {
                            "type": "object",
                            "properties": {
                                "parent": {
                                    "type": "object",
                                    "description": "e.g. {\"page_id\": \"uuid\"}"
                                },
                                "properties": {
                                    "type": "object",
                                    "description": "Page properties, e.g. {\"title\": {\"title\": [{\"text\": {\"content\": \"My Title\"}}]}}"
                                },
                                "children": {
                                    "type": "array",
                                    "description": "Array of block objects, e.g. [{\"object\": \"block\", \"type\": \"paragraph\", \"paragraph\": {\"rich_text\": [{\"text\": {\"content\": \"Text\"}}]}}]"
                                }
                            },
                            "required": ["parent", "properties"]
                        }
                    elif tool["name"] == "API-patch-block-children":
                        tool["inputSchema"] = {
                            "type": "object",
                            "properties": {
                                "block_id": {"type": "string"},
                                "children": {
                                    "type": "array",
                                    "description": "Array of block objects to append"
                                }
                            },
                            "required": ["block_id", "children"]
                        }

                all_mcp_tools.append(tool)
                tool_server_map[tool["name"]] = server

        grok_tools = format_mcp_tools_for_grok(all_mcp_tools)

        async def tool_executor(t_name: str, arguments: dict):
            if t_name not in tool_server_map:
                raise ValueError(f"Unknown tool: {t_name}")
            server = tool_server_map[t_name]
            result = await server.call_tool(t_name, arguments)
            return result

        # Fetch dashboard data context
        try:
            today_iso = (datetime.utcnow() - timedelta(days=1)).isoformat()
            
            # Recent sessions
            sessions = []
            tickets = []
            if client_id:
                sessions_res = supabase.table("sessions").select("id, status, created_at").eq("client_id", str(client_id)).gte("created_at", today_iso).execute()
                sessions = sessions_res.data or []
                
                # Recent tickets
                tickets_res = supabase.table("tickets").select("id, status, issue_summary").eq("client_id", str(client_id)).gte("created_at", today_iso).execute()
                tickets = tickets_res.data or []
                
            resolved_sessions = [s for s in sessions if s.get("status") == "resolved"]
            active_sessions = [s for s in sessions if s.get("status") == "active"]
            
            open_tickets = [t for t in tickets if t.get("status") == "open"]
            resolved_tickets = [t for t in tickets if t.get("status") == "resolved"]

            dashboard_context = (
                f"\n\n--- TODAY'S DASHBOARD SUMMARY ---\n"
                f"Total Sessions (last 24h): {len(sessions)} ({len(resolved_sessions)} resolved, {len(active_sessions)} active)\n"
                f"Total Tickets (last 24h): {len(tickets)} ({len(open_tickets)} open, {len(resolved_tickets)} resolved)\n"
                "Recent Ticket Summaries:\n" + "\n".join([f"- {t.get('issue_summary')} ({t.get('status')})" for t in tickets[:5]]) +
                "\n---------------------------------\n"
                "Use this data if the user asks for 'today's analysis', 'what happened today', 'call resolutions', etc."
            )
        except Exception as e:
            print(f"Error fetching dashboard context: {e}")
            dashboard_context = ""

        system_prompt = (
            "You are Voicera AI, a powerful assistant. "
            "You have access to MCP tools to interact with external services. "
            f"Currently, the user has enabled the following tools: {request.enabled_tools}. "
            "If the user asks you to perform an action using a service (like Notion, Gmail, Calendar, Docs, or Drive) "
            "but the corresponding tool is NOT in the enabled list, you MUST politely inform them that they "
            "need to connect that service first by navigating to 'Settings > Integrations' in the dashboard.\n"
            "CRITICAL INSTRUCTION: If the user asks you to perform an action (e.g., create a Notion page, send an email) "
            "and the tool IS available, you MUST invoke the tool immediately! Do NOT just reply with text saying 'I will do it' "
            "or 'I have created it'. You must actually call the tool function.\n"
            "NOTION TOOL RULES: \n"
            "- If you need to create a page but don't know the `parent_page_id`, you can either ask the user, or if they mention a parent page name, use `API-post-search` to find its ID first.\n"
            "- If no parent page is specified and you want to create a top-level page, try searching for a general workspace page or ask the user for a destination.\n"
            "- Use `API-post-page` to create pages. Format `parent` as `{\"page_id\": \"id\"}` and `properties` with a `title`.\n"
            f"{dashboard_context}"
        )
        # Truncate chat history to last 10 messages to prevent TPM limit errors
        recent_messages = request.messages[-10:] if len(request.messages) > 10 else request.messages
        messages_with_sys = [{"role": "system", "content": system_prompt}] + recent_messages

        reply = await run_tool_loop(
            messages=messages_with_sys,
            available_tools=grok_tools,
            tool_executor=tool_executor
        )

        return {"reply": reply}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")
