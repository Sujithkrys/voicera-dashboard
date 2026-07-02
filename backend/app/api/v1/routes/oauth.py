from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse
import httpx
import os
import urllib.parse
from supabase import create_client
from app.core.config import settings
from app.core.middleware import get_current_user
from app.core.security import verify_token

router = APIRouter(prefix="/oauth", tags=["oauth"])

def get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

GOOGLE_SCOPES = " ".join([
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents",
])

NOTION_CLIENT_ID = os.getenv("NOTION_CLIENT_ID")
NOTION_CLIENT_SECRET = os.getenv("NOTION_CLIENT_SECRET")
NOTION_REDIRECT_URI = os.getenv("NOTION_REDIRECT_URI")


@router.get("/google/authorize")
async def google_authorize(token: str):
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={urllib.parse.quote(GOOGLE_REDIRECT_URI or '')}"
        "&response_type=code"
        f"&scope={GOOGLE_SCOPES}"
        "&access_type=offline"
        "&prompt=consent"
        f"&state={user_id}"
    )
    return RedirectResponse(url)


@router.get("/google/callback")
async def google_callback(code: str, state: str, request: Request):
    user_id = state
    supabase = get_supabase()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        )
        tokens = response.json()

    if "error" in tokens:
        raise HTTPException(status_code=400, detail=tokens["error"])

    supabase.table("user_integrations").upsert({
        "user_id": user_id,
        "provider": "google",
        "access_token": tokens.get("access_token"),
        "refresh_token": tokens.get("refresh_token"),
        "scopes": GOOGLE_SCOPES.split(" "),
    }).execute()

    for tool in ["gmail", "google-calendar", "google-drive", "google-docs"]:
        supabase.table("user_mcp_tools").upsert({
            "user_id": user_id,
            "tool_name": tool,
            "enabled": True
        }).execute()

    dashboard_url = os.getenv("FRONTEND_URL") or os.getenv("DASHBOARD_URL") or "https://voicera-dashboard.pages.dev"
    return RedirectResponse(f"{dashboard_url}/settings/integrations?status=google_connected")


@router.get("/notion/authorize")
async def notion_authorize(token: str):
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    url = (
        "https://api.notion.com/v1/oauth/authorize"
        f"?client_id={NOTION_CLIENT_ID}"
        f"&redirect_uri={urllib.parse.quote(NOTION_REDIRECT_URI or '')}"
        "&response_type=code"
        f"&owner=user"
        f"&state={user_id}"
    )
    return RedirectResponse(url)


@router.get("/notion/callback")
async def notion_callback(code: str, state: str):
    user_id = state
    supabase = get_supabase()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.notion.com/v1/oauth/token",
            auth=(NOTION_CLIENT_ID or "", NOTION_CLIENT_SECRET or ""),
            json={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": NOTION_REDIRECT_URI
            }
        )
        tokens = response.json()

    if "error" in tokens:
        raise HTTPException(status_code=400, detail=tokens.get("error_description", "Unknown error"))

    supabase.table("user_integrations").upsert({
        "user_id": user_id,
        "provider": "notion",
        "access_token": tokens.get("access_token"),
        "refresh_token": tokens.get("access_token"),
    }).execute()

    supabase.table("user_mcp_tools").upsert({
        "user_id": user_id,
        "tool_name": "notion",
        "enabled": True
    }).execute()

    dashboard_url = os.getenv("FRONTEND_URL") or os.getenv("DASHBOARD_URL") or "https://voicera-dashboard.pages.dev"
    return RedirectResponse(f"{dashboard_url}/settings/integrations?status=notion_connected")


@router.get("/status")
async def integration_status(user=Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user.get("user_id") if isinstance(user, dict) else getattr(user, "id", None)
    
    rows = supabase.table("user_mcp_tools")\
        .select("tool_name, enabled")\
        .eq("user_id", user_id)\
        .execute()
    
    return {row["tool_name"]: row["enabled"] for row in (rows.data or [])}
