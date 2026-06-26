# Voicera Backend v1.2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

fastapi_app = FastAPI(
    title="Voicera Backend API",
    description="Backend for Voicera - AI-powered customer support platform",
    version="0.1.0",
)

# Set up CORS middleware
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://voicera-dashboard.thalathotysujith.workers.dev",
        "https://voicera-dashboard.teamvoicera7.workers.dev",
        "https://voicera-landing.teamvoicera7.workers.dev",
        "https://voicera-superadmin.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
import traceback
from fastapi.responses import JSONResponse

@fastapi_app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Unhandled Exception: {str(exc)}",
            "traceback": traceback.format_exc()
        }
    )

@fastapi_app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "voicera-backend"
    }

import os
@fastapi_app.get("/debug-env")
async def debug_env():
    db_url = os.getenv("DATABASE_URL") or ""
    masked_db = db_url
    if "@" in db_url:
        parts = db_url.split("@")
        masked_db = "postgresql://***:***@" + parts[-1]
    return {
        "DATABASE_URL": masked_db,
        "SUPABASE_URL": os.getenv("SUPABASE_URL"),
        "JWT_SECRET_SET": bool(os.getenv("JWT_SECRET")),
        "BREVO_API_KEY_SET": bool(os.getenv("BREVO_API_KEY")),
        "SUPABASE_SERVICE_KEY_SET": bool(os.getenv("SUPABASE_SERVICE_KEY")),
    }

from app.api.v1.routes import (
    auth_router, kb_router, config_router, chat_router, 
    sessions_router, tickets_router, waitlist_router, calendar_router, voice_router, voice_llm_router,
    availability_router
)

fastapi_app.include_router(auth_router, prefix="/api/v1")
fastapi_app.include_router(kb_router, prefix="/api/v1")
fastapi_app.include_router(config_router, prefix="/api/v1")
fastapi_app.include_router(chat_router, prefix="/api/v1")
fastapi_app.include_router(sessions_router, prefix="/api/v1")
fastapi_app.include_router(tickets_router, prefix="/api/v1")
fastapi_app.include_router(waitlist_router, prefix="/api/v1")
fastapi_app.include_router(calendar_router, prefix="/api/v1")
fastapi_app.include_router(voice_router, prefix="/api/v1")
fastapi_app.include_router(voice_llm_router, prefix="/api/v1")
fastapi_app.include_router(availability_router, prefix="/api/v1")

from app.api.v1.routes.bot_config import router as bot_config_router
fastapi_app.include_router(bot_config_router, prefix="/api/v1")

from app.api.v1.routes.voice_kb import router as voice_kb_router
fastapi_app.include_router(voice_kb_router, prefix="/api/v1")

from app.api.v1.routes.superadmin import router as superadmin_router
fastapi_app.include_router(superadmin_router, prefix="/api/v1")


