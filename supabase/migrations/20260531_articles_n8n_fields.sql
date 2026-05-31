alter table public.articles
  add column if not exists external_id text unique,
  add column if not exists language text not null default 'en',
  add column if not exists status text not null default 'published',
  add column if not exists fetched_at timestamptz;

alter table public.articles
  drop constraint if exists articles_status_check;

alter table public.articles
  add constraint articles_status_check
  check (status in ('published', 'hidden', 'archived'));

update public.articles
set status = 'hidden'
where source_name <> 'The Korea Herald';

update public.articles
set status = 'hidden'
where source_name = 'The Korea Herald'
  and source_url = 'https://www.koreaherald.com/';
