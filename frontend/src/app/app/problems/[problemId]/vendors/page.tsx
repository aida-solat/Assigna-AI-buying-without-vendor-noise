"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/ui/score-bar";
import { VendorFilterPanel } from "@/components/vendors/vendor-filter-panel";
import { ComparisonDrawer } from "@/components/vendors/comparison-drawer";
import type { VendorRecommendation } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  AlertTriangle,
} from "lucide-react";

const SAMPLE_VENDORS: VendorRecommendation[] = [
  {
    rank: 1,
    vendor_name: "DocuAI",
    vendor_id: "docuai",
    overall_score: 0.86,
    fit_summary:
      "Strong match for high-volume document processing with SAP integration. Verified evidence for manufacturing use cases.",
    strengths: [
      "SAP S/4HANA verified",
      "Manufacturing case study",
      "GDPR ready",
      "Pilot available",
    ],
    concerns: ["No same-language case study yet", "Pricing on higher end"],
    score_breakdown: {
      need_fit: 0.88,
      evidence_quality: 0.78,
      integration_fit: 0.85,
      budget_fit: 0.75,
      timing_fit: 0.82,
      risk_penalty: 0.15,
    },
    decision_questions: [
      "What is your accuracy on multilingual invoices?",
      "Can you integrate with SAP S/4HANA 2023 release?",
    ],
  },
  {
    rank: 2,
    vendor_name: "ExtractPro",
    vendor_id: "extractpro",
    overall_score: 0.81,
    fit_summary:
      "Excellent evidence quality. Strong in similar company size range. Integration pending verification.",
    strengths: [
      "High evidence quality",
      "Industry case study verified",
      "Human-in-loop option",
    ],
    concerns: [
      "SAP integration not certified",
      "Longer implementation timeline",
    ],
    score_breakdown: {
      need_fit: 0.84,
      evidence_quality: 0.91,
      integration_fit: 0.68,
      budget_fit: 0.82,
      timing_fit: 0.72,
      risk_penalty: 0.1,
    },
    decision_questions: [
      "What is your SAP integration roadmap?",
      "What does a typical pilot timeline look like?",
    ],
  },
  {
    rank: 3,
    vendor_name: "InvoiceBot",
    vendor_id: "invoicebot",
    overall_score: 0.72,
    fit_summary:
      "Budget-friendly option. Good for simpler document types. Less evidence for complex manufacturing workflows.",
    strengths: [
      "Competitive pricing",
      "Quick implementation",
      "Good for simple invoices",
    ],
    concerns: [
      "Limited evidence for complex documents",
      "No manufacturing-specific case study",
      "ERP integration requires middleware",
    ],
    score_breakdown: {
      need_fit: 0.72,
      evidence_quality: 0.55,
      integration_fit: 0.58,
      budget_fit: 0.92,
      timing_fit: 0.88,
      risk_penalty: 0.22,
    },
    decision_questions: [
      "How do you handle delivery notes with variable formats?",
      "What middleware do you recommend for SAP?",
    ],
  },
  {
    rank: 4,
    vendor_name: "DataCapture AI",
    vendor_id: "datacapture",
    overall_score: 0.68,
    fit_summary:
      "Relevant but evidence is incomplete. Missing ERP integration proof and industry-specific validation.",
    strengths: ["Multi-language support", "Modern API"],
    concerns: [
      "No ERP integration proof",
      "Missing industry case study",
      "No pilot on real documents",
    ],
    score_breakdown: {
      need_fit: 0.7,
      evidence_quality: 0.45,
      integration_fit: 0.5,
      budget_fit: 0.78,
      timing_fit: 0.75,
      risk_penalty: 0.25,
    },
    decision_questions: [
      "Can you provide SAP integration documentation?",
      "Do you have manufacturing references?",
    ],
  },
  {
    rank: 5,
    vendor_name: "SmartDocs",
    vendor_id: "smartdocs",
    overall_score: 0.62,
    fit_summary:
      "Early-stage vendor. Promising technology but lacks the evidence depth needed for confident recommendation.",
    strengths: ["Modern architecture", "Flexible deployment"],
    concerns: [
      "Very limited evidence",
      "No verified case studies",
      "Unknown integration capabilities",
    ],
    score_breakdown: {
      need_fit: 0.65,
      evidence_quality: 0.35,
      integration_fit: 0.4,
      budget_fit: 0.85,
      timing_fit: 0.7,
      risk_penalty: 0.3,
    },
    decision_questions: [
      "Can you share any customer references?",
      "What is your roadmap for ERP integrations?",
    ],
  },
];

