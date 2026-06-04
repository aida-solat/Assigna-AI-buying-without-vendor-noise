"use client";

import { Card } from "@/components/ui/card";

interface VendorFilterPanelProps {
  budgetFit: string;
  integrationFit: string;
  riskLevel: string;
  onBudgetChange: (v: string) => void;
  onIntegrationChange: (v: string) => void;
  onRiskChange: (v: string) => void;
}

const RISK_OPTIONS = ["Any", "Low", "Medium", "High"];
const BUDGET_OPTIONS = ["Any", "Good", "Stretch", "Over"];
const INTEGRATION_OPTIONS = ["Any", "Verified", "Pending", "Unknown"];

export function VendorFilterPanel({
  budgetFit,
  integrationFit,
  riskLevel,
  onBudgetChange,
  onIntegrationChange,
  onRiskChange,
}: VendorFilterPanelProps) {
  return (
    <Card className="sticky top-20 space-y-5">
      <h3 className="text-sm font-semibold">Filters & Constraints</h3>

      <FilterGroup
        label="Budget fit"
        options={BUDGET_OPTIONS}
        selected={budgetFit}
        onSelect={onBudgetChange}
      />

      <FilterGroup
        label="Integration status"
        options={INTEGRATION_OPTIONS}
        selected={integrationFit}
        onSelect={onIntegrationChange}
      />

      <FilterGroup
        label="Risk tolerance"
        options={RISK_OPTIONS}
        selected={riskLevel}
        onSelect={onRiskChange}
      />

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Ranked by fit for your problem. Vendors cannot buy higher ranking.
        </p>
      </div>
    </Card>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              selected === opt
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
