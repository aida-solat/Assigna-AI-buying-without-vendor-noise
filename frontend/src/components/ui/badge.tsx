import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "positive" | "warning" | "risk" | "evidence" | "muted";

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  positive: "bg-positive/10 text-positive",
  warning: "bg-warning/10 text-warning",
  risk: "bg-risk/10 text-risk",
  evidence: "bg-evidence/10 text-evidence",
  muted: "bg-muted text-muted-foreground",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
