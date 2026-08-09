import asyncio
import asyncpg
import httpx
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.join(os.path.dirname(__file__)))
from app.core.security import create_access_token

load_dotenv()

async def investigate():
    db_url = os.getenv('DATABASE_URL')
    conn = await asyncpg.connect(db_url)
    
    query = "SELECT call_id, duration_seconds FROM call_outcomes WHERE call_id = 'eb0cc17a-52ef-494d-9b8a-d649357d6409';"
    row = await conn.fetchrow(query)
    
    print("=== Database Row ===")
    if row:
        print(f"call_id: {row['call_id']}")
        print(f"duration_seconds: {row['duration_seconds']}")
    else:
        print("Row not found.")
        
    await conn.close()
    
    print("\n=== API Response ===")
    admin_token = create_access_token(data={"sub": "admin", "client_id": "test_client_id_1"})
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get("http://127.0.0.1:8000/api/v1/sessions", headers=headers)
            print(f"Status Code: {resp.status_code}")
            data = resp.json()
            sessions = data.get("sessions", [])
            for s in sessions:
                if s.get("id") == "eb0cc17a-52ef-494d-9b8a-d649357d6409":
                    print(f"Match found in API!")
                    print(f"metadata: {s.get('metadata')}")
                    return
            print("Session not found in API response.")
        except Exception as e:
            print(f"API request failed: {e}")

asyncio.run(investigate())
