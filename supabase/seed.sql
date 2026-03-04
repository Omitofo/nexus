-- Development seed data.
-- Run with: supabase db reset (resets + runs all migrations + this seed)
-- WARNING: Do not run against production.

-- Create test operator user (password: Test1234!)
-- In real dev you will create users via Supabase Studio or Auth API.
-- This seed just creates sample nodes and a sandbox tender.

INSERT INTO public.nodes (type, name, company_name, country, reputation_score,
  insurance_class, certifications, regulatory_rating, rfq_email)
VALUES
  ('GAS_SOURCE', 'Qatar Field Alpha', 'QatarEnergy', 'QA', 97,
   'Lloyds A+', '{ISO 9001,ISO 14001}', 95, 'rfq@qatarenergy.qa'),

  ('TRADER', 'Trafigura LNG Desk', 'Trafigura', 'CH', 91,
   'P&I Class A', '{ISO 9001,SOX}', 88, 'lng-rfq@trafigura.com'),

  ('TRADER', 'Vitol Gas Trading', 'Vitol Group', 'NL', 85,
   'P&I Class B', '{ISO 9001}', 82, 'gas@vitol.com'),

  ('LIQUEFACTION', 'Shell Pearl GTL', 'Shell', 'QA', 93,
   'Lloyds A+', '{ISO 9001,ISO 14001,EU-ETS}', 91, 'lng-ops@shell.com'),

  ('TRANSPORT', 'Maersk LNG Carrier', 'Maersk Tankers', 'DK', 89,
   'P&I Class A', '{MARPOL,ISM,ISO 9001}', 87, 'chartering@maersk.com'),

  ('TRANSPORT', 'Neptune Energy Vessel', 'Neptune Shipping', 'GR', 71,
   'P&I Class B', '{MARPOL,ISM}', 74, 'ops@neptune-shipping.gr'),

  ('REGASIFICATION', 'Enagas Barcelona Terminal', 'Enagas', 'ES', 94,
   'Lloyds A', '{ISO 9001,ISO 14001,EU-ETS}', 96, 'terminal@enagas.es'),

  ('REGASIFICATION', 'GNL Italia Terminal', 'GNL Italia', 'IT', 88,
   'P&I Class A', '{ISO 9001,EU-ETS}', 90, 'rfq@gnlitalia.it')
;