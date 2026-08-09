import os
import time
import subprocess
import requests
import jwt
from datetime import datetime, timedelta

# Create a JWT token using the same logic as the backend
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-key-for-local-dev-only")
JWT_ALGORITHM = "HS256"

expire = datetime.utcnow() + timedelta(days=1)
token_payload = {
    "exp": expire,
    "sub": "user_id_123",
    "role": "admin",
    "user": {
        "full_name": "Real Admin via JWT",
        "client_id": "test_client_id"
    }
}
token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
headers = {"Authorization": f"Bearer {token}"}

def run_tests():
    # 1. Start uvicorn
    print("Starting uvicorn server...")
    server_process = subprocess.Popen(
        ["python", "-m", "uvicorn", "main:fastapi_app", "--port", "8080"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    try:
        # Wait for server to start
        for _ in range(10):
            try:
                res = requests.get("http://127.0.0.1:8080/api/v1/tickets", headers=headers)
                if res.status_code != 502:
                    break
            except Exception:
                pass
            time.sleep(1)
            
        print("Server is up. Running tests...\n")
        
        call_id = "eb0cc17a-52ef-494d-9b8a-d649357d6409"
        
        # POST /api/v1/tickets
        print("1. POST /api/v1/tickets")
        res = requests.post(
            "http://127.0.0.1:8080/api/v1/tickets", 
            headers=headers,
            json={
                "call_id": call_id,
                "ticket_type": "human_escalation",
                "reason": "Test HTTP request"
            }
        )
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}\n")
        
        if res.status_code != 200:
            return
            
        ticket_id = res.json()["id"]
        
        # GET /api/v1/tickets/:id
        print(f"2. GET /api/v1/tickets/{ticket_id}")
        res = requests.get(f"http://127.0.0.1:8080/api/v1/tickets/{ticket_id}", headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}\n")
        
        # PATCH /api/v1/tickets/:id
        print(f"3. PATCH /api/v1/tickets/{ticket_id}")
        res = requests.patch(
            f"http://127.0.0.1:8080/api/v1/tickets/{ticket_id}", 
            headers=headers,
            json={"status": "resolved"}
        )
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}\n")
        
        # POST /api/v1/tickets/:id/notes
        print(f"4. POST /api/v1/tickets/{ticket_id}/notes")
        res = requests.post(
            f"http://127.0.0.1:8080/api/v1/tickets/{ticket_id}/notes", 
            headers=headers,
            json={"note": "Verified via real HTTP request."}
        )
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}\n")
        
        # GET /api/v1/tickets
        print(f"5. GET /api/v1/tickets")
        res = requests.get("http://127.0.0.1:8080/api/v1/tickets", headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}\n")
        
    finally:
        print("Stopping server...")
        server_process.terminate()
        server_process.wait()

run_tests()
