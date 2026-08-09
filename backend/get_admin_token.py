import jwt
from datetime import datetime, timedelta

def get_token():
    # Try with the local JWT_SECRET
    secret = "voicera_super_secret_jwt_key_change_this_in_production"
    
    payload = {
        "sub": "admin@voicera.ai",
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token

print(get_token())
