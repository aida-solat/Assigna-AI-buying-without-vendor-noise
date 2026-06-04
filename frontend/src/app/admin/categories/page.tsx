"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { TaxonomyCategory } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => apiGet<TaxonomyCategory[]>("/taxonomy"),
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Taxonomy Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Read-only view. Taxonomy is versioned in code — do not edit via UI
          yet.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {categories?.map((cat) => (
            <Card key={cat.category_id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm">
                    {cat.category_name}
                  </h3>
                  <Badge variant="muted">{cat.category_type}</Badge>
                  <Badge variant="muted">{cat.implementation_complexity}</Badge>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  €{(cat.budget_band.min / 1000).toFixed(0)}K – €
                  {(cat.budget_band.max / 1000).toFixed(0)}K
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cat.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
