import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def migrate():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = "ALTER TABLE call_outcomes ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;"
    status = await conn.execute(query)
    
    print(f"Status: {status}")
    await conn.close()

asyncio.run(migrate())
