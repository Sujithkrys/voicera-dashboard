import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://postgres:Sujith%402608@db.zlqefahavxdqfhpejqyd.supabase.co:5432/postgres"

async def main():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        print("Dropping old foreign keys...")
        await conn.execute(text("ALTER TABLE user_integrations DROP CONSTRAINT IF EXISTS user_integrations_user_id_fkey;"))
        await conn.execute(text("ALTER TABLE user_mcp_tools DROP CONSTRAINT IF EXISTS user_mcp_tools_user_id_fkey;"))
        
        print("Adding new foreign keys to public.users...")
        await conn.execute(text("ALTER TABLE user_integrations ADD CONSTRAINT user_integrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;"))
        await conn.execute(text("ALTER TABLE user_mcp_tools ADD CONSTRAINT user_mcp_tools_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;"))
        
        print("Successfully updated foreign keys!")

asyncio.run(main())
