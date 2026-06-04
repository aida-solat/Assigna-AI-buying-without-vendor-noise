"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, FileSearch, Brain, ClipboardCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Find the right AI solution
            <br />
            <span className="text-primary">before talking to vendors.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Assigna turns messy business problems into evidence-scored solution
            categories, vendor shortlists, risks, and decision questions.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/app/problems/new">
              <Button size="lg">
                Start free diagnosis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sample-brief">
              <Button variant="outline" size="lg">
                View sample brief
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="mt-20 grid md:grid-cols-3 gap-1 max-w-3xl mx-auto">
            <TransformStep
              icon={<FileSearch className="h-5 w-5" />}
              title="Business Problem"
              example="We manually process supplier invoices and emails."
              color="text-muted-foreground"
            />
            <TransformStep
              icon={<Brain className="h-5 w-5" />}
              title="Need Diagnosis"
              example="Primary: AI Document Processing. Secondary: Workflow Orchestration. Not recommended: Custom AI Consulting."
              color="text-primary"
            />
            <TransformStep
              icon={<ClipboardCheck className="h-5 w-5" />}
              title="Decision Brief"
              example="Top vendors + risks + questions + evidence gaps"
              color="text-positive"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function TransformStep({
  icon,
  title,
  example,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  example: string;
  color: string;
}) {
  return (
    <div className="relative p-6 text-left">
      <div className={`${color} mb-3`}>{icon}</div>
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        {example}
      </p>
    </div>
  );
}
