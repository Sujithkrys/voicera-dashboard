import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = """
    SELECT call_id, duration_seconds, created_at 
    FROM call_outcomes 
    ORDER BY created_at DESC;
    """
    rows = await conn.fetch(query)
    
    for row in rows:
        print(f"call_id: {row['call_id']} | duration_seconds: {row['duration_seconds']} | created_at: {row['created_at']}")
        
    await conn.close()

asyncio.run(check_db())
