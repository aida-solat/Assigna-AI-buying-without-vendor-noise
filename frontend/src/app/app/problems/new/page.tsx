"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { apiPost } from "@/lib/api";
import type { BuyerProblemInput, DecisionBriefResponse } from "@/lib/types";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";

const SYSTEM_OPTIONS = [
  "SAP",
  "SAP S/4HANA",
  "Oracle",
  "Microsoft Dynamics",
  "NetSuite",
  "Salesforce",
  "Microsoft 365",
  "Google Workspace",
  "Zendesk",
  "Intercom",
  "Freshdesk",
  "HubSpot",
  "Jira",
  "ServiceNow",
  "Slack",
  "Confluence",
  "SharePoint",
  "Xero",
  "QuickBooks",
];

const BUDGET_RANGES = [
  { label: "< €20K", value: 15000 },
  { label: "€20K - €50K", value: 35000 },
  { label: "€50K - €150K", value: 100000 },
  { label: "€150K - €500K", value: 300000 },
  { label: "> €500K", value: 600000 },
];

const COMPANY_SIZES = [
  { label: "1-50", value: 25 },
  { label: "50-200", value: 125 },
  { label: "200-500", value: 350 },
  { label: "500-2000", value: 1000 },
  { label: "2000+", value: 3000 },
];

const INDUSTRIES = [
  "Manufacturing",
  "Financial Services",
  "Professional Services",
  "Logistics & Supply Chain",
  "Technology / SaaS",
  "Healthcare",
  "Retail & E-commerce",
  "Energy & Utilities",
  "Public Sector",
  "Other",
];

const REGIONS = [
  "DACH",
  "Nordics",
  "Western EU",
  "UK",
  "North America",
  "Other",
];

const URGENCIES = [
  { label: "Exploring", value: "exploring" },
  { label: "Planning", value: "planning" },
  { label: "Ready to buy", value: "ready_to_buy" },
];

const TIMELINES = [
  { label: "< 3 months", value: 2 },
  { label: "3-6 months", value: 5 },
  { label: "6-12 months", value: 9 },
  { label: "> 12 months", value: 15 },
];

const DATA_SENSITIVITY = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High (PII/financial)", value: "high" },
];

const TECH_CAPACITY = [
  { label: "No internal tech", value: "none" },
  { label: "Basic IT", value: "basic" },
  { label: "Moderate", value: "moderate" },
  { label: "Strong engineering", value: "strong" },
];

const DYNAMIC_QUESTIONS: Record<
  string,
  { label: string; placeholder: string }[]
> = {
  "AI Document Processing": [
    { label: "How many documents per week?", placeholder: "e.g. 200" },
    {
      label: "Which document types?",
      placeholder: "e.g. invoices, delivery notes, contracts",
    },
    { label: "Which languages?", placeholder: "e.g. German, English" },
    {
      label: "Where should extracted data go?",
      placeholder: "e.g. SAP S/4HANA",
    },
    { label: "What accuracy is acceptable?", placeholder: "e.g. 95%+" },
  ],
  "Enterprise Knowledge Search": [
    { label: "How many internal documents?", placeholder: "e.g. 50,000" },
    {
      label: "Where are they stored?",
      placeholder: "e.g. SharePoint, Confluence",
    },
    {
      label: "Who should access them?",
      placeholder: "e.g. all employees, specific departments",
    },
    {
      label: "Do answers need source citations?",
      placeholder: "e.g. yes, mandatory",
    },
  ],
  "Customer Support Automation": [
    { label: "Monthly ticket volume?", placeholder: "e.g. 3000" },
    { label: "Helpdesk tool?", placeholder: "e.g. Zendesk, Freshdesk" },
    {
      label: "Top repeated questions?",
      placeholder: "e.g. password reset, billing",
    },
    { label: "Current CSAT?", placeholder: "e.g. 72%" },
  ],
  "Finance Back-Office Automation": [
    { label: "Monthly transactions?", placeholder: "e.g. 2000" },
    { label: "Current close time (days)?", placeholder: "e.g. 8" },
    {
      label: "Which processes to automate?",
      placeholder: "e.g. AP, reconciliation, close",
    },
  ],
  "Workflow Orchestration": [
    { label: "How many systems to connect?", placeholder: "e.g. 4" },
    { label: "Process steps?", placeholder: "e.g. 8" },
    { label: "Process frequency per week?", placeholder: "e.g. 50" },
  ],
};

