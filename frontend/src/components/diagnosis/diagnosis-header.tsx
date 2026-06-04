"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface DiagnosisHeaderProps {
  confidence: number;
}

export function DiagnosisHeader({ confidence }: DiagnosisHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {confidence >= 0.6 ? (
        <CheckCircle2 className="h-6 w-6 text-positive" />
      ) : (
        <AlertCircle className="h-6 w-6 text-warning" />
      )}
      <h1 className="text-2xl font-bold">Diagnosis Complete</h1>
      <Badge
        variant={
          confidence >= 0.7
            ? "positive"
            : confidence >= 0.4
              ? "warning"
              : "risk"
        }
      >
        {Math.round(confidence * 100)}% confidence
      </Badge>
    </div>
  );
}
