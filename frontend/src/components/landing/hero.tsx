"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, ShieldCheck, GitBranch, FileText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 engine-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        {/* Left: copy */}
        <div>
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 mono-label text-[11px] text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-positive opacity-75 animate-engine-pulse" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-positive" />
              </span>
              Deterministic decision engine
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.05]">
              AI buying,
              <br />
              <span className="text-gradient">without vendor noise.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Describe a messy business problem in plain language. Assigna
              diagnoses the real need, scores vendors on{" "}
              <span className="text-foreground font-medium">
                verified evidence
              </span>{" "}
              — not reviews or paid placement — and hands you an auditable
              Decision Brief.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
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

          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-positive" />
                No paid ranking
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-accent" />
                Replayable audit trace
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-evidence" />
                Evidence-scored
              </span>
            </div>
          </FadeIn>
        </div>

        {/* Right: live decision brief visual */}
        <FadeIn delay={0.25}>
          <BriefPreview />
        </FadeIn>
      </div>
    </section>
  );
}

function BriefPreview() {
  return (
    <div className="relative surface surface-glow rounded-2xl p-1.5">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-risk/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-positive/70" />
        <span className="ml-3 mono-label text-[10px] text-muted-foreground">
          decision_brief.json
        </span>
      </div>

      <div className="rounded-xl bg-background/60 border border-border p-5 space-y-4">
        {/* scanning bar */}
        <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="absolute h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
        </div>

        <PipeRow
          tag="INPUT"
          tagClass="text-muted-foreground"
          title="“We manually key supplier invoices into our ERP.”"
        />
        <div className="pl-1 text-muted-foreground/40 text-xs">↓</div>
        <PipeRow
          tag="DIAGNOSIS"
          tagClass="text-accent"
          title="AI Document Processing & Extraction"
          confidence="0.91"
        />

        <div className="rounded-lg border border-border bg-card/50 divide-y divide-border">
          <VendorRow rank="01" name="CogniCraft" score="87" tone="positive" />
          <VendorRow rank="02" name="FlowParse AI" score="79" tone="primary" />
          <VendorRow rank="03" name="DocLayer" score="64" tone="warning" />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-risk/30 bg-risk/10 px-3 py-2">
          <span className="mono-label text-[10px] text-risk">
            NOT RECOMMENDED
          </span>
          <span className="text-xs text-muted-foreground">
            Custom AI Consulting
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="mono-label text-[10px] text-muted-foreground">
            trace · ff47257e
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-positive">
            <ShieldCheck className="h-3 w-3" /> verified
          </span>
        </div>
      </div>
    </div>
  );
}

function PipeRow({
  tag,
  tagClass,
  title,
  confidence,
}: {
  tag: string;
  tagClass: string;
  title: string;
  confidence?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <span className={`mono-label text-[10px] ${tagClass}`}>{tag}</span>
        <p className="mt-1 text-sm text-foreground leading-snug">{title}</p>
      </div>
      {confidence && (
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent tabular-nums">
          {confidence}
        </span>
      )}
    </div>
  );
}

function VendorRow({
  rank,
  name,
  score,
  tone,
}: {
  rank: string;
  name: string;
  score: string;
  tone: "positive" | "primary" | "warning";
}) {
  const toneClass = {
    positive: "text-positive",
    primary: "text-primary",
    warning: "text-warning",
  }[tone];
  const barClass = {
    positive: "bg-positive",
    primary: "bg-primary",
    warning: "bg-warning",
  }[tone];
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <span className="mono-label text-[10px] text-muted-foreground">
        {rank}
      </span>
      <span className="flex-1 text-sm text-foreground">{name}</span>
      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`w-7 text-right text-xs font-semibold tabular-nums ${toneClass}`}
      >
        {score}
      </span>
    </div>
  );
}
