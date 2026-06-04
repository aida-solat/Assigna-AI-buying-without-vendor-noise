export type CategoryType =
  | "product_category"
  | "service_delivery_model"
  | "hybrid";

export type Complexity =
  | "low"
  | "low-medium"
  | "medium"
  | "medium-high"
  | "high";

export type Urgency = "exploring" | "planning" | "ready_to_buy";

export type DataSensitivity = "low" | "medium" | "high";

export type TechCapacity = "none" | "basic" | "moderate" | "strong";

export interface BudgetBand {
  min: number;
  max: number;
  currency: string;
  model: string;
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: "EUR" | "USD" | "GBP";
}

export interface TaxonomyCategory {
  category_id: string;
  category_name: string;
  category_type: CategoryType;
  parent_category: string;
  description: string;
  buyer_problem_patterns: string[];
  typical_use_cases: string[];
  not_for: string[];
  implementation_complexity: Complexity;
  budget_band: BudgetBand;
  diagnostic_triggers?: string[];
  evidence_requirements?: EvidenceRequirement[];
  red_flags?: string[];
  decision_questions?: string[];
  adjacent_categories?: string[];
  differentiation_from_adjacent?: string[];
}

export interface BuyerProblem {
  id: string;
  companyName?: string;
  industry: string;
  companySize: string;
  region: string;
  problemStatement: string;
  painPoints: string[];
  currentTools: string[];
  dataSensitivity: DataSensitivity;
  internalTechCapacity: TechCapacity;
  budgetRange: BudgetRange;
  urgency: Urgency;
  timelineMonths: number;
  decisionMakers: string[];
  createdAt: string;
}

export interface CategoryFitResult {
  categoryId: string;
  categoryName: string;
  categoryType: CategoryType;
  fitScore: number;
  confidenceScore: number;
  reasons: string[];
  warnings: string[];
  budgetBand: BudgetBand;
  timelineWeeks: { min: number; max: number };
  complexity: Complexity;
}

export interface ExcludedCategory {
  categoryName: string;
  reasons: string[];
  alternatives: string[];
}

export interface DiagnosisResult {
  id: string;
  buyerProblemId: string;
  primaryCategory: CategoryFitResult;
  secondaryCategories: CategoryFitResult[];
  excludedCategories: ExcludedCategory[];
  confidenceScore: number;
  method: "llm_classified" | "rule_matched" | "hybrid";
  diagnosisReasoning: string;
  exclusionReasoning: string;
  successCriteria: string[];
  constraints: string[];
  requiredIntegrations: string[];
  riskFactors: string[];
}

export interface VendorAssignment {
  id: string;
  vendorId: string;
  vendorName: string;
  rank: number;
  scores: {
    needFit: number;
    industryFit: number;
    integrationFit: number;
    evidenceQuality: number;
    budgetFit: number;
    timingFit: number;
    riskPenalty: number;
    overall: number;
  };
  reasoning: {
    whyThis: string[];
    whyNow: string[];
    whyNotOthers: string[];
    risks: string[];
    questionsForVendor: string[];
  };
  recommendedAction: string;
}

export interface EvidenceItem {
  type: string;
  description: string;
  qualityScore: number;
  verifiedByAssigna: boolean;
  industryMatch: string;
  companySizeMatch: string;
  freshnessDays: number;
  outcome: string;
  sourceUrl?: string;
}

export interface EvidenceRequirement {
  type: string;
  description: string;
  weight: number;
  required: boolean;
  status?: "missing" | "provided" | "verified";
}

export interface ExtractedSignal {
  label: string;
  detected: boolean;
  category?: string;
}

export interface DiagnosisCandidate {
  category_id: string;
  category_name: string;
  confidence: number;
  rank: string;
  positive_signals_matched: string[];
  negative_signals_matched: string[];
  explanation: string;
}

export interface VendorRecommendation {
  rank: number;
  vendor_name: string;
  vendor_id: string;
  overall_score: number;
  fit_summary: string;
  strengths: string[];
  concerns: string[];
  score_breakdown: Record<string, number>;
  decision_questions: string[];
}

export interface DecisionBriefResponse {
  brief_id: string;
  tier: string;
  problem_summary: string;
  diagnosed_category: string;
  diagnosed_category_name: string;
  diagnosis_confidence: number;
  diagnosis_explanation: string;
  top_candidates: DiagnosisCandidate[];
  recommendations: VendorRecommendation[];
  not_recommended_reasons: string[];
  decision_questions: string[];
  red_flags_to_watch: string[];
  next_steps: string[];
}

export interface BuyerProblemInput {
  problem_description: string;
  keywords: string[];
  signals: Record<string, unknown>;
  budget_eur?: number;
  company_size?: number;
  existing_systems: string[];
  tier: "free" | "starter" | "pro";
}

export interface VendorSummary {
  vendor_id: string;
  vendor_name: string;
  description: string;
  website: string;
  categories: string[];
  certifications: string[];
  deployment_model: string[];
}

export interface VendorDetail extends VendorSummary {
  industries_served: string[];
  regions: string[];
  company_size_fit: string[];
  integrations: string[];
  price_range: BudgetBand;
  evidence_items: EvidenceItem[];
  compliance_certifications: string[];
  source: "curated" | "verified" | "self_registered";
  last_verified: string;
}
