import Link from "next/link";

import { N8nTriggerButton } from "@/components/N8nTriggerButton";
import { SplineRuntimeStage } from "@/components/SplineRuntimeStage";

type HomeHeroProps = {
  userId: string;
};

const pageCards = [
  {
    href: "/",
    title: "Daily News",
    text: "Collected stories stay ready near the monitor.",
    imageUrl:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80"
  },
  {
    href: "/vocabulary",
    title: "Vocab",
    text: "Save words with examples and source context.",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80"
  },
  {
    href: "/investigate",
    title: "Investigate",
    text: "Turn saved sources into a focused analysis.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
  },
  {
    href: "/community",
    title: "Community",
    text: "Share investigations and open issue rooms.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
  }
];

export function HomeHero({ userId }: HomeHeroProps) {
  return (
    <section className="relative -mt-[8.25rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black pt-[8.25rem] shadow-[0_24px_90px_rgba(0,0,0,0.42)] md:-mt-[7.75rem] md:pt-[7.75rem]">
      <div className="relative min-h-[78dvh] overflow-hidden bg-[linear-gradient(180deg,#070909_0%,#050505_100%)] md:min-h-[760px]">
        <SplineRuntimeStage className="absolute inset-0 z-[1]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.42)_82%,rgba(0,0,0,0.72)_100%),linear-gradient(90deg,rgba(0,0,0,0.54)_0%,rgba(0,0,0,0.18)_32%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.2)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72)_72%,#050505_100%)]" />
        <div className="pointer-events-none absolute left-5 top-7 z-20 max-w-3xl md:left-10 md:top-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-moss">
            MorningStar
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[0.98] tracking-[-0.075em] text-paper drop-shadow-[0_18px_45px_rgba(0,0,0,0.55)] md:text-7xl lg:text-8xl">
            Study English With Korean News
          </h1>
        </div>

        <div className="pointer-events-auto absolute inset-x-0 bottom-8 z-20 px-4 md:bottom-10 md:px-6">
          <div className="grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0">
            {pageCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group overflow-hidden rounded-[1.2rem] border border-white/16 bg-[#0f1820]/86 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:-translate-y-1 hover:border-moss hover:bg-[#15222b]"
              >
                <div
                  className="h-24 bg-accent md:h-28"
                  style={{
                    backgroundImage: `linear-gradient(180deg,rgba(255,255,252,0.1),rgba(23,23,23,0.12)),url("${card.imageUrl}")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                  }}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold tracking-[-0.04em] text-paper transition group-hover:text-moss">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-paper">{card.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <N8nTriggerButton
          userId={userId}
          showMessage={false}
          className="pointer-events-auto absolute right-6 bottom-[18rem] z-20 md:right-12 md:bottom-[18.5rem] lg:right-16"
          buttonClassName="border border-transparent bg-moss px-8 py-3.5 text-ink shadow-[0_18px_55px_rgba(91,190,178,0.34)] hover:bg-[#72d4c9]"
        />

        <div className="pointer-events-none relative z-10 min-h-[78dvh] md:min-h-[760px]" />
      </div>
    </section>
  );
}
