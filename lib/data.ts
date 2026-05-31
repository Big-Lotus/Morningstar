import { Article, Category } from "@/lib/types";

export const categoryLabels: Record<Category, string> = {
  National: "National",
  Business: "Business",
  "Life&Culture": "Life&Culture",
  Sports: "Sports",
  World: "World",
  "K-pop": "K-pop"
};

export const categories: Category[] = [
  "National",
  "Business",
  "Life&Culture",
  "Sports",
  "World",
  "K-pop"
];

export const koreaHeraldRssSources: Array<{
  category: Category;
  label: string;
  url: string;
}> = [
  {
    category: "National",
    label: "Korea Herald National",
    url: "https://www.koreaherald.com/rss/kh_National"
  },
  {
    category: "Business",
    label: "Korea Herald Business",
    url: "https://www.koreaherald.com/rss/kh_Business"
  },
  {
    category: "Life&Culture",
    label: "Korea Herald Life&Culture",
    url: "https://www.koreaherald.com/rss/kh_LifeCulture"
  },
  {
    category: "Sports",
    label: "Korea Herald Sports",
    url: "https://www.koreaherald.com/rss/kh_Sports"
  },
  {
    category: "World",
    label: "Korea Herald World",
    url: "https://www.koreaherald.com/rss/kh_World"
  },
  {
    category: "K-pop",
    label: "Korea Herald K-pop",
    url: "https://www.koreaherald.com/rss/kh_Kpop"
  }
];

export const articles: Article[] = [
  {
    slug: "korea-herald-national-policy-briefing",
    category: "National",
    title: "National Assembly Debate Puts Youth Policy Back in Focus",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/",
    publishedAt: "2026-05-29T09:00:00.000Z",
    keyword: "youth policy",
    intro:
      "A Korea Herald national story gives learners a compact way to follow policy language, public debate, and the vocabulary of domestic affairs."
  },
  {
    slug: "korea-herald-business-export-outlook",
    category: "Business",
    title: "Korean Exporters Watch Currency Moves Ahead of Summer Orders",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/",
    publishedAt: "2026-05-29T10:20:00.000Z",
    keyword: "export outlook",
    intro:
      "A business item frames market pressure through practical terms around exports, currency movement, demand, and corporate planning."
  },
  {
    slug: "korea-herald-life-culture-museum-night",
    category: "Life&Culture",
    title: "Museums Extend Evening Hours as Cultural Districts Draw Crowds",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/",
    publishedAt: "2026-05-29T11:10:00.000Z",
    keyword: "cultural district",
    intro:
      "A life and culture story is useful for learning descriptive language about public spaces, exhibitions, routines, and city life."
  },
  {
    slug: "korea-herald-sports-baseball-weekend",
    category: "Sports",
    title: "Weekend Baseball Series Highlights New Rivalry Momentum",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/",
    publishedAt: "2026-05-29T12:30:00.000Z",
    keyword: "rivalry momentum",
    intro:
      "A sports article helps learners read action-oriented reporting, short quotes, rankings, performance, and fan reactions."
  },
  {
    slug: "korea-herald-world-summit-talks",
    category: "World",
    title: "Regional Summit Talks Turn to Trade Routes and Security",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/",
    publishedAt: "2026-05-29T13:45:00.000Z",
    keyword: "regional summit",
    intro:
      "A world news card introduces diplomatic vocabulary around negotiations, alliances, trade routes, and regional security."
  },
  {
    slug: "korea-herald-kpop-tour-record",
    category: "K-pop",
    title: "K-pop Group Adds Encore Dates After Global Tour Sellout",
    sourceName: "The Korea Herald",
    sourceUrl: "https://www.koreaherald.com/",
    publishedAt: "2026-05-29T14:40:00.000Z",
    keyword: "global tour",
    intro:
      "A K-pop story gives learners accessible entertainment language around fandom, tours, agencies, charts, and global audiences."
  }
];
