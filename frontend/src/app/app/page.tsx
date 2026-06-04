import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  ClipboardList,
  Lightbulb,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function AppDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold">Decision Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your active problems and decision briefs.
          </p>
        </div>
        <Link href="/app/problems/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Problem
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Active Problems
          </h2>
          <Card className="flex items-center gap-5 p-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                No active problems.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start with a business problem, not a vendor name.
              </p>
            </div>
            <Link href="/app/problems/new">
              <Button variant="outline" size="sm">
                Create first problem
              </Button>
            </Link>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Decision Briefs
          </h2>
          <Card className="flex items-center gap-5 p-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                No briefs generated yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete a diagnosis to generate your first Decision Brief.
              </p>
            </div>
            <Link href="/sample-brief">
              <Button variant="outline" size="sm">
                View sample brief
              </Button>
            </Link>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Draft Diagnoses
          </h2>
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">
              No drafts saved. Diagnoses in progress will appear here.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recommended Next Actions
          </h2>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  Describe your first business problem
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Assigna will diagnose the real need, suggest solution
                  categories, and score vendors using evidence — not reviews or
                  popularity.
                </p>
                <Link href="/app/problems/new">
                  <Button size="sm" className="mt-3">
                    Start diagnosis
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Ranking is based on fit and evidence, not paid placement. Vendors
            cannot buy higher ranking.
          </p>
        </div>
      </div>
    </div>
  );
}
