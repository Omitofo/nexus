-- CHAINS TABLE
-- Stores the result of the greedy algorithm or manual graph assembly.

CREATE TABLE public.chains (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id               UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  is_greedy_optimal       BOOLEAN NOT NULL DEFAULT FALSE,
  node_sequence           UUID[] NOT NULL,  -- ordered node IDs source->client
  total_cost_per_unit     NUMERIC(12, 4) NOT NULL,
  estimated_delivery_days INTEGER NOT NULL,
  overall_score           NUMERIC(5, 2) NOT NULL
                            CHECK (overall_score BETWEEN 0 AND 100),
  score_price             NUMERIC(5, 2) NOT NULL,
  score_risk              NUMERIC(5, 2) NOT NULL,
  score_compliance        NUMERIC(5, 2) NOT NULL,
  score_insurance         NUMERIC(5, 2) NOT NULL,
  score_reputation        NUMERIC(5, 2) NOT NULL,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER chains_updated_at
  BEFORE UPDATE ON public.chains
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add the FK from tenders.selected_chain_id now that chains table exists
ALTER TABLE public.tenders
  ADD CONSTRAINT tenders_selected_chain_fk
  FOREIGN KEY (selected_chain_id) REFERENCES public.chains(id);