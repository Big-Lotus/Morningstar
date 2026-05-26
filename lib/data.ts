import { Article, Category, Topic } from "@/lib/types";

export const categories: Category[] = ["World", "Business", "Tech", "Culture"];

export const articles: Article[] = [
  {
    slug: "city-libraries-create-evening-reading-clubs",
    category: "Culture",
    sourceName: "The New York Times",
    sourceUrl: "https://www.nytimes.com/",
    publishedAt: "2026-04-24T09:00:00.000Z",
    keyword: "reading ritual",
    intro:
      "An evening reading club trend is giving busy adults a softer way to rebuild a daily English habit through community and repetition."
  },
  {
    slug: "small-newsletters-grow-through-trust",
    category: "Business",
    sourceName: "Financial Times",
    sourceUrl: "https://www.ft.com/",
    publishedAt: "2026-04-25T07:30:00.000Z",
    keyword: "audience trust",
    intro:
      "Independent newsletters are growing by sounding more human and consistent, which makes them useful references for language learners watching tone and framing."
  },
  {
    slug: "education-apps-add-daily-voice-notes",
    category: "Tech",
    sourceName: "MIT Technology Review",
    sourceUrl: "https://www.technologyreview.com/",
    publishedAt: "2026-04-26T10:15:00.000Z",
    keyword: "reflective learning",
    intro:
      "Education products are adding voice-based reflection, signaling a shift from speed and streaks toward slower, more expressive learning habits."
  },
  {
    slug: "local-markets-become-weekend-meeting-spaces",
    category: "World",
    sourceName: "BBC",
    sourceUrl: "https://www.bbc.com/",
    publishedAt: "2026-04-27T06:45:00.000Z",
    keyword: "social routine",
    intro:
      "Local markets are being described as social anchors again, offering a concrete example of how ordinary places shape routines, belonging, and public language."
  }
];

export const topics: Topic[] = [
  {
    id: "topic-quiet-habits",
    slug: "quiet-habits-that-help-learning-last",
    title: "Quiet habits that make learning easier to return to",
    overview:
      "This topic looks at how steady routines, calmer interfaces, and repeatable social rituals help people stay with a learning habit longer than pressure-based systems do.",
    relatedKeywords: ["habit", "routine", "reflection", "consistency"],
    articleSlugs: [
      "city-libraries-create-evening-reading-clubs",
      "education-apps-add-daily-voice-notes",
      "local-markets-become-weekend-meeting-spaces"
    ],
    createdAt: "2026-04-28T00:00:00.000Z"
  },
  {
    id: "topic-trust-and-tone",
    slug: "how-trust-and-tone-shape-modern-reading",
    title: "How trust and tone shape modern reading",
    overview:
      "This topic follows the idea that readers stay engaged when information feels credible, measured, and human, which makes tone an important part of learning through news.",
    relatedKeywords: ["trust", "tone", "credibility", "audience"],
    articleSlugs: [
      "small-newsletters-grow-through-trust",
      "city-libraries-create-evening-reading-clubs"
    ],
    createdAt: "2026-04-28T00:00:00.000Z"
  }
];
