"""API request/response models."""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


# ─── Request Models ───────────────────────────────────────────────────────────


class BuyerProblemRequest(BaseModel):
    """Buyer problem intake — the entry point for assignment."""

    problem_description: str = Field(
        min_length=20,
        description="Natural language description of the buyer's problem",
        examples=["We manually enter data from invoices into our ERP. Our team processes hundreds of documents per week and the error rate is high."],
    )
    keywords: list[str] = Field(
        default_factory=list,
        description="Optional keywords to help classification",
    )
    signals: dict[str, Any] = Field(
        default_factory=dict,
        description="Structured signals (e.g., documents_per_week: 200, has_target_system: true)",
    )
    budget_eur: Optional[int] = Field(
        default=None, ge=0,
        description="Buyer's budget in EUR (optional)",
    )
    company_size: Optional[int] = Field(
        default=None, ge=1,
        description="Number of employees (optional)",
    )
    existing_systems: list[str] = Field(
        default_factory=list,
        description="Systems buyer currently uses (e.g., SAP, Salesforce, Zendesk)",
    )
    tier: str = Field(
        default="free",
        pattern=r"^(free|starter|pro)$",
        description="Output tier: free (diagnosis only), starter (vendor names), pro (full brief)",
    )


# ─── Response Models ──────────────────────────────────────────────────────────


class DiagnosisResponse(BaseModel):
    """Category diagnosis result."""

    category_id: str
    category_name: str
    confidence: float
    rank: str
    positive_signals_matched: list[str]
    negative_signals_matched: list[str]
    explanation: str


class VendorRecommendationResponse(BaseModel):
    """A vendor recommendation in the brief."""

    rank: int
    vendor_name: str
    vendor_id: str
    overall_score: float
    fit_summary: str
    strengths: list[str]
    concerns: list[str]
    score_breakdown: dict[str, float]
    decision_questions: list[str]


class DecisionBriefResponse(BaseModel):
    """Full API response for a buyer problem."""

    brief_id: str
    tier: str
    problem_summary: str
    diagnosed_category: str
    diagnosed_category_name: str
    diagnosis_confidence: float
    diagnosis_explanation: str
    top_candidates: list[DiagnosisResponse] = Field(default_factory=list)
    recommendations: list[VendorRecommendationResponse] = Field(default_factory=list)
    not_recommended_reasons: list[str] = Field(default_factory=list)
    decision_questions: list[str] = Field(default_factory=list)
    red_flags_to_watch: list[str] = Field(default_factory=list)
    next_steps: list[str] = Field(default_factory=list)


class TaxonomyCategoryResponse(BaseModel):
    """Public taxonomy category info."""

    category_id: str
    category_name: str
    category_type: str
    parent_category: str
    description: str
    buyer_problem_patterns: list[str]
    typical_use_cases: list[str]
    not_for: list[str]
    implementation_complexity: str
    budget_band: dict[str, Any]


class VendorSummaryResponse(BaseModel):
    """Public vendor summary."""

    vendor_id: str
    vendor_name: str
    description: str
    website: str
    categories: list[str]
    certifications: list[str]
    deployment_model: list[str]


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str
    categories_loaded: int
    vendors_loaded: int
