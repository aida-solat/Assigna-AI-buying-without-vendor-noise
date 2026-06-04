"""Pydantic models for VendorProfile.

Vendors are curated by the Assigna team (editorial model).
Each vendor has evidence items that map to taxonomy evidence_requirements.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class EvidenceStatus(str, Enum):
    VERIFIED = "verified"
    SELF_DECLARED = "self_declared"
    PENDING_REVIEW = "pending_review"


class VendorEvidence(BaseModel):
    """A piece of evidence a vendor provides for a specific category."""

    type: str = Field(description="Must match evidence_requirement.type in taxonomy")
    description: str = Field(min_length=5)
    quality: float = Field(ge=0.0, le=1.0, description="Assessed quality score 0.0-1.0")
    status: EvidenceStatus = Field(default=EvidenceStatus.SELF_DECLARED)
    source_url: Optional[str] = None
    notes: str = ""


class VendorCapability(BaseModel):
    """Vendor capability mapped to a taxonomy category."""

    category_id: str = Field(description="Taxonomy category this capability relates to")
    strength: float = Field(
        ge=0.0, le=1.0,
        description="How strong vendor is in this category (0.0-1.0)",
    )
    evidence: list[VendorEvidence] = Field(default_factory=list)
    integrations_supported: list[str] = Field(default_factory=list)
    typical_timeline_weeks: Optional[int] = None
    pricing_notes: str = ""


class VendorProfile(BaseModel):
    """Complete vendor profile for Assigna assignment engine."""

    vendor_id: str = Field(pattern=r"^[a-z][a-z0-9_-]+$")
    vendor_name: str = Field(min_length=2)
    description: str = Field(min_length=20)
    website: str = Field(pattern=r"^https?://")
    headquarters: str = ""
    founded_year: Optional[int] = None
    company_size: Optional[str] = None  # "1-10", "11-50", "51-200", "201-500", "500+"

    categories: list[VendorCapability] = Field(
        min_length=1,
        description="Categories this vendor serves with evidence",
    )

    languages_supported: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    deployment_model: list[str] = Field(
        default_factory=list,
        description="cloud, on-premise, hybrid",
    )

    red_flags: list[str] = Field(
        default_factory=list,
        description="Known limitations or concerns (Assigna editorial notes)",
    )

    def get_capability(self, category_id: str) -> Optional[VendorCapability]:
        """Get vendor capability for a specific category."""
        for cap in self.categories:
            if cap.category_id == category_id:
                return cap
        return None

    @property
    def category_ids(self) -> list[str]:
        return [c.category_id for c in self.categories]
