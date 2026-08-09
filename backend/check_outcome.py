import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = """
    SELECT call_id, outcome, transcript_summary, created_at 
    FROM call_outcomes 
    WHERE call_id = 'eb0cc17a-52ef-494d-9b8a-d649357d6409';
    """
    row = await conn.fetchrow(query)
    
    if row:
        print(f"call_id: {row['call_id']}")
        print(f"outcome: {row['outcome']}")
        print(f"transcript_summary: {row['transcript_summary']}")
        print(f"created_at: {row['created_at']}")
    else:
        print("Row not found.")
        
    await conn.close()

asyncio.run(check_db())
