"use client";

import { cn } from "@/lib/utils";

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  colorClass?: string;
  showPercentage?: boolean;
}

export function ScoreBar({
  label,
  value,
  maxValue = 1,
  colorClass = "bg-primary",
  showPercentage = true,
}: ScoreBarProps) {
  const pct = Math.round((value / maxValue) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-32 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium tabular-nums w-10 text-right">
          {pct}%
        </span>
      )}
    </div>
  );
}
