"""Structured evidence objects.

Every piece of vendor evidence must conform to EvidenceObject.
This is the atomic unit of trust in Assigna's scoring pipeline.
"""

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, model_validator


class SourceType(str, Enum):
    CASE_STUDY = "case_study"
    DOCUMENTATION = "documentation"
    BENCHMARK = "benchmark"
    INTEGRATION_DOC = "integration_doc"
    PRICING_PAGE = "pricing_page"
    SECURITY_DOC = "security_doc"
    CUSTOMER_REFERENCE = "customer_reference"
    THIRD_PARTY_REPORT = "third_party_report"
    VENDOR_WEBSITE = "vendor_website"
    PILOT_RESULT = "pilot_result"


class VerificationStatus(str, Enum):
    VERIFIED = "verified"
    SELF_DECLARED = "self_declared"
    PENDING_REVIEW = "pending_review"
    DISPUTED = "disputed"
    EXPIRED = "expired"


class EvidenceObject(BaseModel):
    """Atomic unit of vendor evidence.

    Every claim a vendor makes must be backed by an EvidenceObject.
    The evidence engine scores, ages, and verifies these objects.
    """

    evidence_id: str = Field(description="Unique identifier")
    vendor_id: str = Field(description="Which vendor this evidence belongs to")
    category_id: str = Field(description="Which taxonomy category this supports")

    source_type: SourceType
    source_url: Optional[str] = Field(
        default=None, description="URL to the original source"
    )

    claim: str = Field(
        min_length=10,
        description="What the vendor claims (e.g. '95% accuracy on invoices')",
    )
    extracted_signal: str = Field(
        min_length=5,
        description="Normalized signal extracted from claim (e.g. 'accuracy_rate:0.95')",
    )

    confidence: float = Field(
        ge=0.0, le=1.0,
        description="How confident we are in this evidence (0.0-1.0)",
    )

    collected_date: date = Field(description="When this evidence was collected")
    freshness_days: int = Field(
        ge=0,
        description="Days since collection (auto-calculated or set)",
    )

    vendor_controlled: bool = Field(
        default=True,
        description="True if evidence comes from vendor's own materials",
    )
    verification_status: VerificationStatus = Field(
        default=VerificationStatus.SELF_DECLARED,
    )
    verified_by: Optional[str] = Field(
        default=None,
        description="Who verified this evidence (analyst name or 'assigna_team')",
    )
    verified_date: Optional[date] = None

    industry_match: Optional[str] = Field(
        default=None,
        description="Which industry this evidence is from (e.g. 'Manufacturing')",
    )
    company_size_match: Optional[str] = Field(
        default=None,
        description="Company size range this evidence covers (e.g. '200-500')",
    )

    buyer_relevance: float = Field(
        default=0.5, ge=0.0, le=1.0,
        description="How relevant this evidence is to the current buyer (contextual)",
    )
    category_relevance: float = Field(
        default=1.0, ge=0.0, le=1.0,
        description="How well this evidence maps to the category's evidence requirements",
    )

    measurable_outcome: Optional[str] = Field(
        default=None,
        description="Quantified outcome (e.g. 'Reduced processing time by 43%')",
    )

    @model_validator(mode="after")
    def check_verified_fields(self) -> "EvidenceObject":
        if self.verification_status == VerificationStatus.VERIFIED:
            if not self.verified_by:
                raise ValueError("verified evidence must have verified_by")
        return self

    @property
    def is_stale(self) -> bool:
        return self.freshness_days > 365

    @property
    def is_vendor_sourced(self) -> bool:
        return self.vendor_controlled

    @property
    def effective_confidence(self) -> float:
        """Confidence adjusted for freshness, source type, and verification."""
        base = self.confidence

        # Freshness decay
        if self.freshness_days > 365:
            base *= 0.6
        elif self.freshness_days > 180:
            base *= 0.85

        # Verification boost
        if self.verification_status == VerificationStatus.VERIFIED:
            base = min(1.0, base * 1.15)
        elif self.verification_status == VerificationStatus.SELF_DECLARED:
            base *= 0.8

        # Vendor-sourced penalty
        if self.vendor_controlled:
            base *= 0.9

        return round(min(1.0, base), 3)
