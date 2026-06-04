import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";

type NotRecommendedCardProps = {
  categoryName: string;
  reasons: string[];
  alternatives: string[];
};

export function NotRecommendedCard({
  categoryName,
  reasons,
  alternatives,
}: NotRecommendedCardProps) {
  return (
    <Card className="border-risk/20 bg-risk/5">
      <div className="flex items-center gap-2 mb-3">
        <XCircle className="h-4 w-4 text-risk" />
        <h3 className="font-semibold text-sm">Not Recommended: {categoryName}</h3>
      </div>
      <ul className="space-y-1.5 mb-3">
        {reasons.map((r) => (
          <li key={r} className="text-xs text-muted-foreground flex gap-2">
            <span className="text-risk shrink-0">✕</span>
            {r}
          </li>
        ))}
      </ul>
      {alternatives.length > 0 && (
        <div className="pt-3 border-t border-risk/10">
          <p className="text-xs text-muted-foreground mb-1">
            Consider instead:
          </p>
          <ul className="space-y-1">
            {alternatives.map((a) => (
              <li key={a} className="text-xs text-foreground">
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
