"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, HelpCircle } from "lucide-react";
import type { ExtractedSignal } from "@/lib/types";

interface SignalExtractionPanelProps {
  signals: ExtractedSignal[];
}

export function SignalExtractionPanel({ signals }: SignalExtractionPanelProps) {
  const detectedCategories = [
    ...new Set(
      signals
        .filter((s) => s.detected && s.category)
        .map((s) => s.category!),
    ),
  ];

  return (
    <Card className="sticky top-20">
      <h3 className="text-sm font-semibold mb-3">Detected Signals</h3>
      {signals.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Start typing to see signal extraction...
        </p>
      ) : (
        <div className="space-y-2">
          {signals.map((sig) => (
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

      {detectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Possible category:
          </p>
          {detectedCategories.map((cat) => (
            <Badge key={cat} variant="default" className="mr-1 mb-1">
              {cat}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
