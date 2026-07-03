import json
import httpx
import os
from typing import Any

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
GEMINI_MODEL = "gemini-2.5-flash"

async def run_tool_loop(
    messages: list[dict],
    available_tools: list[dict],      # MCP tool definitions formatted for Grok
    tool_executor,                     # async callable: (tool_name, args) -> result
    max_iterations: int = 5
) -> str:
    """
    Runs the Grok tool-call loop until the model stops requesting tools
    or max_iterations is reached.
    
    Returns the final text response.
    """
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    headers = {
        "Authorization": f"Bearer {gemini_api_key}",
        "Content-Type": "application/json"
    }

    iteration = 0

    async with httpx.AsyncClient(timeout=60.0) as client:
        while iteration < max_iterations:
            iteration += 1

            payload = {
                "model": GEMINI_MODEL,
                "messages": messages,
                "tools": available_tools if available_tools else None,
                "tool_choice": "auto" if available_tools else "none"
            }

            # If there are no tools, don't pass 'tools' array
            if not available_tools:
                payload.pop("tools", None)
                payload.pop("tool_choice", None)

            try:
                response = await client.post(GEMINI_API_URL, json=payload, headers=headers)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                error_body = e.response.text
                raise ValueError(f"Gemini API error: {e.response.status_code} - {error_body}")
            
            data = response.json()

            choice = data["choices"][0]
            message = choice["message"]
            finish_reason = choice["finish_reason"]

            # Append assistant message to history
            messages.append(message)

            # If Grok is done — return text
            if finish_reason == "stop" or not message.get("tool_calls"):
                return message.get("content", "")

            # Process each tool call
            if message.get("tool_calls"):
                for tool_call in message["tool_calls"]:
                    tool_name = tool_call["function"]["name"]
                    
                    try:
                        tool_args = json.loads(tool_call["function"]["arguments"])
                    except json.JSONDecodeError:
                        tool_args = {}
                        
                    tool_call_id = tool_call["id"]

                    # Execute via MCP
                    try:
                        result = await tool_executor(tool_name, tool_args)
                        result_content = json.dumps(result)
                    except Exception as e:
                        result_content = f"Tool error: {str(e)}"

                    # Append tool result to message history
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call_id,
                        "content": result_content
                    })

    return "I ran into an issue completing that request. Please try again."


def format_mcp_tools_for_grok(mcp_tools: list[dict]) -> list[dict]:
    """
    Converts MCP tool definitions into Grok/OpenAI function-calling format.
    """
    grok_tools = []
    for tool in mcp_tools:
        grok_tools.append({
            "type": "function",
            "function": {
                "name": tool["name"],
                "description": tool.get("description", ""),
                "parameters": tool.get("inputSchema", {
                    "type": "object",
                    "properties": {}
                })
            }
        })
    return grok_tools
