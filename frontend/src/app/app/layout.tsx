import Link from "next/link";

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/problems/new", label: "New Problem" },
  { href: "/app/briefs/sample", label: "Briefs" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient Decision Engine backdrop */}
      <div className="fixed inset-0 engine-glow pointer-events-none" />
      <div className="fixed inset-0 bg-grid pointer-events-none" />

      <header className="relative border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_4px_16px_-4px_rgba(124,108,255,0.7)]">
              <span className="text-white font-bold text-xs">A</span>
              <span className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
            </div>
            <span className="font-semibold text-base tracking-tight">
              Assigna
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="relative flex-1">{children}</main>
    </div>
  );
}
