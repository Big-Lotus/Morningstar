# Article model and Korea Herald RSS categories

Saetbyeol treats `articles` as external reference cards. The app should not store
full article bodies.

## Categories

The prototype follows The Korea Herald section structure:

- `National`
- `Business`
- `Life&Culture`
- `Sports`
- `World`
- `K-pop`

RSS feeds are already sectioned, so n8n should assign the category based on the
feed being processed instead of running another classifier.

## Recommended RSS mapping

| Category | RSS source |
| --- | --- |
| `National` | `https://www.koreaherald.com/rss/kh_National` |
| `Business` | `https://www.koreaherald.com/rss/kh_Business` |
| `Life&Culture` | `https://www.koreaherald.com/rss/kh_LifeCulture` |
| `Sports` | `https://www.koreaherald.com/rss/kh_Sports` |
| `World` | `https://www.koreaherald.com/rss/kh_World` |
| `K-pop` | `https://www.koreaherald.com/rss/kh_Kpop` |

If only `National` is connected during the prototype, keep the full category UI
visible and let the other sections show empty states.

## `articles` fields

| Field | Purpose |
| --- | --- |
| `id` | Supabase primary key |
| `external_id` | RSS `guid` or URL hash for deduplication |
| `slug` | App-facing article identifier |
| `title` | Article title from RSS |
| `source_name` | `The Korea Herald` |
| `source_url` | Original article URL |
| `category` | One of the six Korea Herald categories |
| `published_at` | RSS publish date |
| `keyword` | Short display keyword, can be derived from title in n8n |
| `intro` | Short card intro written by our system, not copied article body |
| `language` | Default `en` |
| `status` | `published`, `hidden`, or `archived` |
| `fetched_at` | Time n8n fetched the RSS item |
| `created_at` | Supabase insert time |

## Prototype n8n rule

Start with one RSS feed, preferably `National`. For each item:

1. Use RSS `guid` as `external_id`; if missing, hash `link`.
2. Use RSS `title` as `title`.
3. Use RSS `link` as `source_url`.
4. Set `source_name` to `The Korea Herald`.
5. Set `category` from the current RSS feed.
6. Set `published_at` from RSS `pubDate`.
7. Create `slug` from title or URL.
8. Set `keyword` from a short title phrase.
9. Set `intro` to a simple source-card sentence.
10. Upsert into Supabase by `source_url`.
