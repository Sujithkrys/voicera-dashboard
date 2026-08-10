import asyncio
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

from app.core.database import async_session
from sqlalchemy import text

async def verify():
    async with async_session() as session:
        print("--- CHECKING chat_threads and chat_messages ---")
        res1 = await session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('chat_threads', 'chat_messages');"))
        tables = [r[0] for r in res1.fetchall()]
        print(f"Tables found: {tables}")
        
        print("\n--- CHECKING clients TABLE ---")
        try:
            res2 = await session.execute(text("SELECT COUNT(*) FROM clients;"))
            count = res2.scalar()
            print(f"clients table exists and has {count} rows")
        except Exception as e:
            print(f"clients table error: {e}")
            
        print("\n--- CHECKING auth.users TABLE ---")
        try:
            res3 = await session.execute(text("SELECT COUNT(*) FROM auth.users;"))
            count = res3.scalar()
            print(f"auth.users table exists and has {count} rows")
        except Exception as e:
            print(f"auth.users table error: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
