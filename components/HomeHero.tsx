export function HomeHero() {
  return (
    <section className="rounded-[2rem] border border-line bg-paper/80 px-7 py-8 shadow-soft md:px-10">
      <p className="text-sm uppercase tracking-[0.22em] text-clay">
        Today&apos;s Reading Space
      </p>
      <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
        Daily news, softened into a reading habit you can actually keep.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
        Begin with one clear headline, move at an unhurried pace, and let the
        reading space stay warm, quiet, and easy to return to tomorrow.
      </p>
    </section>
  );
}
