import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ui/score-bar";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FileText,
} from "lucide-react";

export default function SampleBriefPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sample Decision Brief</h1>
        </div>
        <p className="text-muted-foreground mb-10">
          This is what a Pro Decision Brief looks like for a real business
          problem.
        </p>

        <Card className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Executive Summary
          </p>
          <p className="text-base leading-relaxed">
            Assigna recommends starting with{" "}
            <span className="font-semibold text-primary">
              AI Document Processing & Extraction
            </span>
            , supported by Workflow Orchestration only if approval routing is in
            scope. Custom AI consulting is not recommended at this stage because
            the problem is standard and off-the-shelf tools can solve the
            extraction layer with lower implementation risk.
          </p>
        </Card>

        <Card className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Problem Understanding
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We receive hundreds of supplier invoices and delivery notes every
            week. Our team manually checks them against purchase orders and
            enters data into SAP. Errors are increasing and month-end processing
            is slow.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="default">Manufacturing</Badge>
            <Badge variant="default">200-500 employees</Badge>
            <Badge variant="default">DACH</Badge>
            <Badge variant="muted">SAP S/4HANA</Badge>
            <Badge variant="muted">€50K-€150K budget</Badge>
          </div>
        </Card>

        <Card className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Need Diagnosis
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-positive" />
                <span className="font-semibold text-sm">
                  Primary: AI Document Processing & Extraction
                </span>
                <Badge variant="positive">84% fit</Badge>
              </div>
              <ul className="space-y-1 ml-6">
                <li className="text-xs text-muted-foreground">
                  High document volume detected
                </li>
                <li className="text-xs text-muted-foreground">
                  Manual data entry pain confirmed
                </li>
                <li className="text-xs text-muted-foreground">
                  ERP target system exists (SAP)
                </li>
                <li className="text-xs text-muted-foreground">
                  Error/compliance pressure mentioned
                </li>
              </ul>
            </div>
            <div className="border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">
                  Secondary: Workflow Orchestration
                </span>
                <Badge variant="muted">61% fit</Badge>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Approval routing after extraction may need orchestration.
              </p>
            </div>
            <div className="border border-risk/20 bg-risk/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-risk" />
                <span className="font-semibold text-sm">
                  Not Recommended: Custom AI Consulting
                </span>
              </div>
              <ul className="space-y-1 ml-6">
                <li className="text-xs text-muted-foreground">
                  Standard problem — off-the-shelf tools exist
                </li>
                <li className="text-xs text-muted-foreground">
                  Custom build would increase cost and risk
                </li>
                <li className="text-xs text-muted-foreground">
                  Existing target systems can be integrated without bespoke AI
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Vendor Comparison
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">
                    Vendor
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Fit
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Evidence
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Risk
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 font-medium">DocuAI</td>
                  <td className="py-3">
                    <Badge variant="positive">86%</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="positive">78%</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="warning">Medium</Badge>
                  </td>
                  <td className="py-3 text-xs text-primary">Request POC</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 font-medium">Vendor B</td>
                  <td className="py-3">
                    <Badge variant="positive">81%</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="positive">91%</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="positive">Low</Badge>
                  </td>
                  <td className="py-3 text-xs text-primary">Schedule call</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Vendor C</td>
                  <td className="py-3">
                    <Badge variant="warning">62%</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="warning">55%</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="risk">High</Badge>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">
                    Not recommended
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Score Breakdown — Top Vendor
          </p>
          <div className="space-y-3">
            <ScoreBar label="Need Fit" value={0.88} colorClass="bg-primary" />
            <ScoreBar
              label="Evidence Quality"
              value={0.72}
              colorClass="bg-evidence"
            />
            <ScoreBar
              label="Integration Fit"
              value={0.81}
              colorClass="bg-positive"
            />
            <ScoreBar
              label="Budget Fit"
              value={0.75}
              colorClass="bg-primary"
            />
            <ScoreBar
              label="Risk"
              value={0.35}
              colorClass="bg-warning"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Never hide the reasoning behind a score.
          </p>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-risk" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Risk Summary
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Main risk</p>
              <p className="text-sm text-muted-foreground">
                Your document types may be less standardized than expected.
                Require a pilot on real documents before contract.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Evidence gaps</p>
              <ul className="space-y-1">
                <li className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-warning">-</span> Missing same-industry
                  case study from top vendor
                </li>
                <li className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-warning">-</span> No pilot on buyer
                  document samples yet
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Questions for Vendor Calls
          </p>
          <ol className="space-y-2 list-decimal list-inside">
            <li className="text-sm text-muted-foreground">
              What is your accuracy rate on our specific document types?
            </li>
            <li className="text-sm text-muted-foreground">
              Can you integrate directly with SAP S/4HANA?
            </li>
            <li className="text-sm text-muted-foreground">
              What is your STP rate for similar manufacturing clients?
            </li>
            <li className="text-sm text-muted-foreground">
              Do you offer a pilot on our real documents before commitment?
            </li>
            <li className="text-sm text-muted-foreground">
              What happens when extraction confidence is low?
            </li>
          </ol>
        </Card>
      </main>
      <TrustFooter />
    </>
  );
}
