export function HomeHero() {
  return (
    <section className="rounded-[2rem] border border-line bg-paper/80 px-7 py-8 shadow-soft md:px-10">
      <p className="text-sm uppercase tracking-[0.22em] text-clay">
        Today&apos;s Topic Space
      </p>
      <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
        Real issues, reshaped into a calmer English learning habit.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
        Start from one topic, follow a few trusted source articles, and keep
        the learning experience warm, quiet, and easier to return to tomorrow.
      </p>
    </section>
  );
}
