import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AdminBriefsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Decision Briefs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track generated briefs and outcomes.
        </p>
      </div>

      <Card className="flex items-center gap-4 p-5">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">
            No briefs generated yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Briefs will appear here once buyers complete diagnoses.
          </p>
        </div>
      </Card>
    </div>
  );
}
