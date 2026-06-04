import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export function SampleOutputSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          What you get
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          A Decision Brief — not a vendor list. Evidence, reasoning, risks,
          and questions before any sales call.
        </p>

        <Card className="relative overflow-hidden">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Primary Recommendation
              </p>
              <p className="text-lg font-semibold text-primary">
                AI Document Processing & Extraction
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Why
              </p>
              <ul className="space-y-1">
                <li className="text-sm text-muted-foreground">
                  - High document volume
                </li>
                <li className="text-sm text-muted-foreground">
                  - Manual ERP data entry
                </li>
                <li className="text-sm text-muted-foreground">
                  - Existing target system
                </li>
                <li className="text-sm text-muted-foreground">
                  - Error reduction need
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Not Recommended
              </p>
              <p className="text-sm font-medium text-risk">
                Custom AI Agent Consulting
              </p>
              <ul className="space-y-1 mt-1">
                <li className="text-sm text-muted-foreground">
                  - Standard problem, off-the-shelf tools exist
                </li>
                <li className="text-sm text-muted-foreground">
                  - Custom build would increase cost and risk
                </li>
              </ul>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Vendor names, scores, risks, and questions locked
              </span>
            </div>
            <Link href="/sample-brief">
              <Button size="sm">
                View full sample brief
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
