import { Shield, Scale, Eye } from "lucide-react";

export function TrustFooter() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Ranking is based on fit and evidence, not paid placement.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Assigna may recommend that you do not buy software yet.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Vendors cannot buy higher ranking. Ever.
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Assigna. Built &amp; designed by
          Deciwa.
        </div>
      </div>
    </footer>
  );
}
