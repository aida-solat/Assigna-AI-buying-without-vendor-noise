import { Search, AlertTriangle, PhoneCall, Bot } from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Look-alike vendors",
    text: "Every vendor website sounds identical. Buzzwords in, signal out.",
  },
  {
    icon: AlertTriangle,
    title: "Category-first reviews",
    text: "Review platforms assume you already know the category you need.",
  },
  {
    icon: PhoneCall,
    title: "Vendor-biased calls",
    text: "Sales calls optimize for the vendor's close, not your decision.",
  },
  {
    icon: Bot,
    title: "Generic AI advice",
    text: "Generic chatbots give generic answers with no evidence behind them.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 px-6 border-y border-border">
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <span className="mono-label text-[11px] text-risk">The problem</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Buying AI today is
            <span className="text-risk"> noise</span>, not signal.
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="group surface rounded-xl p-5 transition-colors hover:border-warning/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
