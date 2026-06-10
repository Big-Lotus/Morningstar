begin;

delete from public.bookmarks;

delete from public.investigation_sources
where source_type = 'article';

delete from public.saved_vocabulary
where source_type = 'article';

drop table if exists public.articles cascade;

create table public.articles (
  creator text,
  title text not null,
  link text not null unique,
  pubdate timestamptz,
  author text,
  contentsnippet text,
  categories jsonb not null default '[]'::jsonb
);

commit;
