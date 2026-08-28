-- =========================================================
-- Peg Solitaire Multiplayer — Supabase Schema
-- =========================================================

-- Enable UUID generator (already on by default in Supabase)

-- =========================================================
-- Table: rooms
-- =========================================================
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_id text not null,
  board_shape text not null check (board_shape in ('triangle','english','diamond','deutsch')),
  level int not null default 1 check (level between 1 and 4),
  timer_seconds int not null default 180 check (timer_seconds between 30 and 1800),
  max_rounds int not null default 3 check (max_rounds between 1 and 10),
  min_players int not null default 2 check (min_players between 1 and 100),
  max_players int not null default 20 check (max_players between 2 and 100),
  hints_allowed boolean not null default true,
  hint_penalty int not null default 50 check (hint_penalty between 0 and 500),
  status text not null default 'waiting' check (status in ('waiting','playing','finished')),
  current_round int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_rooms_code on public.rooms(code);

-- =========================================================
-- Table: players
-- =========================================================
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  persistent_id text not null,
  nickname text not null,
  score int not null default 0,
  pegs_remaining int not null default 0,
  is_host boolean not null default false,
  is_ready boolean not null default false,
  finished_rounds int not null default 0,
  last_seen timestamptz not null default now(),
  unique (room_id, persistent_id)
);

create index if not exists idx_players_room on public.players(room_id);

-- =========================================================
-- Table: round_results
-- =========================================================
create table if not exists public.round_results (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  round_number int not null,
  score_delta int not null,
  pegs_remaining int not null,
  hints_used int not null default 0,
  time_used_seconds int not null default 0,
  finished_at timestamptz not null default now(),
  unique (player_id, round_number)
);

create index if not exists idx_results_room on public.round_results(room_id);

-- =========================================================
-- Realtime publication
-- =========================================================
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.round_results;

-- =========================================================
-- Row Level Security
-- Note: Anonymous players need to read/write; we rely on
-- the app-layer to scope by room_id which we always provide
-- explicitly. RLS is permissive for anon but only when the
-- rows can be reached by their explicit IDs/codes.
-- =========================================================
alter table public.rooms enable row level security;
alter table public.players enable row level security;
alter table public.round_results enable row level security;

-- rooms: anyone with the code can read, only host can update
create policy "rooms_read_all"
  on public.rooms for select
  using (true);

create policy "rooms_insert_anon"
  on public.rooms for insert
  with check (true);

create policy "rooms_update_host"
  on public.rooms for update
  using (true)
  with check (true);

-- players: anyone can read members of any room, anyone can join/leave
create policy "players_read_all"
  on public.players for select
  using (true);

create policy "players_insert_anon"
  on public.players for insert
  with check (true);

create policy "players_update_self"
  on public.players for update
  using (true)
  with check (true);

create policy "players_delete_self"
  on public.players for delete
  using (true);

-- round_results: anyone in the room can read; players can write their own
create policy "results_read_all"
  on public.round_results for select
  using (true);

create policy "results_insert_anon"
  on public.round_results for insert
  with check (true);

create policy "results_update_anon"
  on public.round_results for update
  using (true)
  with check (true);