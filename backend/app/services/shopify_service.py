import httpx
import base64
import hmac
import hashlib
import time
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class ShopifyService:
    def __init__(self):
        self.store_domain = settings.SHOPIFY_STORE_DOMAIN
        self.client_id = settings.SHOPIFY_CLIENT_ID
        self.client_secret = settings.SHOPIFY_CLIENT_SECRET
        self.api_version = settings.SHOPIFY_API_VERSION
        self.webhook_secret = settings.SHOPIFY_WEBHOOK_SECRET
        
        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0

    async def get_access_token(self) -> str:
        """
        Fetches and caches the Shopify access token using client_credentials grant.
        Refreshes if expired.
        """
        if not self.client_id or not self.client_secret or not self.store_domain:
            raise ValueError("Shopify credentials not fully configured")
            
        if self._access_token and time.time() < self._token_expires_at:
            return self._access_token
            
        url = f"https://{self.store_domain}/admin/oauth/access_token"
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials"
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                
                self._access_token = data.get("access_token")
                # Typical token expiration is assumed here, falling back to 24h
                expires_in = data.get("expires_in", 86400) 
                self._token_expires_at = time.time() + expires_in - 300
                
                return self._access_token
        except Exception as e:
            logger.error(f"Error fetching Shopify access token: {e}")
            raise

    def verify_webhook_hmac(self, request_body_bytes: bytes, hmac_header: str) -> bool:
        """
        Verify incoming Shopify webhook against SHOPIFY_WEBHOOK_SECRET.
        """
        if not self.webhook_secret:
            logger.error("SHOPIFY_WEBHOOK_SECRET not configured")
            return False
            
        secret_bytes = self.webhook_secret.encode('utf-8')
        computed_hmac = hmac.new(secret_bytes, request_body_bytes, hashlib.sha256)
        computed_hmac_b64 = base64.b64encode(computed_hmac.digest()).decode('utf-8')
        
        return hmac.compare_digest(computed_hmac_b64, hmac_header)

    async def get_order_by_checkout_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Checks whether a completed order now exists for a given checkout token.
        """
        if not token:
            return None
            
        try:
            access_token = await self.get_access_token()
            url = f"https://{self.store_domain}/admin/api/{self.api_version}/orders.json"
            headers = {
                "X-Shopify-Access-Token": access_token
            }
            params = {
                "checkout_token": token,
                "status": "any"
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    data = response.json()
                    orders = data.get("orders", [])
                    if orders:
                        return orders[0]
                return None
        except Exception as e:
            logger.error(f"Error fetching order by checkout token: {e}")
            return None

    async def get_checkout_details(self, checkout_id: str) -> Optional[Dict[str, Any]]:
        """
        Returns customer phone, name, line items, cart value.
        """
        if not checkout_id:
            return None
            
        try:
            access_token = await self.get_access_token()
            url = f"https://{self.store_domain}/admin/api/{self.api_version}/checkouts/{checkout_id}.json"
            headers = {
                "X-Shopify-Access-Token": access_token
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    return response.json().get("checkout")
                return None
        except Exception as e:
            logger.error(f"Error fetching checkout details: {e}")
            return None

    async def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        if not order_id:
            return None
        try:
            access_token = await self.get_access_token()
            url = f"https://{self.store_domain}/admin/api/{self.api_version}/orders/{order_id}.json"
            headers = {"X-Shopify-Access-Token": access_token}
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    return response.json().get("order")
                return None
        except Exception as e:
            logger.error(f"Error fetching order by ID: {e}")
            return None

    async def search_product_stock(self, product_name: str, size: Optional[str] = None, color: Optional[str] = None) -> Dict[str, Any]:
        """
        Performs a fuzzy match on Shopify products to determine availability.
        Returns {"available": bool, "quantity_bucket": "in_stock" | "low_stock" | "out_of_stock"}
        or {"available": None, "reason": "not_found"}
        """
        if not product_name:
            return {"available": None, "reason": "not_found"}
            
        try:
            access_token = await self.get_access_token()
            url = f"https://{self.store_domain}/admin/api/{self.api_version}/products.json"
            headers = {"X-Shopify-Access-Token": access_token}
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers, params={"limit": 100})
                if response.status_code != 200:
                    return {"available": None, "reason": "not_found"}
                
                products = response.json().get("products", [])
                
                import difflib
                best_match = None
                best_score = 0.0
                
                for p in products:
                    score = difflib.SequenceMatcher(None, product_name.lower(), p.get("title", "").lower()).ratio()
                    if score > best_score:
                        best_score = score
                        best_match = p
                        
                if not best_match or best_score < 0.6:
                    return {"available": None, "reason": "not_found"}
                    
                variants = best_match.get("variants", [])
                matched_variant = None
                
                if size or color:
                    for v in variants:
                        v_title = v.get("title", "").lower()
                        if size and size.lower() not in v_title:
                            continue
                        if color and color.lower() not in v_title:
                            continue
                        matched_variant = v
                        break
                
                if not matched_variant and variants:
                    matched_variant = variants[0]
                    
                if not matched_variant:
                    return {"available": None, "reason": "not_found"}
                    
                inventory_quantity = matched_variant.get("inventory_quantity", 0)
                
                if inventory_quantity <= 0:
                    bucket = "out_of_stock"
                    available = False
                elif inventory_quantity < 5:
                    bucket = "low_stock"
                    available = True
                else:
                    bucket = "in_stock"
                    available = True
                    
                return {
                    "available": available,
                    "quantity_bucket": bucket,
                    "product_name": best_match.get("title"),
                    "variant_name": matched_variant.get("title")
                }
        except Exception as e:
            logger.error(f"Error searching product stock: {e}")
            return {"available": None, "reason": "not_found"}

shopify_service = ShopifyService()
