create table user_games (
  id          bigint primary key generated always as identity,
  created_at  timestamptz not null default now(),
  modified_at timestamptz not null default now(),
  user_id     uuid not null references public.users(id) on delete cascade,
  game_id     uuid not null references public.games(id) on delete cascade,
  shelf       text not null default 'Owned',
  is_private  boolean not null default false,
  is_loaned   boolean not null default false
);

create index user_games_user_id_idx on user_games(user_id);
create index user_games_game_id_idx on user_games(game_id);
