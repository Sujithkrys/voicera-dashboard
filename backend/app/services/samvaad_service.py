import httpx
import logging
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class SamvaadService:
    def __init__(self):
        self.api_key = settings.SAMVAAD_API_KEY
        self.base_url = settings.SAMVAAD_BASE_URL.rstrip("/")
        self.outbound_agent_id = settings.SAMVAAD_OUTBOUND_AGENT_ID
        self.connection_id = settings.SAMVAAD_CONNECTION_ID
        
        self.headers = {
            "api-subscription-key": self.api_key or "",
            "Content-Type": "application/json"
        }

    async def check_dnd(self, phone_number: str) -> bool:
        """
        Calls Samvaad's DND list check.
        Returns True if the number is on the DND list, False otherwise.
        """
        if not self.api_key:
            logger.warning("SAMVAAD_API_KEY not configured, skipping DND check (assuming False)")
            return False
            
        url = f"{self.base_url}/dnd/check"
        payload = {"phone_number": phone_number}
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, headers=self.headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("is_dnd", False)
                else:
                    logger.warning(f"Failed DND check: {response.status_code} {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Error checking DND list: {e}")
            return False

    async def trigger_outbound_call(
        self,
        phone_number: str,
        agent_variables: Dict[str, Any],
        opening_line: str,
        entry_state: str,
        metadata: Dict[str, Any]
    ) -> Optional[str]:
        """
        POST to Samvaad's Instant Outbound endpoint.
        """
        if not self.api_key or not self.outbound_agent_id or not self.connection_id:
            logger.warning("Samvaad credentials not fully configured, cannot trigger call")
            return None
            
        base_app_url = settings.FRONTEND_URL or "https://example.com"
        webhook_url = f"{base_app_url}/api/v1/samvaad/call-outcome"
        
        url = f"{self.base_url}/calls"
        
        payload = {
            "agent_id": self.outbound_agent_id,
            "connection_id": self.connection_id,
            "to_phone_number": phone_number,
            "agent_variables": agent_variables,
            "entry_state": entry_state,
            "app_overrides": {
                "initial_bot_message": opening_line
            },
            "webhook_config": {
                "url": webhook_url
            },
            "metadata": metadata
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, headers=self.headers, json=payload)
                if response.status_code in [200, 201]:
                    data = response.json()
                    return data.get("call_id")
                else:
                    logger.error(f"Failed to trigger outbound call: {response.status_code} {response.text}")
                    return None
        except Exception as e:
            logger.error(f"Error triggering outbound call: {e}")
            return None

    async def fetch_call_outcome(self, call_id: str) -> Optional[Dict[str, Any]]:
        """
        Wraps the Data Fetch API. Used by reconciliation job as fallback.
        """
        if not self.api_key:
            return None
            
        url = f"{self.base_url}/calls/{call_id}"
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=self.headers)
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"Failed to fetch call outcome {call_id}: {response.status_code}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching call outcome {call_id}: {e}")
            return None

samvaad_service = SamvaadService()
