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
        tables_to_check = ['pending_checkouts', 'sessions', 'tickets']
        for t in tables_to_check:
            print(f"\n--- {t.upper()} ---")
            try:
                res = await session.execute(text(f"""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = '{t}';
                """))
                cols = res.fetchall()
                for col in cols:
                    print(f" - {col[0]}: {col[1]}")
            except Exception as e:
                print(f"Error checking {t}: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
