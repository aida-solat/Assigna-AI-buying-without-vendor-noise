import { z } from "zod";

export const BuyerProblemInputSchema = z.object({
  problem_description: z
    .string()
    .min(20, { error: "Problem description must be at least 20 characters" }),
  keywords: z.array(z.string()).default([]),
  signals: z.record(z.string(), z.unknown()).default({}),
  budget_eur: z.number().positive().optional(),
  company_size: z.number().positive().optional(),
  existing_systems: z.array(z.string()).default([]),
  tier: z.enum(["free", "starter", "pro"]).default("free"),
});

export type ValidatedBuyerProblemInput = z.infer<
  typeof BuyerProblemInputSchema
>;

export const CompanyContextSchema = z.object({
  industry: z.string().min(1, { error: "Industry is required" }),
  companySize: z.string().min(1, { error: "Company size is required" }),
  region: z.string().min(1, { error: "Region is required" }),
  problemStatement: z.string().min(20),
  currentTools: z.array(z.string()),
  dataSensitivity: z.enum(["low", "medium", "high"]).default("medium"),
  internalTechCapacity: z
    .enum(["none", "basic", "moderate", "strong"])
    .default("basic"),
  budgetRange: z.object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
    currency: z.enum(["EUR", "USD", "GBP"]).default("EUR"),
  }),
  urgency: z
    .enum(["exploring", "planning", "ready_to_buy"])
    .default("exploring"),
  timelineMonths: z.number().positive().default(6),
});

export type ValidatedCompanyContext = z.infer<typeof CompanyContextSchema>;

export const AdminVendorSchema = z.object({
  vendor_name: z.string().min(2, { error: "Vendor name is required" }),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters" }),
  website: z.string().url({ error: "Must be a valid URL" }),
  categories: z
    .array(z.string())
    .min(1, { error: "At least one category is required" }),
  industries_served: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  company_size_fit: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  deployment_model: z.array(z.string()).default([]),
  compliance_certifications: z.array(z.string()).default([]),
});

export type ValidatedAdminVendor = z.infer<typeof AdminVendorSchema>;

export const EvidenceItemSchema = z.object({
  type: z.string().min(1, { error: "Evidence type is required" }),
  description: z.string().min(5, { error: "Description is required" }),
  industryMatch: z.string().default(""),
  companySizeMatch: z.string().default(""),
  measurableOutcome: z.string().default(""),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  qualityScore: z.number().min(0).max(1).default(0.5),
  freshnessDays: z.number().nonnegative().default(180),
  verifiedByAssigna: z.boolean().default(false),
});

export type ValidatedEvidenceItem = z.infer<typeof EvidenceItemSchema>;
