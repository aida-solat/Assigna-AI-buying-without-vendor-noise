"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface EvidenceGapPanelProps {
  categoryName: string;
  requirements: string[];
}

export function EvidenceGapPanel({
  categoryName,
  requirements,
}: EvidenceGapPanelProps) {
  if (requirements.length === 0) return null;

  return (
    <Card className="border-evidence/20 bg-evidence/5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-evidence" />
        <h3 className="text-sm font-semibold">Evidence to Demand</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Before talking to vendors for{" "}
        <span className="font-medium text-foreground">{categoryName}</span>,
        ensure they can provide:
      </p>
      <ul className="space-y-1.5">
        {requirements.map((req) => (
          <li key={req} className="flex items-start gap-2">
            <Badge variant="evidence" className="mt-0.5 shrink-0 text-[10px]">
              required
            </Badge>
            <span className="text-xs text-muted-foreground">{req}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
