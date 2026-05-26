create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  source_name text not null,
  source_url text not null unique,
  category text,
  published_at timestamptz,
  keyword text,
  intro text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  overview text not null,
  related_keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.topic_articles (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (topic_id, article_id)
);

create table if not exists public.saved_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  topic_id uuid not null references public.topics(id) on delete cascade,
  word text not null,
  sentence text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  topic_id uuid not null references public.topics(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, topic_id)
);
