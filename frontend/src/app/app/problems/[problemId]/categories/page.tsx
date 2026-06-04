"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from "lucide-react";

const SAMPLE_CATEGORIES = {
  primary: {
    id: "ai-document-processing",
    name: "AI Document Processing & Extraction",
    fitScore: 0.84,
    fits: [
      "High document volume",
      "Manual data entry pain",
      "Existing target system",
      "Error/compliance pressure",
    ],
    doesNotFit: [
      "No target system",
      "Very low document volume",
      "Need full workflow redesign",
      "Need human judgement, not extraction",
    ],
  },
  secondary: [
    {
      id: "workflow-orchestration",
      name: "Workflow Orchestration",
      fitScore: 0.61,
      reason: "Approval routing after extraction may need orchestration.",
    },
  ],
  excluded: [
    {
      name: "Custom AI Agent Consulting",
      reason:
        "Standard problem — product category exists, custom build unnecessary.",
    },
  ],
};

export default function ProblemCategoriesPage() {
  const params = useParams();
  const problemId = params.problemId as string;
  const cat = SAMPLE_CATEGORIES;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Category Fit Review</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Review which solution categories fit your problem — and which do not.
      </p>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Primary — Best Fit
            </p>
            <Link
              href={`/app/categories/${cat.primary.id}`}
              className="text-lg font-bold text-primary hover:underline"
            >
              {cat.primary.name}
            </Link>
          </div>
          <Badge variant="positive">
            {Math.round(cat.primary.fitScore * 100)}% fit
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <p className="text-xs font-medium text-positive mb-2">
              When this fits:
            </p>
            <ul className="space-y-1.5">
              {cat.primary.fits.map((f) => (
                <li
                  key={f}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-positive shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-risk mb-2">
              When this does not fit:
            </p>
            <ul className="space-y-1.5">
              {cat.primary.doesNotFit.map((f) => (
                <li
                  key={f}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <XCircle className="h-4 w-4 text-risk shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 mt-5 pt-4 border-t border-border">
          <Link href={`/app/categories/${cat.primary.id}`}>
            <Button variant="outline" size="sm">
              View full category detail
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

      {cat.secondary.map((s) => (
        <Card key={s.id} className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Secondary
              </p>
              <Link
                href={`/app/categories/${s.id}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {s.name}
              </Link>
            </div>
            <Badge variant="muted">{Math.round(s.fitScore * 100)}% fit</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{s.reason}</p>
        </Card>
      ))}

      {cat.excluded.map((ex) => (
        <Card key={ex.name} className="mb-4 border-risk/20 bg-risk/5">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-risk" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Not Recommended
            </p>
          </div>
          <p className="font-semibold text-sm">{ex.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{ex.reason}</p>
        </Card>
      ))}
    </div>
  );
}
