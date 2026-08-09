import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def migrate():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = "ALTER TABLE call_outcomes ADD COLUMN IF NOT EXISTS failure_reason TEXT;"
    status = await conn.execute(query)
    
    print(f"Status: {status}")
    await conn.close()

asyncio.run(migrate())
