-- Note: the auth.users table is managed by Supabase Auth.
-- This table stores additional public profile data synced from auth.users.
create table users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text
);

-- Automatically create a users row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
