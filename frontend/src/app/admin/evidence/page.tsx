"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  FileWarning,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const EVIDENCE_TYPES = [
  {
    type: "Case Study",
    description: "Published customer story with measurable outcomes",
    count: 12,
    verified: 8,
    pending: 4,
  },
  {
    type: "Integration Proof",
    description:
      "Confirmed integration with target system (e.g. SAP, Salesforce)",
    count: 9,
    verified: 6,
    pending: 3,
  },
  {
    type: "Benchmark",
    description: "Third-party or vendor-published accuracy/performance data",
    count: 7,
    verified: 3,
    pending: 4,
  },
  {
    type: "Certification",
    description: "ISO 27001, SOC 2, GDPR compliance, industry-specific",
    count: 15,
    verified: 12,
    pending: 3,
  },
  {
    type: "Pilot Result",
    description: "Outcome from a buyer pilot or POC engagement",
    count: 4,
    verified: 2,
    pending: 2,
  },
  {
    type: "Reference Customer",
    description: "Named customer willing to be contacted as reference",
    count: 6,
    verified: 4,
    pending: 2,
  },
];

export default function AdminEvidencePage() {
  const totalItems = EVIDENCE_TYPES.reduce((sum, e) => sum + e.count, 0);
  const totalVerified = EVIDENCE_TYPES.reduce((sum, e) => sum + e.verified, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Evidence Registry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and verify evidence items across all curated vendors.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Total evidence</p>
          </div>
          <p className="text-2xl font-bold">{totalItems}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-positive" />
            <p className="text-xs text-muted-foreground">Verified</p>
          </div>
          <p className="text-2xl font-bold text-positive">{totalVerified}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <p className="text-xs text-muted-foreground">Pending review</p>
          </div>
          <p className="text-2xl font-bold text-warning">
            {totalItems - totalVerified}
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        {EVIDENCE_TYPES.map((ev) => (
          <Card key={ev.type} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base">{ev.type}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {ev.description}
                </p>
              </div>
              <Badge variant="muted">{ev.count} items</Badge>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-positive" />
                {ev.verified} verified
              </span>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-warning" />
                {ev.pending} pending
              </span>
            </div>

            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-positive rounded-full transition-all"
                style={{ width: `${(ev.verified / ev.count) * 100}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 bg-muted/50 border-dashed">
        <div className="flex items-start gap-3">
          <FileWarning className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Read-only view</p>
            <p className="text-xs text-muted-foreground mt-1">
              Evidence items are currently managed via the backend data layer.
              The management UI for adding, verifying, and linking evidence to
              vendors is under development.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
