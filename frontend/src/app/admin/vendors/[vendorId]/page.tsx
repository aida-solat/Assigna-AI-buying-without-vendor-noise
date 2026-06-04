"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { VendorSummary } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ExternalLink, Shield, Cloud } from "lucide-react";
import Link from "next/link";

export default function AdminVendorDetailPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: () => apiGet<VendorSummary[]>("/vendors"),
  });

  const vendor = vendors?.find((v) => v.vendor_id === vendorId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-8">
        <Link
          href="/admin/vendors"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to vendors
        </Link>
        <p className="text-muted-foreground">Vendor not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/vendors"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to vendors
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{vendor.vendor_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {vendor.description}
          </p>
        </div>
        {vendor.website && (
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Certifications</h3>
          </div>
          {vendor.certifications?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {vendor.certifications.map((c) => (
                <Badge key={c} variant="muted">
                  {c}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No certifications on file.
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Deployment</h3>
          </div>
          {vendor.deployment_model?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {vendor.deployment_model.map((d) => (
                <Badge key={d} variant="muted">
                  {d}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Unknown</p>
          )}
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="flex flex-wrap gap-1.5">
          {vendor.categories?.map((cat) => (
            <Badge key={cat} variant="default">
              {cat}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="bg-muted/50 border-dashed">
        <p className="text-xs text-muted-foreground">
          Evidence items and scoring profiles are managed via the backend. Edit
          capabilities will be connected here.
        </p>
      </Card>

      <div className="mt-6">
        <Button variant="outline" disabled>
          Edit vendor
        </Button>
      </div>
    </div>
  );
}
