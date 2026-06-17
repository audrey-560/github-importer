create table public.signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  golf_level text,
  interests text[] not null default '{}',
  availability text[] not null default '{}',
  instagram text
);

grant insert on public.signups to anon, authenticated;
grant all on public.signups to service_role;

alter table public.signups enable row level security;

create policy "Anyone can sign up"
  on public.signups
  for insert
  to anon, authenticated
  with check (true);