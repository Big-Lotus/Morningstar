# Article model and Korea Herald RSS categories

Saetbyeol treats `articles` as external reference cards. The app should not store
full article bodies. The minimal RSS-backed table keeps only the raw fields we
actually receive from n8n.

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
| `creator` | RSS `creator` |
| `title` | Article title from RSS |
| `link` | Original article URL |
| `pubDate` | RSS publish date |
| `author` | RSS `author` |
| `contentSnippet` | RSS `contentSnippet` |
| `categories` | RSS `categories` array |

## Prototype n8n rule

Start with one RSS feed, preferably `National`. For each item:

1. Map RSS `creator` to `creator`.
2. Map RSS `title` to `title`.
3. Map RSS `link` to `link`.
4. Map RSS `pubDate` or `isoDate` to `pubDate`.
5. Map RSS `author` to `author`.
6. Map RSS `contentSnippet` to `contentSnippet`.
7. Map RSS `categories` to `categories`.
8. Upsert into Supabase by `link`.
