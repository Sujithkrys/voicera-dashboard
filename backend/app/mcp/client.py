import asyncio
import json
import os
from typing import Optional

class MCPServerProcess:
    """Manages a single MCP server subprocess."""
    
    def __init__(self, name: str, command: str, args: list, env: dict):
        self.name = name
        self.command = command
        self.args = args
        self.env = env
        self.process: Optional[asyncio.subprocess.Process] = None
        self.tools: list = []

    async def start(self):
        full_env = {**os.environ, **self.env}
        self.process = await asyncio.create_subprocess_exec(
            self.command, *self.args,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=full_env
        )
        # Initialize MCP handshake
        await self._send_request("initialize", {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "chat-platform", "version": "1.0.0"}
        })
        # Fetch available tools
        tools_response = await self._send_request("tools/list", {})
        self.tools = tools_response.get("tools", [])
        return self.tools

    async def call_tool(self, tool_name: str, arguments: dict) -> dict:
        response = await self._send_request("tools/call", {
            "name": tool_name,
            "arguments": arguments
        })
        return response

    async def _send_request(self, method: str, params: dict) -> dict:
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }
        payload = json.dumps(request) + "\n"
        if not self.process or not self.process.stdin or not self.process.stdout:
            raise RuntimeError("MCP process not running properly")

        self.process.stdin.write(payload.encode())
        await self.process.stdin.drain()
        
        line = await asyncio.wait_for(
            self.process.stdout.readline(), 
            timeout=60.0
        )
        return json.loads(line.decode())

    async def stop(self):
        if self.process:
            self.process.terminate()
            await self.process.wait()


class MCPClientManager:
    """
    Manages per-user MCP server sessions.
    Each active user gets their own set of MCP server processes
    with their own OAuth tokens injected.
    """

    def __init__(self):
        # key: user_id, value: dict of { tool_name: MCPServerProcess }
        self._sessions: dict[str, dict[str, MCPServerProcess]] = {}

    async def get_or_create_session(
        self, 
        user_id: str, 
        tool_name: str, 
        user_tokens: dict
    ) -> MCPServerProcess:
        if user_id not in self._sessions:
            self._sessions[user_id] = {}

        if tool_name not in self._sessions[user_id]:
            server = await self._spawn_server(tool_name, user_tokens)
            self._sessions[user_id][tool_name] = server

        return self._sessions[user_id][tool_name]

    async def _spawn_server(self, tool_name: str, tokens: dict) -> MCPServerProcess:
        configs = {
            "gmail": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-gmail"],
                "env": {
                    "GMAIL_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
                    "GMAIL_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", ""),
                    "GMAIL_REFRESH_TOKEN": tokens.get("refresh_token", ""),
                }
            },
            "google-calendar": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-google-calendar"],
                "env": {
                    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
                    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", ""),
                    "GOOGLE_REFRESH_TOKEN": tokens.get("refresh_token", ""),
                }
            },
            "google-drive": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-gdrive"],
                "env": {
                    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
                    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", ""),
                    "GOOGLE_REFRESH_TOKEN": tokens.get("refresh_token", ""),
                }
            },
            "google-docs": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-google-docs"],
                "env": {
                    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", ""),
                    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET", ""),
                    "GOOGLE_REFRESH_TOKEN": tokens.get("refresh_token", ""),
                }
            },
            "notion": {
                "command": "npx",
                "args": ["-y", "@notionhq/notion-mcp-server"],
                "env": {
                    "NOTION_API_TOKEN": tokens.get("notion_token", ""),
                }
            }
        }

        if tool_name not in configs:
            raise ValueError(f"Unknown MCP tool: {tool_name}")

        config = configs[tool_name]
        server = MCPServerProcess(
            name=tool_name,
            command=config["command"],
            args=config["args"],
            env=config["env"]
        )
        await server.start()
        return server

    async def teardown_user_session(self, user_id: str):
        if user_id in self._sessions:
            for server in self._sessions[user_id].values():
                await server.stop()
            del self._sessions[user_id]


mcp_manager = MCPClientManager()
