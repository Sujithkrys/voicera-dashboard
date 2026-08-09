import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def get_call_id():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    row = await conn.fetchrow("SELECT call_id FROM call_outcomes LIMIT 1;")
    print(row['call_id'] if row else "None")
    await conn.close()

asyncio.run(get_call_id())
