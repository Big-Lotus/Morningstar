import { Article, CommunityPost } from "@/lib/types";

export const MARATHON_POST_ID = "11111111-1111-4111-8111-111111111111";

const marathonOptionIds = {
  coordination: "22222222-2222-4222-8222-222222222221",
  noClosures: "22222222-2222-4222-8222-222222222222",
  acceptable: "22222222-2222-4222-8222-222222222223",
  unsure: "22222222-2222-4222-8222-222222222224"
};

const marathonSources: Article[] = [
  {
    slug: "korea-herald-weekend-marathons",
    category: "Sports",
    title: "Weekend marathons raise questions over road closures",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/article/10616937",
    publishedAt: "2026-06-18T09:00:00.000Z",
    keyword: "urban marathons",
    intro:
      "A community debate about city races, traffic control, and the everyday impact of large weekend events."
  },
  {
    slug: "newneek-pizza-station-marathon-debate",
    category: "Life&Culture",
    title: "Pizza Station debate on weekend marathon disruption",
    sourceName: "Newneek",
    sourceUrl: "https://newneek.co/@pizzastation/article/35880",
    publishedAt: "2026-06-18T09:30:00.000Z",
    keyword: "community poll",
    intro:
      "A card-news style discussion asking how cities can support runners while respecting residents' routines."
  }
];

export const featuredCommunityPosts: CommunityPost[] = [
  {
    id: MARATHON_POST_ID,
    compositionId: MARATHON_POST_ID,
    authorName: "MorningStar Desk",
    title: "Weekend Marathons",
    insight:
      "Most people are not against marathons. They want races to continue with better planning, earlier notices, safer operations, and cleaner routes.",
    requirements:
      "What do you think about road closures during urban marathons?",
    analysis:
      "Running has become one of Korea's most popular hobbies. More than 400 marathon events are now held across the country each year. Large races attract runners, spectators, sponsors, and visitors, bringing energy and economic benefits to host cities.\n\nBut during major races, roads may remain closed for hours. Buses are delayed or rerouted, traffic becomes congested, and residents may struggle to reach work, appointments, or weekend plans.",
    sourceSlugs: marathonSources.map((source) => source.slug),
    sourceSnapshots: marathonSources,
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333331",
        authorName: "Jiyoon",
        body:
          "Running on an open road feels amazing, but experiencing the same event as a driver made me understand how frustrating road closures can be.",
        createdAt: "2026-06-18T11:10:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333332",
        authorName: "Minseo",
        body:
          "Large events should only be approved when organizers can properly manage traffic, safety, and cleanup.",
        createdAt: "2026-06-18T12:24:00.000Z"
      }
    ],
    pollQuestion:
      "A community festival or a disruption to daily life? What do you think about road closures during urban marathons?",
    pollOptions: [
      {
        id: marathonOptionIds.coordination,
        label: "Better coordination is needed"
      },
      {
        id: marathonOptionIds.noClosures,
        label: "City roads should not be closed"
      },
      {
        id: marathonOptionIds.acceptable,
        label: "The current system is acceptable"
      },
      {
        id: marathonOptionIds.unsure,
        label: "Not sure"
      }
    ],
    pollVotes: [],
    summaryInsight:
      "A successful marathon should be enjoyable for runners without becoming a burden for everyone else.",
    createdAt: "2026-06-18T09:00:00.000Z"
  }
];

export type PollResult = {
  optionId: string;
  label: string;
  votes: number;
  percentage: number;
  swatchClass: string;
  barClass: string;
};

export type CommunityStoryBlock = {
  eyebrow: string;
  title: string;
  body: string[];
};

