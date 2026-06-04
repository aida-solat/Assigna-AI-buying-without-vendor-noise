"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/ui/score-bar";
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Shield,
} from "lucide-react";

export default function BriefViewerPage() {
  const params = useParams();
  const briefId = params.briefId as string;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              Decision Brief: Supplier Document Automation
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Brief ID: {briefId} &middot; Generated: Today
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          1. Executive Summary
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
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          2. Problem Understanding
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          We receive hundreds of supplier invoices and delivery notes every
          week. Our team manually checks them against purchase orders and enters
          data into SAP. Errors are increasing and month-end processing is slow.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Manufacturing</Badge>
          <Badge variant="default">200-500 employees</Badge>
          <Badge variant="default">DACH</Badge>
          <Badge variant="muted">SAP S/4HANA</Badge>
          <Badge variant="muted">€50K-€150K budget</Badge>
        </div>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          3. Need Diagnosis
        </p>
        <div className="space-y-3">
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
        </div>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          4. Recommended Category Path
        </p>
        <div className="border border-risk/20 bg-risk/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-risk" />
            <span className="font-semibold text-sm">
              Not Recommended: Custom AI Agent Consulting
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
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          5. Vendor Shortlist
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Vendor</th>
                <th className="pb-3 font-medium text-muted-foreground">Category Fit</th>
                <th className="pb-3 font-medium text-muted-foreground">Evidence</th>
                <th className="pb-3 font-medium text-muted-foreground">Integration</th>
                <th className="pb-3 font-medium text-muted-foreground">Risk</th>
                <th className="pb-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 font-medium">DocuAI</td>
                <td className="py-3"><Badge variant="positive">86%</Badge></td>
                <td className="py-3"><Badge variant="positive">78%</Badge></td>
                <td className="py-3"><Badge variant="positive">SAP verified</Badge></td>
                <td className="py-3"><Badge variant="warning">Medium</Badge></td>
                <td className="py-3 text-xs text-primary">Request POC</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 font-medium">Vendor B</td>
                <td className="py-3"><Badge variant="positive">81%</Badge></td>
                <td className="py-3"><Badge variant="positive">91%</Badge></td>
                <td className="py-3"><Badge variant="positive">SAP certified</Badge></td>
                <td className="py-3"><Badge variant="positive">Low</Badge></td>
                <td className="py-3 text-xs text-primary">Schedule call</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 font-medium">Vendor C</td>
                <td className="py-3"><Badge variant="warning">72%</Badge></td>
                <td className="py-3"><Badge variant="warning">65%</Badge></td>
                <td className="py-3"><Badge variant="muted">Pending</Badge></td>
                <td className="py-3"><Badge variant="warning">Medium</Badge></td>
                <td className="py-3 text-xs text-muted-foreground">Evaluate</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 font-medium">Vendor D</td>
                <td className="py-3"><Badge variant="warning">68%</Badge></td>
                <td className="py-3"><Badge variant="warning">55%</Badge></td>
                <td className="py-3"><Badge variant="muted">Unknown</Badge></td>
                <td className="py-3"><Badge variant="risk">High</Badge></td>
                <td className="py-3 text-xs text-muted-foreground">Not recommended</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Vendor E</td>
                <td className="py-3"><Badge variant="warning">62%</Badge></td>
                <td className="py-3"><Badge variant="warning">50%</Badge></td>
                <td className="py-3"><Badge variant="muted">Unknown</Badge></td>
                <td className="py-3"><Badge variant="risk">High</Badge></td>
                <td className="py-3 text-xs text-muted-foreground">Not recommended</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          6. Score Breakdown — Top Vendor
        </p>
        <div className="space-y-3">
          <ScoreBar label="Need Fit" value={0.88} colorClass="bg-primary" />
          <ScoreBar label="Evidence Quality" value={0.72} colorClass="bg-evidence" />
          <ScoreBar label="Integration Fit" value={0.81} colorClass="bg-positive" />
          <ScoreBar label="Budget Fit" value={0.75} colorClass="bg-primary" />
          <ScoreBar label="Risk" value={0.35} colorClass="bg-warning" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Never hide the reasoning behind a score.
        </p>
      </Card>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-risk" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            7. Risk Summary
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Buyer-side risks</p>
            <p className="text-sm text-muted-foreground">
              Document types may be less standardized than expected. Internal
              change management may slow adoption.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Vendor-side risks</p>
            <p className="text-sm text-muted-foreground">
              Top vendor missing same-industry case study. Integration
              certification is vendor self-declared.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Implementation risks</p>
            <p className="text-sm text-muted-foreground">
              Pilot phase critical — do not sign full contract before pilot
              on real documents.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Evidence gaps</p>
            <ul className="space-y-1">
              <li className="text-sm text-muted-foreground flex gap-2">
                <span className="text-warning">-</span>
                Missing same-industry case study from top vendor
              </li>
              <li className="text-sm text-muted-foreground flex gap-2">
                <span className="text-warning">-</span>
                No pilot on buyer document samples yet
              </li>
              <li className="text-sm text-muted-foreground flex gap-2">
                <span className="text-warning">-</span>
                GDPR compliance certification self-declared
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          8. Questions for Vendor Calls
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
          <li className="text-sm text-muted-foreground">
            What is your pricing model — per document, per user, or platform fee?
          </li>
          <li className="text-sm text-muted-foreground">
            What does your typical implementation timeline look like for our size?
          </li>
        </ol>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          9. Procurement Checklist
        </p>
        <ul className="space-y-2">
          {[
            "Request pilot on real documents before contract",
            "Verify SAP S/4HANA integration with your specific version",
            "Check GDPR/compliance certifications independently",
            "Compare total cost of ownership across 3-year period",
            "Negotiate pilot-to-contract conversion terms",
            "Define SLAs for accuracy, uptime, and support response",
            "Include exit clause and data portability terms",
          ].map((item) => (
            <li key={item} className="text-sm text-muted-foreground flex gap-2">
              <div className="w-4 h-4 border border-border rounded shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          10. Recommended Next Action
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              1
            </div>
            <p className="text-sm text-muted-foreground">
              Request a POC from DocuAI with your real invoice samples.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              2
            </div>
            <p className="text-sm text-muted-foreground">
              Schedule vendor call with Vendor B as backup comparison.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              3
            </div>
            <p className="text-sm text-muted-foreground">
              Use the questions above to evaluate both vendors during calls.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            Ranking is based on fit and evidence, not paid placement.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
