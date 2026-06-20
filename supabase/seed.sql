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

insert into public.users (id, username, password_hash)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'MorningStar Desk',
    'seeded-community-account'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'Jiyoon',
    'seeded-community-account'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'Minseo',
    'seeded-community-account'
  )
on conflict (id) do update set
  username = excluded.username,
  password_hash = excluded.password_hash;

insert into public.community_polls
  (id, user_id, title, question, summary_insight, created_at, updated_at)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'Weekend Marathons',
    'A community festival or a disruption to daily life? What do you think about road closures during urban marathons?',
    'A successful marathon should be enjoyable for runners without becoming a burden for everyone else.',
    '2026-06-18T09:00:00.000Z',
    '2026-06-18T09:00:00.000Z'
  )
on conflict (id) do update set
  title = excluded.title,
  question = excluded.question,
  summary_insight = excluded.summary_insight,
  updated_at = excluded.updated_at;

insert into public.community_poll_options
  (id, poll_id, label, sort_order)
values
  (
    '22222222-2222-4222-8222-222222222221',
    '11111111-1111-4111-8111-111111111111',
    'Better coordination is needed',
    0
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'City roads should not be closed',
    1
  ),
  (
    '22222222-2222-4222-8222-222222222223',
    '11111111-1111-4111-8111-111111111111',
    'The current system is acceptable',
    2
  ),
  (
    '22222222-2222-4222-8222-222222222224',
    '11111111-1111-4111-8111-111111111111',
    'Not sure',
    3
  )
on conflict (id) do update set
  label = excluded.label,
  sort_order = excluded.sort_order;

insert into public.community_poll_comments
  (id, poll_id, user_id, body, created_at)
values
  (
    '33333333-3333-4333-8333-333333333331',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'Running on an open road feels amazing, but experiencing the same event as a driver made me understand how frustrating road closures can be.',
    '2026-06-18T11:10:00.000Z'
  ),
  (
    '33333333-3333-4333-8333-333333333332',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'Large events should only be approved when organizers can properly manage traffic, safety, and cleanup.',
    '2026-06-18T12:24:00.000Z'
  )
on conflict (id) do update set
  body = excluded.body,
  created_at = excluded.created_at;
