import type { Article, CommunityPost } from "@/lib/types";

export const MARATHON_POST_ID = "11111111-1111-4111-8111-111111111111";

type FeaturedCommunityConfig = {
  id: string;
  title: string;
  sourceUrl: string;
  sourceTitle: string;
  publishedAt: string;
  category: Article["category"];
  keyword: string;
  question: string;
  deck: string;
  insight: string;
  analysis: string;
  takeaway: string;
  imageUrl: string;
  imageAlt: string;
  options: Array<{
    id: string;
    label: string;
    votes: number;
    percentage: number;
  }>;
  usefulExpressions: UsefulExpression[];
  opinionSummaries: CommunityOpinionSummary[];
  storyBlocks: CommunityStoryBlock[];
  comments: CommunityPost["comments"];
};

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

export type CommunityOpinionSummary = {
  optionId: string;
  label: string;
  summary: string;
  points: string[];
  quote: string;
  tone: string;
  examples?: Array<{
    name: string;
    opinion: string;
  }>;
};

export type UsefulExpression = {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
};

const resultColors = [
  ["bg-[#e9873d]", "bg-[#e9873d]"],
  ["bg-[#4b8ecf]", "bg-[#4b8ecf]"],
  ["bg-[#57a773]", "bg-[#57a773]"],
  ["bg-[#a8aaa5]", "bg-[#a8aaa5]"]
];

