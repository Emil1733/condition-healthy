-- New Table: Page Content (Stores the pre-generated AI text)
-- This replaces "Live Generation" with "Database Storage"

create table public.page_content (
  id uuid default uuid_generate_v4() primary key,
  path_slug text not null, -- e.g. "psoriasis/austin-tx" (Unique Key)
  condition text not null, -- "Psoriasis"
  city_slug text not null, -- "austin-tx"
  
  -- The AI Content
  meta_title text,
  meta_description text,
  intro_text text, -- The "Humanized" paragraph
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(path_slug)
);

-- RLS: Public can READ
alter table public.page_content enable row level security;

create policy "Public content is viewable by everyone."
  on public.page_content for select
  using ( true );

-- RLS: Service Role can INSERT (Seed Script)
create policy "Service role can insert content."
  on public.page_content for insert
  with check ( true );
