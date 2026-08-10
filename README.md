# Voicera - AI Customer Support Agent

Voicera is an AI-powered customer support and cart recovery platform for e-commerce. It leverages advanced LLMs and integrations (Shopify, Sarvam AI) to automatically handle customer queries, book support calls, and execute cart recovery campaigns.

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy (async), Celery, Redis
- **Database**: PostgreSQL (Supabase)
- **Frontend**: React 18, Vite, Tailwind CSS, Material UI
- **AI / LLMs**: Sarvam AI, OpenAI, Anthropic, Gemini, Firecrawl
- **Integrations**: Shopify, Google Calendar, Brevo, Resend

## Features

### Working
- **User Authentication**: Multi-tenant workspace architecture with JWT auth.
- **Dashboard UI**: Full metric tracking, call logs, ticket management, and settings configuration.
- **Shopify Integration**: Automated webhook ingestion for checkouts and cart recovery tracking.
- **AI Chat Assistant**: Built-in ChatGPT-style interface for querying recent calls and tickets using Model Context Protocol (MCP).
- **Email Notifications**: Transactional emails for signup, booking confirmations, and agent summaries.
- **Agent Configuration**: Inbound and outbound voice agent configuration (via Sarvam AI).

### In Progress
- Advanced cart recovery analytics and timeline tracking.
- Seamless one-click Google Calendar OAuth synchronization.
- Deepened Firecrawl website scraping for automated Knowledge Base generation.

## Local Setup

### 1. Database & Services
You will need a PostgreSQL database (e.g., Supabase) and a Redis instance (for Celery background tasks).

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and fill in your variables.
```bash
uvicorn main:app --reload
```

*(Optional) Start the Celery worker for background tasks:*
```bash
celery -A app.celery_app worker --loglevel=info
```

### 3. Frontend Setup
```bash
cd dashboard
npm install
```
Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:8000`.
```bash
npm run dev
```

## Environment Variables
Reference the `.env.example` files in both the `backend/` and `dashboard/` directories. 

**Key Backend Variables:**
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `DATABASE_URL`
- `JWT_SECRET`, `REDIS_URL`
- `SARVAM_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`
- `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_WEBHOOK_SECRET`
- `BREVO_API_KEY`, `GOOGLE_CLIENT_ID`

**Key Frontend Variables:**
- `VITE_API_URL`

## Project Structure
- `/backend`: FastAPI application, background workers, and database schemas.
- `/dashboard`: Vite + React frontend application.

## License
MIT License
