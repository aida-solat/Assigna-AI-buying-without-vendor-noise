import { Card, CardTitle } from "@/components/ui/card";
import { Database, Layers, FileText, FileCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Curation panel for Assigna editorial content.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Vendors</CardTitle>
          </div>
          <p className="text-2xl font-bold tabular-nums">5</p>
          <p className="text-xs text-muted-foreground mt-1">
            Curated vendor profiles
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Layers className="h-5 w-5 text-evidence" />
            <CardTitle>Categories</CardTitle>
          </div>
          <p className="text-2xl font-bold tabular-nums">10</p>
          <p className="text-xs text-muted-foreground mt-1">
            Solution taxonomy categories
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5 text-positive" />
            <CardTitle>Briefs</CardTitle>
          </div>
          <p className="text-2xl font-bold tabular-nums">0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Generated decision briefs
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <FileCheck className="h-5 w-5 text-warning" />
            <CardTitle>Evidence</CardTitle>
          </div>
          <p className="text-2xl font-bold tabular-nums">53</p>
          <p className="text-xs text-muted-foreground mt-1">
            Evidence items tracked
          </p>
        </Card>
      </div>
    </div>
  );
}
