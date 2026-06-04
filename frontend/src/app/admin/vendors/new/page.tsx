"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

export default function AdminNewVendorPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [deploymentModel, setDeploymentModel] = useState<string[]>([]);

  function addTag(
    list: string[],
    setter: (v: string[]) => void,
    value: string,
    inputSetter: (v: string) => void,
  ) {
    const v = value.trim();
    if (v && !list.includes(v)) setter([...list, v]);
    inputSetter("");
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/admin/vendors"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to vendors
      </Link>

      <h1 className="text-2xl font-bold mb-2">Add Vendor</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Add a new vendor to the curated database with evidence and capabilities.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Vendor name *
          </label>
          <input
            className="w-full h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. DocuAI"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description
          </label>
          <textarea
            className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this vendor do?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Website</label>
          <input
            className="w-full h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Categories</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(categories, setCategories, catInput, setCatInput);
                }
              }}
              placeholder="Add category and press Enter"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addTag(categories, setCategories, catInput, setCatInput)
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Badge key={c} variant="default" className="gap-1">
                {c}
                <button
                  onClick={() =>
                    setCategories(categories.filter((x) => x !== c))
                  }
                  className="hover:text-foreground cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Certifications
          </label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 h-10 px-3 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(
                    certifications,
                    setCertifications,
                    certInput,
                    setCertInput,
                  );
                }
              }}
              placeholder="e.g. ISO 27001, SOC 2"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addTag(
                  certifications,
                  setCertifications,
                  certInput,
                  setCertInput,
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {certifications.map((c) => (
              <Badge key={c} variant="muted" className="gap-1">
                {c}
                <button
                  onClick={() =>
                    setCertifications(certifications.filter((x) => x !== c))
                  }
                  className="hover:text-foreground cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Deployment model
          </label>
          <div className="flex flex-wrap gap-2">
            {["SaaS", "On-premise", "Hybrid", "Private cloud"].map((dm) => (
              <button
                key={dm}
                onClick={() =>
                  setDeploymentModel((prev) =>
                    prev.includes(dm)
                      ? prev.filter((x) => x !== dm)
                      : [...prev, dm],
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  deploymentModel.includes(dm)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {dm}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-muted/50 border-dashed">
          <p className="text-xs text-muted-foreground">
            Vendor data is managed via the backend data layer. Submit will
            persist once the admin API is connected.
          </p>
        </Card>

        <Button className="w-full" disabled>
          Save vendor
        </Button>
      </div>
    </div>
  );
}
