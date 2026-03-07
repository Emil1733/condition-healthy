-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- 1. Locations Table (For the pSEO Pages)
create table public.locations (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique, -- e.g. "austin-tx"
  city text not null,
  state text not null,
  zip_codes text[] not null, -- Array of zip codes
  population int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Studies Table (The Offers)
create table public.studies (
  id uuid default uuid_generate_v4() primary key,
  nct_id text not null, -- ClinicalTrials.gov ID
  title text not null, -- "Psoriasis Study..."
  condition text not null, -- "Psoriasis"
  status text not null, -- "Recruiting"
  location_city text, -- "Austin"
  location_state text, -- "TX"
  compensation text, -- "Up to $1,200"
  affiliate_link text, -- MaxBounty Link
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Leads Table (The Cash Register)
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  condition text not null,
  phone text,
  answers jsonb, -- Stores quiz answers { "age": 35, "history": "..." }
  status text default 'pending', -- "pending", "sold", "rejected"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Page Content Table (The pSEO Engine)
create table if not exists public.page_content (
  id uuid default uuid_generate_v4() primary key,
  path_slug text not null unique, -- e.g. "psoriasis/austin-tx"
  condition text not null,
  city_slug text not null,
  intro_text text,
  medical_context text,
  environmental_factors text,
  local_faq jsonb,
  local_facilities jsonb, -- [Phase 11] Array of top research hospitals/clinics
  transit_info text,      -- [Phase 11] Local transit and accessibility logistics
  demographic_context text, -- [Phase 11] Demographic and regional health data
  meta_title text,
  meta_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.locations enable row level security;
alter table public.studies enable row level security;
alter table public.leads enable row level security;
alter table public.page_content enable row level security;

-- 6. Policies (Security Rules)

-- Locations: Public can READ
drop policy if exists "Public locations are viewable by everyone." on public.locations;
create policy "Public locations are viewable by everyone."
  on public.locations for select
  using ( true );

-- Studies: Public can READ
drop policy if exists "Public studies are viewable by everyone." on public.studies;
create policy "Public studies are viewable by everyone."
  on public.studies for select
  using ( true );

-- Page Content: Public can READ (Crucial for SEO/UI)
drop policy if exists "Public can read page content." on public.page_content;
create policy "Public can read page content."
  on public.page_content for select
  using ( true );

-- Leads: Public can INSERT (Submit Quiz)
drop policy if exists "Public can insert leads." on public.leads;
create policy "Public can insert leads."
  on public.leads for insert
  with check ( true );

-- Leads: Only Admin can READ
create policy "Leads are private."
  on public.leads for select
  using ( false ); 

-- Service Role Management (For Hydra Engine)
create policy "Service role manage content" on public.page_content for all using (true) with check (true);
create policy "Service role manage studies" on public.studies for all using (true) with check (true);
create policy "Service role manage locations" on public.locations for all using (true) with check (true);
