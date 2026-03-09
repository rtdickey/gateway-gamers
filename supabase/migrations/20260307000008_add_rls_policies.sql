-- ============================================================
-- GAMES
-- ============================================================
alter table public.games enable row level security;

-- Anyone authenticated can read games
create policy "games: authenticated users can read"
  on public.games for select
  to authenticated
  using (true);

-- Admins and contributors can insert games
create policy "games: contributors and admins can insert"
  on public.games for insert
  to authenticated
  with check (public.get_user_role() in ('admin', 'contributor'));

-- Only admins can update or delete games
create policy "games: admins can update"
  on public.games for update
  to authenticated
  using (public.get_user_role() = 'admin');

create policy "games: admins can delete"
  on public.games for delete
  to authenticated
  using (public.get_user_role() = 'admin');


-- ============================================================
-- USERS
-- ============================================================
alter table public.users enable row level security;

-- Users can always read their own profile
create policy "users: can read own profile"
  on public.users for select
  to authenticated
  using (id = auth.uid());

-- Accepted friends can read each other's profiles
create policy "users: accepted friends can read profile"
  on public.users for select
  to authenticated
  using (
    exists (
      select 1 from public.friendships
      where status = 'accepted'
        and (
          (requester_id = auth.uid() and addressee_id = id) or
          (addressee_id = auth.uid() and requester_id = id)
        )
    )
  );

-- Admins can read all profiles
create policy "users: admins can read all"
  on public.users for select
  to authenticated
  using (public.get_user_role() = 'admin');

-- Users can update only their own profile (except role)
create policy "users: can update own profile"
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Only admins can update roles
create policy "users: admins can update any profile"
  on public.users for update
  to authenticated
  using (public.get_user_role() = 'admin');


-- ============================================================
-- USER_GAMES
-- ============================================================
alter table public.user_games enable row level security;

-- Users can read their own shelf
create policy "user_games: owner can read"
  on public.user_games for select
  to authenticated
  using (user_id = auth.uid());

-- Accepted friends can read non-private shelf entries
create policy "user_games: friends can read non-private"
  on public.user_games for select
  to authenticated
  using (
    is_private = false
    and exists (
      select 1 from public.friendships
      where status = 'accepted'
        and (
          (requester_id = auth.uid() and addressee_id = user_id) or
          (addressee_id = auth.uid() and requester_id = user_id)
        )
    )
  );

-- Users can only insert/update/delete their own shelf entries
create policy "user_games: owner can insert"
  on public.user_games for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "user_games: owner can update"
  on public.user_games for update
  to authenticated
  using (user_id = auth.uid());

create policy "user_games: owner can delete"
  on public.user_games for delete
  to authenticated
  using (user_id = auth.uid());


-- ============================================================
-- LOANS
-- ============================================================
alter table public.loans enable row level security;

-- Owner can see loans for their games
create policy "loans: owner can read"
  on public.loans for select
  to authenticated
  using (
    exists (
      select 1 from public.user_games
      where user_games.id = loans.user_game_id
        and user_games.user_id = auth.uid()
    )
  );

-- Borrower can see loans where they are the borrower
create policy "loans: borrower can read"
  on public.loans for select
  to authenticated
  using (borrower_id = auth.uid());

-- Owner can insert loans for their own games
create policy "loans: owner can insert"
  on public.loans for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_games
      where user_games.id = loans.user_game_id
        and user_games.user_id = auth.uid()
    )
  );

-- Owner can update loans (e.g. mark returned)
create policy "loans: owner can update"
  on public.loans for update
  to authenticated
  using (
    exists (
      select 1 from public.user_games
      where user_games.id = loans.user_game_id
        and user_games.user_id = auth.uid()
    )
  );

-- Owner can delete loans
create policy "loans: owner can delete"
  on public.loans for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_games
      where user_games.id = loans.user_game_id
        and user_games.user_id = auth.uid()
    )
  );


-- ============================================================
-- FRIENDSHIPS
-- ============================================================
alter table public.friendships enable row level security;

-- Users can see friendships they are part of
create policy "friendships: users can read own"
  on public.friendships for select
  to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());

-- Any authenticated user can send a friend request (insert as requester)
create policy "friendships: users can request"
  on public.friendships for insert
  to authenticated
  with check (requester_id = auth.uid());

-- Only the addressee can accept or decline (update status)
-- Requester can also withdraw their own pending request
create policy "friendships: addressee can update status"
  on public.friendships for update
  to authenticated
  using (addressee_id = auth.uid() or requester_id = auth.uid());

-- Either party can delete (unfriend or withdraw request)
create policy "friendships: either party can delete"
  on public.friendships for delete
  to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());
