import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

type EvidenceRequirement = {
  type: string;
  description: string;
  weight: number;
  required: boolean;
  status?: "missing" | "provided" | "verified";
};

type EvidenceRequirementListProps = {
  requirements: EvidenceRequirement[];
};

const statusIcons = {
  missing: <AlertCircle className="h-3.5 w-3.5 text-warning" />,
  provided: <Clock className="h-3.5 w-3.5 text-primary" />,
  verified: <CheckCircle2 className="h-3.5 w-3.5 text-positive" />,
};

const statusLabels = {
  missing: "Missing",
  provided: "Provided",
  verified: "Verified",
};

export function EvidenceRequirementList({
  requirements,
}: EvidenceRequirementListProps) {
  return (
    <Card>
      <h3 className="font-semibold text-sm mb-4">Evidence Requirements</h3>
      <div className="space-y-3">
        {requirements.map((req) => (
          <div key={req.type} className="flex items-start gap-3">
            {req.status ? statusIcons[req.status] : statusIcons.missing}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  {req.type}
                </span>
                {req.required && (
                  <Badge variant="risk" className="text-[10px]">
                    Required
                  </Badge>
                )}
                {req.status && (
                  <Badge
                    variant={
                      req.status === "verified"
                        ? "positive"
                        : req.status === "provided"
                        ? "default"
                        : "warning"
                    }
                    className="text-[10px]"
                  >
                    {statusLabels[req.status]}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {req.description}
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
              Weight: {Math.round(req.weight * 100)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
