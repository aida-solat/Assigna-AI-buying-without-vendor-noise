import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const useCases = [
  {
    title: "Supplier Invoice Automation",
    industry: "Manufacturing",
    problem:
      "Hundreds of invoices per week processed manually into SAP. Errors rising, month-end close delayed.",
    diagnosis: "AI Document Processing & Extraction",
    notRecommended: "Custom AI Consulting",
    reason:
      "Standard extraction problem — off-the-shelf tools with SAP connectors exist.",
  },
  {
    title: "Support Ticket Overload",
    industry: "SaaS / Technology",
    problem:
      "60% of support tickets are repetitive questions. Senior agents spend time on low-value queries.",
    diagnosis: "Customer Support Automation",
    notRecommended: "Enterprise RAG / Knowledge Search",
    reason:
      "The need is auto-resolution, not search. Knowledge search is secondary.",
  },
  {
    title: "Internal Knowledge Fragmentation",
    industry: "Professional Services",
    problem:
      "Teams can't find policies, procedures, or past project docs across Confluence, SharePoint, and email.",
    diagnosis: "Enterprise Knowledge Search & RAG",
    notRecommended: "Workflow Orchestration",
    reason: "The problem is findability, not process routing.",
  },
  {
    title: "Manual Financial Close",
    industry: "Financial Services",
    problem:
      "Month-end close takes 8+ days. Reconciliation is manual. AP processing has no automation.",
    diagnosis: "Finance Back-Office Automation",
    notRecommended: "AI Document Processing",
    reason:
      "Document extraction alone won't fix reconciliation and close workflows.",
  },
  {
    title: "Cross-System Approval Chaos",
    industry: "Enterprise / Multi-division",
    problem:
      "Approvals span Salesforce, SAP, email, and Slack. No visibility into bottlenecks.",
    diagnosis: "Workflow Orchestration & Integration",
    notRecommended: "Custom AI Consulting",
    reason: "Integration platforms solve this without bespoke development.",
  },
  {
    title: "Compliance Document Review",
    industry: "Banking / Insurance",
    problem:
      "Regulatory submissions require review of hundreds of documents. Manual review is slow and error-prone.",
    diagnosis: "Compliance Document Review & AI Audit",
    notRecommended: "General AI Document Processing",
    reason:
      "Compliance review needs domain-specific accuracy, audit trails, and regulatory awareness.",
  },
];

export default function UseCasesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Use Cases</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Real business problems diagnosed by Assigna. Each shows the primary
          recommendation, what was explicitly not recommended, and why.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {useCases.map((uc) => (
            <Card key={uc.title} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="muted">{uc.industry}</Badge>
              </div>
              <h3 className="font-semibold text-base mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {uc.problem}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="positive">Recommended</Badge>
                  <span className="text-sm font-medium">{uc.diagnosis}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="risk">Not recommended</Badge>
                  <span className="text-sm text-muted-foreground">
                    {uc.notRecommended}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-1">
                  {uc.reason}
                </p>
              </div>
              <Link href="/app/problems/new">
                <Button variant="outline" size="sm" className="w-full">
                  Try similar problem
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
      <TrustFooter />
    </>
  );
}
