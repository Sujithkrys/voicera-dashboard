import asyncio
import asyncpg
import json
from datetime import date, datetime

def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

async def query_db():
    db_url = 'postgresql://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres'
    try:
        conn = await asyncpg.connect(db_url)
        
        rows = await conn.fetch('SELECT * FROM call_outcomes ORDER BY created_at DESC LIMIT 5')
        print(f'Rows found: {len(rows)}')
        for i, row in enumerate(rows):
            print(f'Row {i+1}: {json.dumps(dict(row), default=json_serial, indent=2)}')
            
        await conn.close()
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(query_db())
