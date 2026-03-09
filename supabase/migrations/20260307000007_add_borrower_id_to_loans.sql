-- Add borrower_id as a nullable FK to users
-- Null means the borrower was entered as free text (legacy) or not yet a user
alter table public.loans
  add column borrower_id uuid references public.users(id) on delete set null;

create index loans_borrower_id_idx on public.loans(borrower_id);
