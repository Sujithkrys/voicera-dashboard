import requests

url = "https://voicera-dashboard-production.up.railway.app/api/v1/chat"
headers = {"Content-Type": "application/json"}
data = {"messages": [{"role": "user", "content": "hi"}], "enabled_tools": []}

try:
    response = requests.post(url, headers=headers, json=data)
    print("Status Code:", response.status_code)
    print("Response text:", response.text)
except Exception as e:
    print("Exception:", e)
