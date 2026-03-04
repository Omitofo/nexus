-- TENDERS TABLE
-- Core entity. REAL = actual client deal. SANDBOX = market exploration.

CREATE TABLE public.tenders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type                TEXT NOT NULL CHECK (type IN ('REAL', 'SANDBOX')),
  name                TEXT NOT NULL,
  product             TEXT NOT NULL CHECK (product IN ('LNG', 'NG', 'CNG')),
  volume_mt           NUMERIC(12, 2) NOT NULL,
  delivery_date       DATE NOT NULL,
  delivery_location   TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN (
                          'DRAFT', 'RFQ_SENT', 'QUOTES_RECEIVING',
                          'OPTIMAL_FOUND', 'CLOSED'
                        )),
  created_by          UUID NOT NULL REFERENCES public.profiles(id),
  client_user_id      UUID REFERENCES public.profiles(id),
  greedy_score        NUMERIC(5, 2),
  selected_chain_id   UUID,  -- FK added after chains table is created
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenders_updated_at
  BEFORE UPDATE ON public.tenders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();