type Step = "problem" | "context" | "details" | "processing" | "done";

export default function NewProblemPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("problem");

  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [budget, setBudget] = useState<number | undefined>();
  const [companySize, setCompanySize] = useState<number | undefined>();
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [urgency, setUrgency] = useState("");
  const [timeline, setTimeline] = useState<number | undefined>();
  const [dataSensitivity, setDataSensitivity] = useState("");
  const [techCapacity, setTechCapacity] = useState("");
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>(
    {},
  );
  const [tier, setTier] = useState<"free" | "starter" | "pro">("free");

  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [result, setResult] = useState<DecisionBriefResponse | null>(null);
  const [error, setError] = useState("");

  const detectedSignals = extractSignals(description);
  const detectedCategories = [
    ...new Set(
      detectedSignals
        .filter((s) => s.detected && s.category)
        .map((s) => s.category!),
    ),
  ];

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    setKeywordInput("");
  }

  function toggleSystem(sys: string) {
    setSelectedSystems((prev) =>
      prev.includes(sys) ? prev.filter((s) => s !== sys) : [...prev, sys],
    );
  }

  async function handleSubmit() {
    setStep("processing");
    setProcessing(true);
    setError("");

    const steps = [
      "Structuring your problem...",
      "Checking category fit...",
      "Looking for disqualifiers...",
      "Scoring vendor evidence...",
      "Preparing diagnosis...",
    ];

    for (const s of steps) {
      setProcessingStep(s);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const input: BuyerProblemInput = {
        problem_description: description,
        keywords,
        signals: buildSignals(description),
        budget_eur: budget,
        company_size: companySize,
        existing_systems: selectedSystems,
        tier,
      };
      const res = await apiPost<DecisionBriefResponse>("/assign", input);
      setResult(res);
      setStep("done");
    } catch {
      setError("Failed to get diagnosis. Is the backend running?");
      setStep("context");
    } finally {
      setProcessing(false);
    }
  }

  if (step === "processing") {
    return (
      <div className="max-w-lg mx-auto px-6 py-32 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-6" />
        <p className="text-lg font-medium">{processingStep}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Analyzing your problem against our solution taxonomy.
        </p>
      </div>
    );
  }

  if (step === "done" && result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          {result.diagnosis_confidence >= 0.6 ? (
            <CheckCircle2 className="h-6 w-6 text-positive" />
          ) : (
            <AlertCircle className="h-6 w-6 text-warning" />
          )}
          <h1 className="text-2xl font-bold">Diagnosis Complete</h1>
          <Badge
            variant={
              result.diagnosis_confidence >= 0.7
                ? "positive"
                : result.diagnosis_confidence >= 0.4
                  ? "warning"
                  : "risk"
            }
          >
            {Math.round(result.diagnosis_confidence * 100)}% confidence
          </Badge>
        </div>

        {result.diagnosis_confidence < 0.5 && (
          <Card className="mb-6 border-warning/30 bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Low confidence diagnosis</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The signals in your description were not strong enough for a
                  high-confidence match. Consider adding more detail about your
                  problem, existing systems, and expected outcomes.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="mb-6">
          <h2 className="font-semibold mb-1">Primary Recommendation</h2>
          <p className="text-xl font-bold text-primary">
            {result.diagnosed_category_name}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {result.diagnosis_explanation}
          </p>
        </Card>

        {result.not_recommended_reasons.length > 0 && (
          <Card className="mb-6 border-risk/20 bg-risk/5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-4 w-4 text-risk" />
              <h2 className="font-semibold text-sm">Not Recommended</h2>
            </div>
            <ul className="space-y-1.5">
              {result.not_recommended_reasons.map((r) => (
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
        )}

        {result.top_candidates.length > 1 && (
          <Card className="mb-6">
            <h2 className="font-semibold mb-3">Other Candidates</h2>
            <div className="space-y-3">
              {result.top_candidates.slice(1).map((c) => (
                <div
                  key={c.category_id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{c.category_name}</span>
                  <Badge variant="muted">{c.rank}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {result.recommendations.length > 0 && (
          <Card className="mb-6">
            <h2 className="font-semibold mb-3">Vendor Recommendations</h2>
            <div className="space-y-4">
              {result.recommendations.map((rec) => (
                <div
                  key={rec.vendor_id}
                  className="border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        #{rec.rank}
                      </span>
                      <span className="font-semibold">{rec.vendor_name}</span>
                    </div>
                    <Badge
                      variant={
                        rec.overall_score >= 0.7
                          ? "positive"
                          : rec.overall_score >= 0.4
                            ? "warning"
                            : "risk"
                      }
                    >
                      {Math.round(rec.overall_score * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec.fit_summary}
                  </p>
                  {rec.strengths.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {rec.strengths.map((s) => (
                        <Badge key={s} variant="positive">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {rec.concerns.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rec.concerns.map((c) => (
                        <Badge key={c} variant="warning">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {rec.score_breakdown &&
                    Object.keys(rec.score_breakdown).length > 0 && (
                      <div className="mt-3 space-y-2">
                        {Object.entries(rec.score_breakdown).map(
                          ([key, val]) => (
                            <ScoreBar
                              key={key}
                              label={key.replace(/_/g, " ")}
                              value={val}
                              colorClass={
                                val >= 0.7
                                  ? "bg-positive"
                                  : val >= 0.4
                                    ? "bg-warning"
                                    : "bg-risk"
                              }
                            />
                          ),
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {result.tier === "free" && (
          <Card className="bg-muted/50 border-dashed">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  Want vendor names and scoring?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upgrade to Starter (€99) or Pro (€499) for full Decision
                  Brief.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTier("starter");
                      setStep("context");
                    }}
                  >
                    Get Starter Brief
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setTier("pro");
                      setStep("context");
                    }}
                  >
                    Get Pro Brief
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {result.red_flags_to_watch.length > 0 && (
          <Card className="mt-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-risk" />
              Red Flags to Watch
            </h2>
            <ul className="space-y-2">
              {result.red_flags_to_watch.map((f) => (
                <li
                  key={f}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-risk shrink-0">-</span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {result.decision_questions.length > 0 && (
          <Card className="mt-6">
            <h2 className="font-semibold mb-3">Questions for Vendor Calls</h2>
            <ol className="space-y-2 list-decimal list-inside">
              {result.decision_questions.map((q) => (
                <li key={q} className="text-sm text-muted-foreground">
                  {q}
                </li>
              ))}
            </ol>
          </Card>
        )}

        {result.diagnosis_confidence < 0.3 &&
          result.recommendations.length === 0 && (
            <Card className="mt-6 border-muted bg-muted/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">
                    We do not recommend buying software yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your document volume is below the typical ROI threshold, or
                    the problem is not well-matched to available solution
                    categories.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    Recommended next step: Standardize the manual process and
                    revisit automation when volume grows.
                  </p>
                </div>
              </div>
            </Card>
          )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setStep("problem");
            }}
          >
            New Problem
          </Button>
          {result.recommendations.length > 0 && result.tier === "free" && (
            <Button
              onClick={() => {
                setTier("starter");
                setStep("context");
              }}
            >
              Unlock vendor shortlist
            </Button>
          )}
          {result.recommendations.length > 0 && result.tier !== "free" && (
            <Button onClick={() => router.push(`/app/briefs/sample`)}>
              View decision brief
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">
        {step === "problem"
          ? "Describe your business problem"
          : step === "context"
            ? "Company context"
            : "Operational details"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {step === "problem"
          ? "In plain language. No category selection needed."
          : step === "context"
            ? "Help us refine the diagnosis with context."
            : "Specific questions based on your detected category."}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-risk/10 border border-risk/20 rounded-xl text-sm text-risk">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {step === "problem" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  What problem are you trying to solve?
                </label>
                <textarea
                  className="w-full h-40 p-4 border border-border rounded-xl bg-card text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                  placeholder="Example: We receive hundreds of supplier invoices and delivery notes every week. Our team manually checks them against purchase orders and enters data into SAP. Errors are increasing and month-end processing is slow."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {description.length < 20
                    ? `${20 - description.length} more characters needed`
                    : ""}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Keywords (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. invoice, OCR, SAP"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  />
                  <Button variant="outline" size="sm" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {keywords.map((kw) => (
                      <Badge key={kw} variant="default">
                        {kw}
                        <button
                          className="ml-1.5 hover:text-risk"
                          onClick={() =>
                            setKeywords(keywords.filter((k) => k !== kw))
                          }
                        >
                          x
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                size="lg"
                disabled={description.length < 20}
                onClick={() => setStep("context")}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}

          {step === "context" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current systems
                </label>
                <div className="flex flex-wrap gap-2">
                  {SYSTEM_OPTIONS.map((sys) => (
                    <button
                      key={sys}
                      onClick={() => toggleSystem(sys)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedSystems.includes(sys)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget range
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_RANGES.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        budget === b.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company size
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_SIZES.map((cs) => (
                    <button
                      key={cs.value}
                      onClick={() => setCompanySize(cs.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        companySize === cs.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {cs.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        industry === ind
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        region === r
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Urgency
                </label>
                <div className="flex flex-wrap gap-2">
                  {URGENCIES.map((u) => (
                    <button
                      key={u.value}
                      onClick={() => setUrgency(u.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        urgency === u.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Timeline
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTimeline(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        timeline === t.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Data sensitivity
                </label>
                <div className="flex flex-wrap gap-2">
                  {DATA_SENSITIVITY.map((ds) => (
                    <button
                      key={ds.value}
                      onClick={() => setDataSensitivity(ds.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        dataSensitivity === ds.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {ds.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Internal technical capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {TECH_CAPACITY.map((tc) => (
                    <button
                      key={tc.value}
                      onClick={() => setTechCapacity(tc.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        techCapacity === tc.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {tc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Brief tier
                </label>
                <div className="flex gap-2">
                  {(["free", "starter", "pro"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        tier === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {t === "free"
                        ? "Free Diagnosis"
                        : t === "starter"
                          ? "Starter €99"
                          : "Pro €499"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("problem")}>
                  Back
                </Button>
                {detectedCategories.length > 0 ? (
                  <Button size="lg" onClick={() => setStep("details")}>
                    Continue to operational details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={processing}
                  >
                    Check category fit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )}

          {step === "details" && (
            <>
              {detectedCategories.map((cat) => {
                const questions = DYNAMIC_QUESTIONS[cat];
                if (!questions) return null;
                return (
                  <div key={cat} className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">
                      For: {cat}
                    </h3>
                    {questions.map((q) => (
                      <div key={q.label}>
                        <label className="block text-sm font-medium mb-1.5">
                          {q.label}
                        </label>
                        <input
                          className="w-full h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder={q.placeholder}
                          value={dynamicAnswers[q.label] || ""}
                          onChange={(e) =>
                            setDynamicAnswers({
                              ...dynamicAnswers,
                              [q.label]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                );
              })}

              {detectedCategories.every((cat) => !DYNAMIC_QUESTIONS[cat]) && (
                <p className="text-sm text-muted-foreground">
                  No category-specific questions detected. You can proceed
                  directly.
                </p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("context")}>
                  Back
                </Button>
                <Button size="lg" onClick={handleSubmit} disabled={processing}>
                  Check category fit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <h3 className="text-sm font-semibold mb-3">Detected Signals</h3>
            {detectedSignals.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Start typing to see signal extraction...
              </p>
            ) : (
              <div className="space-y-2">
                {detectedSignals.map((sig) => (
                  <div key={sig.label} className="flex items-center gap-2">
                    {sig.detected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-positive" />
                    ) : (
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        sig.detected
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {sig.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {detectedSignals.some((s) => s.category) && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Possible category:
                </p>
                {[
                  ...new Set(
                    detectedSignals
                      .filter((s) => s.detected && s.category)
                      .map((s) => s.category!),
                  ),
                ].map((cat) => (
                  <Badge key={cat} variant="default" className="mr-1 mb-1">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

interface DetectedSignal {
  label: string;
  detected: boolean;
  category?: string;
}

function extractSignals(text: string): DetectedSignal[] {
  if (text.length < 5) return [];
  const lower = text.toLowerCase();
  return [
    {
      label: "Document-heavy workflow",
      detected: /document|invoice|pdf|form|contract|paper/.test(lower),
      category: "AI Document Processing",
    },
    {
      label: "Manual data entry",
      detected: /manual|data entry|type in|enter data|copy.*(paste|into)/.test(
        lower,
      ),
      category: "AI Document Processing",
    },
    {
      label: "ERP / target system",
      detected: /erp|sap|oracle|netsuite|dynamics|target system/.test(lower),
      category: "AI Document Processing",
    },
    {
      label: "Email / inbox workflow",
      detected: /email|inbox|mail|outlook|gmail/.test(lower),
      category: "Email Workflow Automation",
    },
    {
      label: "Support / tickets",
      detected:
        /support|ticket|helpdesk|customer.*(service|question)|zendesk|intercom/.test(
          lower,
        ),
      category: "Customer Support Automation",
    },
    {
      label: "Knowledge / search",
      detected:
        /knowledge|search|find.*(document|answer)|internal.*wiki|rag|confluence/.test(
          lower,
        ),
      category: "Enterprise Knowledge Search",
    },
    {
      label: "Workflow / approval",
      detected: /workflow|approval|routing|handoff|automat.*process/.test(
        lower,
      ),
      category: "Workflow Orchestration",
    },
    {
      label: "Finance / accounting",
      detected:
        /finance|accounting|month.?end|close|reconcil|ap\b|ar\b|invoice.*pay/.test(
          lower,
        ),
      category: "Finance Back-Office Automation",
    },
    {
      label: "Compliance / regulatory",
      detected: /compliance|regulat|audit|gdpr|sox|legal.*review/.test(lower),
      category: "Compliance Document Review",
    },
    {
      label: "Procurement / supplier",
      detected:
        /procurement|supplier|vendor.*manage|purchase.*order|rfp|rfq/.test(
          lower,
        ),
      category: "Procurement Workflow Automation",
    },
    {
      label: "Sales / CRM",
      detected: /sales|crm|lead|pipeline|prospect|quota/.test(lower),
      category: "Sales Operations Automation",
    },
    {
      label: "High volume mentioned",
      detected: /hundred|thousand|volume|per week|per month|per day|bulk/.test(
        lower,
      ),
    },
    {
      label: "Error / quality concern",
      detected: /error|mistake|accuracy|quality|wrong|incorrect/.test(lower),
    },
    {
      label: "Budget mentioned",
      detected: /budget|cost|price|€|\$|spend|invest/.test(lower),
    },
  ];
}

function buildSignals(text: string): Record<string, unknown> {
  const lower = text.toLowerCase();
  const signals: Record<string, unknown> = {};
  if (/hundred|200|300|400|500/.test(lower)) signals.documents_per_week = 200;
  if (/thousand|1000|2000/.test(lower)) signals.documents_per_week = 1000;
  if (/erp|sap|oracle|netsuite|target/.test(lower))
    signals.has_target_system = true;
  if (/support|ticket/.test(lower))
    signals.support_interactions_per_month = 2000;
  if (/manual|data entry/.test(lower)) signals.manual_process = true;
  return signals;
}
