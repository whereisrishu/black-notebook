-- One JSON state document per authenticated notebook owner.
create table public.notebook_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default clock_timestamp()
);

alter table public.notebook_state enable row level security;

-- The public schema is exposed through the Supabase Data API by default.
grant usage on schema public to authenticated;
revoke all on public.notebook_state from anon;
grant select, insert, update on public.notebook_state to authenticated;

create policy "Owner can read notebook state"
  on public.notebook_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owner can create notebook state"
  on public.notebook_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owner can update notebook state"
  on public.notebook_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

