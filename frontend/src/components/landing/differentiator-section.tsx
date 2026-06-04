import { Badge } from "@/components/ui/badge";

export function DifferentiatorSection() {
  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Not &quot;best vendors&quot;
        </p>
        <h2 className="text-3xl font-bold mb-6">
          The right vendors for this problem, at this stage, under these
          constraints.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Badge variant="default">Why this?</Badge>
          <Badge variant="positive">Why now?</Badge>
          <Badge variant="warning">Why not others?</Badge>
          <Badge variant="evidence">What evidence?</Badge>
        </div>
      </div>
    </section>
  );
}
