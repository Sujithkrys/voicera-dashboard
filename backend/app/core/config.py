from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    DATABASE_URL: str = ""
    
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    
    REDIS_URL: Optional[str] = None
    
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: Optional[str] = None
    SARVAM_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    
    FRONTEND_URL: Optional[str] = None
    FIRECRAWL_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    SAMVAAD_API_KEY: Optional[str] = None
    SAMVAAD_BASE_URL: str = "https://apps.sarvam.ai/api/app-authoring/v1"
    SAMVAAD_ORG_ID: Optional[str] = None
    SAMVAAD_WORKSPACE_ID: Optional[str] = None
    SAMVAAD_OUTBOUND_AGENT_ID: Optional[str] = None
    SAMVAAD_INBOUND_AGENT_ID: Optional[str] = None
    SAMVAAD_CONNECTION_ID: Optional[str] = None
    AGENT_TOOLS_API_KEY: Optional[str] = None

    SHOPIFY_STORE_DOMAIN: Optional[str] = None
    SHOPIFY_CLIENT_ID: Optional[str] = None
    SHOPIFY_CLIENT_SECRET: Optional[str] = None
    SHOPIFY_API_VERSION: str = "2026-07"
    SHOPIFY_WEBHOOK_SECRET: Optional[str] = None
    
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "https://voicera-dashboard-production.up.railway.app/api/v1/calendar/callback"
    BREVO_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
