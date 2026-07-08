from typing import List
from openai import OpenAI
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        self.client = OpenAI(
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
        """Generate batch embeddings using OpenAI, processing in chunks of 100."""
        if not texts:
            return []
            
        all_embeddings = []
        batch_size = 100
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            # Clean texts (OpenAI recommendation)
            batch = [t.replace("\n", " ") for t in batch]
            
            response = self.client.embeddings.create(
                input=batch,
                model=self.model,
                dimensions=768
            )
            all_embeddings.extend([item.embedding for item in response.data])
            
        return all_embeddings

# Singleton instance
embedding_service = EmbeddingService()
