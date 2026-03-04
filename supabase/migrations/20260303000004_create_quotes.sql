-- QUOTES TABLE
-- One row per (tender, node) pair. Created when RFQ is broadcast.
-- Updated when node replies (via Fastify API).

CREATE TABLE public.quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id       UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  node_id         UUID NOT NULL REFERENCES public.nodes(id) ON DELETE RESTRICT,
  status          TEXT NOT NULL DEFAULT 'SENT'
                    CHECK (status IN (
                      'SENT', 'PENDING', 'REPLIED', 'DECLINED', 'EXPIRED'
                    )),
  price_per_unit  NUMERIC(12, 4),
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  valid_until     TIMESTAMPTZ,
  lead_time_days  INTEGER,
  notes           TEXT,
  document_urls   TEXT[] NOT NULL DEFAULT '{}',
  received_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One quote per node per tender
  UNIQUE (tender_id, node_id)
);

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable Realtime on quotes so frontend receives live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;