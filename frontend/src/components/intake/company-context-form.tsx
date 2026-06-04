"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SYSTEM_OPTIONS = [
  "SAP", "SAP S/4HANA", "Oracle", "Microsoft Dynamics", "NetSuite",
  "Salesforce", "Microsoft 365", "Google Workspace", "Zendesk", "Intercom",
  "Freshdesk", "HubSpot", "Jira", "ServiceNow", "Slack", "Confluence",
  "SharePoint", "Xero", "QuickBooks",
];

const BUDGET_RANGES = [
  { label: "< €20K", value: 15000 },
  { label: "€20K - €50K", value: 35000 },
  { label: "€50K - €150K", value: 100000 },
  { label: "€150K - €500K", value: 300000 },
  { label: "> €500K", value: 600000 },
];

const COMPANY_SIZES = [
  { label: "1-50", value: 25 },
  { label: "50-200", value: 125 },
  { label: "200-500", value: 350 },
  { label: "500-2000", value: 1000 },
  { label: "2000+", value: 3000 },
];

const INDUSTRIES = [
  "Manufacturing", "Financial Services", "Professional Services",
  "Logistics & Supply Chain", "Technology / SaaS", "Healthcare",
  "Retail & E-commerce", "Energy & Utilities", "Public Sector", "Other",
];

const REGIONS = ["DACH", "Nordics", "Western EU", "UK", "North America", "Other"];

const URGENCIES = [
  { label: "Exploring", value: "exploring" },
  { label: "Planning", value: "planning" },
  { label: "Ready to buy", value: "ready_to_buy" },
];

const TIMELINES = [
  { label: "< 3 months", value: 2 },
  { label: "3-6 months", value: 5 },
  { label: "6-12 months", value: 9 },
  { label: "> 12 months", value: 15 },
];

const DATA_SENSITIVITY = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High (PII/financial)", value: "high" },
];

const TECH_CAPACITY = [
  { label: "No internal tech", value: "none" },
  { label: "Basic IT", value: "basic" },
  { label: "Moderate", value: "moderate" },
  { label: "Strong engineering", value: "strong" },
];

export interface CompanyContextValues {
  selectedSystems: string[];
  budget?: number;
  companySize?: number;
  industry: string;
  region: string;
  urgency: string;
  timeline?: number;
  dataSensitivity: string;
  techCapacity: string;
  tier: "free" | "starter" | "pro";
}

interface CompanyContextFormProps {
  values: CompanyContextValues;
  onChange: (values: CompanyContextValues) => void;
  onBack: () => void;
  onContinue: () => void;
  onSubmit: () => void;
  hasCategories: boolean;
  processing: boolean;
}

function ChipSelector<T extends string | number>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { label: string; value: T }[];
  selected: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onSelect(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              selected === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StringChipSelector({
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
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
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

function MultiChipSelector({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              selected.includes(opt)
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

export function CompanyContextForm({
  values,
  onChange,
  onBack,
  onContinue,
  onSubmit,
  hasCategories,
  processing,
}: CompanyContextFormProps) {
  const update = (partial: Partial<CompanyContextValues>) =>
    onChange({ ...values, ...partial });

  return (
    <>
      <MultiChipSelector
        label="Current systems"
        options={SYSTEM_OPTIONS}
        selected={values.selectedSystems}
        onToggle={(sys) =>
          update({
            selectedSystems: values.selectedSystems.includes(sys)
              ? values.selectedSystems.filter((s) => s !== sys)
              : [...values.selectedSystems, sys],
          })
        }
      />

      <ChipSelector
        label="Budget range"
        options={BUDGET_RANGES}
        selected={values.budget}
        onSelect={(v) => update({ budget: v })}
      />

      <ChipSelector
        label="Company size"
        options={COMPANY_SIZES}
        selected={values.companySize}
        onSelect={(v) => update({ companySize: v })}
      />

      <StringChipSelector
        label="Industry"
        options={INDUSTRIES}
        selected={values.industry}
        onSelect={(v) => update({ industry: v })}
      />

      <StringChipSelector
        label="Region"
        options={REGIONS}
        selected={values.region}
        onSelect={(v) => update({ region: v })}
      />

      <ChipSelector
        label="Urgency"
        options={URGENCIES}
        selected={values.urgency}
        onSelect={(v) => update({ urgency: v })}
      />

      <ChipSelector
        label="Timeline"
        options={TIMELINES}
        selected={values.timeline}
        onSelect={(v) => update({ timeline: v })}
      />

      <ChipSelector
        label="Data sensitivity"
        options={DATA_SENSITIVITY}
        selected={values.dataSensitivity}
        onSelect={(v) => update({ dataSensitivity: v })}
      />

      <ChipSelector
        label="Internal technical capacity"
        options={TECH_CAPACITY}
        selected={values.techCapacity}
        onSelect={(v) => update({ techCapacity: v })}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Brief tier</label>
        <div className="flex gap-2">
          {(["free", "starter", "pro"] as const).map((t) => (
            <button
              key={t}
              onClick={() => update({ tier: t })}
              className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                values.tier === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {t === "free"
                ? "Free Diagnosis"
                : t === "starter"
                  ? "Starter €99"
                  : "Pro €499"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        {hasCategories ? (
          <Button size="lg" onClick={onContinue}>
            Continue to operational details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" onClick={onSubmit} disabled={processing}>
            Check category fit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}
