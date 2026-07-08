import asyncio
from typing import List, Dict
import os
from app.core.config import settings

# Attempt to import Firecrawl; if not available, we can fail gracefully or raise an error
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
            },
            poll_interval=2  # Poll every 2 seconds
        )
        
        # crawl_result typically contains a list of crawled pages in 'data'
        if isinstance(crawl_result, dict) and "data" in crawl_result:
            pages = crawl_result["data"]
            for page in pages:
                if "markdown" in page:
                    results.append({
                        "url": page.get("metadata", {}).get("sourceURL", base_url),
                        "content": page["markdown"],
                        "title": page.get("metadata", {}).get("title", base_url)
                    })
        elif isinstance(crawl_result, list):
            for page in crawl_result:
                if "markdown" in page:
                    results.append({
                        "url": page.get("metadata", {}).get("sourceURL", base_url),
                        "content": page["markdown"],
                        "title": page.get("metadata", {}).get("title", base_url)
                    })
    except Exception as e:
        print(f"Firecrawl error: {e}")
        raise e
        
    return results
