import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def run_migration():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    with open('migrate_tickets.sql', 'r') as f:
        sql = f.read()
        
    await conn.execute(sql)
    print("Migration successful")
    await conn.close()

asyncio.run(run_migration())
