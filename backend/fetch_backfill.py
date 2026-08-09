import asyncio
import asyncpg
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

sys.path.append(os.path.join(os.path.dirname(__file__)))

from app.services.samvaad_service import samvaad_service

load_dotenv()

async def fetch_backfill():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = "SELECT call_id, created_at FROM call_outcomes WHERE call_id = 'eb0cc17a-52ef-494d-9b8a-d649357d6409';"
    row = await conn.fetchrow(query)
    
    if not row:
        print("Row not found.")
        await conn.close()
        return
        
    created_at = row['created_at']
    print(f"Row created_at: {created_at}")
    
    print("Fetching from Analytics API...")
    result = await samvaad_service.fetch_call_outcome_by_time(created_at)
    
    print("\n=== Result ===")
    if result:
        print(f"Duration extracted: {result.get('duration_seconds')} seconds")
        print(f"Failure reason: {result.get('failure_reason')}")
        print(f"Agent variables: {result.get('agent_variables')}")
    else:
        print("No matching interaction found.")
        
    await conn.close()

asyncio.run(fetch_backfill())