export function mergeFeaturedCommunityPosts(posts: CommunityPost[]) {
  const cleanedPosts = posts.filter(isUsefulCommunityPost).map(enrichPost);
  const existingIds = new Set(cleanedPosts.map((post) => post.id));
  const missingFeaturedPosts = featuredCommunityPosts.filter(
    (post) => !existingIds.has(post.id)
  );

  return [...missingFeaturedPosts, ...cleanedPosts].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getCommunityCardVisual(post: CommunityPost, index = 0) {
  if (post.id === MARATHON_POST_ID) {
    return {
      imageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Runners moving through a city road race",
      eyebrow: "Community poll",
      deck:
        "Road races bring energy to the city, but road closures can reshape an ordinary weekend."
    };
  }

  const seed = encodeURIComponent(post.title || `community-${index}`);
  const isPoll = Boolean(post.pollOptions?.length);

  return {
    imageUrl: `https://picsum.photos/seed/${seed}/1200/760`,
    imageAlt: `${post.title} visual`,
    eyebrow: isPoll ? "Community poll" : "Shared analysis",
    deck: isPoll
      ? post.pollQuestion ?? post.requirements
      : post.insight || post.requirements
  };
}

export function getCommunityPollResults(post: CommunityPost): PollResult[] {
  if (post.id === MARATHON_POST_ID) {
    return [
      {
        optionId: marathonOptionIds.coordination,
        label: "Better coordination is needed",
        votes: 226,
        percentage: 72.7,
        swatchClass: "bg-[#e9873d]",
        barClass: "bg-[#e9873d]"
      },
      {
        optionId: marathonOptionIds.noClosures,
        label: "City roads should not be closed",
        votes: 50,
        percentage: 16.1,
        swatchClass: "bg-[#4b8ecf]",
        barClass: "bg-[#4b8ecf]"
      },
      {
        optionId: marathonOptionIds.acceptable,
        label: "The current system is acceptable",
        votes: 29,
        percentage: 9.3,
        swatchClass: "bg-[#57a773]",
        barClass: "bg-[#57a773]"
      },
      {
        optionId: marathonOptionIds.unsure,
        label: "Not sure",
        votes: 6,
        percentage: 1.9,
        swatchClass: "bg-[#a8aaa5]",
        barClass: "bg-[#a8aaa5]"
      }
    ];
  }

  const votes = post.pollVotes ?? [];

  return (post.pollOptions ?? []).map((option, index) => {
    const optionVotes = votes.filter((vote) => vote.optionId === option.id);
    const percentage =
      votes.length > 0 ? Math.round((optionVotes.length / votes.length) * 100) : 0;
    const colorClasses = [
      ["bg-[#e9873d]", "bg-[#e9873d]"],
      ["bg-[#4b8ecf]", "bg-[#4b8ecf]"],
      ["bg-[#57a773]", "bg-[#57a773]"],
      ["bg-[#a8aaa5]", "bg-[#a8aaa5]"]
    ][index % 4];

    return {
      optionId: option.id,
      label: option.label,
      votes: optionVotes.length,
      percentage,
      swatchClass: colorClasses[0],
      barClass: colorClasses[1]
    };
  });
}

export function getCommunityStoryBlocks(post: CommunityPost): CommunityStoryBlock[] {
  if (post.id !== MARATHON_POST_ID) {
    return [];
  }

  return [
    {
      eyebrow: "What is this debate about?",
      title: "A popular hobby is becoming a city operations question",
      body: [
        "Running has become one of Korea's most popular hobbies. More than 400 marathon events are now held across the country each year.",
        "Large races attract runners, spectators, sponsors, and visitors, bringing energy and economic benefits to host cities. But roads may remain closed for hours, buses can be delayed or rerouted, and residents may struggle to reach work, appointments, or weekend plans.",
        "As marathon events become larger and more frequent, people are asking how cities can support running events without placing too much inconvenience on residents."
      ]
    },
    {
      eyebrow: "What the community said",
      title: "Most people want better coordination, not fewer festivals",
      body: [
        "The largest group supported the positive purpose of marathons but said events should be managed more carefully.",
        "They called for better traffic management, earlier road-closure notices, stronger safety standards, clear cleanup plans, more suitable routes, and limits on event frequency."
      ]
    },
    {
      eyebrow: "Ideas from the community",
      title: "Maps, standards, alternative routes, and resident support",
      body: [
        "Real-time map updates could show road closures and bus detours directly in navigation apps.",
        "Cities could review traffic, safety, staffing, and cleanup plans before approving events. Smaller races could use parks, riverside paths, stadiums, and less crowded roads.",
        "For major events, residents asked for additional public transportation or temporary transit discounts."
      ]
    },
    {
      eyebrow: "Community takeaway",
      title: "The challenge is balance",
      body: [
        "Most people are not against marathons. They want marathon events to continue, but with better planning and clearer communication.",
        "The balance is between runners' experiences, residents' daily lives, and safe city operations."
      ]
    }
  ];
}

function enrichPost(post: CommunityPost): CommunityPost {
  if (post.id !== MARATHON_POST_ID) {
    return post;
  }

  return {
    ...featuredCommunityPosts[0],
    ...post,
    insight: post.insight || featuredCommunityPosts[0].insight,
    requirements: post.requirements || featuredCommunityPosts[0].requirements,
    analysis: post.analysis || featuredCommunityPosts[0].analysis,
    sourceSlugs: post.sourceSlugs.length
      ? post.sourceSlugs
      : featuredCommunityPosts[0].sourceSlugs,
    sourceSnapshots: post.sourceSnapshots.length
      ? post.sourceSnapshots
      : featuredCommunityPosts[0].sourceSnapshots,
    comments: post.comments.length ? post.comments : featuredCommunityPosts[0].comments,
    pollQuestion: post.pollQuestion || featuredCommunityPosts[0].pollQuestion,
    pollOptions: post.pollOptions?.length
      ? post.pollOptions
      : featuredCommunityPosts[0].pollOptions,
    summaryInsight: post.summaryInsight || featuredCommunityPosts[0].summaryInsight
  };
}

function isUsefulCommunityPost(post: CommunityPost) {
  const title = post.title.trim().toLowerCase();

  return Boolean(title) && !["good", "test", "test1", "hello"].includes(title);
}
