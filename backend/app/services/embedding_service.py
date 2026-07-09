import asyncio
from typing import List
from openai import OpenAI, AsyncOpenAI
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.GEMINI_API_KEY or "dummy_key",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.async_client = AsyncOpenAI(
            api_key=settings.GEMINI_API_KEY or "dummy_key",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.model = "gemini-embedding-2"

    def generate_embedding(self, text: str) -> List[float]:
        """Generate a 768-dimensional embedding using Gemini."""
        if not text:
            return [0.0] * 768
            
        response = self.client.embeddings.create(
            input=[text.replace("\n", " ")],
            model=self.model,
            dimensions=768
        )
        return response.data[0].embedding

    def generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Synchronous version for backwards compatibility."""
        return asyncio.run(self.async_generate_batch_embeddings(texts))

    async def async_generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate batch embeddings asynchronously with rate limit handling."""
        if not texts:
            return []
            
        all_embeddings = []
        batch_size = 15 # Small batch size for Gemini free tier
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch = [t.replace("\n", " ") for t in batch]
            
            retries = 3
            while retries > 0:
                try:
                    response = await self.async_client.embeddings.create(
                        input=batch,
                        model=self.model,
                        dimensions=768
                    )
                    all_embeddings.extend([item.embedding for item in response.data])
                    break
                except Exception as e:
                    if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                        print(f"Rate limited. Waiting 10 seconds... ({retries} retries left)")
                        await asyncio.sleep(10)
                        retries -= 1
                    else:
                        raise e
            
            # Small delay between batches to respect free tier (100 RPM max)
            if i + batch_size < len(texts):
                await asyncio.sleep(2)
            
        return all_embeddings

# Singleton instance
embedding_service = EmbeddingService()
