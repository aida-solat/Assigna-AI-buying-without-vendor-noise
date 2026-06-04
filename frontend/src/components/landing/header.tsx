import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Assigna</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/use-cases"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Use Cases
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/sample-brief"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sample Brief
          </Link>
          <Link
            href="/taxonomy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Categories
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/app/problems/new">
            <Button size="md">Start Diagnosis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
