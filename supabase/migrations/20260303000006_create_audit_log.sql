-- AUDIT LOG TABLE
-- Append-only. Every write action is recorded. No UPDATE or DELETE allowed.
-- Satisfies OWASP A09: Security Logging and Monitoring Failures.

CREATE TABLE public.audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id),
  user_email   TEXT,
  action       TEXT NOT NULL,   -- e.g. "tender.create", "greedy.run"
  resource     TEXT,            -- e.g. "tender:abc-123"
  ip_address   INET,
  user_agent   TEXT,
  metadata     JSONB,           -- any extra context
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nobody can update or delete audit log rows (not even admins)
CREATE RULE audit_log_no_update AS ON UPDATE TO public.audit_log DO INSTEAD NOTHING;
CREATE RULE audit_log_no_delete AS ON DELETE TO public.audit_log DO INSTEAD NOTHING;