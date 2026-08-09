import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def delete_rows():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = "DELETE FROM call_outcomes WHERE call_id IN ('...', 'test-manual-call-id-12345');"
    status = await conn.execute(query)
    
    print(f"Status: {status}")
    await conn.close()

asyncio.run(delete_rows())