export default function VendorShortlistPage() {
  useParams();

  const [budgetFit, setBudgetFit] = useState("Any");
  const [integrationFit, setIntegrationFit] = useState("Any");
  const [riskLevel, setRiskLevel] = useState("Any");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const selectedVendors = SAMPLE_VENDORS.filter((v) =>
    selected.includes(v.vendor_id),
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Vendor Shortlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked by fit for your problem — not popularity, not paid placement.
          </p>
        </div>
        <div className="flex gap-2">
          {selected.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
            >
              Compare ({selected.length})
            </Button>
          )}
          <Link href={`/app/briefs/sample`}>
            <Button size="sm">
              Build decision brief
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-7 gap-8">
        <div className="lg:col-span-2">
          <VendorFilterPanel
            budgetFit={budgetFit}
            integrationFit={integrationFit}
            riskLevel={riskLevel}
            onBudgetChange={setBudgetFit}
            onIntegrationChange={setIntegrationFit}
            onRiskChange={setRiskLevel}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {SAMPLE_VENDORS.map((v) => {
            const isExpanded = expanded[v.vendor_id] ?? false;
            const isSelected = selected.includes(v.vendor_id);
            const hasEvidenceGaps = v.score_breakdown.evidence_quality < 0.6;

            return (
              <Card
                key={v.vendor_id}
                className={`transition-shadow ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      #{v.rank}
                    </span>
                    <Link
                      href={`/app/vendors/${v.vendor_id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {v.vendor_name}
                    </Link>
                  </div>
                  <Badge
                    variant={
                      v.overall_score >= 0.7
                        ? "positive"
                        : v.overall_score >= 0.4
                          ? "warning"
                          : "risk"
                    }
                  >
                    {Math.round(v.overall_score * 100)}%
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{v.fit_summary}</p>

                {hasEvidenceGaps && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-warning/5 border border-warning/20 rounded-lg">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                    <span className="text-xs text-warning">
                      Vendor is relevant, but evidence is incomplete
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {v.strengths.map((s) => (
                    <Badge key={s} variant="positive">
                      {s}
                    </Badge>
                  ))}
                  {v.concerns.map((c) => (
                    <Badge key={c} variant="warning">
                      {c}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(v.vendor_id)}
                  >
                    {isExpanded ? (
                      <>
                        Hide details
                        <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        View assignment reasoning
                        <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleSelect(v.vendor_id)}
                  >
                    {isSelected ? "Added to brief" : "Add to brief"}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Score Breakdown
                      </p>
                      <div className="space-y-2">
                        {Object.entries(v.score_breakdown).map(([key, val]) => (
                          <ScoreBar
                            key={key}
                            label={key.replace(/_/g, " ")}
                            value={val}
                            colorClass={
                              key === "risk_penalty"
                                ? "bg-risk"
                                : val >= 0.7
                                  ? "bg-positive"
                                  : val >= 0.4
                                    ? "bg-warning"
                                    : "bg-risk"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {v.decision_questions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Questions to Ask
                        </p>
                        <ol className="space-y-1 list-decimal list-inside">
                          {v.decision_questions.map((q) => (
                            <li
                              key={q}
                              className="text-xs text-muted-foreground"
                            >
                              {q}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-sm font-semibold mb-3">Comparison Summary</h3>
            <div className="space-y-3">
              {SAMPLE_VENDORS.slice(0, 3).map((v) => (
                <div key={v.vendor_id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{v.vendor_name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {Math.round(v.overall_score * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        v.overall_score >= 0.7 ? "bg-positive" : "bg-warning"
                      }`}
                      style={{ width: `${v.overall_score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-warning/20 bg-warning/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">Evidence Gaps</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-warning shrink-0">-</span>
                Vendor #1 missing same-language case study
              </li>
              <li className="flex gap-2">
                <span className="text-warning shrink-0">-</span>
                Vendor #2 SAP integration not certified
              </li>
              <li className="flex gap-2">
                <span className="text-warning shrink-0">-</span>
                Vendor #4 no ERP integration proof
              </li>
              <li className="flex gap-2">
                <span className="text-warning shrink-0">-</span>
                Vendor #5 no verified case studies
              </li>
            </ul>
          </Card>

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Vendors cannot buy higher ranking.
            </p>
          </div>
        </div>
      </div>

      <ComparisonDrawer
        vendors={selectedVendors}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
