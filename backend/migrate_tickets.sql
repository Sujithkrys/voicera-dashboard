-- 1. Preserve the old schema and data by renaming
ALTER TABLE tickets RENAME TO tickets_legacy_widget;

-- 2. Create the new schema for Voice AI calls
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id TEXT REFERENCES call_outcomes(call_id),
    ticket_type TEXT NOT NULL,
    reason TEXT,
    requested_item TEXT,
    contact_preference TEXT,
    contact_value TEXT,
    scheduled_callback_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'open',
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE ticket_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id),
    note TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add CHECK Constraints
ALTER TABLE tickets ADD CONSTRAINT chk_ticket_type CHECK (ticket_type IN ('callback_requested', 'human_escalation', 'product_availability', 'other'));
ALTER TABLE tickets ADD CONSTRAINT chk_ticket_status CHECK (status IN ('open', 'in_progress', 'resolved', 'cancelled'));

-- 4. Re-enable RLS on new tables
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_notes ENABLE ROW LEVEL SECURITY;
