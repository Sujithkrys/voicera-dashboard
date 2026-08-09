from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
from app.core.middleware import require_admin
from pydantic import BaseModel
from typing import Optional, List
import json

router = APIRouter(prefix="/tickets", tags=["tickets"])

class TicketCreateRequest(BaseModel):
    call_id: str
    ticket_type: str
    reason: Optional[str] = None
    requested_item: Optional[str] = None
    contact_preference: Optional[str] = None
    contact_value: Optional[str] = None

class TicketUpdateRequest(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None

class NoteCreateRequest(BaseModel):
    note: str

@router.get("")
async def list_tickets(
    status: Optional[str] = None,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    query_str = """
        SELECT t.id, t.call_id, t.ticket_type, t.reason, t.requested_item, 
               t.contact_preference, t.contact_value, t.scheduled_callback_at, 
               t.status, t.assigned_to, t.created_at, t.resolved_at,
               c.phone_number, c.outcome, c.transcript_summary, c.duration_seconds
        FROM tickets t
        LEFT JOIN call_outcomes c ON t.call_id = c.call_id
    """
    params = {}
    if status and status != 'all':
        query_str += " WHERE t.status = :status"
        params['status'] = status
        
    query_str += " ORDER BY t.created_at DESC"
    
    result = await db.execute(text(query_str), params)
    tickets = [dict(row._mapping) for row in result]
    
    # We must ensure UUIDs and datetimes are serialized to strings
    for t in tickets:
        if t['id']: t['id'] = str(t['id'])
        if t['created_at']: t['created_at'] = t['created_at'].isoformat()
        if t['resolved_at']: t['resolved_at'] = t['resolved_at'].isoformat()
        if t['scheduled_callback_at']: t['scheduled_callback_at'] = t['scheduled_callback_at'].isoformat()
        
    return {"tickets": tickets}

@router.get("/{ticket_id}")
async def get_ticket(
    ticket_id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    # Fetch ticket
    query_str = """
        SELECT t.id, t.call_id, t.ticket_type, t.reason, t.requested_item, 
               t.contact_preference, t.contact_value, t.scheduled_callback_at, 
               t.status, t.assigned_to, t.created_at, t.resolved_at,
               c.phone_number, c.outcome, c.transcript_summary, c.duration_seconds
        FROM tickets t
        LEFT JOIN call_outcomes c ON t.call_id = c.call_id
        WHERE t.id = :ticket_id
    """
    result = await db.execute(text(query_str), {"ticket_id": ticket_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    ticket = dict(row._mapping)
    ticket['id'] = str(ticket['id'])
    if ticket['created_at']: ticket['created_at'] = ticket['created_at'].isoformat()
    if ticket['resolved_at']: ticket['resolved_at'] = ticket['resolved_at'].isoformat()
    if ticket['scheduled_callback_at']: ticket['scheduled_callback_at'] = ticket['scheduled_callback_at'].isoformat()

    # Fetch notes
    notes_query = """
        SELECT id, note, created_by, created_at
        FROM ticket_notes
        WHERE ticket_id = :ticket_id
        ORDER BY created_at ASC
    """
    notes_result = await db.execute(text(notes_query), {"ticket_id": ticket_id})
    notes = [dict(n._mapping) for n in notes_result]
    for n in notes:
        n['id'] = str(n['id'])
        if n['created_at']: n['created_at'] = n['created_at'].isoformat()
        
    ticket["ticket_notes"] = notes
    return ticket

@router.post("")
async def create_ticket(
    request: TicketCreateRequest,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    query_str = """
        INSERT INTO tickets (call_id, ticket_type, reason, requested_item, contact_preference, contact_value)
        VALUES (:call_id, :ticket_type, :reason, :requested_item, :contact_preference, :contact_value)
        RETURNING id, status, created_at
    """
    params = request.dict(exclude_none=True)
    for field in ['reason', 'requested_item', 'contact_preference', 'contact_value']:
        if field not in params:
            params[field] = None
            
    try:
        result = await db.execute(text(query_str), params)
        await db.commit()
        row = dict(result.fetchone()._mapping)
        row['id'] = str(row['id'])
        row['created_at'] = row['created_at'].isoformat()
        return row
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{ticket_id}")
async def update_ticket(
    ticket_id: str,
    request: TicketUpdateRequest,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    updates = []
    params = {"ticket_id": ticket_id}
    
    if request.status:
        updates.append("status = :status")
        params["status"] = request.status
        if request.status in ("resolved", "cancelled"):
            updates.append("resolved_at = NOW()")
            
    if request.assigned_to is not None:
        updates.append("assigned_to = :assigned_to")
        params["assigned_to"] = request.assigned_to
        
    if not updates:
        return {"status": "no updates"}
        
    query_str = f"""
        UPDATE tickets SET {", ".join(updates)}
        WHERE id = :ticket_id
        RETURNING id, status, assigned_to
    """
    
    try:
        result = await db.execute(text(query_str), params)
        await db.commit()
        row = result.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Ticket not found")
        row_dict = dict(row._mapping)
        row_dict['id'] = str(row_dict['id'])
        return row_dict
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{ticket_id}/notes")
async def add_note(
    ticket_id: str,
    request: NoteCreateRequest,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    created_by = current_user.get("user", {}).get("full_name") or "System"
    query_str = """
        INSERT INTO ticket_notes (ticket_id, note, created_by)
        VALUES (:ticket_id, :note, :created_by)
        RETURNING id, note, created_by, created_at
    """
    params = {
        "ticket_id": ticket_id,
        "note": request.note,
        "created_by": created_by
    }
    
    try:
        result = await db.execute(text(query_str), params)
        await db.commit()
        row = dict(result.fetchone()._mapping)
        row['id'] = str(row['id'])
        row['created_at'] = row['created_at'].isoformat()
        return row
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
