"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Share2, ArrowLeft } from "lucide-react";

export default function BriefExportPage() {
  const params = useParams();
  const briefId = params.briefId as string;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href={`/app/briefs/${briefId}`}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to brief
      </Link>

      <h1 className="text-2xl font-bold mb-2">Export Decision Brief</h1>
      <p className="text-sm text-muted-foreground mb-8">Brief ID: {briefId}</p>

      <div className="space-y-4">
        <Card className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-risk/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-risk" />
            </div>
            <div>
              <p className="font-semibold text-sm">PDF Export</p>
              <p className="text-xs text-muted-foreground">
                Full decision brief with scores, reasoning, and procurement
                checklist
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Download PDF
          </Button>
        </Card>

        <Card className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Shareable Link</p>
              <p className="text-xs text-muted-foreground">
                Share a read-only version with your procurement team
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1.5" />
            Copy Link
          </Button>
        </Card>

        <Card className="bg-muted/50 border-dashed p-5">
          <div className="text-center">
            <Badge variant="muted" className="mb-3">
              Coming soon
            </Badge>
            <p className="text-sm text-muted-foreground">
              CSV export, API integration, and team workspace features are under
              development.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
