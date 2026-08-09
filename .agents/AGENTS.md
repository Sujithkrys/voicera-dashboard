# Standing Rules for Voicera Project

1. NEVER show mock, placeholder, or fabricated data as if it were real, anywhere in the UI or in explanations. If real data isn't available yet, show an honest empty/pending state instead of an invented value.
2. Before writing to any database (INSERT/UPDATE/DELETE) or running any schema migration, show the exact command and wait for explicit approval. Never run it and tell the user afterward.
3. Before pushing any commit to GitHub or deploying, show the full diff and wait for explicit "yes, apply this" — a plan document is not approval, only direct confirmation is.
4. If not certain something works (an API endpoint, a config binding, a claimed platform behavior), say so explicitly and tell the user how to verify it, rather than stating it confidently. If a claim is made that works and later found it doesn't, flag the correction clearly rather than quietly moving on.
5. When fixing a bug, verify the fix against real data end-to-end (query the actual database, check the actual live page) before saying it's done. A log line or a code change is not verification.
6. Never guess at credentials, IDs, table names, or API shapes. If something is unknown, tell the user what needs to be checked and where to check it, rather than trying plausible-looking values.
7. Keep changes scoped to exactly what was asked for in that message. Don't bundle unrelated fixes into the same diff without flagging them separately first.
8. If an automated edit fails, partially applies, or has an unexpected side effect, stop and report the exact current state before attempting a different approach — don't retry blindly.
