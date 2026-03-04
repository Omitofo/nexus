-- SUPPLY CHAIN NODES TABLE
-- Each row is a company or asset in the supply chain.

CREATE TABLE public.nodes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type               TEXT NOT NULL CHECK (type IN (
                       'GAS_SOURCE', 'TRADER', 'LIQUEFACTION',
                       'TRANSPORT', 'REGASIFICATION', 'STORAGE'
                     )),
  name               TEXT NOT NULL,
  company_name       TEXT NOT NULL,
  country            CHAR(2) NOT NULL,  -- ISO 3166-1 alpha-2
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  reputation_score   NUMERIC(5, 2) NOT NULL DEFAULT 50
                       CHECK (reputation_score BETWEEN 0 AND 100),
  insurance_class    TEXT NOT NULL,
  certifications     TEXT[] NOT NULL DEFAULT '{}',
  regulatory_rating  NUMERIC(5, 2) NOT NULL DEFAULT 50
                       CHECK (regulatory_rating BETWEEN 0 AND 100),
  rfq_email          TEXT NOT NULL,
  rfq_webhook_url    TEXT,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER nodes_updated_at
  BEFORE UPDATE ON public.nodes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();