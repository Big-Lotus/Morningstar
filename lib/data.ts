import { Article, Category } from "@/lib/types";

export const categories: Category[] = ["World", "Business", "Tech", "Culture"];

export const articles: Article[] = [
  {
    slug: "city-libraries-create-evening-reading-clubs",
    category: "Culture",
    title: "City Libraries Create Evening Reading Clubs for Busy Adults",
    summary: [
      "Public libraries are opening quieter evening programs so adults can read, discuss news, and build learning habits after work.",
      "The new format focuses on short, guided reading sessions that feel welcoming rather than academic.",
      "Organizers say attendance grows when reading is framed as a calm routine instead of a difficult task."
    ],
    content: [
      "Several city libraries have started evening reading clubs designed for adults who want a slower, more flexible way to learn. The sessions usually begin after work hours and center on one short article or essay.",
      "Instead of assigning long materials, librarians prepare a brief reading guide and a simple discussion prompt. Participants can read quietly, compare interpretations, and ask about unfamiliar expressions without pressure.",
      "Program managers say the clubs are especially helpful for language learners because they combine real-world topics with repetition and context. Many attendees return every week because the environment feels restorative and manageable."
    ]
  },
  {
    slug: "small-newsletters-grow-through-trust",
    category: "Business",
    title: "Small Newsletters Grow Through Trust, Not Speed",
    summary: [
      "Independent newsletter publishers are finding loyal audiences by publishing fewer stories with clearer explanations.",
      "Readers appear more willing to return when the tone feels reliable and easy to follow.",
      "Analysts say depth and consistency now matter as much as breaking news speed for niche media brands."
    ],
    content: [
      "A growing number of small publishers are focusing on trust as their main product advantage. Rather than racing to post every update, they select fewer stories and spend more time explaining why each one matters.",
      "This slower editorial strategy often attracts readers who feel tired of constant alerts and fragmented headlines. Subscribers say they value calm summaries that help them understand events quickly.",
      "Media consultants note that readers are more likely to pay for services that reduce noise. For many publishers, that means creating a clear voice, predictable schedule, and a reading experience that feels respectful of attention."
    ]
  },
  {
    slug: "education-apps-add-daily-voice-notes",
    category: "Tech",
    title: "Education Apps Add Daily Voice Notes to Support Reflection",
    summary: [
      "Learning platforms are introducing short voice journaling tools to help users reflect on what they read each day.",
      "The feature works best when it complements reading instead of interrupting it.",
      "Design teams say the most successful products keep recording optional and visually lightweight."
    ],
    content: [
      "Educational apps are experimenting with daily voice notes as a simple reflection tool. After reading an article, users can record a short response about the key idea, a new word, or a question they still have.",
      "Product teams report that reflection improves retention, but only when the extra step feels easy. If recording appears too early or asks too much, readers are more likely to leave the session unfinished.",
      "Design researchers recommend placing reflection tools after the core reading task and keeping controls minimal. In that model, the reading experience remains central while the learning habit becomes easier to repeat."
    ]
  },
  {
    slug: "local-markets-become-weekend-meeting-spaces",
    category: "World",
    title: "Local Markets Become Weekend Meeting Spaces for Young Families",
    summary: [
      "Community markets in several cities are being redesigned as slower social spaces, not only shopping destinations.",
      "Parents say seating, music, and reading corners make them stay longer and visit more often.",
      "Urban planners view the trend as a sign that people want public spaces that support everyday routines."
    ],
    content: [
      "Weekend markets are changing in ways that reflect new social habits. In many neighborhoods, organizers are adding shaded seating, casual performances, and children’s reading areas alongside traditional food stalls.",
      "Families say the updated spaces feel less transactional and more like shared community rooms. The result is longer visits and more relaxed interactions between local residents.",
      "Urban planners describe the trend as part of a wider shift toward public spaces that support small daily rituals. When people can browse, sit, and read without hurry, they are more likely to make the space part of their routine."
    ]
  }
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
