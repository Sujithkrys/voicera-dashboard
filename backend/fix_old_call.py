import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def update_db():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    # Set the duration of the one historical call to 63 seconds
    query = """
    UPDATE call_outcomes
    SET duration_seconds = 63
    WHERE call_id = 'eb0cc17a-52ef-494d-9b8a-d649357d6409';
    """
    await conn.execute(query)
        
    await conn.close()

asyncio.run(update_db())
