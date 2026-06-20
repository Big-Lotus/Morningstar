alter table public.saved_vocabulary
  drop constraint if exists saved_vocabulary_source_type_check;

alter table public.saved_vocabulary
  add constraint saved_vocabulary_source_type_check
  check (source_type in ('article', 'custom_source', 'manual'));
