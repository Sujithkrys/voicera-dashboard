import asyncio
import asyncpg
import os

async def check_db():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    rows = await conn.fetch("SELECT call_id, phone_number, created_at FROM call_outcomes ORDER BY created_at DESC LIMIT 3")
    for r in rows:
        print(f"Row: ID='{r['call_id']}', Phone='{r['phone_number']}'")
    await conn.close()

asyncio.run(check_db())
