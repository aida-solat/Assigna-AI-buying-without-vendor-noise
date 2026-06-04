import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                A
              </span>
            </div>
            <span className="font-semibold text-base tracking-tight">
              Assigna
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/app"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/app/problems/new"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              New Problem
            </Link>
            <Link
              href="/app/briefs/sample"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Briefs
            </Link>
            <Link
              href="/app/settings"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
