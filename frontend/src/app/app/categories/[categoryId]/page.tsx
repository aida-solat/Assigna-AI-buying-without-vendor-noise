"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiGet } from "@/lib/api";
import type { TaxonomyCategory } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "fit" | "evidence" | "red-flags" | "questions" | "adjacent";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "fit", label: "Fit Rules" },
  { id: "evidence", label: "Evidence" },
  { id: "red-flags", label: "Red Flags" },
  { id: "questions", label: "Questions" },
  { id: "adjacent", label: "Adjacent" },
];

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const [tab, setTab] = useState<Tab>("overview");

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => apiGet<TaxonomyCategory>(`/taxonomy/${categoryId}`),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{category.category_name}</h1>
          <Badge variant="muted">{category.category_type}</Badge>
          <Badge variant="muted">{category.implementation_complexity}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {category.description}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Budget: €{(category.budget_band.min / 1000).toFixed(0)}K – €
          {(category.budget_band.max / 1000).toFixed(0)}K
        </p>
      </div>

      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              tab === t.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-sm mb-3">What this category solves</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-sm mb-3">Typical use cases</h3>
            <ul className="space-y-2">
              {category.typical_use_cases.map((uc) => (
                <li key={uc} className="text-sm text-muted-foreground flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-positive shrink-0 mt-0.5" />
                  {uc}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "fit" && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-sm mb-3">When this fits</h3>
            <ul className="space-y-2">
              {category.buyer_problem_patterns.map((p) => (
                <li key={p} className="text-sm text-muted-foreground flex gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-positive shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-sm mb-3">When this does NOT fit</h3>
            <ul className="space-y-2">
              {category.not_for.map((nf) => (
                <li key={nf} className="text-sm text-muted-foreground flex gap-2">
                  <XCircle className="h-3.5 w-3.5 text-risk shrink-0 mt-0.5" />
                  {nf}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "evidence" && (
        <Card>
          <h3 className="font-semibold text-sm mb-3">
            Evidence to demand from vendors
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            For this category, require these before making a decision:
          </p>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground flex gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-evidence shrink-0 mt-0.5" />
              Accuracy benchmark on your document/data types
            </li>
            <li className="text-sm text-muted-foreground flex gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-evidence shrink-0 mt-0.5" />
              Same-industry case study with measurable outcomes
            </li>
            <li className="text-sm text-muted-foreground flex gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-evidence shrink-0 mt-0.5" />
              Integration proof with your current systems
            </li>
            <li className="text-sm text-muted-foreground flex gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-evidence shrink-0 mt-0.5" />
              Pilot availability on your real data
            </li>
            <li className="text-sm text-muted-foreground flex gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-evidence shrink-0 mt-0.5" />
              Compliance certifications relevant to your region
            </li>
          </ul>
        </Card>
      )}

      {tab === "red-flags" && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-risk" />
            <h3 className="font-semibold text-sm">Red flags to watch</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground">
              - Vendor cannot provide accuracy metrics on similar document types
            </li>
            <li className="text-sm text-muted-foreground">
              - No reference customer in your industry or region
            </li>
            <li className="text-sm text-muted-foreground">
              - Requires long integration timeline with no pilot phase
            </li>
            <li className="text-sm text-muted-foreground">
              - Pricing not transparent or requires multi-year lock-in
            </li>
            <li className="text-sm text-muted-foreground">
              - Claims to solve adjacent problems without specialization
            </li>
          </ul>
        </Card>
      )}

      {tab === "questions" && (
        <Card>
          <h3 className="font-semibold text-sm mb-3">Decision questions</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Ask these before committing to a vendor in this category:
          </p>
          <ol className="space-y-2 list-decimal list-inside">
            <li className="text-sm text-muted-foreground">
              What is your accuracy rate on our specific data types?
            </li>
            <li className="text-sm text-muted-foreground">
              Can you integrate with our current systems?
            </li>
            <li className="text-sm text-muted-foreground">
              What does implementation look like for our company size?
            </li>
            <li className="text-sm text-muted-foreground">
              Do you offer a pilot on our real data before contract?
            </li>
            <li className="text-sm text-muted-foreground">
              What happens when automation confidence is low?
            </li>
            <li className="text-sm text-muted-foreground">
              What is your pricing model and total cost of ownership?
            </li>
          </ol>
        </Card>
      )}

      {tab === "adjacent" && (
        <Card>
          <h3 className="font-semibold text-sm mb-3">Adjacent categories</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Problems in this area sometimes overlap with:
          </p>
          <div className="space-y-3">
            {category.parent_category && (
              <div>
                <p className="text-xs text-muted-foreground">Parent:</p>
                <Badge variant="default">{category.parent_category}</Badge>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Use the diagnosis flow to determine which category is primary for
              your specific problem.
            </p>
          </div>
        </Card>
      )}

      <div className="mt-8">
        <Link href="/app/problems/new">
          <Button>Check if this category fits your problem</Button>
        </Link>
      </div>
    </div>
  );
}
