import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function RequestBriefPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Request a Decision Brief</h1>
        <p className="text-muted-foreground mb-10">
          Choose how deep you want to go. Start with a free diagnosis — upgrade
          when you&apos;re ready.
        </p>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Free Diagnosis</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Understand what category you need
                </p>
              </div>
              <span className="text-xl font-bold">€0</span>
            </div>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                Primary category diagnosis
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                Not-recommended categories with reasoning
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                Evidence checklist for your category
              </li>
            </ul>
            <Link href="/app/problems/new">
              <Button variant="outline" className="w-full">
                Start free diagnosis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card className="ring-2 ring-primary shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Pro Decision Brief</h3>
                  <Badge variant="default">Most popular</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full evidence-scored recommendation
                </p>
              </div>
              <span className="text-xl font-bold">€499</span>
            </div>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                5 scored vendors with full reasoning
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                Comparison matrix
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                Risk analysis + evidence gaps
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                Decision questions for vendor calls
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-positive" />
                PDF export
              </li>
            </ul>
            <Link href="/app/problems/new">
              <Button className="w-full">
                Get Pro Brief
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Enterprise</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ongoing decision intelligence
                </p>
              </div>
              <span className="text-xl font-bold">€1,500+/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Multi-problem coverage, vendor monitoring, custom playbook,
              outcome tracking, and a dedicated analyst.
            </p>
            <Button variant="outline" className="w-full">
              Contact us
            </Button>
          </Card>
        </div>
      </main>
      <TrustFooter />
    </>
  );
}
