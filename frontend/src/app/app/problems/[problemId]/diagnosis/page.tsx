"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/ui/score-bar";
import { DiagnosisHeader } from "@/components/diagnosis/diagnosis-header";
import { EvidenceGapPanel } from "@/components/diagnosis/evidence-gap-panel";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const SAMPLE_DIAGNOSIS = {
  confidence: 0.82,
  method: "Hybrid analysis" as const,
  primary: {
    categoryName: "AI Document Processing & Extraction",
    categoryId: "ai-document-processing",
    fitScore: 0.84,
    confidenceScore: 0.82,
    complexity: "Medium",
    budgetMin: 15000,
    budgetMax: 200000,
    timelineMin: 4,
    timelineMax: 12,
    reasons: [
      "High document volume detected",
      "Manual data entry pain confirmed",
      "ERP target system exists (SAP)",
      "Error/compliance pressure mentioned",
    ],
    warnings: ["Document type standardization unclear"],
  },
  secondary: [
    {
      categoryName: "Workflow Orchestration",
      categoryId: "workflow-orchestration",
      fitScore: 0.61,
      reason: "Your problem includes approval routing after extraction.",
    },
  ],
  notRecommended: [
    {
      categoryName: "Custom AI Agent / AI Automation Consulting",
      reasons: [
        "Your problem is standard enough for off-the-shelf tools",
        "Custom build would increase implementation risk",
        "Existing target systems can be integrated without bespoke AI",
      ],
    },
  ],
  evidenceRequirements: [
    "Accuracy benchmark on similar document types",
    "Same-industry case study (Manufacturing)",
    "ERP integration proof (SAP S/4HANA)",
    "Pilot on your actual documents",
  ],
};

export default function DiagnosisPage() {
  const params = useParams();
  const problemId = params.problemId as string;
  const d = SAMPLE_DIAGNOSIS;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-2">
        <DiagnosisHeader confidence={d.confidence} />
      </div>
      <div className="flex items-center gap-3 mb-8">
        <Badge variant="muted">{d.method}</Badge>
        <span className="text-xs text-muted-foreground">
          Problem ID: {problemId}
        </span>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Primary Recommendation
            </p>
            <p className="text-xl font-bold text-primary">
              {d.primary.categoryName}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
              <span>Fit: {Math.round(d.primary.fitScore * 100)}%</span>
              <span>Confidence: High</span>
              <span>
                Budget: €{(d.primary.budgetMin / 1000).toFixed(0)}k–€
                {(d.primary.budgetMax / 1000).toFixed(0)}k
              </span>
              <span>
                Timeline: {d.primary.timelineMin}–{d.primary.timelineMax} weeks
              </span>
              <span>Complexity: {d.primary.complexity}</span>
            </div>
            <ul className="mt-4 space-y-1.5">
              {d.primary.reasons.map((r) => (
                <li
                  key={r}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-positive shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
            {d.primary.warnings.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                {d.primary.warnings.map((w) => (
                  <p
                    key={w}
                    className="text-xs text-warning flex items-center gap-2"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {w}
                  </p>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-5">
              <Link href={`/app/categories/${d.primary.categoryId}`}>
                <Button variant="outline" size="sm">
                  View reasoning
                </Button>
              </Link>
              <Link href={`/app/categories/${d.primary.categoryId}`}>
                <Button variant="outline" size="sm">
                  Compare adjacent categories
                </Button>
              </Link>
              <Link href={`/app/problems/${problemId}/vendors`}>
                <Button size="sm">
                  Continue to vendor shortlist
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>

          {d.secondary.map((s) => (
            <Card key={s.categoryId}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Secondary
                  </p>
                  <p className="font-semibold">{s.categoryName}</p>
                </div>
                <Badge variant="muted">
                  {Math.round(s.fitScore * 100)}% fit
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Why secondary: {s.reason}
              </p>
            </Card>
          ))}

          {d.notRecommended.map((nr) => (
            <Card key={nr.categoryName} className="border-risk/20 bg-risk/5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-4 w-4 text-risk" />
                <h3 className="font-semibold text-sm">Not Recommended</h3>
              </div>
              <p className="text-sm font-medium mb-2">{nr.categoryName}</p>
              <ul className="space-y-1.5">
                {nr.reasons.map((r) => (
                  <li
                    key={r}
                    className="text-xs text-muted-foreground flex gap-2"
                  >
                    <span className="text-risk shrink-0">✕</span>
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <EvidenceGapPanel
            categoryName={d.primary.categoryName}
            requirements={d.evidenceRequirements}
          />

          <Card>
            <h3 className="text-sm font-semibold mb-3">Diagnosis Metadata</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Confidence</span>
                <span className="font-medium tabular-nums">
                  {Math.round(d.confidence * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium">{d.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Categories checked</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Disqualified</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
