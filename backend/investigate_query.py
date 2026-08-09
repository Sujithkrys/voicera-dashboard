import asyncio
import asyncpg
import os

async def query_db():
    db_url = 'postgresql://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres'
    try:
        conn = await asyncpg.connect(db_url)
        
        # 1. Total pending_fetch rows
        total_pending = await conn.fetchval("SELECT COUNT(*) FROM call_outcomes WHERE outcome = 'pending_fetch'")
        
        # 2. Total pending_fetch rows older than 2 minutes
        older_than_2_mins = await conn.fetchval("SELECT COUNT(*) FROM call_outcomes WHERE outcome = 'pending_fetch' AND created_at < NOW() - INTERVAL '2 minutes'")
        
        # 3. All rows in call_outcomes (limit 5)
        recent_rows = await conn.fetch("SELECT call_id, outcome, created_at, NOW() as current_db_time FROM call_outcomes ORDER BY created_at DESC LIMIT 5")
        
        print(f'Total rows with outcome="pending_fetch": {total_pending}')
        print(f'Rows with outcome="pending_fetch" AND older than 2 mins: {older_than_2_mins}')
        print('\nRecent 5 rows in call_outcomes:')
        for r in recent_rows:
            print(f"ID: {r['call_id'][:10]}... | Outcome: {r['outcome']} | Created: {r['created_at']} | DB Time: {r['current_db_time']}")
            
        await conn.close()
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(query_db())
