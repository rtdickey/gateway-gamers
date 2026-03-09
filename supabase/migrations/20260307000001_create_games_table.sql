create table games (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  title          text,
  age            int,
  min_players    int,
  max_players    int,
  is_expansion   boolean not null default false,
  publisher      text,
  playing_time   int,
  image          text,
  thumbnail      text,
  year_published int,
  bgg_id         int
);
