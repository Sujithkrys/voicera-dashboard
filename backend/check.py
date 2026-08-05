import asyncio
from app.core.database import get_db
from sqlalchemy import text

async def check():
    async for db in get_db():
        res = await db.execute(text("SELECT id, file_name, file_type, file_url FROM kb_documents;"))
        rows = res.fetchall()
        for r in rows:
            print(f"Name: {r.file_name}, Type: {r.file_type}, URL: {r.file_url}")
        break

if __name__ == "__main__":
    asyncio.run(check())
