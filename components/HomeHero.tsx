export function HomeHero() {
  return (
    <section className="grid gap-6 rounded-[2.4rem] border border-line/80 bg-paper/88 p-5 shadow-soft md:grid-cols-[1.08fr_0.92fr] md:p-7">
      <div className="rounded-[2rem] bg-[#fff8ef] p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Today&apos;s News Space
        </p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
          Collect the stories you care about, then write from them.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Start with interest-based headlines, save the pieces that feel related,
          and turn those saved articles into your own English writing.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.6rem] border border-line bg-paper px-4 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">Collect</p>
            <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-ink">
              Save
            </p>
            <p className="mt-2 text-sm leading-6 text-clay">
              Keep only the stories that really match your curiosity.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-paper px-4 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">Connect</p>
            <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-ink">
              Match
            </p>
            <p className="mt-2 text-sm leading-6 text-clay">
              Pull in more related sources before you begin writing.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-paper px-4 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">Reflect</p>
            <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-ink">
              Share
            </p>
            <p className="mt-2 text-sm leading-6 text-clay">
              Turn collected news into analysis and community insight.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-rows-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-line/70 bg-[linear-gradient(135deg,rgba(227,130,74,0.92),rgba(107,67,47,0.85))] p-6">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#ffd8b3]/50 blur-3xl" />
          <div className="absolute right-5 top-5 rounded-full bg-paper/85 px-3 py-1 text-xs uppercase tracking-[0.18em] text-clay">
            Editorial board
          </div>
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-sm uppercase tracking-[0.2em] text-paper/80">
              Analysis request
            </p>
            <h2 className="mt-3 max-w-sm font-[family-name:var(--font-heading)] text-4xl font-semibold leading-tight text-paper">
              A lighter, more visual desk for collecting related news.
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-line/70 bg-[linear-gradient(180deg,#f7e6cf,#ead1b2)] p-4">
            <div className="h-full rounded-[1.25rem] border border-paper/70 bg-paper/60 p-4">
              <div className="h-24 rounded-[1rem] bg-[linear-gradient(180deg,rgba(229,121,69,0.4),rgba(255,255,255,0.1))]" />
              <div className="mt-4 h-2 w-20 rounded-full bg-[#d5b597]" />
              <div className="mt-2 h-2 w-28 rounded-full bg-[#e3c7aa]" />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-line bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">Flow</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[1rem] bg-accent/55 px-4 py-3 text-sm text-ink">
                1. Save the story that catches your attention
              </div>
              <div className="rounded-[1rem] bg-[#f7ead9] px-4 py-3 text-sm text-ink">
                2. Add more sources and refine your request
              </div>
              <div className="rounded-[1rem] bg-accent/55 px-4 py-3 text-sm text-ink">
                3. Turn the bundle into a clearer analysis
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
