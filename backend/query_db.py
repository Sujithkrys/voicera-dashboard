import asyncio
import asyncpg

async def query_db():
    db_url = 'postgresql://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres'
    try:
        conn = await asyncpg.connect(db_url)
        
        # Check call_outcomes
        outcomes_count = await conn.fetchval('SELECT COUNT(*) FROM call_outcomes')
        print(f'call_outcomes count: {outcomes_count}')
        if outcomes_count > 0:
            latest_outcome = await conn.fetchrow('SELECT * FROM call_outcomes ORDER BY created_at DESC LIMIT 1')
            print(f'Latest call_outcomes: {dict(latest_outcome)}')
            
        # Check pending_checkouts
        checkouts_count = await conn.fetchval('SELECT COUNT(*) FROM pending_checkouts')
        print(f'pending_checkouts count: {checkouts_count}')
        if checkouts_count > 0:
            latest_checkout = await conn.fetchrow('SELECT * FROM pending_checkouts ORDER BY created_at DESC LIMIT 1')
            print(f'Latest pending_checkouts: {dict(latest_checkout)}')
            
        await conn.close()
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(query_db())
