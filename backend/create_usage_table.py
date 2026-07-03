import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def create_table():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return
        
    conn = await asyncpg.connect(db_url)
    
    query = """
    CREATE TABLE IF NOT EXISTS api_usage (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        prompt_tokens INTEGER DEFAULT 0,
        completion_tokens INTEGER DEFAULT 0,
        total_tokens INTEGER DEFAULT 0,
        model TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """
    await conn.execute(query)
    print("Table api_usage created successfully!")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(create_table())
