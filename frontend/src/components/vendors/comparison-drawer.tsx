"use client";

import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VendorRecommendation } from "@/lib/types";

interface ComparisonDrawerProps {
  vendors: VendorRecommendation[];
  open: boolean;
  onClose: () => void;
}

export function ComparisonDrawer({
  vendors,
  open,
  onClose,
}: ComparisonDrawerProps) {
  if (!open || vendors.length < 2) return null;

  const scoreKeys = vendors[0]?.score_breakdown
    ? Object.keys(vendors[0].score_breakdown)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-card border-l border-border h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Compare Vendors</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground">
                  Metric
                </th>
                {vendors.map((v) => (
                  <th
                    key={v.vendor_id}
                    className="pb-3 text-left font-medium text-foreground"
                  >
                    {v.vendor_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">Overall Fit</td>
                {vendors.map((v) => (
                  <td key={v.vendor_id} className="py-2">
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
                  </td>
                ))}
              </tr>
              {scoreKeys.map((key) => (
                <tr key={key} className="border-b border-border">
                  <td className="py-2 text-muted-foreground">
                    {key.replace(/_/g, " ")}
                  </td>
                  {vendors.map((v) => {
                    const val = v.score_breakdown[key] ?? 0;
                    return (
                      <td key={v.vendor_id} className="py-2">
                        <ScoreBar
                          label=""
                          value={val}
                          colorClass={
                            val >= 0.7
                              ? "bg-positive"
                              : val >= 0.4
                                ? "bg-warning"
                                : "bg-risk"
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-b border-border">
                <td className="py-2 text-muted-foreground">Main Strength</td>
                {vendors.map((v) => (
                  <td
                    key={v.vendor_id}
                    className="py-2 text-xs text-muted-foreground"
                  >
                    {v.strengths[0] || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Main Concern</td>
                {vendors.map((v) => (
                  <td
                    key={v.vendor_id}
                    className="py-2 text-xs text-muted-foreground"
                  >
                    {v.concerns[0] || "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
