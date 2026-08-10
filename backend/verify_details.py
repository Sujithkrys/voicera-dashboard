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
        # Check if chat tables are empty
        res = await session.execute(text("SELECT COUNT(*) FROM chat_threads;"))
        print(f"chat_threads rows: {res.scalar()}")
        
        res = await session.execute(text("SELECT COUNT(*) FROM chat_messages;"))
        print(f"chat_messages rows: {res.scalar()}")
        
        # Check users table id column
        res = await session.execute(text("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_schema='public' AND table_name='users' AND column_name='id';
        """))
        print(f"users.id data type: {res.scalar()}")
        
        # Check tickets table schema specifically
        res = await session.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema='public' AND table_name='tickets';
        """))
        print(f"tickets columns: {res.fetchall()}")

if __name__ == "__main__":
    asyncio.run(verify())
