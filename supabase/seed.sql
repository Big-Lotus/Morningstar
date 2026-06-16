insert into public.articles
  (creator, title, link, "pubDate", "contentSnippet", categories)
values
  (
    'The Korea Herald',
    'National Assembly Debate Puts Youth Policy Back in Focus',
    'https://www.koreaherald.com/article/10766000',
    '2026-05-29T09:00:00.000Z',
    'A Korea Herald national story gives learners a compact way to follow policy language, public debate, and the vocabulary of domestic affairs.',
    '["National"]'::jsonb
  ),
  (
    'The Korea Herald',
    'Korean Exporters Watch Currency Moves Ahead of Summer Orders',
    'https://www.koreaherald.com/article/10766001',
    '2026-05-29T10:20:00.000Z',
    'A business item frames market pressure through practical terms around exports, currency movement, demand, and corporate planning.',
    '["Business"]'::jsonb
  ),
  (
    'The Korea Herald',
    'Museums Extend Evening Hours as Cultural Districts Draw Crowds',
    'https://www.koreaherald.com/article/10766002',
    '2026-05-29T11:10:00.000Z',
    'A life and culture story is useful for learning descriptive language about public spaces, exhibitions, routines, and city life.',
    '["Life&Culture"]'::jsonb
  ),
  (
    'The Korea Herald',
    'Weekend Baseball Series Highlights New Rivalry Momentum',
    'https://www.koreaherald.com/article/10766003',
    '2026-05-29T12:30:00.000Z',
    'A sports article helps learners read action-oriented reporting, short quotes, rankings, performance, and fan reactions.',
    '["Sports"]'::jsonb
  ),
  (
    'The Korea Herald',
    'Regional Summit Talks Turn to Trade Routes and Security',
    'https://www.koreaherald.com/article/10766004',
    '2026-05-29T13:45:00.000Z',
    'A world news card introduces diplomatic vocabulary around negotiations, alliances, trade routes, and regional security.',
    '["World"]'::jsonb
  ),
  (
    'The Korea Herald',
    'K-pop Group Adds Encore Dates After Global Tour Sellout',
    'https://www.koreaherald.com/article/10766005',
    '2026-05-29T14:40:00.000Z',
    'A K-pop story gives learners accessible entertainment language around fandom, tours, agencies, charts, and global audiences.',
    '["K-pop"]'::jsonb
  )
on conflict (link) do update set
  creator = excluded.creator,
  title = excluded.title,
  "pubDate" = excluded."pubDate",
  "contentSnippet" = excluded."contentSnippet",
  categories = excluded.categories;
