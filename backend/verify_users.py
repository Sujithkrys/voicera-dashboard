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
        print("--- CHECKING users TABLE ---")
        try:
            res = await session.execute(text("SELECT id, email FROM users LIMIT 1;"))
            row = res.fetchone()
            print(f"users table exists, sample row: {row}")
            
            res2 = await session.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users';
            """))
            cols = res2.fetchall()
            print("Users columns:")
            for col in cols:
                print(f" - {col[0]}: {col[1]}")
                
        except Exception as e:
            print(f"users table error: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
