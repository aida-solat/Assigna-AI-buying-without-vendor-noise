import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your account and preferences.
      </p>

      <div className="space-y-5">
        <Card>
          <h3 className="font-semibold text-sm mb-3">Current Plan</h3>
          <div className="flex items-center gap-3">
            <Badge variant="default">Free Diagnosis</Badge>
            <span className="text-sm text-muted-foreground">€0/problem</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Upgrade to Starter (€99) or Pro (€499) to unlock vendor names,
            scoring, comparison matrix, and PDF export.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              Upgrade to Starter
            </Button>
            <Button size="sm">Upgrade to Pro</Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm mb-3">Company Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Company name
              </label>
              <input
                className="w-full h-9 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Your company"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Email
              </label>
              <input
                className="w-full h-9 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="you@company.com"
                disabled
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Profile editing requires authentication. Coming soon.
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm mb-3">Data & Privacy</h3>
          <p className="text-xs text-muted-foreground">
            Your problem descriptions and diagnosis results are stored securely.
            Assigna does not share your data with vendors. Vendor ranking is
            based on fit and evidence, not paid placement.
          </p>
        </Card>
      </div>
    </div>
  );
}
