drop table if exists public.articles cascade;

create table public.articles (
  creator text,
  title text not null,
  link text not null unique,
  "pubDate" timestamptz,
  "contentSnippet" text,
  categories jsonb not null default '[]'::jsonb
);

alter table if exists public.saved_vocabulary
  alter column source_id type text using source_id::text;

alter table if exists public.investigation_sources
  alter column source_id type text using source_id::text;
