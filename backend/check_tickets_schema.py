import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def check_schema():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    # Check tickets table schema
    query = """
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'tickets';
    """
    rows = await conn.fetch(query)
    for r in rows:
        print(f"{r['column_name']}: {r['data_type']}")
    
    await conn.close()

asyncio.run(check_schema())
