import asyncio
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

from app.core.database import async_session
from sqlalchemy import text

async def create_tables():
    async with async_session() as session:
        print("Dropping existing tables...")
        await session.execute(text("DROP TABLE IF EXISTS chat_messages CASCADE;"))
        await session.execute(text("DROP TABLE IF EXISTS chat_threads CASCADE;"))

        print("Creating chat_threads table...")
        await session.execute(text("""
            CREATE TABLE IF NOT EXISTS chat_threads (
                id TEXT PRIMARY KEY,
                client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                title TEXT DEFAULT 'New chat',
                is_pinned BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """))
        
        print("Creating chat_messages table...")
        await session.execute(text("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id TEXT PRIMARY KEY,
                thread_id TEXT REFERENCES chat_threads(id) ON DELETE CASCADE,
                role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """))
        
        await session.commit()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(create_tables())
