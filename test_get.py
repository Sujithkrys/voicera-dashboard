import requests

url = "https://voicera-dashboard-production.up.railway.app/api/v1/oauth/status"
headers = {
    "Origin": "https://voicera-dashboard.pages.dev"
}
response = requests.get(url, headers=headers)
print("Status Code:", response.status_code)
print("Headers:", response.headers)
print("Body:", response.text)
