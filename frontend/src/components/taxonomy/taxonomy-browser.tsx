"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { TaxonomyCategory } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Layers, Wrench, Puzzle } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  product_category: <Layers className="h-4 w-4 text-primary" />,
  service_delivery_model: <Wrench className="h-4 w-4 text-evidence" />,
  hybrid: <Puzzle className="h-4 w-4 text-warning" />,
};

const typeLabels: Record<string, string> = {
  product_category: "Product",
  service_delivery_model: "Service",
  hybrid: "Hybrid",
};

export function TaxonomyBrowser() {
  const { data, isLoading } = useQuery({
    queryKey: ["taxonomy"],
    queryFn: () => apiGet<TaxonomyCategory[]>("/taxonomy"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data?.map((cat) => (
        <Card key={cat.category_id} className="hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3 mb-3">
            {typeIcons[cat.category_type]}
            <div className="flex-1">
              <h3 className="font-semibold text-base">{cat.category_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="muted">{typeLabels[cat.category_type]}</Badge>
                <Badge variant="muted">{cat.implementation_complexity}</Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {cat.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Budget: €{(cat.budget_band.min / 1000).toFixed(0)}K - €
              {(cat.budget_band.max / 1000).toFixed(0)}K
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
