alter table public.users
  add column if not exists email text;

alter table public.users
  alter column password_hash drop not null;

create unique index if not exists users_email_key
  on public.users (email)
  where email is not null;
