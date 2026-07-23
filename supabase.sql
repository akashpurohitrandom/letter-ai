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

-- A single persistent, asynchronous Tic Tac Toe game — one shared board (id = 1)
-- that either player can move on from any device, at any time. A move locks
-- the board until the other player's turn; a finished game freezes the board
-- until "New game" resets it, and the cumulative win record never resets.
create table if not exists tic_tac_toe (
  id int primary key default 1,
  board jsonb not null default '[null,null,null,null,null,null,null,null,null]',
  next_player text not null default 'X',
  status text not null default 'in_progress', -- 'in_progress' | 'X' | 'O' | 'draw'
  player1_wins int not null default 0,
  player2_wins int not null default 0,
  draws int not null default 0,
  updated_at timestamptz default now()
);

alter table tic_tac_toe enable row level security;

create policy "Public can read the game state"
on tic_tac_toe for select
using (true);
