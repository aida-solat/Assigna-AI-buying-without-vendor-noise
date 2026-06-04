"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/ui/score-bar";
import { ChevronDown, ChevronUp } from "lucide-react";

type VendorAssignmentCardProps = {
  vendorName: string;
  rank: number;
  overallScore: number;
  scores: {
    needFit: number;
    evidenceQuality: number;
    industryFit: number;
    integrationFit: number;
    budgetFit: number;
    timingFit: number;
    riskPenalty: number;
  };
  reasoning: {
    whyThis: string[];
    whyNow: string[];
    risks: string[];
    questionsForVendor: string[];
  };
  tags?: string[];
};

export function VendorAssignmentCard({
  vendorName,
  rank,
  overallScore,
  scores,
  reasoning,
  tags = [],
}: VendorAssignmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round(overallScore * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground tabular-nums">
            #{rank}
          </span>
          <h3 className="font-semibold text-base">{vendorName}</h3>
        </div>
        <Badge
          variant={pct >= 70 ? "positive" : pct >= 40 ? "warning" : "risk"}
        >
          Overall: {pct}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MiniScore label="Need Fit" value={scores.needFit} />
        <MiniScore label="Evidence" value={scores.evidenceQuality} />
        <MiniScore label="Integration" value={scores.integrationFit} />
        <MiniScore label="Budget" value={scores.budgetFit} />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-between text-muted-foreground"
      >
        {expanded ? "Hide details" : "View assignment reasoning"}
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
          <div className="space-y-2">
            <ScoreBar label="Need Fit" value={scores.needFit} colorClass="bg-primary" />
            <ScoreBar label="Evidence Quality" value={scores.evidenceQuality} colorClass="bg-evidence" />
            <ScoreBar label="Industry Fit" value={scores.industryFit} colorClass="bg-primary" />
            <ScoreBar label="Integration Fit" value={scores.integrationFit} colorClass="bg-positive" />
            <ScoreBar label="Budget Fit" value={scores.budgetFit} colorClass="bg-primary" />
            <ScoreBar label="Timing Fit" value={scores.timingFit} colorClass="bg-primary" />
            <ScoreBar label="Risk Penalty" value={scores.riskPenalty} colorClass="bg-risk" />
          </div>

          {reasoning.whyThis.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5">Why this vendor</p>
              <ul className="space-y-1">
                {reasoning.whyThis.map((r) => (
                  <li key={r} className="text-xs text-muted-foreground">
                    - {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reasoning.whyNow.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5">Why now</p>
              <ul className="space-y-1">
                {reasoning.whyNow.map((r) => (
                  <li key={r} className="text-xs text-muted-foreground">
                    - {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reasoning.risks.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5">Risks</p>
              <ul className="space-y-1">
                {reasoning.risks.map((r) => (
                  <li key={r} className="text-xs text-muted-foreground">
                    - {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reasoning.questionsForVendor.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1.5">
                Questions to ask this vendor
              </p>
              <ol className="space-y-1 list-decimal list-inside">
                {reasoning.questionsForVendor.map((q) => (
                  <li key={q} className="text-xs text-muted-foreground">
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
}

function MiniScore({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="text-center">
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-sm font-bold tabular-nums ${
          pct >= 70
            ? "text-positive"
            : pct >= 40
            ? "text-warning"
            : "text-risk"
        }`}
      >
        {pct}%
      </p>
    </div>
  );
}