const featuredConfigs: FeaturedCommunityConfig[] = [
  {
    id: "11111111-1111-4111-8111-111111111112",
    title: "AI Glasses",
    sourceUrl: "https://newneek.co/@pizzastation/article/41322",
    sourceTitle: "Should AI glasses be restricted?",
    publishedAt: "2026-06-18T09:00:00.000Z",
    category: "National",
    keyword: "AI glasses",
    question:
      "Should the use of AI glasses be restricted in exams, public spaces, and daily life?",
    deck:
      "Smart glasses can translate, search, guide, and assist. They can also record, analyze, and quietly change the rules of privacy and fairness.",
    insight:
      "Most participants supported restrictions, but many wanted rules that protect privacy without blocking useful assistive technology.",
    analysis:
      "AI glasses are moving from science fiction into ordinary life. They combine cameras, microphones, and generative AI in a device that can look like regular eyewear. That promise is raising concerns about cheating, hidden recording, facial data, and whether institutions are ready for wearable AI.",
    takeaway:
      "The central question is not whether AI glasses are good or bad. It is where society should draw rules before the device becomes invisible.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A person using wearable technology near a laptop",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222231",
        label: "Restrictions are needed",
        votes: 1880,
        percentage: 73.6
      },
      {
        id: "22222222-2222-4222-8222-222222222232",
        label: "They should not be restricted",
        votes: 77,
        percentage: 3.0
      },
      {
        id: "22222222-2222-4222-8222-222222222233",
        label: "A different approach is needed",
        votes: 540,
        percentage: 21.1
      },
      {
        id: "22222222-2222-4222-8222-222222222234",
        label: "Not sure",
        votes: 57,
        percentage: 2.2
      }
    ],
    usefulExpressions: [
      {
        id: "ai-glasses-wearable-ai",
        phrase: "wearable AI",
        meaning: "AI technology built into something people can wear",
        example:
          "Wearable AI can make translation, navigation, and search available without taking out a phone."
      },
      {
        id: "ai-glasses-privacy-invasion",
        phrase: "privacy invasion",
        meaning: "a situation where someone's private life or data is violated",
        example:
          "Hidden recording through AI glasses could become a serious privacy invasion."
      },
      {
        id: "ai-glasses-cheating",
        phrase: "exam cheating",
        meaning: "dishonest behavior during a test or exam",
        example:
          "Schools are worried that AI glasses could create a new form of exam cheating."
      },
      {
        id: "ai-glasses-blanket-ban",
        phrase: "blanket ban",
        meaning: "a rule that completely bans something in all cases",
        example:
          "Some participants said a blanket ban would block useful assistive technology."
      },
      {
        id: "ai-glasses-safety-guardrails",
        phrase: "safety guardrails",
        meaning: "rules or systems that prevent harmful use",
        example:
          "Visible recording indicators could work as safety guardrails for AI glasses."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222231",
        label: "Restrictions are needed",
        tone: "Privacy and fairness first",
        summary:
          "This group saw AI glasses as a technology that can quietly cross boundaries before people notice. Their strongest concern was not the device itself, but how easily it could be used for cheating, hidden recording, facial recognition, and data collection.",
        points: [
          "Exams, bathrooms, courts, schools, and other sensitive spaces need clear restrictions.",
          "Visible recording indicators, product labels, and legal penalties should be prepared before the device becomes common.",
          "Assistive uses should remain possible, but only with rules that separate legitimate support from abuse."
        ],
        quote:
          "If people start feeling watched without consent, the basic comfort of everyday life disappears.",
        examples: [
          {
            name: "Baek Siya",
            opinion:
              "Living with the feeling that privacy is not protected would make people anxious and uncomfortable, as if they were constantly being watched. New technology should not be rushed into daily life. It needs enough ethical review, public discussion, and coordination so that side effects do not turn into crime."
          },
          {
            name: "Prang",
            opinion:
              "AI has enormous potential, but generative AI has already shown that new technology can be abused for crime, such as deepfakes. AI glasses and other AI wearables will also carry that risk. The problem is not the technology itself, but the humans using it, which is why restrictions are needed."
          },
          {
            name: "Kovena",
            opinion:
              "The problem is that AI glasses could become common before proper laws are in place. It is not only that an individual user may record something. Data could all move to AI companies, including the user's data and other people's data. Regulation or usage limits seem necessary."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222232",
        label: "They should not be restricted",
        tone: "Do not punish the tool",
        summary:
          "This smaller group argued that AI glasses were created for useful purposes and should not be blocked because some people misuse them. They were more worried about slowing innovation and reducing access to tools that could help people work, move, learn, and communicate.",
        points: [
          "The problem is harmful behavior, not the existence of AI glasses.",
          "Blanket restrictions could make developers and users avoid beneficial applications.",
          "Policies should target abuse while allowing ordinary and assistive uses."
        ],
        quote:
          "Technology should not be stopped just because society has not yet learned how to use it well.",
        examples: [
          {
            name: "Rose",
            opinion:
              "AI glasses were developed for positive uses. The problems happening now come from people using them wrongly. In that case, society needs more specific policies rather than blocking the technology itself. It feels like our social systems are not keeping up with the speed of science and technology."
          },
          {
            name: "Goguma",
            opinion:
              "This technology clearly has good uses. If restrictions are placed too broadly, the reason developers created these glasses could disappear. Once limits are imposed, developers may have fewer reasons to build them and fewer places where the technology can be used."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222233",
        label: "A different approach is needed",
        tone: "Regulate by place and purpose",
        summary:
          "This group wanted a middle path. They agreed that AI glasses can create real risks, but said a simple ban would miss important cases such as disability support, public safety, translation, navigation, and professional use.",
        points: [
          "Rules should vary by location, purpose, and risk level.",
          "Design standards, detection tools, and penalties for abuse could be more effective than broad bans.",
          "Public services, emergency workers, and people with disabilities may need carefully defined exceptions."
        ],
        quote:
          "The right answer is not yes or no. It is building a system that makes good uses possible and bad uses costly.",
        examples: [
          {
            name: "Sugar Sugar Rune",
            opinion:
              "There may be cheating in important exams, but some people may need glasses for disability support. Instead of completely restricting them, society should allow use when necessary and prepare different policies or methods when use is not appropriate."
          },
          {
            name: "Felix",
            opinion:
              "Using AI glasses is a natural result of technological development, and more AI wearables will appear. Rather than restricting the use of the technology itself, it is important to create legal systems for proper use, such as design standards or penalties that reduce abuse."
          },
          {
            name: "Anonymous",
            opinion:
              "The glasses were not made only for misuse or harmful purposes. Restrictions on abuse are needed, but a total ban should be reconsidered. Police officers, firefighters, and people with visual impairments may benefit from them, so stronger punishment for misuse could be a better path."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222234",
        label: "Not sure",
        tone: "Too early to judge",
        summary:
          "Undecided participants felt the technology is still changing too quickly to judge with confidence. They wanted more information about actual harm, enforcement methods, and whether current privacy law can handle wearable AI.",
        points: [
          "The device is promising, but the risks are hard to measure before mass adoption.",
          "Rules may become outdated quickly if the technology changes form.",
          "More public discussion is needed before choosing a strict policy."
        ],
        quote:
          "It feels too early to choose a side when even the shape of the product is still changing."
      }
    ],
    storyBlocks: [
      {
        eyebrow: "What is this debate about?",
        title: "Wearable AI is becoming harder to notice",
        body: [
          "AI glasses can search, translate, record, and analyze what the wearer sees without needing a phone in hand.",
          "Supporters see the device as a useful tool for accessibility, navigation, work, and everyday information. Critics worry that it can be used for exam cheating, hidden filming, and mass collection of personal data."
        ]
      },
      {
        eyebrow: "What the community said",
        title: "Protection first, but not a blanket ban",
        body: [
          "The largest group wanted restrictions in sensitive places such as exams, bathrooms, courts, and schools.",
          "Many people also asked for visible recording indicators, clear labeling, stronger penalties for abuse, and exceptions for people who genuinely need assistive technology."
        ]
      },
      {
        eyebrow: "Community takeaway",
        title: "Rules need to evolve with the device",
        body: [
          "A simple ban may push the problem into harder-to-detect forms. The better path may be clear usage zones, detection standards, privacy rules, and exam systems that account for AI tools."
        ]
      }
    ],
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333341",
        authorName: "Baek Siya",
        body:
          "If people feel watched without consent, daily life becomes anxious. New technology should enter society with clear ethical checks.",
        createdAt: "2026-06-18T11:00:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333342",
        authorName: "Felix",
        body:
          "The answer should not be banning the technology itself. We need rules for where and how it can be used responsibly.",
        createdAt: "2026-06-18T12:20:00.000Z"
      }
    ]
  },
  {
    id: "11111111-1111-4111-8111-111111111113",
    title: "Debt-Fueled Stock Investing",
    sourceUrl: "https://newneek.co/@pizzastation/article/40849",
    sourceTitle: "Should people borrow money to invest in stocks?",
    publishedAt: "2026-06-04T09:00:00.000Z",
    category: "Business",
    keyword: "leveraged investing",
    question:
      "When investors borrow heavily to buy stocks, is it a personal responsibility or a risk that needs regulation?",
    deck:
      "A hot stock market is pulling more people into leveraged investing. The upside feels personal, but the downside can spread through households and markets.",
    insight:
      "Most participants said investment choices are personal, but many still wanted guardrails such as financial education and lending checks.",
    analysis:
      "As Korean stocks surged, margin loans and credit borrowing rose sharply. Supporters of personal responsibility argued that investing is voluntary and losses should remain with the investor. Others warned that excessive debt can trigger forced selling, household stress, and broader financial instability.",
    takeaway:
      "Freedom to invest matters, but leverage can turn private risk into public pressure when too many people borrow beyond what they can repay.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Stock market charts on a trading screen",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222241",
        label: "It is each person's responsibility",
        votes: 2286,
        percentage: 57.2
      },
      {
        id: "22222222-2222-4222-8222-222222222242",
        label: "Some regulation is needed",
        votes: 1292,
        percentage: 32.3
      },
      {
        id: "22222222-2222-4222-8222-222222222243",
        label: "A different solution is needed",
        votes: 240,
        percentage: 6.0
      },
      {
        id: "22222222-2222-4222-8222-222222222244",
        label: "Not sure",
        votes: 179,
        percentage: 4.5
      }
    ],
    usefulExpressions: [
      {
        id: "debt-investing-leverage",
        phrase: "leverage",
        meaning: "using borrowed money to increase potential investment gains or losses",
        example:
          "Leverage can multiply profits in a rising market, but it can also multiply losses."
      },
      {
        id: "debt-investing-margin-loan",
        phrase: "margin loan",
        meaning: "money borrowed from a brokerage to buy investments",
        example:
          "A margin loan can force investors to sell if stock prices fall quickly."
      },
      {
        id: "debt-investing-forced-selling",
        phrase: "forced selling",
        meaning: "selling assets because rules or debt pressure require it",
        example:
          "Forced selling can deepen market anxiety when many investors borrowed too much."
      },
      {
        id: "debt-investing-household-debt",
        phrase: "household debt",
        meaning: "money owed by individuals or families",
        example:
          "Excessive stock borrowing can add pressure to household debt."
      },
      {
        id: "debt-investing-risk-warning",
        phrase: "risk warning",
        meaning: "a notice that explains possible danger or loss",
        example:
          "Participants wanted clearer risk warnings before people borrow to invest."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222241",
        label: "It is each person's responsibility",
        tone: "Personal risk, personal result",
        summary:
          "This group treated borrowing to invest as a voluntary choice. They argued that adults who chase higher returns must also accept the possibility of larger losses, and that the state should not rescue people from investment decisions they made freely.",
        points: [
          "Investing with borrowed money is risky, but the decision belongs to the investor.",
          "Excessive protection can encourage people to ignore risk.",
          "The market needs responsibility as much as opportunity."
        ],
        quote:
          "If someone borrows to invest, the profit and the loss should both belong to that person.",
        examples: [
          {
            name: "Seoyeon",
            opinion:
              "Borrowing money is a choice, and using that borrowed money to invest is also a choice. The responsibility for that choice should belong to the individual. If the market rises so quickly that not borrowing feels strange, then society should look at the environment pushing people toward extreme choices, but the solution should not violate investment freedom."
          },
          {
            name: "Sim Yujeong",
            opinion:
              "It is very difficult for the state to solve a matter that each person handles through their own investment decisions. If the government intervenes carelessly, the problem could grow larger or only appear solved for a short time. Since investing differs by personal tendency, the degree of state intervention needs careful debate."
          },
          {
            name: "Anonymous",
            opinion:
              "There is no stock market that rises forever. Bubbles bursting is natural in the long run, and neither individuals nor the government can predict it exactly. Regulating each person would be overreach. What matters is making responsibility clear: if excessive investing creates losses, that is the individual's responsibility."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222242",
        label: "Some regulation is needed",
        tone: "Private choices can create public damage",
        summary:
          "This group worried that debt-fueled investing can spread beyond one person's account. If many investors borrow too much, forced selling, household debt pressure, and market volatility can become a wider social problem.",
        points: [
          "Loan screening and leverage limits can prevent extreme cases.",
          "Brokerages and lenders should explain loss scenarios more clearly.",
          "Regulation should protect the system from mass panic, not guarantee profits."
        ],
        quote:
          "When too many people borrow beyond their capacity, it stops being only an individual problem.",
        examples: [
          {
            name: "Pool Alert King",
            opinion:
              "Borrowing to invest is an individual choice, but with debt piling up this much, it is unclear how many people could truly take responsibility if the market fails to keep rising. If interest rates rise, repayment burdens will grow. Since the side effects can affect other citizens, some regulation is needed."
          },
          {
            name: "Anonymous",
            opinion:
              "Everyone dreams of making a fortune at least once, and the current stock market can shake even people who were never interested in stocks. It is tempting enough to make me think about borrowing to invest. I wish there were some regulation strong enough to hold back that psychology."
          },
          {
            name: "Anonymous",
            opinion:
              "When household debt grows, the government and financial authorities will eventually regulate it. If indebted investors go bankrupt, the burden may be handled through taxes. Profits go to individuals, but losses can become a cost shared by everyone, so some regulation is needed."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222243",
        label: "A different solution is needed",
        tone: "Education before prohibition",
        summary:
          "This group preferred stronger financial education and transparent warnings over direct regulation. They wanted people to understand margin calls, interest costs, and downside scenarios before borrowing for stocks.",
        points: [
          "Risk education should be practical and easy to understand.",
          "Apps and brokerages should show worst-case loss simulations before loans are approved.",
          "Policy should reduce reckless borrowing without blocking ordinary investment."
        ],
        quote:
          "People need to see how leverage multiplies losses before they click the borrow button.",
        examples: [
          {
            name: "Annyeong",
            opinion:
              "Investment is an individual choice, but extremely risky investing can make a person's life impossible to recover from. It can also increase debt across society, so a system that checks this in advance is necessary."
          },
          {
            name: "Je Hiyoung",
            opinion:
              "Borrowing and investing are personal choices, but if many people fail because they borrowed beyond what they can handle, everyone can suffer. Rather than ignoring it or banning it through regulation, people should be allowed to invest after enough education and qualification checks."
          },
          {
            name: "JH",
            opinion:
              "Realistic education is needed so people can understand investment risk. This is not simply about blocking people through regulation or respecting personal preference. We should respect individual freedom while building a practical education system that clearly teaches risk."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222244",
        label: "Not sure",
        tone: "Depends on scale",
        summary:
          "Undecided participants felt the answer depends on how large the debt is, who is lending, and whether losses remain manageable. They were cautious about both moralizing investors and ignoring systemic risk.",
        points: [
          "Small, informed borrowing feels different from extreme leverage.",
          "The same rule may not fit young retail investors and experienced traders.",
          "More data is needed on defaults, forced selling, and household impact."
        ],
        quote:
          "The issue is not borrowing itself. It is whether people know what they are stepping into."
      }
    ],
    storyBlocks: [
      {
        eyebrow: "What is this debate about?",
        title: "A rally can make risk feel invisible",
        body: [
          "When markets climb quickly, investors may borrow through securities firms, credit loans, or overdrafts to increase their exposure.",
          "This can increase gains, but it can also increase losses. If prices fall, forced selling can happen quickly and deepen market anxiety."
        ]
      },
      {
        eyebrow: "What the community said",
        title: "Personal choice, public spillover",
        body: [
          "The largest group argued that borrowing and investing are personal choices, so individuals must accept the consequences.",
          "Others said the scale of borrowing can become a social issue if defaults, forced sales, or household debt pressures spread."
        ]
      },
      {
        eyebrow: "Community takeaway",
        title: "Education may matter as much as regulation",
        body: [
          "Participants suggested stronger financial education, clearer risk warnings, better loan screening, and limits on extreme leverage rather than a simple ban."
        ]
      }
    ],
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333351",
        authorName: "Seoyeon",
        body:
          "Borrowing is a choice, and investing with borrowed money is also a choice. The responsibility should be clear.",
        createdAt: "2026-06-04T11:00:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333352",
        authorName: "JH",
        body:
          "People need practical education that shows how leverage can multiply losses, not just gains.",
        createdAt: "2026-06-04T12:20:00.000Z"
      }
    ]
  },
  {
    id: MARATHON_POST_ID,
    title: "Weekend Marathons",
    sourceUrl: "https://www.koreaherald.com/article/10616937",
    sourceTitle: "Weekend marathons raise questions over road closures",
    publishedAt: "2026-06-18T09:00:00.000Z",
    category: "Sports",
    keyword: "urban marathons",
    question:
      "A community festival or a disruption to daily life? What do you think about road closures during urban marathons?",
    deck:
      "Road races bring energy to the city, but road closures can reshape an ordinary weekend.",
    insight:
      "Most people are not against marathons. They want races to continue with better planning, earlier notices, safer operations, and cleaner routes.",
    analysis:
      "Running has become one of Korea's most popular hobbies. More than 400 marathon events are now held across the country each year. Large races attract runners, spectators, sponsors, and visitors, bringing energy and economic benefits to host cities.\n\nBut during major races, roads may remain closed for hours. Buses are delayed or rerouted, traffic becomes congested, and residents may struggle to reach work, appointments, or weekend plans.",
    takeaway:
      "A successful marathon should be enjoyable for runners without becoming a burden for everyone else.",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Runners moving through a city road race",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222221",
        label: "Better coordination is needed",
        votes: 226,
        percentage: 72.7
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        label: "City roads should not be closed",
        votes: 50,
        percentage: 16.1
      },
      {
        id: "22222222-2222-4222-8222-222222222223",
        label: "The current system is acceptable",
        votes: 29,
        percentage: 9.3
      },
      {
        id: "22222222-2222-4222-8222-222222222224",
        label: "Not sure",
        votes: 6,
        percentage: 1.9
      }
    ],
    usefulExpressions: [
      {
        id: "marathon-road-closure",
        phrase: "road closure",
        meaning: "a temporary block on road traffic",
        example:
          "A major road closure can delay buses, cars, and weekend plans."
      },
      {
        id: "marathon-traffic-management",
        phrase: "traffic management",
        meaning: "planning and controlling traffic movement",
        example:
          "Better traffic management could reduce the inconvenience caused by marathons."
      },
      {
        id: "marathon-detour",
        phrase: "bus detour",
        meaning: "a changed route that avoids a blocked road",
        example:
          "Residents asked for earlier notices about bus detours during race days."
      },
      {
        id: "marathon-community-event",
        phrase: "community event",
        meaning: "an event that brings local people together",
        example:
          "Many people still see marathons as positive community events."
      },
      {
        id: "marathon-strike-balance",
        phrase: "strike a balance",
        meaning: "find a fair middle point between different needs",
        example:
          "Cities need to strike a balance between runners' experiences and residents' daily lives."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222221",
        label: "Better coordination is needed",
        tone: "Keep the race, fix the planning",
        summary:
          "Most participants were not against marathons themselves. They supported the health, community, and local business benefits, but said cities and organizers need better coordination so residents are not surprised or trapped by road closures.",
        points: [
          "Road-closure notices should arrive earlier and be easier to find.",
          "Navigation apps, bus apps, and city websites should show real-time detours.",
          "Race routes, cleanup, safety staffing, and event frequency need clearer approval standards."
        ],
        quote:
          "Running on an open road is great, but residents should not discover the closure only after they are already delayed.",
        examples: [
          {
            name: "Jiyoon",
            opinion:
              "Running on an open road feels amazing, but experiencing the same event as a driver made me understand how frustrating road closures can be. Marathons can continue, but cities need better notices, traffic guidance, and planning."
          },
          {
            name: "Minseo",
            opinion:
              "Large events should only be approved when organizers can properly manage traffic, safety, and cleanup. Marathons are good for health and local businesses, but rules are needed to protect residents from unnecessary inconvenience."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222222",
        label: "City roads should not be closed",
        tone: "Daily life should come first",
        summary:
          "This group felt weekend road closures had become too frequent and disruptive. They focused on workers, drivers, bus riders, and people with appointments who may not have flexible schedules.",
        points: [
          "Unexpected bus detours and traffic jams can turn short trips into long delays.",
          "Weekend workers and residents with fixed plans are often overlooked.",
          "Large races should use parks, riverside paths, stadiums, or roads with less daily traffic."
        ],
        quote:
          "A public road is not only for event participants. It is also part of someone's commute, shift, or family schedule.",
        examples: [
          {
            name: "Hana",
            opinion:
              "I often find out about a marathon only after getting on a bus and hearing that the route has changed. Some people still work on weekends, and road closures are becoming too frequent."
          },
          {
            name: "Doyun",
            opinion:
              "A five-minute trip once took nearly an hour because there was no clear information about the restrictions. City roads should not be closed so easily when ordinary residents have plans too."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222223",
        label: "The current system is acceptable",
        tone: "A little inconvenience is part of city life",
        summary:
          "This group believed marathons create a healthier and more active city. They saw temporary inconvenience as something residents can understand when the event is well-intentioned and socially positive.",
        points: [
          "Marathons support health, shared experiences, and lively public culture.",
          "Local businesses can benefit from runners, spectators, and visitors.",
          "Temporary closures can be accepted when they are not excessive."
        ],
        quote:
          "A city that supports health and culture will sometimes ask people to be patient for a few hours.",
        examples: [
          {
            name: "Mina",
            opinion:
              "Marathons are healthy and positive community events. A little inconvenience is something residents can understand when the event helps create a lively city atmosphere."
          },
          {
            name: "Jun",
            opinion:
              "Even people who do not run can benefit from a city that supports health, culture, and active lifestyles. The current system is acceptable if people approach the event with some patience."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222224",
        label: "Not sure",
        tone: "The details matter",
        summary:
          "Undecided participants did not reject the event or the inconvenience outright. They wanted to know the route, duration, frequency, public notice quality, and whether alternative transit support was provided.",
        points: [
          "A small local race and a large citywide race should not be judged the same way.",
          "Residents may accept closures if communication and transport support are strong.",
          "The policy should consider both runners' experience and residents' routines."
        ],
        quote:
          "It depends on how much the event disrupts the neighborhood and how honestly the city prepares people."
      }
    ],
    storyBlocks: [
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
        eyebrow: "Community takeaway",
        title: "The challenge is balance",
        body: [
          "Most people are not against marathons. They want marathon events to continue, but with better planning and clearer communication.",
          "The balance is between runners' experiences, residents' daily lives, and safe city operations."
        ]
      }
    ],
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
    ]
  },
  {
    id: "11111111-1111-4111-8111-111111111114",
    title: "Performance Bonus Caps",
    sourceUrl: "https://newneek.co/@pizzastation/article/40326",
    sourceTitle: "Should semiconductor bonus caps be removed?",
    publishedAt: "2026-05-07T09:00:00.000Z",
    category: "Business",
    keyword: "fair compensation",
    question:
      "Should semiconductor companies remove caps on performance bonuses when profits surge?",
    deck:
      "Samsung Electronics and SK hynix turned record profits into a bigger question: how should companies share gains with workers?",
    insight:
      "The largest group wanted a middle path: transparent calculations, flexible bonus bands, stock compensation, or other benefits instead of a simple yes-or-no answer.",
    analysis:
      "As the semiconductor industry entered a strong cycle, workers argued that exceptional profits should be shared with those who helped create them. Companies warned that unlimited bonuses could weaken investment capacity, research spending, and long-term stability in a cyclical industry.",
    takeaway:
      "The debate is less about a single bonus check and more about whether the rules for reward feel fair, transparent, and sustainable.",
    imageUrl:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A close-up of semiconductor hardware",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222251",
        label: "The cap should be removed",
        votes: 775,
        percentage: 24.6
      },
      {
        id: "22222222-2222-4222-8222-222222222252",
        label: "The cap should stay",
        votes: 868,
        percentage: 27.5
      },
      {
        id: "22222222-2222-4222-8222-222222222253",
        label: "A different solution is needed",
        votes: 984,
        percentage: 31.2
      },
      {
        id: "22222222-2222-4222-8222-222222222254",
        label: "Not sure",
        votes: 525,
        percentage: 16.7
      }
    ],
    usefulExpressions: [
      {
        id: "bonus-performance-bonus",
        phrase: "performance bonus",
        meaning: "extra pay given when goals or results are achieved",
        example:
          "Workers argued that a performance bonus should reflect the profits they helped create."
      },
      {
        id: "bonus-compensation-cap",
        phrase: "compensation cap",
        meaning: "a maximum limit on how much someone can be paid",
        example:
          "The debate focused on whether the compensation cap should be removed."
      },
      {
        id: "bonus-profit-sharing",
        phrase: "profit-sharing",
        meaning: "a system where employees receive part of company profits",
        example:
          "Some participants wanted a clearer profit-sharing formula."
      },
      {
        id: "bonus-talent-retention",
        phrase: "talent retention",
        meaning: "keeping skilled workers from leaving",
        example:
          "Removing the cap could help talent retention in the semiconductor industry."
      },
      {
        id: "bonus-long-term-sustainability",
        phrase: "long-term sustainability",
        meaning: "the ability to keep something stable over time",
        example:
          "Opponents worried that unlimited bonuses could hurt long-term sustainability."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222251",
        label: "The cap should be removed",
        tone: "Share exceptional gains",
        summary:
          "Supporters argued that record profits are created by workers as well as management and capital. If a company earns exceptional returns during a semiconductor boom, employees should feel that their contribution is recognized in a meaningful way.",
        points: [
          "Removing or raising the cap can improve morale and talent retention.",
          "Workers should share in upside when workloads and performance expectations rise.",
          "A strong reward system can help companies compete for engineers and specialists."
        ],
        quote:
          "If the company celebrates record performance, the people who made it possible should feel that record too.",
        examples: [
          {
            name: "Anonymous",
            opinion:
              "I do not think the excess profits of major companies like Samsung or SK hynix were achieved by one person alone. They are the result of the effort of many employees working inside those companies. It is not fair to dismiss this as rich-company workers being greedy or as an elite labor union complaint."
          },
          {
            name: "Orange Collector Kkong",
            opinion:
              "Company profits have no cap, so I do not understand why performance bonuses should have one. The important demand seems to be clear standards for bonuses. The company did well because many employees endured overtime, weekend work, and heavy workloads. If performance is poor, bonuses disappear anyway, so the cap can be removed."
          },
          {
            name: "Seo Somin",
            opinion:
              "The company can earn enough profit to pay bonuses because employees are there. Technology is the source of corporate success, but people create that technology. Being rewarded for the work you did is natural."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222252",
        label: "The cap should stay",
        tone: "Keep compensation predictable",
        summary:
          "This group worried that uncapped bonuses could become difficult to manage in a cyclical industry. They emphasized investment, research, equipment, shareholder duties, and the need to prepare for downturns.",
        points: [
          "Semiconductor profits rise and fall sharply across cycles.",
          "Unlimited bonuses could reduce funds for long-term competitiveness.",
          "A predictable cap helps the company plan compensation and investment together."
        ],
        quote:
          "A boom year should not create a compensation rule that becomes impossible in a downturn.",
        examples: [
          {
            name: "Anonymous",
            opinion:
              "If the cap is removed, the union may demand unlimited bonuses, and the company could face a heavy burden after the semiconductor supercycle ends. The profit surge came not only from employee effort, but also from international conditions, supply and demand, prices, and government support. If employee contribution can be calculated more precisely, raising the cap would be better."
          },
          {
            name: "SABCS",
            opinion:
              "The bonus cap is a rule that the company and workers agreed on in advance. Asking for more just because operating profit increased seems too hasty. If workers demand bonuses because they contributed to profit, then by the same logic, should they also share responsibility when the company suffers major losses?"
          },
          {
            name: "Kim Chanmi",
            opinion:
              "If the cap disappears, a large amount of money could keep flowing out and limit company growth. If the situation gets worse while labor costs remain high, no one knows what the company might do to reduce personnel expenses. In the long run, it could harm everyone."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222253",
        label: "A different solution is needed",
        tone: "Make the formula transparent",
        summary:
          "The largest group wanted a redesign rather than simply keeping or removing the cap. They asked for transparent formulas, flexible bands, stock-based rewards, welfare benefits, or profit-sharing rules that employees can understand.",
        points: [
          "Workers want to know how the bonus is calculated and why.",
          "A flexible system can reward exceptional years without creating unlimited obligations.",
          "Stock compensation, leave, benefits, or team-based incentives could complement cash bonuses."
        ],
        quote:
          "The problem is not only the amount. It is whether the rules feel clear and fair.",
        examples: [
          {
            name: "Seoan",
            opinion:
              "The semiconductor industry is growing quickly now, but no one can be sure it will continue. Because of that uncertainty, removing the cap should be considered carefully. Still, the company's success was also made possible by employees' effort, so rewards or other recognition systems could reflect the union's concerns."
          },
          {
            name: "Hi",
            opinion:
              "Removing the cap feels excessive. Semiconductors are not essential consumer goods, no one knows when the boom cycle will end, and development costs are huge. The cap should remain, but alternatives such as company shares could be offered. Employees need the company to keep earning profits too."
          },
          {
            name: "Choi Horim",
            opinion:
              "Rewarding employees when semiconductor companies perform well is a good thing. But from the company's side, a massive bonus demand is a burden. A cap can remain while the payout level is raised within a certain range, or compensation can come through vacation and other welfare support."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222254",
        label: "Not sure",
        tone: "Fairness is hard to price",
        summary:
          "Undecided participants saw both sides. They understood why workers expect larger rewards after strong performance, but also worried about industry volatility and whether public opinion can judge internal compensation fairly.",
        points: [
          "A fair bonus depends on profit, workload, market cycle, and company strategy.",
          "Internal compensation data is hard for outsiders to evaluate.",
          "The policy should avoid both worker resentment and short-term financial decisions."
        ],
        quote:
          "It is easy to say share more, but hard to know what amount is truly sustainable."
      }
    ],
    storyBlocks: [
      {
        eyebrow: "What is this debate about?",
        title: "A boom cycle tested old compensation rules",
        body: [
          "Performance bonuses often have a maximum level tied to salary or base pay. During a supercycle, workers can feel that a fixed cap does not reflect their contribution.",
          "Companies, meanwhile, point to the need for research, facilities, shareholder returns, and stability when the industry turns down."
        ]
      },
      {
        eyebrow: "What the community said",
        title: "Fairness means both reward and durability",
        body: [
          "Supporters of removing the cap emphasized worker contribution and talent retention.",
          "Opponents worried about unlimited claims, business volatility, and investment capacity. The largest group wanted clearer formulas and compromise tools."
        ]
      },
      {
        eyebrow: "Community takeaway",
        title: "Transparency may be the real demand",
        body: [
          "Many participants did not simply ask for more money. They asked for a reward system that workers can understand and companies can sustain."
        ]
      }
    ],
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333361",
        authorName: "Seoan",
        body:
          "The industry is growing quickly now, but no one knows how long it will last. A cautious compromise seems wiser.",
        createdAt: "2026-05-07T11:00:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333362",
        authorName: "Somin",
        body:
          "Technology is built by people. Reward systems should recognize that without putting the whole company at risk.",
        createdAt: "2026-05-07T12:20:00.000Z"
      }
    ]
  },
  {
    id: "11111111-1111-4111-8111-111111111115",
    title: "Smoke-Free Generation",
    sourceUrl: "https://newneek.co/@pizzastation/article/40237",
    sourceTitle: "Should the UK-style smoke-free generation law be adopted?",
    publishedAt: "2026-04-30T09:00:00.000Z",
    category: "World",
    keyword: "public health",
    question:
      "Should countries ban tobacco purchases for people born after a certain year?",
    deck:
      "The UK's smoke-free generation law frames tobacco as a public health crisis. Critics see it as government overreach into adult choice.",
    insight:
      "More than half supported the law, while a large minority wanted alternatives such as higher prices, stronger smoke-free zones, and quitting support.",
    analysis:
      "The proposed smoke-free generation law would prevent people born after 2009 from legally buying tobacco even after they become adults. Supporters argue that tobacco addiction creates enormous health and social costs. Opponents worry about personal freedom, black markets, and whether prohibition can work.",
    takeaway:
      "The debate asks how far a government should go when a private habit creates public health costs.",
    imageUrl:
      "https://images.unsplash.com/photo-1527099908998-5b73a5fe2a0d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A no smoking sign on a wall",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222261",
        label: "It should be adopted",
        votes: 2100,
        percentage: 52.0
      },
      {
        id: "22222222-2222-4222-8222-222222222262",
        label: "It should not be adopted",
        votes: 290,
        percentage: 7.2
      },
      {
        id: "22222222-2222-4222-8222-222222222263",
        label: "A different solution is needed",
        votes: 1360,
        percentage: 33.7
      },
      {
        id: "22222222-2222-4222-8222-222222222264",
        label: "Not sure",
        votes: 289,
        percentage: 7.2
      }
    ],
    usefulExpressions: [
      {
        id: "smoke-free-generation",
        phrase: "smoke-free generation",
        meaning: "a generation that is prevented or encouraged from starting smoking",
        example:
          "The law aims to create a smoke-free generation by blocking future tobacco purchases."
      },
      {
        id: "smoke-public-health",
        phrase: "public health",
        meaning: "the health of people in a community or society",
        example:
          "Supporters argued that tobacco creates serious public health costs."
      },
      {
        id: "smoke-black-market",
        phrase: "black market",
        meaning: "illegal buying and selling outside official rules",
        example:
          "Opponents worried that a strict tobacco ban could create a black market."
      },
      {
        id: "smoke-secondhand-smoke",
        phrase: "secondhand smoke",
        meaning: "smoke breathed in by people near a smoker",
        example:
          "Secondhand smoke was one reason participants supported stronger restrictions."
      },
      {
        id: "smoke-cessation-support",
        phrase: "cessation support",
        meaning: "help for people trying to stop a habit, especially smoking",
        example:
          "Many people preferred cessation support over a lifetime purchase ban."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222261",
        label: "It should be adopted",
        tone: "Protect the next generation",
        summary:
          "Supporters saw tobacco as an addictive product with costs that spread beyond individual smokers. They argued that preventing a new generation from starting is more humane and effective than helping people quit after addiction takes hold.",
        points: [
          "Smoking harms public health systems, families, and people exposed to secondhand smoke.",
          "A generation-based rule can gradually reduce smoking without punishing current smokers overnight.",
          "Young people are especially vulnerable to marketing, peer pressure, and early addiction."
        ],
        quote:
          "If we already know the harm, protecting people before addiction starts is a reasonable public duty.",
        examples: [
          {
            name: "Dandal",
            opinion:
              "The freedom of non-smokers to protect their health matters more than a smoker's freedom to buy an addictive product. There may be backlash and illegal routes at first, but once tobacco is legally restricted, public awareness of its danger will grow over time."
          },
          {
            name: "Mobile Plan",
            opinion:
              "Tobacco is harmful in every way and damages other people too. It also increases social costs, so banning it makes sense. It is time to consider the public health costs saved by banning tobacco rather than the tax revenue gained from selling it."
          },
          {
            name: "Seoan",
            opinion:
              "Many smokers know they need to quit, but it is difficult without strong willpower. Even though the government already intervenes through price increases, smoke-free zones, and fines, quitting is still mostly left to personal choice. For meaningful change, a measure with some force is needed."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222262",
        label: "It should not be adopted",
        tone: "Adults should choose for themselves",
        summary:
          "Opponents worried that the law goes too far by permanently limiting the choices of future adults. They also questioned whether prohibition-style policies would create black markets or unfair enforcement.",
        points: [
          "A person who becomes an adult should not be banned forever based only on birth year.",
          "Strict bans can push demand into illegal markets.",
          "Education and personal responsibility may be better than lifetime purchase restrictions."
        ],
        quote:
          "The product is harmful, but that does not automatically mean the government should remove adult choice.",
        examples: [
          {
            name: "Yeondoo Memo",
            opinion:
              "I question whether creating a smoke-free generation is truly necessary. Tobacco is a preference product, and access should not be completely blocked. Some people may become more curious precisely because they are told they cannot even approach it. Dividing people by birth year restricts freedom in the wrong direction."
          },
          {
            name: "Park Minhye",
            opinion:
              "Tobacco is bad for the body, but it does not immediately cause severe symptoms like narcotics. It is also already very common. If regulation starts this way, many things such as alcohol could also become targets. This excessively limits personal choice."
          },
          {
            name: "Min Jiseon",
            opinion:
              "History shows that when strongly addictive preference goods are banned, illegal trade always grows. Since the internet connects the world, illegal access is easier than before. Forced tobacco prohibition could create a huge black market outside government oversight and even involve criminal groups."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222263",
        label: "A different solution is needed",
        tone: "Reduce harm without a lifetime ban",
        summary:
          "This group wanted stronger anti-smoking policy, but preferred layered measures rather than a birth-year ban. They suggested price policy, smoke-free zones, cessation support, packaging rules, and education.",
        points: [
          "Higher tobacco taxes and plain packaging can reduce demand.",
          "Quitting programs should be easier to access and less stigmatizing.",
          "Rules against secondhand smoke should be enforced more consistently."
        ],
        quote:
          "The goal should be fewer smokers, but the method should be practical enough to last.",
        examples: [
          {
            name: "Anonymous",
            opinion:
              "Smoking is an unhealthy hobby that harms personal health, the surrounding environment, and hygiene, so improvement is clearly needed. But stopping smoking itself through the state is a different matter. Even though youth tobacco purchases are already illegal, youth smoking remains high, so it is time for methods beyond simply saying do not smoke."
          },
          {
            name: "Anonymous",
            opinion:
              "Alcohol and tobacco are choices based on personal preference. Instead of banning them completely, prices could be raised or fines increased when people smoke in smoke-free areas and harm others. The tax collected could be used for better purposes."
          },
          {
            name: "Mandu",
            opinion:
              "I am not sure this method would truly create a smoke-free generation. People often want something more when they are told not to do it. Rather than banning it by law, changing social perception or helping people who want to quit would be better."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222264",
        label: "Not sure",
        tone: "Good goal, uncertain method",
        summary:
          "Undecided participants agreed that smoking is harmful but were unsure whether a generational purchase ban would work. Their concerns centered on enforcement, fairness, and unintended consequences.",
        points: [
          "The law may be difficult to enforce across age groups.",
          "People may find illegal or informal ways to buy tobacco.",
          "More evidence is needed before adopting a policy with lifelong effects."
        ],
        quote:
          "The purpose makes sense, but I am not sure this rule is the most realistic way to get there."
      }
    ],
    storyBlocks: [
      {
        eyebrow: "What is this debate about?",
        title: "A law aimed at stopping smoking before it starts",
        body: [
          "The UK approach would raise the legal tobacco-buying age every year, effectively preventing younger generations from ever legally buying cigarettes.",
          "Supporters say tobacco is addictive and costly to public health systems. Critics say adults should not lose the right to choose legal products."
        ]
      },
      {
        eyebrow: "What the community said",
        title: "Health protection won, but alternatives mattered",
        body: [
          "Many supported strong action because smoking harms both smokers and people nearby.",
          "Others suggested higher tobacco taxes, stronger penalties for smoking in banned areas, better quitting support, or education rather than lifetime purchase bans."
        ]
      },
      {
        eyebrow: "Community takeaway",
        title: "Public health policy always touches freedom",
        body: [
          "The question is not only whether smoking is harmful. It is whether preventing harm justifies a law that limits future adults before they ever make the choice."
        ]
      }
    ],
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333371",
        authorName: "Dandal",
        body:
          "The freedom to stay healthy matters more than the freedom of an addictive product to keep spreading harm.",
        createdAt: "2026-04-30T11:00:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333372",
        authorName: "Memo",
        body:
          "A total ban may create resistance or illegal markets. Price, education, and support could work better together.",
        createdAt: "2026-04-30T12:20:00.000Z"
      }
    ]
  },
  {
    id: "11111111-1111-4111-8111-111111111116",
    title: "Wedding Stealth Tours",
    sourceUrl: "https://newneek.co/@pizzastation/article/39307",
    sourceTitle: "Is it okay to quietly visit another person's wedding venue?",
    publishedAt: "2026-03-19T09:00:00.000Z",
    category: "Life&Culture",
    keyword: "wedding costs",
    question:
      "Is it acceptable for engaged couples to quietly observe another wedding before choosing a venue?",
    deck:
      "Couples want to inspect expensive venues before signing. Wedding hosts may feel that uninvited guests cross a line.",
    insight:
      "Opinion was almost evenly split between quiet visits and respecting invitations, with many calling for official venue tours instead.",
    analysis:
      "Wedding stealth tours emerged because venue contracts are expensive, popular dates are hard to secure, and official consultations may not reveal the real experience. Supporters say discreet observation helps couples avoid costly mistakes. Opponents say weddings are private family events, not open showrooms.",
    takeaway:
      "The practice reflects a deeper problem: wedding services are expensive, opaque, and difficult to evaluate before commitment.",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A decorated wedding ceremony venue",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222271",
        label: "Quiet visits are acceptable",
        votes: 1102,
        percentage: 33.1
      },
      {
        id: "22222222-2222-4222-8222-222222222272",
        label: "Uninvited visits are not acceptable",
        votes: 1097,
        percentage: 32.9
      },
      {
        id: "22222222-2222-4222-8222-222222222273",
        label: "A different solution is needed",
        votes: 565,
        percentage: 17.0
      },
      {
        id: "22222222-2222-4222-8222-222222222274",
        label: "Not sure",
        votes: 568,
        percentage: 17.0
      }
    ],
    usefulExpressions: [
      {
        id: "wedding-stealth-tour",
        phrase: "stealth tour",
        meaning: "a quiet unofficial visit to inspect a place",
        example:
          "Some engaged couples take a stealth tour to see how a real wedding venue operates."
      },
      {
        id: "wedding-uninvited-guest",
        phrase: "uninvited guest",
        meaning: "someone who attends without being asked or welcomed",
        example:
          "Opponents said a stealth visitor is still an uninvited guest."
      },
      {
        id: "wedding-transparent-pricing",
        phrase: "transparent pricing",
        meaning: "clear prices without hidden costs",
        example:
          "Participants said transparent pricing could reduce the need for stealth tours."
      },
      {
        id: "wedding-consent-based",
        phrase: "consent-based",
        meaning: "done with clear permission from the people involved",
        example:
          "A consent-based venue tour could protect the couple's privacy."
      },
      {
        id: "wedding-private-ceremony",
        phrase: "private ceremony",
        meaning: "a personal event intended only for invited people",
        example:
          "Many people argued that a wedding is a private ceremony, not a showroom."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222271",
        label: "Quiet visits are acceptable",
        tone: "A careful preview is understandable",
        summary:
          "This group said quiet observation can be acceptable because weddings are expensive, contracts are difficult to reverse, and venue consultations often do not show the real event experience. They emphasized discretion and respect.",
        points: [
          "Couples need to see parking, flow, lighting, food service, and staff response in a real setting.",
          "A quiet visit that does not eat, take seats, interrupt photos, or disturb guests can be low-impact.",
          "Venue decisions involve large costs, so consumers need more reliable information."
        ],
        quote:
          "If the visit is brief and respectful, it feels more like research than intrusion.",
        examples: [
          {
            name: "Nandol",
            opinion:
              "From the perspective of an engaged couple, it is natural to wonder how the actual ceremony runs at a venue. In many cases, seeing it in person is the only way to know. Venues should create official services, but if the visit does not disrupt the ceremony, a careful look around seems acceptable."
          },
          {
            name: "Jini Jini",
            opinion:
              "If visitors stay quiet and do not stand out, I think it is fine. It is hard to distinguish them from actual guests, and seeing a real ceremony may be the only way to check the venue. But whispering obviously, losing focus during the ceremony, or taking too many photos would be rude."
          },
          {
            name: "Chogongil",
            opinion:
              "A wedding is a once-in-a-lifetime event, and people spend a huge amount of money they worked hard to save. It is understandable to feel anxious about signing a contract based only on a consultant's words. If visitors pay a proper congratulatory gift and avoid causing trouble, it seems acceptable."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222272",
        label: "Uninvited visits are not acceptable",
        tone: "A wedding is not a showroom",
        summary:
          "This group focused on the emotional privacy of the couple and families. They argued that even quiet strangers can make an intimate event feel commercialized or unsafe.",
        points: [
          "The wedding couple invited guests to celebrate, not to inspect the venue.",
          "Uninvited visitors can make families uncomfortable even if they behave politely.",
          "The venue should not shift its marketing burden onto someone else's private ceremony."
        ],
        quote:
          "A wedding day belongs to the couple. It should not become a live sample room for strangers.",
        examples: [
          {
            name: "Breadcrumb Squirrel",
            opinion:
              "A wedding gathers both families, friends, coworkers, and acquaintances of the couple. These days, some weddings invite only very close people. That makes a wedding a major family event, and the couple could feel uncomfortable if a total stranger secretly comes to watch."
          },
          {
            name: "Nunum",
            opinion:
              "There is a phrase, uninvited guest. It is obvious that people involved would not look kindly on a stealth wedding tour. On one of the happiest days of a couple's life, doing something socially inappropriate does not feel right. The venue should be filled with guests who came to sincerely celebrate."
          },
          {
            name: "Future King",
            opinion:
              "A wedding is a place to congratulate people you know. If the purpose is not celebration, there is no reason to go, and certainly no need to go secretly. Meals are usually prepared based on the expected number of guests, so unrelated visitors eating there could disrupt service."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222273",
        label: "A different solution is needed",
        tone: "Create consent-based venue tours",
        summary:
          "This group saw the conflict as a market design problem. They wanted venues to offer official live-event tours, realistic video walkthroughs, transparent pricing, and systems that compensate or protect couples who agree to observation.",
        points: [
          "Venues should provide real ceremony information without forcing secret visits.",
          "Consent-based tours could separate potential customers from private guest areas.",
          "Clearer pricing and refund terms would reduce the pressure to inspect secretly."
        ],
        quote:
          "The fact that people sneak in means the wedding market is not giving enough trustworthy information.",
        examples: [
          {
            name: "Salmon Lover",
            opinion:
              "Wedding costs are so high that it is natural to want to see the real atmosphere and avoid failure. But secretly attending someone else's wedding does not feel polite. It would be better if the company informed the wedding couple in advance and offered discounts or benefits so both sides know about each other."
          },
          {
            name: "7uly",
            opinion:
              "What if the venue officially guided engaged couples to see an actual wedding? The venue could manage the meal cost separately instead of making the wedding couple pay for it. Hidden visits become a problem because they are hidden. If I were planning a wedding, I would also want to know how the actual ceremony works."
          },
          {
            name: "Yeondoo Memo",
            opinion:
              "Before judging stealth tours, we should ask why this culture appeared. The wedding industry has hidden prices and operated opaquely, while couples often do not receive proper guidance. Unless the add-on costs and unclear pricing change, it will be hard to stop these tours."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222274",
        label: "Not sure",
        tone: "Depends on behavior",
        summary:
          "Undecided participants felt the answer depends on how the visit happens. A quick lobby glance felt different from entering the ceremony space, taking photos, eating food, or blending into the guest list.",
        points: [
          "Venue layout, visitor behavior, and the couple's consent all matter.",
          "Some visits may be harmless, while others clearly cross a privacy line.",
          "A social norm is needed because the current boundary is unclear."
        ],
        quote:
          "The same action can feel harmless or rude depending on how far the visitor goes."
      }
    ],
    storyBlocks: [
      {
        eyebrow: "What is this debate about?",
        title: "A private celebration became a consumer research site",
        body: [
          "Some engaged couples visit real weddings to check parking, food, crowd flow, lighting, and service before choosing a venue.",
          "Supporters say this is understandable because wedding costs are high and contracts are difficult to reverse. Opponents say an uninvited visit can make the couple and guests uncomfortable."
        ]
      },
      {
        eyebrow: "What the community said",
        title: "The split was almost exact",
        body: [
          "One side said quiet, respectful observation can be acceptable if it does not disturb the ceremony.",
          "The other side said a wedding is not a showroom and should be filled with people there to celebrate the couple."
        ]
      },
      {
        eyebrow: "Community takeaway",
        title: "The wedding industry needs better transparency",
        body: [
          "Many participants wanted venues to offer official live-event tours, clearer pricing, and consent-based systems so couples do not feel pushed toward secret visits."
        ]
      }
    ],
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333381",
        authorName: "Nandol",
        body:
          "If there is no other way to see the actual ceremony flow, a quiet and respectful visit can be understandable.",
        createdAt: "2026-03-19T11:00:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333382",
        authorName: "Yeondoo Memo",
        body:
          "The real issue is that wedding pricing and venue information are too opaque. Better official tours would solve a lot.",
        createdAt: "2026-03-19T12:20:00.000Z"
      }
    ]
  },
  {
    id: "11111111-1111-4111-8111-111111111117",
    title: "Public Walkways in Apartments",
    sourceUrl: "https://newneek.co/@pizzastation/article/38323",
    sourceTitle: "Should apartment public walkways stay open?",
    publishedAt: "2026-01-29T09:00:00.000Z",
    category: "National",
    keyword: "public walkways",
    question:
      "Should apartment complexes keep public walkways open to non-residents?",
    deck:
      "Apartment residents want privacy and safety. Neighbors rely on walkways that connect stations, parks, schools, and shops.",
    insight:
      "Most participants said public walkways should remain open, but many wanted management rules that reduce noise, litter, and safety concerns.",
    analysis:
      "Some apartment complexes received redevelopment benefits in exchange for creating walkways that connect the neighborhood. After residents move in, conflicts can arise when outsiders use those paths often. Residents cite privacy, noise, safety, and maintenance costs. Nearby residents argue that closing the path breaks a public connection.",
    takeaway:
      "The problem sits between private property and urban public life. Clear management responsibility matters before gates go up.",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern apartment buildings with a pedestrian path",
    options: [
      {
        id: "22222222-2222-4222-8222-222222222281",
        label: "They should stay open",
        votes: 362,
        percentage: 57.6
      },
      {
        id: "22222222-2222-4222-8222-222222222282",
        label: "They do not have to stay open",
        votes: 106,
        percentage: 16.9
      },
      {
        id: "22222222-2222-4222-8222-222222222283",
        label: "A different solution is needed",
        votes: 125,
        percentage: 19.9
      },
      {
        id: "22222222-2222-4222-8222-222222222284",
        label: "Not sure",
        votes: 35,
        percentage: 5.6
      }
    ],
    usefulExpressions: [
      {
        id: "walkway-public-walkway",
        phrase: "public walkway",
        meaning: "a path intended for public pedestrian use",
        example:
          "The conflict began over whether the public walkway should remain open."
      },
      {
        id: "walkway-private-property",
        phrase: "private property",
        meaning: "land or buildings owned by individuals or private groups",
        example:
          "Residents argued that the apartment complex is still private property."
      },
      {
        id: "walkway-public-interest",
        phrase: "public interest",
        meaning: "the benefit or welfare of the wider community",
        example:
          "Supporters said keeping the path open serves the public interest."
      },
      {
        id: "walkway-shared-rules",
        phrase: "shared rules",
        meaning: "rules agreed on by multiple groups",
        example:
          "A third solution could involve shared rules for access, cleaning, and safety."
      },
      {
        id: "walkway-local-government",
        phrase: "local government mediation",
        meaning: "help from local authorities to resolve conflict",
        example:
          "Several participants asked for local government mediation instead of neighbor conflict."
      }
    ],
    opinionSummaries: [
      {
        optionId: "22222222-2222-4222-8222-222222222281",
        label: "They should stay open",
        tone: "Public benefits should remain public",
        summary:
          "This group argued that walkways promised or designed as public connections should continue serving the neighborhood. They saw closure as unfair when redevelopment benefits, zoning decisions, or community planning assumed public access.",
        points: [
          "Walkways connect everyday routes to transit, schools, parks, and shops.",
          "If public access helped justify a project, residents should not later close it unilaterally.",
          "A city works better when useful paths remain connected."
        ],
        quote:
          "If the walkway was part of the neighborhood plan, it should not disappear after the apartments are built.",
        examples: [
          {
            name: "Jo Hwa",
            opinion:
              "The issue probably grew because the path has heavy foot traffic and management costs became too high. Still, if one restriction after another appears, people may no longer be able to walk freely. Public walkways should remain open, and users also need to keep the street clean and careful."
          },
          {
            name: "Ringo",
            opinion:
              "For the public interest, the walkway can be opened. Making people take long detours seriously harms public convenience. I also question whether opening the walkway truly creates huge problems for the apartment. Locking the complex may even hurt the image of residents and isolate the community."
          },
          {
            name: "Ennui",
            opinion:
              "Sharing an apartment's central passage with the community feels healthier. Problems like trash can happen, but there should be ways to respond other than banning entry. Today it may be my apartment blocking others, but someday I may be the one forced to take a long detour."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222282",
        label: "They do not have to stay open",
        tone: "Residents carry the cost",
        summary:
          "This group emphasized that apartment residents deal with noise, litter, facility damage, security concerns, and maintenance costs. They questioned why residents should bear the burden when outsiders use the space heavily.",
        points: [
          "Privacy and safety concerns increase when many non-residents pass through residential space.",
          "Cleaning, repair, and security costs often fall on residents.",
          "Public convenience should not erase the rights of people who live there."
        ],
        quote:
          "A shortcut for others can become a daily burden for the people who live beside it.",
        examples: [
          {
            name: "Gomgom",
            opinion:
              "My apartment is experiencing this problem. There seem to be many issues caused by people who do not live here passing through. Not everyone causes trouble, but even if only a few people do, the damage falls on residents. Since it is hard to identify those few people realistically, the result becomes blocking everyone."
          },
          {
            name: "Shuji",
            opinion:
              "Where I live has good landscaping, so nearby residents, students, and children often come through. But some people throw trash, college students drink and shout, and pet waste is left behind. After residents experience so many unreasonable incidents, banning outside entry begins to feel right."
          },
          {
            name: "Anonymous",
            opinion:
              "It would be good to open public walkways, but the land is still residents' private property. Since many problems caused by outside visitors cannot be solved inside the apartment complex, I understand why residents take this kind of measure."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222283",
        label: "A different solution is needed",
        tone: "Manage access, do not simply open or close",
        summary:
          "This group wanted practical rules that protect both access and residents' quality of life. Suggestions included time-limited access, cameras, better lighting, shared maintenance costs, route redesign, and local government mediation.",
        points: [
          "Open hours can balance commute needs with nighttime safety concerns.",
          "Cities can help pay for cleaning, lighting, signs, and maintenance if the path serves the public.",
          "Design changes can separate public walking paths from private residential areas."
        ],
        quote:
          "The answer should not be a locked gate or a free-for-all. It should be shared rules.",
        examples: [
          {
            name: "Lili Turnip",
            opinion:
              "The argument that the apartment passage is private land is valid, and the argument that the path has long been used as a public route is also valid. Since neither side is simply wrong, they should share opinions and search for a third solution with consideration as neighbors."
          },
          {
            name: "Eunji",
            opinion:
              "If it is legally private land, that should be recognized, and the state should help find another solution. If opinions are divided enough to create this much conflict, it is not fair to force only one side to be considerate. Local or central government should step in."
          },
          {
            name: "Ko Junhyuk",
            opinion:
              "It is hard to say either side is completely wrong. Residents may feel burdened by outsiders freely entering private property, but completely blocking the path is also a problem. Separating the passage and setting limits on time or usage could reduce discomfort on both sides."
          }
        ]
      },
      {
        optionId: "22222222-2222-4222-8222-222222222284",
        label: "Not sure",
        tone: "Context decides",
        summary:
          "Undecided participants wanted to know whether the walkway was legally promised as public, how much disturbance occurs, and whether the city has offered support. They saw both community access and resident protection as legitimate.",
        points: [
          "A path built with public conditions differs from a purely private internal route.",
          "The level of nuisance should be measured rather than assumed.",
          "The fairest answer may depend on legal agreements and actual usage data."
        ],
        quote:
          "I need to know whether this is truly public space or private space being used like public space."
      }
    ],
    storyBlocks: [
      {
        eyebrow: "What is this debate about?",
        title: "A shortcut can become a neighborhood fault line",
        body: [
          "Public walkways inside apartment complexes often connect transit, schools, parks, and commercial areas.",
          "Residents may experience noise, litter, privacy concerns, and facility damage. Neighbors may lose a useful everyday route if access is blocked."
        ]
      },
      {
        eyebrow: "What the community said",
        title: "Keep the path, manage the conflict",
        body: [
          "The largest group argued that walkways built for public use should remain open because closing them harms the broader neighborhood.",
          "Others said residents should not have to absorb all the costs and discomfort created by constant outside use."
        ]
      },
      {
        eyebrow: "Community takeaway",
        title: "Publicness needs maintenance rules",
        body: [
          "Participants suggested time-based access, clearer conduct rules, shared cleaning costs, local government mediation, and designs that separate public paths from private residential areas."
        ]
      }
    ],
    comments: [
      {
        id: "33333333-3333-4333-8333-333333333391",
        authorName: "Jo Hwa",
        body:
          "Public walkways should stay open, but people using them also need to keep the space clean and respectful.",
        createdAt: "2026-01-29T11:00:00.000Z"
      },
      {
        id: "33333333-3333-4333-8333-333333333392",
        authorName: "Lili",
        body:
          "Both sides have a point. The city or district should help find a third solution instead of leaving neighbors to fight.",
        createdAt: "2026-01-29T12:20:00.000Z"
      }
    ]
  }
];

export const featuredCommunityPosts: CommunityPost[] = featuredConfigs.map(
  (config) => toCommunityPost(config)
);

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
  const config = getFeaturedConfig(post.id);

  if (config) {
    return {
      imageUrl: config.imageUrl,
      imageAlt: config.imageAlt,
      eyebrow: "Community poll",
      deck: config.deck
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
  const config = getFeaturedConfig(post.id);

  if (config) {
    return config.options.map((option, index) => toPollResult(option, index));
  }

  const votes = post.pollVotes ?? [];

  return (post.pollOptions ?? []).map((option, index) => {
    const optionVotes = votes.filter((vote) => vote.optionId === option.id);
    const percentage =
      votes.length > 0 ? Math.round((optionVotes.length / votes.length) * 100) : 0;

    return toPollResult(
      {
        ...option,
        votes: optionVotes.length,
        percentage
      },
      index
    );
  });
}

export function getCommunityStoryBlocks(post: CommunityPost): CommunityStoryBlock[] {
  return getFeaturedConfig(post.id)?.storyBlocks ?? [];
}

export function getCommunityOpinionSummaries(post: CommunityPost) {
  const config = getFeaturedConfig(post.id);

  if (!config) {
    return [];
  }

  return config.opinionSummaries.map((summary, index) => {
    const colorClasses = resultColors[index % resultColors.length];

    return {
      ...summary,
      swatchClass: colorClasses[0],
      barClass: colorClasses[1],
      borderClass: [
        "border-[#e9873d]/35",
        "border-[#4b8ecf]/35",
        "border-[#57a773]/35",
        "border-[#a8aaa5]/35"
      ][index % resultColors.length],
      textClass: [
        "text-[#a84f13]",
        "text-[#25649d]",
        "text-[#2d7245]",
        "text-[#686b63]"
      ][index % resultColors.length],
      surfaceClass: [
        "bg-[#fff4ea]",
        "bg-[#eef6ff]",
        "bg-[#edf8f1]",
        "bg-[#f4f4f1]"
      ][index % resultColors.length]
    };
  });
}

export function getCommunityUsefulExpressions(post: CommunityPost) {
  return getFeaturedConfig(post.id)?.usefulExpressions ?? [];
}

function toCommunityPost(config: FeaturedCommunityConfig): CommunityPost {
  const source: Article = {
    slug: `featured-${slugify(config.title)}`,
    category: config.category,
    title: config.sourceTitle,
    sourceName: config.sourceUrl.includes("newneek.co") ? "Newneek" : "The Korea Herald",
    sourceUrl: config.sourceUrl,
    publishedAt: config.publishedAt,
    keyword: config.keyword,
    intro: config.deck
  };

  return {
    id: config.id,
    compositionId: config.id,
    authorName: "MorningStar Desk",
    title: config.title,
    insight: config.insight,
    requirements: config.question,
    analysis: config.analysis,
    sourceSlugs: [source.slug],
    sourceSnapshots: [source],
    comments: config.comments,
    pollQuestion: config.question,
    pollOptions: config.options.map((option) => ({
      id: option.id,
      label: option.label
    })),
    pollVotes: [],
    summaryInsight: config.takeaway,
    createdAt: config.publishedAt
  };
}

function enrichPost(post: CommunityPost): CommunityPost {
  const config = getFeaturedConfig(post.id);

  if (!config) {
    return post;
  }

  const featuredPost = toCommunityPost(config);

  return {
    ...featuredPost,
    ...post,
    insight: post.insight || featuredPost.insight,
    requirements: post.requirements || featuredPost.requirements,
    analysis: post.analysis || featuredPost.analysis,
    sourceSlugs: post.sourceSlugs.length ? post.sourceSlugs : featuredPost.sourceSlugs,
    sourceSnapshots: post.sourceSnapshots.length
      ? post.sourceSnapshots
      : featuredPost.sourceSnapshots,
    comments: post.comments.length ? post.comments : featuredPost.comments,
    pollQuestion: post.pollQuestion || featuredPost.pollQuestion,
    pollOptions: post.pollOptions?.length ? post.pollOptions : featuredPost.pollOptions,
    summaryInsight: post.summaryInsight || featuredPost.summaryInsight
  };
}

function getFeaturedConfig(postId: string) {
  return featuredConfigs.find((config) => config.id === postId);
}

function toPollResult(
  option: { id: string; label: string; votes: number; percentage: number },
  index: number
): PollResult {
  const colorClasses = resultColors[index % resultColors.length];

  return {
    optionId: option.id,
    label: option.label,
    votes: option.votes,
    percentage: option.percentage,
    swatchClass: colorClasses[0],
    barClass: colorClasses[1]
  };
}

function isUsefulCommunityPost(post: CommunityPost) {
  const title = post.title.trim().toLowerCase();

  return Boolean(title) && !["good", "test", "test1", "hello"].includes(title);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
