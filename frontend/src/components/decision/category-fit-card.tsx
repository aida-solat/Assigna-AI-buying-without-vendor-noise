import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type CategoryFitCardProps = {
  categoryName: string;
  categoryType: "product_category" | "service_delivery_model" | "hybrid";
  fitScore: number;
  confidenceScore: number;
  complexity: string;
  budgetBand: { min: number; max: number; currency: string; model: string };
  timelineWeeks: { min: number; max: number };
  reasons: string[];
  warnings: string[];
  isPrimary?: boolean;
};

const typeLabels: Record<string, string> = {
  product_category: "Product",
  service_delivery_model: "Service",
  hybrid: "Hybrid",
};

export function CategoryFitCard({
  categoryName,
  categoryType,
  fitScore,
  confidenceScore,
  complexity,
  budgetBand,
  timelineWeeks,
  reasons,
  warnings,
  isPrimary = false,
}: CategoryFitCardProps) {
  const fitPct = Math.round(fitScore * 100);
  const confLabel =
    confidenceScore >= 0.8
      ? "High"
      : confidenceScore >= 0.5
      ? "Medium"
      : "Low";

  return (
    <Card className={isPrimary ? "ring-2 ring-primary/30" : ""}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {isPrimary ? "Primary Recommendation" : "Secondary"}
          </p>
          <h3 className="font-semibold text-lg">{categoryName}</h3>
        </div>
        <Badge
          variant={fitPct >= 70 ? "positive" : fitPct >= 40 ? "warning" : "risk"}
        >
          {fitPct}% fit
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="muted">{typeLabels[categoryType]}</Badge>
        <Badge variant="muted">Confidence: {confLabel}</Badge>
        <Badge variant="muted">Complexity: {complexity}</Badge>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
        <span>
          Budget: {budgetBand.currency === "EUR" ? "€" : budgetBand.currency}
          {(budgetBand.min / 1000).toFixed(0)}K – €
          {(budgetBand.max / 1000).toFixed(0)}K
        </span>
        <span>
          Timeline: {timelineWeeks.min}–{timelineWeeks.max} weeks
        </span>
      </div>

      {reasons.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-foreground mb-1.5">Why:</p>
          <ul className="space-y-1">
            {reasons.map((r) => (
              <li key={r} className="text-xs text-muted-foreground flex gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-positive shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div>
          <p className="text-xs font-medium text-foreground mb-1.5">Watch:</p>
          <ul className="space-y-1">
            {warnings.map((w) => (
              <li key={w} className="text-xs text-muted-foreground flex gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
