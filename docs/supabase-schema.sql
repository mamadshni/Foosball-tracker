-- Players table
create table if not exists public.players (
  id uuid primary key,
  name text not null,
  rating integer not null default 1000,
  games_played integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  created_at timestamptz not null default now()
);

-- Games table
create table if not exists public.games (
  id uuid primary key,
  date timestamptz not null default now(),
  team_a uuid[] not null,
  team_b uuid[] not null,
  winner_team text not null check (winner_team in ('A','B')),
  points_change integer not null,
  per_player_deltas jsonb
);

-- Enable RLS (Row Level Security) and simple public policies for demo
alter table public.players enable row level security;
alter table public.games enable row level security;

do $$ begin
  create policy "public players read" on public.players for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public players write" on public.players for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public players update" on public.players for update using (true) with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public games read" on public.games for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public games write" on public.games for insert with check (true);
exception when duplicate_object then null; end $$;

