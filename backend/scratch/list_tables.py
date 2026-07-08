import asyncio
import asyncpg

async def main():
    db_url = "postgresql://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres"
    conn = await asyncpg.connect(db_url)
    rows = await conn.fetch("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'")
    for r in rows:
        print(r['column_name'], r['data_type'])
    await conn.close()

if __name__ == '__main__':
    asyncio.run(main())
