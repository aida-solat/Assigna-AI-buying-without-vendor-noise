import { Shield, Scale, Eye } from "lucide-react";

const principles = [
  {
    icon: Shield,
    text: "Ranking is based on fit and evidence, not paid placement.",
  },
  {
    icon: Scale,
    text: "Assigna may recommend that you do not buy software yet.",
  },
  { icon: Eye, text: "Vendors cannot buy higher ranking. Ever." },
];

export function TrustFooter() {
  return (
    <footer className="relative border-t border-border py-14 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="surface rounded-xl p-5 flex items-start gap-3"
              >
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-8">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-[11px]">A</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Assigna
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Assigna · Built &amp; designed by
            Deciwa.
          </p>
        </div>
      </div>
    </footer>
  );
}
