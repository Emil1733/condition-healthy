-- 1. Update page_content with Deep Content Columns
ALTER TABLE public.page_content 
ADD COLUMN IF NOT EXISTS medical_context text,
ADD COLUMN IF NOT EXISTS environmental_factors text,
ADD COLUMN IF NOT EXISTS local_faq jsonb;

-- 2. Ensure locations table has RLS for Service Role
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Policy for Public Read
DROP POLICY IF EXISTS "Public locations are viewable by everyone" ON public.locations;
CREATE POLICY "Public locations are viewable by everyone"
  ON public.locations FOR SELECT
  USING ( true );

-- Policy for Admin Write (Service Role)
DROP POLICY IF EXISTS "Service role can manage locations" ON public.locations;
CREATE POLICY "Service role can manage locations"
  ON public.locations FOR ALL
  USING ( true )
  WITH CHECK ( true );

-- 3. Ensure page_content has RLS for Service Role
DROP POLICY IF EXISTS "Service role can manage content" ON public.page_content;
CREATE POLICY "Service role can manage content"
  ON public.page_content FOR ALL
  USING ( true )
  WITH CHECK ( true );

-- 4. Ensure studies has RLS for Service Role
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studies ADD CONSTRAINT studies_nct_id_key UNIQUE (nct_id);

DROP POLICY IF EXISTS "Public studies are viewable by everyone" ON public.studies;
CREATE POLICY "Public studies are viewable by everyone"
  ON public.studies FOR SELECT
  USING ( true );


DROP POLICY IF EXISTS "Service role can manage studies" ON public.studies;
CREATE POLICY "Service role can manage studies"
  ON public.studies FOR ALL
  USING ( true )
  WITH CHECK ( true );

-- 5. Create Leads Table (The Cash Register)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text NOT NULL,
  condition text NOT NULL,
  city text,
  answers jsonb, -- Stores quiz answers { "age": "Yes", "diagnosis": "Yes" }
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Public can INSERT (Submit Quiz)
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK ( true );

-- Policy: Authenticated/Service role can manage
DROP POLICY IF EXISTS "Service role can manage leads" ON public.leads;
CREATE POLICY "Service role can manage leads"
  ON public.leads FOR ALL
  USING ( true )
  WITH CHECK ( true );

