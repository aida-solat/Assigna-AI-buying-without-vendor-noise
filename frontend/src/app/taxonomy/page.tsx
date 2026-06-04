import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { TaxonomyBrowser } from "@/components/taxonomy/taxonomy-browser";

export default function TaxonomyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Solution Taxonomy</h1>
        <p className="text-muted-foreground mb-10">
          Assigna maps every AI business problem to one of these evidence-scored
          categories. Product categories are checked before custom solutions.
        </p>
        <TaxonomyBrowser />
      </main>
      <TrustFooter />
    </>
  );
}
