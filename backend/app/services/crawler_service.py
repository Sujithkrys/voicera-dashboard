import asyncio
from typing import List, Dict
import os
from app.core.config import settings

try:
    from firecrawl import AsyncFirecrawlApp
except ImportError:
    AsyncFirecrawlApp = None

async def crawl_website(base_url: str, max_pages: int = 10) -> List[Dict[str, str]]:
    """Crawl a website using Firecrawl API."""
    
    if not AsyncFirecrawlApp:
        raise Exception("firecrawl-py is not installed or available.")
        
    if not settings.FIRECRAWL_API_KEY:
        raise Exception("FIRECRAWL_API_KEY is not set in environment variables.")
        
    app = AsyncFirecrawlApp(api_key=settings.FIRECRAWL_API_KEY)
    
    results = []
    
    try:
        # Start the crawl
        crawl_result = await app.async_crawl_url(
            base_url,
            params={
                "limit": max_pages,
                "scrapeOptions": {
                    "formats": ["markdown"]
                }
            }
        )
        
        crawl_id = crawl_result.id
        
        # Poll for completion
        while True:
            status = await app.check_crawl_status(crawl_id)
            if status.status == 'completed':
                pages = status.data
                break
            elif status.status in ['failed', 'cancelled']:
                raise Exception(f"Crawl failed with status: {status.status}")
                
            await asyncio.sleep(3)
            
        for page in pages:
            # Handle both dict and object access depending on SDK version
            if isinstance(page, dict):
                markdown = page.get("markdown")
                metadata = page.get("metadata", {})
                title = metadata.get("title", base_url)
                source_url = metadata.get("sourceURL", base_url)
            else:
                markdown = getattr(page, "markdown", None)
                metadata = getattr(page, "metadata", None)
                title = getattr(metadata, "title", base_url) if metadata else base_url
                source_url = getattr(metadata, "sourceURL", base_url) if metadata else base_url
                
            if markdown:
                results.append({
                    "url": source_url,
                    "content": markdown,
                    "title": title
                })
                
    except Exception as e:
        print(f"Firecrawl error: {e}")
        raise e
        
    return results
