create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  original_article text not null,
  source_url text not null,
  source_name text,
  category text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  article_id uuid not null references public.articles(id) on delete cascade,
  word text not null,
  sentence text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now()
);
