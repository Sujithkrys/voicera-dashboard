import asyncio
import asyncpg
import json
from datetime import date, datetime

def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

async def query_recent_calls():
    db_url = 'postgresql://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres'
    try:
        conn = await asyncpg.connect(db_url)
        
        rows = await conn.fetch('SELECT call_id, outcome, transcript_summary, created_at FROM call_outcomes ORDER BY created_at DESC LIMIT 5')
        print(f'Rows found: {len(rows)}')
        for i, row in enumerate(rows):
            print(f'Row {i+1} [{row["created_at"]}]:')
            print(f'  call_id: {row["call_id"]}')
            print(f'  outcome: {repr(row["outcome"])}')
            print(f'  transcript_summary: {repr(row["transcript_summary"])}')
            print('-' * 40)
            
        await conn.close()
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(query_recent_calls())
