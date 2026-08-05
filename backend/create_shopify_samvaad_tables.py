import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def create_tables():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return
        
    conn = await asyncpg.connect(db_url)
    
    query = """
    CREATE TABLE IF NOT EXISTS pending_checkouts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        checkout_id TEXT NOT NULL,
        checkout_token TEXT,
        customer_phone TEXT,
        customer_name TEXT,
        cart_items JSONB,
        cart_value NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        status TEXT CHECK (status IN ('pending', 'converted', 'called', 'skipped')) DEFAULT 'pending',
        reason TEXT CHECK (reason IN ('abandoned', 'failed_payment', 'unknown')),
        call_attempts INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS call_outcomes (
        call_id TEXT PRIMARY KEY,
        agent_type TEXT,
        phone_number TEXT,
        outcome TEXT,
        transcript_summary TEXT,
        checkout_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """
    
    try:
        await conn.execute(query)
        print("Tables pending_checkouts and call_outcomes created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(create_tables())
