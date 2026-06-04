"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { VendorSummary } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Shield, Cloud, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminVendorsPage() {
  const { data: vendors, isLoading } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: () => apiGet<VendorSummary[]>("/vendors"),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Vendor Curation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated vendor profiles with evidence.
          </p>
        </div>
        <Link href="/admin/vendors/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Vendor
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {vendors?.map((vendor) => (
            <Link
              key={vendor.vendor_id}
              href={`/admin/vendors/${vendor.vendor_id}`}
            >
              <Card className="p-5 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">
                      {vendor.vendor_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vendor.description}
                    </p>
                  </div>
                  {vendor.website && (
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    <span>
                      {vendor.certifications?.join(", ") || "No certifications"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cloud className="h-3.5 w-3.5" />
                    <span>
                      {vendor.deployment_model?.join(", ") || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {vendor.categories?.map((cat) => (
                    <Badge key={cat} variant="default">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
