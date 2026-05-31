alter table public.saved_vocabulary
  add column if not exists meaning text not null default '';
