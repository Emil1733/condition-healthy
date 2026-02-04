-- 1. Insert Tier 1 Locations (Medical Hubs + Population Giants)
INSERT INTO public.locations (slug, city, state, zip_codes, population) VALUES
  ('houston-tx', 'Houston', 'TX', ARRAY['77030', '77001'], 2300000),
  ('boston-ma', 'Boston', 'MA', ARRAY['02115', '02118'], 675000),
  ('philadelphia-pa', 'Philadelphia', 'PA', ARRAY['19104', '19107'], 1600000),
  ('durham-nc', 'Durham', 'NC', ARRAY['27710', '27705'], 280000),
  ('new-york-ny', 'New York', 'NY', ARRAY['10021', '10029'], 8800000),
  ('los-angeles-ca', 'Los Angeles', 'CA', ARRAY['90095', '90033'], 3900000),
  ('chicago-il', 'Chicago', 'IL', ARRAY['60611', '60637'], 2700000),
  ('phoenix-az', 'Phoenix', 'AZ', ARRAY['85004', '85006'], 1600000),
  ('miami-fl', 'Miami', 'FL', ARRAY['33136', '33125'], 440000),
  ('austin-tx', 'Austin', 'TX', ARRAY['78701', '78712'], 970000)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Dummy Studies (The Inventory)
INSERT INTO public.studies (nct_id, title, condition, status, location_city, location_state, compensation, affiliate_link) VALUES
  ('NCT04521098', 'Phase 3 Efficacy Study of IL-17 Inhibitor for Moderate Plaque Psoriasis', 'Psoriasis', 'Recruiting', 'Austin', 'TX', 'Up to $1,200', 'https://maxbounty.com/test-link'),
  ('NCT03928172', 'Investigational Insulin Therapy for Type 2 Diabetes Management', 'Diabetes', 'Recruiting', 'Houston', 'TX', 'Up to $2,500', 'https://maxbounty.com/test-link'),
  ('NCT05512034', 'Acute Migraine Treatment Efficiency in Adults', 'Migraine', 'Recruiting', 'Dallas', 'TX', 'Up to $800', 'https://maxbounty.com/test-link'),
  ('NCT04412987', 'Safety Study of New Biologic for Atopic Dermatitis (Eczema)', 'Eczema', 'Recruiting', 'New York', 'NY', 'Up to $1,500', 'https://maxbounty.com/test-link'),
  ('NCT02837190', 'Rheumatoid Arthritis Paint Management Trial', 'Arthritis', 'Recruiting', 'Boston', 'MA', 'Up to $1,000', 'https://maxbounty.com/test-link');

-- Note: We only add a few studies to verify the logic.
-- The "City" in the study table will match the "City" in the location table for the joins to work via the UI logic if needed, 
-- or we rely on the condition match.
