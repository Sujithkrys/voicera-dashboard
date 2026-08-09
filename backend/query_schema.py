import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def query_db():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    # 1. Query column definition
    query_schema = """
    SELECT column_name, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'call_outcomes' AND column_name = 'duration_seconds';
    """
    row = await conn.fetchrow(query_schema)
    print("=== Column Definition ===")
    if row:
        print(f"column_name: {row['column_name']}")
        print(f"is_nullable: {row['is_nullable']}")
        print(f"column_default: {row['column_default']}")
    else:
        print("Column not found!")
        
    print("\n=== Current Row State ===")
    query_row = "SELECT call_id, duration_seconds FROM call_outcomes WHERE call_id = 'eb0cc17a-52ef-494d-9b8a-d649357d6409';"
    call_row = await conn.fetchrow(query_row)
    if call_row:
        print(f"call_id: {call_row['call_id']}")
        print(f"duration_seconds: {call_row['duration_seconds']}")
    
    await conn.close()

asyncio.run(query_db())
