import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-border bg-card flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-secondary rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">A</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <AdminNavLink href="/admin">Dashboard</AdminNavLink>
          <AdminNavLink href="/admin/vendors">Vendors</AdminNavLink>
          <AdminNavLink href="/admin/categories">Categories</AdminNavLink>
          <AdminNavLink href="/admin/briefs">Briefs</AdminNavLink>
          <AdminNavLink href="/admin/evidence">Evidence</AdminNavLink>
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}

function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}
