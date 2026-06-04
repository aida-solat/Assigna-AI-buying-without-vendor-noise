"""Pydantic models for SolutionTaxonomy.

Every taxonomy category MUST validate against TaxonomyCategory.
These models are the single source of truth for category shape.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator


class CategoryType(str, Enum):
    PRODUCT_CATEGORY = "product_category"
    SERVICE_DELIVERY_MODEL = "service_delivery_model"
    HYBRID = "hybrid"


class ImplementationComplexity(str, Enum):
    LOW = "low"
    LOW_MEDIUM = "low-medium"
    MEDIUM = "medium"
    MEDIUM_HIGH = "medium-high"
    HIGH = "high"


class BudgetBand(BaseModel):
    min: int = Field(ge=0, description="Minimum budget in currency")
    max: int = Field(ge=0, description="Maximum budget in currency")
    currency: str = Field(default="EUR", pattern=r"^[A-Z]{3}$")
    model: str = Field(description="Pricing model description")

    @model_validator(mode="after")
    def min_less_than_max(self) -> "BudgetBand":
        if self.min >= self.max:
            raise ValueError(f"budget_band.min ({self.min}) must be < max ({self.max})")
        return self


class TimelineWeeks(BaseModel):
    min: int = Field(ge=1, description="Minimum weeks to implement")
    max: int = Field(ge=1, description="Maximum weeks to implement")

    @model_validator(mode="after")
    def min_less_than_max(self) -> "TimelineWeeks":
        if self.min >= self.max:
            raise ValueError(f"timeline.min ({self.min}) must be < max ({self.max})")
        return self


class EvidenceRequirement(BaseModel):
    type: str = Field(min_length=1, description="Evidence type identifier (snake_case)")
    description: str = Field(min_length=10, description="Human-readable description")
    weight: float = Field(ge=0.0, le=1.0, description="Weight for scoring (0.0-1.0)")
    required: bool = Field(description="Whether this evidence is mandatory for assignment")

    @field_validator("type")
    @classmethod
    def type_is_snake_case(cls, v: str) -> str:
        if not v.replace("_", "").isalpha():
            raise ValueError(f"evidence type must be snake_case, got: {v}")
        return v


class DiagnosticTriggers(BaseModel):
    positive_signals: list[str] = Field(min_length=3)
    negative_signals: list[str] = Field(min_length=2)
    minimum_thresholds: dict[str, Any] = Field(
        description="Key-value thresholds that should be met for this category to apply"
    )
    disqualifiers: list[str] = Field(
        min_length=2,
        description="Hard disqualifiers — if any match, category is NOT recommended",
    )


class TaxonomyCategory(BaseModel):
    category_id: str = Field(min_length=3, pattern=r"^[a-z][a-z0-9_]+$")
    category_name: str = Field(min_length=5)
    category_type: CategoryType
    parent_category: str = Field(min_length=3)
    description: str = Field(min_length=50)

    buyer_problem_patterns: list[str] = Field(min_length=3)
    diagnostic_triggers: DiagnosticTriggers

    typical_use_cases: list[str] = Field(min_length=3)
    not_for: list[str] = Field(min_length=3)
    required_buyer_inputs: list[str] = Field(min_length=4)
    typical_integrations: list[str] = Field(min_length=3)
    buyer_roles: list[str] = Field(min_length=3)
    success_metrics: list[str] = Field(min_length=3)

    implementation_complexity: ImplementationComplexity
    typical_timeline_weeks: TimelineWeeks
    budget_band: BudgetBand

    evidence_requirements: list[EvidenceRequirement] = Field(min_length=3)

    red_flags_for_buyer: list[str] = Field(min_length=3)
    red_flags_for_vendor: list[str] = Field(min_length=3)
    vendor_capability_requirements: list[str] = Field(min_length=4)
    decision_questions: list[str] = Field(min_length=5)

    adjacent_categories: list[str] = Field(min_length=1)
    differentiation_from_adjacent: dict[str, str] = Field(
        description="Key: vs_<category_id>, Value: differentiation explanation"
    )

    @field_validator("evidence_requirements")
    @classmethod
    def evidence_weights_valid(cls, v: list[EvidenceRequirement]) -> list[EvidenceRequirement]:
        total_weight = sum(e.weight for e in v)
        if not (0.95 <= total_weight <= 1.05):
            raise ValueError(
                f"evidence_requirements weights must sum to ~1.0, got {total_weight:.2f}"
            )
        required_count = sum(1 for e in v if e.required)
        if required_count < 2:
            raise ValueError("At least 2 evidence_requirements must be required=true")
        return v

    @field_validator("adjacent_categories")
    @classmethod
    def adjacent_categories_are_snake_case(cls, v: list[str]) -> list[str]:
        for cat_id in v:
            if cat_id == "all_product_categories":
                continue
            if not cat_id.replace("_", "").isalpha():
                raise ValueError(f"adjacent_category must be snake_case id, got: {cat_id}")
        return v


class TaxonomyIndex(BaseModel):
    """Auto-generated index over all loaded categories."""

    categories: dict[str, str] = Field(
        description="category_id → JSON filename"
    )
    parent_categories: dict[str, list[str]] = Field(
        description="parent_category → list of category_ids"
    )
    category_types: dict[str, list[str]] = Field(
        description="category_type → list of category_ids"
    )
    adjacency_graph: dict[str, list[str]] = Field(
        description="category_id → list of adjacent category_ids"
    )
