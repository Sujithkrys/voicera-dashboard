import os
import asyncio
import asyncpg
import logging
from celery import shared_task
from app.services.samvaad_service import samvaad_service

logger = logging.getLogger(__name__)

async def process_call_outcome(call_id: str):
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL not set for samvaad tasks")
        return

    try:
        conn = await asyncpg.connect(db_url)
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return

    try:
        row = await conn.fetchrow("SELECT created_at FROM call_outcomes WHERE call_id = $1", call_id)
        if not row:
            logger.error(f"Could not find row for call {call_id}")
            return

        data = await samvaad_service.fetch_call_outcome_by_time(row['created_at'])
        if not data:
            logger.error(f"Could not fetch analytics data for call {call_id} around {row['created_at']}")
            return
        
        agent_vars = data.get("agent_variables", {})
        duration = data.get("duration_seconds")
        failure_reason = data.get("failure_reason", "NO_FAILURE_REASON")
        
        outcome = agent_vars.get("call_disposition") or "unknown"
        transcript_summary = agent_vars.get("call_summary") or ""
        
        query = """
            UPDATE call_outcomes
            SET outcome = $1, transcript_summary = $2, duration_seconds = COALESCE($3, duration_seconds), failure_reason = $4
            WHERE call_id = $5
        """
        await conn.execute(query, outcome, transcript_summary, duration, failure_reason, call_id)
        logger.info(f"Updated call outcome for {call_id}: {outcome}")

    except Exception as e:
        logger.error(f"Error updating call outcome for {call_id}: {e}")
    finally:
        await conn.close()

@shared_task(name="app.tasks.samvaad_tasks.fetch_and_update_call_outcome")
def fetch_and_update_call_outcome(call_id: str):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    loop.run_until_complete(process_call_outcome(call_id))
