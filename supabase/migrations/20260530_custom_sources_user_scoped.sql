alter table public.custom_sources
  drop constraint if exists custom_sources_slug_key;

alter table public.custom_sources
  drop constraint if exists custom_sources_source_url_key;

alter table public.custom_sources
  add constraint custom_sources_user_slug_key unique (user_id, slug);

alter table public.custom_sources
  add constraint custom_sources_user_source_url_key unique (user_id, source_url);
