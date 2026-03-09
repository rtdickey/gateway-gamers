create table loans (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  user_game_id bigint not null references public.user_games(id) on delete cascade,
  borrower     text not null,
  loaned_at    timestamptz not null default now(),
  returned_at  timestamptz
);

create index loans_user_game_id_idx on loans(user_game_id);
