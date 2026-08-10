import httpx
import jwt
from datetime import datetime, timedelta
import asyncio
import os
from dotenv import load_dotenv

load_dotenv('.env')

async def main():
    secret = os.getenv('JWT_SECRET', 'voicera_super_secret_jwt_key_change_this_in_production')
    payload = {
        "sub": "admin@voicera.ai",
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    url = "https://voicera-dashboard-production-3c5b.up.railway.app/api/v1/samvaad/connection-health"
    
    import time
    for _ in range(30):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, headers={"Authorization": f"Bearer {token}"})
                data = res.json()
                if "shopify_token_error" in data:
                    print("LIVE:", data)
                    return
                print("Deploy not live yet, retrying in 10s...")
        except Exception as e:
            print("Error", e)
        time.sleep(10)

asyncio.run(main())
