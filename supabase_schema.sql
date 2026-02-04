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
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  condition text not null,
  phone text,
  answers jsonb, -- Stores quiz answers { "age": 35, "history": "..." }
  status text default 'pending', -- "pending", "sold", "rejected"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.locations enable row level security;
alter table public.studies enable row level security;
alter table public.leads enable row level security;

-- 5. Policies (Security Rules)

-- Locations: Public can READ
create policy "Public locations are viewable by everyone."
  on public.locations for select
  using ( true );

-- Studies: Public can READ
create policy "Public studies are viewable by everyone."
  on public.studies for select
  using ( true );

-- Leads: Public can INSERT (Submit Quiz)
create policy "Public can insert leads."
  on public.leads for insert
  with check ( true );

-- Leads: Only Admin can READ (Protect privacy)
-- Note: You will view these in the Supabase Dashboard
create policy "Leads are private."
  on public.leads for select
  using ( false ); 
