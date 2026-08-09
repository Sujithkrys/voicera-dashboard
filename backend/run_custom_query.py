import asyncio
import asyncpg

async def run_query():
    db_url = 'postgresql://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres'
    try:
        conn = await asyncpg.connect(db_url)
        rows = await conn.fetch('SELECT call_id, outcome, transcript_summary, created_at FROM call_outcomes ORDER BY created_at DESC LIMIT 3;')
        for i, r in enumerate(rows):
            print(f"--- Row {i+1} ---")
            print(f"call_id: {r['call_id']}")
            print(f"outcome: {r['outcome']}")
            print(f"transcript_summary: {r['transcript_summary']}")
            print(f"created_at: {r['created_at']}")
        await conn.close()
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(run_query())
