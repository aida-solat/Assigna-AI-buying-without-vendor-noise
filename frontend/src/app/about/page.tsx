import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { Card } from "@/components/ui/card";
import { Shield, Scale, Eye, Brain } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">About Assigna</h1>
        <p className="text-muted-foreground leading-relaxed mb-10">
          Assigna is a decision intelligence platform for B2B AI buying. We
          diagnose what category of solution you actually need, score vendors
          using evidence, and generate a decision brief — before you talk to any
          sales team.
        </p>

        <h2 className="text-xl font-bold mb-6">Our principles</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Card className="flex items-start gap-4 p-5">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Ranking is not for sale
              </h3>
              <p className="text-xs text-muted-foreground">
                Vendor ranking is based on fit and evidence quality. Payment
                does not change ranking. Ever.
              </p>
            </div>
          </Card>
          <Card className="flex items-start gap-4 p-5">
            <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">
                We may say &quot;don&apos;t buy&quot;
              </h3>
              <p className="text-xs text-muted-foreground">
                If the problem doesn&apos;t justify a software purchase, Assigna
                will tell you. This is a trust feature, not a bug.
              </p>
            </div>
          </Card>
          <Card className="flex items-start gap-4 p-5">
            <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Evidence over opinion
              </h3>
              <p className="text-xs text-muted-foreground">
                Every score is backed by evidence items: case studies,
                benchmarks, integration proofs, pilot results.
              </p>
            </div>
          </Card>
          <Card className="flex items-start gap-4 p-5">
            <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Decision-first, not marketplace
              </h3>
              <p className="text-xs text-muted-foreground">
                Assigna is not G2, not a review platform, not a marketplace.
                It&apos;s a decision room.
              </p>
            </div>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-4">How it&apos;s different</h2>
        <div className="space-y-3 mb-12">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most platforms start with vendors. Assigna starts with your problem.
            We diagnose the real need first, map it to curated solution
            categories, then score vendors against evidence — not popularity,
            not reviews, not ads.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The output is a Decision Brief: a structured document that tells you
            what to buy, why, what risks to watch, what evidence is missing, and
            what questions to ask vendors in calls.
          </p>
        </div>

        <h2 className="text-xl font-bold mb-4">Editorial-first model</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-12">
          Assigna curates 30–50 vendors across 10 solution categories. Every
          vendor is reviewed, every evidence item is verified. We are not a
          marketplace. We are an editorial decision product.
        </p>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            Built & designed by{" "}
            <span className="font-semibold text-foreground">Deciwa</span>.
          </p>
        </div>
      </main>
      <TrustFooter />
    </>
  );
}
