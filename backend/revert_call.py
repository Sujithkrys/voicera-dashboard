import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def revert_db():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    # Check rows with duration_seconds > 0
    query_check = "SELECT call_id, duration_seconds FROM call_outcomes WHERE duration_seconds > 0;"
    rows = await conn.fetch(query_check)
    print(f"Rows with duration > 0 before update: {len(rows)}")
    for r in rows:
        print(f" - {r['call_id']}: {r['duration_seconds']}")
    
    # Set back to NULL
    query_update = """
    UPDATE call_outcomes
    SET duration_seconds = NULL
    WHERE call_id = 'eb0cc17a-52ef-494d-9b8a-d649357d6409';
    """
    await conn.execute(query_update)
        
    await conn.close()
    print("Row reverted to NULL.")

asyncio.run(revert_db())
