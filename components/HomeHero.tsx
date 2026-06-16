import Link from "next/link";

import { N8nTriggerButton } from "@/components/N8nTriggerButton";

type HomeHeroProps = {
  userId: string;
};

const splineUrl =
  "https://my.spline.design/cutecomputerfollowcursor-nOkpDVcYzEvvSrloO9SbWENR/";

const pageCards = [
  {
    href: "/",
    title: "Daily News",
    text: "Collected stories appear as cards below the monitor.",
    seed: "morningstar-news-wall"
  },
  {
    href: "/vocabulary",
    title: "Vocab",
    text: "Save words with examples and source context.",
    seed: "mint-notebook-desk"
  },
  {
    href: "/investigate",
    title: "Investigate",
    text: "Turn saved sources into a focused analysis.",
    seed: "analysis-monitor-room"
  },
  {
    href: "/community",
    title: "Community",
    text: "Share investigations and open issue rooms.",
    seed: "soft-community-board"
  }
];

export function HomeHero({ userId }: HomeHeroProps) {
  return (
    <section className="relative -mt-[8.25rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black pt-[8.25rem] shadow-[0_24px_90px_rgba(0,0,0,0.42)] md:-mt-[7.75rem] md:pt-[7.75rem]">
      <div className="relative min-h-[78dvh] overflow-hidden bg-[linear-gradient(180deg,#070909_0%,#050505_100%)] md:min-h-[760px]">
        <iframe
          src={splineUrl}
          title="Interactive 3D computer background"
          frameBorder="0"
          className="absolute left-1/2 top-1/2 z-[1] h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 border-0 opacity-100 md:h-[118%] md:w-[118%]"
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.42)_82%,rgba(0,0,0,0.72)_100%),linear-gradient(90deg,rgba(0,0,0,0.54)_0%,rgba(0,0,0,0.18)_32%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.2)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72)_72%,#050505_100%)]" />
        <N8nTriggerButton
          userId={userId}
          showMessage={false}
          className="pointer-events-auto absolute right-6 top-[10.5rem] z-20 md:right-12 md:top-[9.5rem] lg:right-16"
          buttonClassName="border border-transparent bg-moss px-8 py-3.5 text-ink shadow-[0_18px_55px_rgba(91,190,178,0.34)] hover:bg-[#72d4c9]"
        />

        <div className="pointer-events-none relative z-10 flex min-h-[78dvh] flex-col justify-end px-5 py-8 md:min-h-[760px] md:px-10 md:py-10">
          <div className="pb-7">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-moss">
                MorningStar
              </p>
              <h1 className="mt-4 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[0.98] tracking-[-0.075em] text-paper drop-shadow-[0_18px_45px_rgba(0,0,0,0.55)] md:text-7xl lg:text-8xl">
                Study English With Korean News
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-paper/72 drop-shadow-[0_10px_28px_rgba(0,0,0,0.5)]">
                Collect Korean news, save useful vocabulary, and turn sources
                into clearer English analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black px-4 pb-5 pt-7 md:px-6 md:pb-7">
        <div className="grid gap-3 md:grid-cols-4">
          {pageCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group overflow-hidden rounded-[1.2rem] border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:border-moss"
            >
              <div
                className="h-28 bg-accent"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(255,255,252,0.1),rgba(23,23,23,0.12)),url("https://picsum.photos/seed/${card.seed}/640/360")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold tracking-[-0.04em] text-ink transition group-hover:text-moss">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-clay">{card.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
