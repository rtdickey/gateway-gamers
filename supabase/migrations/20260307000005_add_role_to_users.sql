-- Create the role enum
create type app_role as enum ('admin', 'contributor', 'user');

-- Add role column to users, defaulting all existing and new users to 'user'
alter table public.users
  add column role app_role not null default 'user';

-- Helper function: returns the current user's role
-- Used in RLS policies to avoid repeated subqueries
create or replace function public.get_user_role()
returns app_role as $$
  select role from public.users where id = auth.uid()
$$ language sql security definer stable;
