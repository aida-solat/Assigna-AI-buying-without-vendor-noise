import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free Diagnosis",
    price: "€0",
    description: "Understand what category you need",
    features: [
      "Problem intake + signal extraction",
      "Primary category diagnosis",
      "Not-recommended explanation",
      "Evidence checklist",
    ],
    cta: "Start free",
    variant: "outline" as const,
  },
  {
    name: "Starter Brief",
    price: "€99",
    description: "Know which vendors to talk to",
    features: [
      "Everything in Free",
      "3 vendor names with scores",
      "Basic fit explanation",
      "Integration check",
    ],
    cta: "Get Starter Brief",
    variant: "secondary" as const,
  },
  {
    name: "Pro Decision Brief",
    price: "€499",
    description: "Full evidence-scored recommendation",
    features: [
      "Everything in Starter",
      "5 scored vendors with reasoning",
      "Comparison matrix",
      "Risk analysis + evidence gaps",
      "Decision questions for vendor calls",
      "PDF export",
    ],
    cta: "Get Pro Brief",
    variant: "primary" as const,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "€1,500+/mo",
    description: "Ongoing decision intelligence",
    features: [
      "Multi-problem coverage",
      "Vendor monitoring",
      "Custom playbook",
      "Outcome tracking",
      "Dedicated analyst",
    ],
    cta: "Contact us",
    variant: "outline" as const,
  },
];

export function PricingSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-center text-muted-foreground mb-14 max-w-md mx-auto">
          Ranking is based on fit and evidence, not paid placement. Vendors
          cannot buy higher ranking.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col ${
                tier.highlighted
                  ? "ring-2 ring-primary shadow-md"
                  : ""
              }`}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-base">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{tier.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-positive shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/app/problems/new">
                <Button variant={tier.variant} size="sm" className="w-full">
                  {tier.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
