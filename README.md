# Voicera Dashboard & Backend

This repository contains both the FastAPI backend and the customer support dashboard interface for Voicera.

## Repository Layout
- `backend/`: FastAPI application containing all core API routes and orchestration code.
- `dashboard/`: Interactive customer support dashboard UI.

## Getting Started

### Backend Setup
1. Move to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment, then install requirements:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set up your `.env` configuration file based on `.env.example`.
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

### Dashboard Setup
1. Move to the `dashboard/` directory.
2. Copy `config.example.js` to `config.js` and fill in your Supabase/Deepgram API credentials.
3. Open `index.html` in your browser.
