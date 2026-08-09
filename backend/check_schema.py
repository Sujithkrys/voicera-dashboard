import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def check_schema():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    # Check if tables exist
    query = """
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('tickets', 'ticket_notes');
    """
    rows = await conn.fetch(query)
    tables = [r['table_name'] for r in rows]
    print(f"Tables found: {tables}")
    
    await conn.close()

asyncio.run(check_schema())
