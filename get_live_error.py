import requests
import random

url = 'https://voicera-dashboard-production.up.railway.app/api/v1/auth/signup'
rand_id = random.randint(1000, 9999)
payload = {
    'company_name': f'Test Company {rand_id}',
    'company_email': f'test_sujith_{rand_id}@gmail.com',
    'password': 'Password123!',
    'domain': 'gmail.com'
}

print(f"Sending signup request for test_sujith_{rand_id}@gmail.com...")
try:
    response = requests.post(
        url, 
        json=payload, 
        headers={'Origin': 'https://voicera-dashboard.thalathotysujith.workers.dev'}
    )
    print('Status Code:', response.status_code)
    print('Response JSON:', response.json() if 'application/json' in response.headers.get('Content-Type', '') else response.text)
except Exception as e:
    print('Error:', e)
