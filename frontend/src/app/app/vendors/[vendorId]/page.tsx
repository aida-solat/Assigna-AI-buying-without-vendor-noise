"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/ui/score-bar";
import {
  Shield,
  Calendar,
  Globe,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";

type Tab =
  | "overview"
  | "fit"
  | "evidence"
  | "integrations"
  | "risks"
  | "questions";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "fit", label: "Fit" },
  { id: "evidence", label: "Evidence" },
  { id: "integrations", label: "Integrations" },
  { id: "risks", label: "Risks" },
  { id: "questions", label: "Questions" },
];

const SAMPLE_VENDOR_DATA = {
  vendor_name: "DocuAI",
  vendor_id: "docuai",
  description:
    "Enterprise document processing platform specializing in invoice, delivery note, and purchase order extraction with ERP integration.",
  website: "https://docuai.example.com",
  categories: ["AI Document Processing & Extraction"],
  regions: ["DACH", "Western EU", "UK"],
  company_size_fit: ["200-500", "500-2000", "2000+"],
  certifications: ["ISO 27001", "SOC 2 Type II"],
  deployment_model: ["Cloud", "Hybrid"],
  integrations: ["SAP S/4HANA", "Oracle NetSuite", "Microsoft Dynamics"],
  source: "curated" as const,
  last_verified: "2024-01-15",
  scores: {
    needFit: 0.88,
    evidenceQuality: 0.78,
    integrationFit: 0.85,
    budgetFit: 0.75,
    timingFit: 0.82,
    riskPenalty: 0.15,
    overall: 0.86,
  },
  reasoning: {
    whyThis: [
      "Verified accuracy benchmarks on similar document types",
      "Direct SAP S/4HANA integration certified",
      "Manufacturing-specific case study available",
    ],
    whyNow: [
      "Your document volume exceeds manual processing threshold",
      "Month-end delays create compounding compliance risk",
      "Vendor has current DACH deployment capacity",
    ],
    whyNotOthers: [
      "Higher evidence quality than competing vendors",
      "Only vendor with verified SAP integration for your version",
      "Lower implementation risk for your company size",
    ],
    risks: [
      "No same-language (German) case study yet",
      "Pricing on higher end of budget range",
      "Implementation timeline may stretch if SAP customization needed",
    ],
    questionsForVendor: [
      "What is your accuracy on multilingual invoices?",
      "Can you integrate with SAP S/4HANA 2023 release specifically?",
      "What does a typical pilot timeline look like for our document volume?",
      "What is your pricing model — per document, per user, or platform fee?",
      "What happens when extraction confidence is below threshold?",
    ],
  },
  evidence: [
    {
      type: "Case Study",
      description:
        "Reduced invoice processing time by 43% for a manufacturing company (500 employees)",
      qualityScore: 0.82,
      verifiedByAssigna: true,
      industryMatch: "Manufacturing",
      companySizeMatch: "200-500",
      freshnessDays: 180,
      outcome: "Reduced invoice processing time by 43%",
    },
    {
      type: "Integration Proof",
      description:
        "Certified SAP S/4HANA integration with automated data posting",
      qualityScore: 0.88,
      verifiedByAssigna: true,
      industryMatch: "Cross-industry",
      companySizeMatch: "Any",
      freshnessDays: 90,
      outcome: "Full ERP integration without middleware",
    },
    {
      type: "Accuracy Benchmark",
      description:
        "95.2% straight-through processing rate on standardized invoices",
      qualityScore: 0.75,
      verifiedByAssigna: false,
      industryMatch: "Financial Services",
      companySizeMatch: "500-2000",
      freshnessDays: 365,
      outcome: "95.2% STP rate",
    },
  ],
};

export default function BuyerVendorDetailPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;
  const [tab, setTab] = useState<Tab>("overview");
  const v = SAMPLE_VENDOR_DATA;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{v.vendor_name}</h1>
            <Badge variant="positive">
              {Math.round(v.scores.overall * 100)}% fit
            </Badge>
            <Badge variant="muted">{v.source}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{v.description}</p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {v.regions.join(", ")}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {v.company_size_fit.join(", ")}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Last verified: {v.last_verified}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              tab === t.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {v.categories.map((c) => (
                <Badge key={c} variant="default">
                  {c}
                </Badge>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {v.certifications.map((c) => (
                <Badge key={c} variant="positive">
                  <Shield className="h-3 w-3 mr-1" />
                  {c}
                </Badge>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">Deployment</h3>
            <div className="flex flex-wrap gap-2">
              {v.deployment_model.map((d) => (
                <Badge key={d} variant="muted">
                  {d}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "fit" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              <ScoreBar
                label="Need Fit"
                value={v.scores.needFit}
                colorClass="bg-primary"
              />
              <ScoreBar
                label="Evidence Quality"
                value={v.scores.evidenceQuality}
                colorClass="bg-evidence"
              />
              <ScoreBar
                label="Integration Fit"
                value={v.scores.integrationFit}
                colorClass="bg-positive"
              />
              <ScoreBar
                label="Budget Fit"
                value={v.scores.budgetFit}
                colorClass="bg-primary"
              />
              <ScoreBar
                label="Timing Fit"
                value={v.scores.timingFit}
                colorClass="bg-primary"
              />
              <ScoreBar
                label="Risk Penalty"
                value={v.scores.riskPenalty}
                colorClass="bg-risk"
              />
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">Why This Vendor</h3>
            <ul className="space-y-1.5">
              {v.reasoning.whyThis.map((r) => (
                <li
                  key={r}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-positive shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">Why Now</h3>
            <ul className="space-y-1.5">
              {v.reasoning.whyNow.map((r) => (
                <li
                  key={r}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">Why Not Others</h3>
            <ul className="space-y-1.5">
              {v.reasoning.whyNotOthers.map((r) => (
                <li
                  key={r}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "evidence" && (
        <div className="space-y-4">
          {v.evidence.map((e, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="default" className="mb-2">
                    {e.type}
                  </Badge>
                  <p className="text-sm">{e.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-lg font-bold tabular-nums">
                    {Math.round(e.qualityScore * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Quality</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Verified</p>
                  <p>{e.verifiedByAssigna ? "Yes ✓" : "Self-declared"}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Industry</p>
                  <p>{e.industryMatch}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Company Size</p>
                  <p>{e.companySizeMatch}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Freshness</p>
                  <p>{e.freshnessDays} days</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Outcome:</span>{" "}
                  {e.outcome}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "integrations" && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold mb-3">
              Verified Integrations
            </h3>
            <div className="space-y-2">
              {v.integrations.map((int) => (
                <div
                  key={int}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm">{int}</span>
                  <Badge variant="positive">Verified</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">Deployment Models</h3>
            <div className="flex flex-wrap gap-2">
              {v.deployment_model.map((d) => (
                <Badge key={d} variant="muted">
                  {d}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "risks" && (
        <Card>
          <h3 className="text-sm font-semibold mb-3">Known Risks</h3>
          <ul className="space-y-2">
            {v.reasoning.risks.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === "questions" && (
        <Card>
          <h3 className="text-sm font-semibold mb-3">
            Questions for Vendor Call
          </h3>
          <ol className="space-y-2 list-decimal list-inside">
            {v.reasoning.questionsForVendor.map((q) => (
              <li key={q} className="text-sm text-muted-foreground">
                {q}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
