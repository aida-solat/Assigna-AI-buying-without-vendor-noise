const steps = [
  {
    num: "01",
    title: "Describe the problem",
    desc: "In plain language. No forms, no category to pick.",
  },
  {
    num: "02",
    title: "Diagnose the real need",
    desc: "Signals extracted, matched against a versioned solution taxonomy.",
  },
  {
    num: "03",
    title: "Map to categories",
    desc: "Primary, secondary, and explicitly not-recommended paths.",
  },
  {
    num: "04",
    title: "Score on evidence",
    desc: "Hard disqualifier gates first — then evidence, not reviews or popularity.",
  },
  {
    num: "05",
    title: "Receive a Decision Brief",
    desc: "Scored vendors, risks, questions, and a replayable audit trace.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <span className="mono-label text-[11px] text-accent">
            The pipeline
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Five deterministic steps
          </h2>
        </div>

        <ol className="relative border-l border-border ml-4">
          {steps.map((step) => (
            <li key={step.num} className="relative pl-10 pb-10 last:pb-0 group">
              <span className="absolute -left-[9px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-primary/50 bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform group-hover:scale-150" />
              </span>
              <div className="flex items-baseline gap-3">
                <span className="mono-label text-xs text-muted-foreground tabular-nums">
                  {step.num}
                </span>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
