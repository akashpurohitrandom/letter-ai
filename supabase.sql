-- Run this in your Supabase project's SQL Editor (left sidebar -> SQL Editor -> New query)

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  published boolean default true,
  created_at timestamptz default now()
);

-- Row Level Security: allow anyone with the anon key to READ published letters only.
-- All writes go through your server (using the service role key), so writes are
-- never exposed to the browser.
alter table letters enable row level security;

create policy "Public can read published letters"
on letters for select
using (published = true);

-- A single-row sticky note, pushed from /admin. Always exactly one row (id = 1) —
-- pushing a new message overwrites it rather than appending to a history.
create table if not exists sticky_note (
  id int primary key default 1,
  message text not null,
  updated_at timestamptz default now()
);

alter table sticky_note enable row level security;

create policy "Public can read the sticky note"
on sticky_note for select
using (true);
