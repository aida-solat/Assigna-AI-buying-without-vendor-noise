const steps = [
  { num: "1", title: "Describe the problem", desc: "In plain language. No forms, no category selection." },
  { num: "2", title: "Assigna diagnoses the real need", desc: "Extracts signals, matches against solution taxonomy." },
  { num: "3", title: "Maps to solution categories", desc: "Primary, secondary, and explicitly not-recommended." },
  { num: "4", title: "Scores vendors using evidence", desc: "Not reviews. Not popularity. Verified evidence." },
  { num: "5", title: "You receive a Decision Brief", desc: "Scored vendors, risks, questions, and next steps." },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">How Assigna works</h2>
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-5">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
