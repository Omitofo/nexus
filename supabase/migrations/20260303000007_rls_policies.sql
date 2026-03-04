-- ROW LEVEL SECURITY POLICIES
-- All policies in one dedicated file for clarity.
-- The Fastify backend uses the service role key which bypasses RLS.
-- The frontend browser client uses the anon key which is subject to RLS.

-- Enable RLS on every table
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chains    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: returns true if the calling user has the operator role
CREATE OR REPLACE FUNCTION public.is_operator()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'operator'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──────────────────────────────────────────────────────
CREATE POLICY "profiles: users read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── TENDERS ───────────────────────────────────────────────────────
-- Operators see all tenders; clients see only their own
CREATE POLICY "tenders: read"
  ON public.tenders FOR SELECT
  USING (
    public.is_operator()
    OR client_user_id = auth.uid()
  );

-- ── NODES ─────────────────────────────────────────────────────────
-- Any authenticated user can read nodes (needed for graph display)
CREATE POLICY "nodes: authenticated read"
  ON public.nodes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── QUOTES ────────────────────────────────────────────────────────
-- Operators see all; clients see quotes for their tenders only
CREATE POLICY "quotes: read"
  ON public.quotes FOR SELECT
  USING (
    public.is_operator()
    OR tender_id IN (
      SELECT id FROM public.tenders WHERE client_user_id = auth.uid()
    )
  );

-- ── CHAINS ────────────────────────────────────────────────────────
CREATE POLICY "chains: read"
  ON public.chains FOR SELECT
  USING (
    public.is_operator()
    OR tender_id IN (
      SELECT id FROM public.tenders WHERE client_user_id = auth.uid()
    )
  );

-- ── AUDIT LOG ─────────────────────────────────────────────────────
-- Only operators can read audit log. No one can write from browser.
CREATE POLICY "audit_log: operators read"
  ON public.audit_log FOR SELECT
  USING (public.is_operator());