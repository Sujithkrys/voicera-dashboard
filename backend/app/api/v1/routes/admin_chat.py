import os
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Optional
from openai import OpenAI
from app.core.config import settings

router = APIRouter(prefix="/admin-chat", tags=["admin-chat"])

class AdminChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

@router.post("")
async def send_admin_chat_message(request: AdminChatRequest):
    try:
        oai = OpenAI(
            api_key=os.getenv("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1"
        )
        system_prompt = "You are a helpful dashboard assistant for Voicera. Provide concise, helpful answers about the dashboard, call metrics, escalations, or configuration. You are talking to the Voicera dashboard administrator."
        
        messages = [{"role": "system", "content": system_prompt}]
        
        if request.history:
            for msg in request.history[-6:]:  # Keep last 6 messages for context
                role = msg.get("role", "user")
                if role not in ["user", "assistant"]:
                    continue
                messages.append({"role": role, "content": msg.get("content", "")})
                
        messages.append({"role": "user", "content": request.message})
        
        response = oai.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
            temperature=0.7,
            max_tokens=600
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        print(f"Admin chat error: {e}")
        return {"response": "Sorry, an error occurred while connecting to Groq. Please check your API key or try again later."}
