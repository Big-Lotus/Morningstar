import { Article, Category } from "@/lib/types";

export const categories: Category[] = ["World", "Business", "Tech", "Culture"];

export const articles: Article[] = [
  {
    slug: "city-libraries-create-evening-reading-clubs",
    category: "Culture",
    title: "City Libraries Create Evening Reading Clubs for Busy Adults",
    sourceUrl: "https://www.nytimes.com/"
  },
  {
    slug: "small-newsletters-grow-through-trust",
    category: "Business",
    title: "Small Newsletters Grow Through Trust, Not Speed",
    sourceUrl: "https://www.ft.com/"
  },
  {
    slug: "education-apps-add-daily-voice-notes",
    category: "Tech",
    title: "Education Apps Add Daily Voice Notes to Support Reflection",
    sourceUrl: "https://www.technologyreview.com/"
  },
  {
    slug: "local-markets-become-weekend-meeting-spaces",
    category: "World",
    title: "Local Markets Become Weekend Meeting Spaces for Young Families",
    sourceUrl: "https://www.bbc.com/"
  }
];
