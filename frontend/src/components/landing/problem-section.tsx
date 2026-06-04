import { Card } from "@/components/ui/card";
import { AlertTriangle, Search, PhoneCall, Bot } from "lucide-react";

const problems = [
  {
    icon: <Search className="h-5 w-5 text-warning" />,
    text: "Vendor websites all sound the same.",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-warning" />,
    text: "Review platforms assume you already know the category.",
  },
  {
    icon: <PhoneCall className="h-5 w-5 text-warning" />,
    text: "Sales calls optimize for the vendor, not your decision.",
  },
  {
    icon: <Bot className="h-5 w-5 text-warning" />,
    text: "Generic AI tools give generic advice.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          AI buying is broken.
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p, i) => (
            <Card key={i} className="flex items-start gap-4 p-5">
              <div className="shrink-0 mt-0.5">{p.icon}</div>
              <p className="text-sm text-foreground leading-relaxed">{p.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
