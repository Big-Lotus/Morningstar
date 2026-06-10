alter table public.articles
  add column if not exists rss_creator text,
  add column if not exists rss_author text,
  add column if not exists rss_content text,
  add column if not exists rss_content_snippet text,
  add column if not exists rss_categories jsonb not null default '[]'::jsonb,
  add column if not exists rss_iso_date timestamptz;

update public.articles
set rss_categories = jsonb_build_array(category)
where coalesce(jsonb_array_length(rss_categories), 0) = 0
  and category is not null;

update public.articles
set rss_content_snippet = intro
where rss_content_snippet is null
  and intro is not null;

update public.articles
set rss_iso_date = coalesce(rss_iso_date, published_at);

create or replace function public.derive_article_keyword(article_title text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(
      substring(
        regexp_replace(lower(coalesce(article_title, '')), '[^a-z0-9 ]+', '', 'g')
        from '^((?:\S+\s+){0,2}\S+)'
      )
    ),
    ''
  );
$$;

create or replace function public.normalize_article_from_rss()
returns trigger
language plpgsql
as $$
declare
  normalized_category text;
begin
  if new.rss_categories is null then
    new.rss_categories := '[]'::jsonb;
  end if;

  normalized_category := coalesce(
    nullif(new.category, ''),
    nullif(new.rss_categories ->> 0, ''),
    'National'
  );
  new.category := normalized_category;

  new.source_name := coalesce(nullif(new.source_name, ''), nullif(new.rss_creator, ''), nullif(new.rss_author, ''), 'Unknown source');
  new.published_at := coalesce(new.published_at, new.rss_iso_date, new.fetched_at, now());
  new.rss_iso_date := coalesce(new.rss_iso_date, new.published_at);
  new.fetched_at := coalesce(new.fetched_at, now());

  new.intro := coalesce(
    nullif(new.intro, ''),
    nullif(new.rss_content_snippet, ''),
    left(coalesce(new.rss_content, new.title, 'Article reference'), 240)
  );

  new.keyword := coalesce(
    nullif(new.keyword, ''),
    public.derive_article_keyword(new.title)
  );

  return new;
end;
$$;

drop trigger if exists normalize_article_from_rss on public.articles;

create trigger normalize_article_from_rss
before insert or update on public.articles
for each row
execute function public.normalize_article_from_rss();
