-- Friendship status enum
create type friendship_status as enum ('pending', 'accepted', 'declined');

create table public.friendships (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  requester_id  uuid not null references public.users(id) on delete cascade,
  addressee_id  uuid not null references public.users(id) on delete cascade,
  status        friendship_status not null default 'pending',

  -- Prevent duplicate or self-referencing friendships
  constraint no_self_friendship check (requester_id <> addressee_id),
  constraint unique_friendship unique (requester_id, addressee_id)
);

create index friendships_requester_id_idx on public.friendships(requester_id);
create index friendships_addressee_id_idx on public.friendships(addressee_id);
