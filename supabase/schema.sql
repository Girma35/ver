-- WorkEthio · single-user cloud schema (Supabase / Postgres)
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- The app is a single-user demo, so every table has exactly one row keyed by the
-- profile id 'demo-user'. Row Level Security is enabled and scoped to that id.

create table if not exists public.workethio_profiles (
  profile_id   text primary key,
  language     text not null default 'om',
  current_page text not null default 'tasks',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.workethio_wallets (
  profile_id              text primary key
                            references public.workethio_profiles (profile_id) on delete cascade,
  balance_etb             numeric(12, 2) not null default 0,
  completed_tasks         text[] not null default '{}',
  withdrawal_method       text not null default 'telebirr',
  phone_number_or_account text not null default '',
  updated_at              timestamptz not null default now()
);

create table if not exists public.workethio_verifications (
  profile_id       text primary key
                     references public.workethio_profiles (profile_id) on delete cascade,
  is_verified      boolean not null default false,
  verified_at      text,
  applicant_name   text not null default '',
  phone_number     text not null default '',
  city             text not null default '',
  document_type    text not null default 'fayda',
  id_number        text not null default '',
  consent_given    boolean not null default false,
  -- File binaries stay in the browser (IndexedDB); only their local ids are stored.
  id_file_id       integer,
  selfie_file_id   integer,
  submission_id    integer,
  updated_at       timestamptz not null default now()
);

alter table public.workethio_profiles      enable row level security;
alter table public.workethio_wallets       enable row level security;
alter table public.workethio_verifications enable row level security;

grant select, insert, update, delete on public.workethio_profiles      to anon, authenticated;
grant select, insert, update, delete on public.workethio_wallets       to anon, authenticated;
grant select, insert, update, delete on public.workethio_verifications to anon, authenticated;

drop policy if exists "workethio demo profile access" on public.workethio_profiles;
create policy "workethio demo profile access" on public.workethio_profiles
  for all
  using (profile_id = 'demo-user')
  with check (profile_id = 'demo-user');

drop policy if exists "workethio demo wallet access" on public.workethio_wallets;
create policy "workethio demo wallet access" on public.workethio_wallets
  for all
  using (profile_id = 'demo-user')
  with check (profile_id = 'demo-user');

drop policy if exists "workethio demo verification access" on public.workethio_verifications;
create policy "workethio demo verification access" on public.workethio_verifications
  for all
  using (profile_id = 'demo-user')
  with check (profile_id = 'demo-user');
