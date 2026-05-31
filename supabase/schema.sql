create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  created_at timestamptz not null default now(),
  unique (user_id, category)
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  slug text not null unique,
  title text not null,
  source_name text not null,
  source_url text not null unique,
  category text not null,
  published_at timestamptz,
  keyword text,
  intro text not null,
  language text not null default 'en',
  status text not null default 'published' check (status in ('published', 'hidden', 'archived')),
  fetched_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  slug text not null,
  title text not null,
  source_name text not null,
  source_url text not null,
  category text not null default 'National',
  keyword text,
  intro text not null,
  created_at timestamptz not null default now(),
  unique (user_id, slug),
  unique (user_id, source_url)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, article_id)
);

create table if not exists public.saved_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_type text not null check (source_type in ('article', 'custom_source')),
  source_id uuid not null,
  word text not null,
  meaning text not null default '',
  sentence text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.investigations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  requirements text not null,
  analysis text not null,
  status text not null default 'generated' check (status in ('draft', 'generated', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investigation_sources (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid not null references public.investigations(id) on delete cascade,
  source_type text not null check (source_type in ('article', 'custom_source')),
  source_id uuid not null,
  sort_order integer not null default 0,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (investigation_id, source_type, source_id)
);

create table if not exists public.community_analysis_posts (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid not null references public.investigations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  insight text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (investigation_id)
);

create table if not exists public.community_analysis_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_analysis_posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.community_polls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  question text not null,
  summary_insight text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.community_polls(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  unique (poll_id, label)
);

create table if not exists public.community_poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.community_polls(id) on delete cascade,
  option_id uuid not null references public.community_poll_options(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  opinion text not null default '',
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create table if not exists public.community_poll_comments (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.community_polls(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
