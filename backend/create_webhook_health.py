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
    CREATE TABLE IF NOT EXISTS webhook_health (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        last_received_at TIMESTAMPTZ DEFAULT NOW()
    );
    """
    
    try:
        await conn.execute(query)
        print("Table webhook_health created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(create_tables())
