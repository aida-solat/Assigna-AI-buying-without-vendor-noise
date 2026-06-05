const questions = [
  {
    q: "Why this?",
    tone: "text-primary",
    ring: "border-primary/30 bg-primary/5",
  },
  {
    q: "Why now?",
    tone: "text-positive",
    ring: "border-positive/30 bg-positive/5",
  },
  {
    q: "Why not others?",
    tone: "text-warning",
    ring: "border-warning/30 bg-warning/5",
  },
  {
    q: "What evidence?",
    tone: "text-evidence",
    ring: "border-evidence/30 bg-evidence/5",
  },
];

export function DifferentiatorSection() {
  return (
    <section className="relative py-24 px-6 border-y border-border overflow-hidden">
      <div className="absolute inset-0 engine-glow opacity-60 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto text-center">
        <span className="mono-label text-[11px] text-muted-foreground">
          Not &ldquo;best vendors&rdquo;
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
          The right vendors for{" "}
          <span className="text-gradient">this problem</span>, at this stage,
          under these constraints.
        </h2>
        <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
          Every brief answers four questions a sales call never will.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {questions.map((item) => (
            <span
              key={item.q}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${item.ring} ${item.tone}`}
            >
              {item.q}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
