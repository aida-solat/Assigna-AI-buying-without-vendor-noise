"""Source registry — reliability profiles for different evidence source types.

Not all evidence sources are equal. A third-party benchmark is more
trustworthy than a vendor's own marketing page. This module defines
source-type weights and computes source-adjusted evidence quality.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.evidence.schema import EvidenceObject, SourceType


# Source reliability weights: how trustworthy is each source type?
SOURCE_RELIABILITY: dict[SourceType, float] = {
    SourceType.THIRD_PARTY_REPORT: 0.95,
    SourceType.CUSTOMER_REFERENCE: 0.90,
    SourceType.BENCHMARK: 0.85,
    SourceType.PILOT_RESULT: 0.85,
    SourceType.INTEGRATION_DOC: 0.80,
    SourceType.CASE_STUDY: 0.75,
    SourceType.SECURITY_DOC: 0.75,
    SourceType.DOCUMENTATION: 0.65,
    SourceType.PRICING_PAGE: 0.50,
    SourceType.VENDOR_WEBSITE: 0.40,
}


@dataclass
class SourceAssessment:
    """Assessment of a single evidence source."""

    evidence_id: str
    source_type: SourceType
    reliability: float  # 0.0-1.0
    vendor_controlled: bool
    adjusted_quality: float  # quality × reliability × verification
    notes: str


class SourceRegistry:
    """Evaluates evidence quality based on source type and provenance."""

    def assess(self, evidence: EvidenceObject) -> SourceAssessment:
        """Assess a single evidence object's source reliability."""
        reliability = SOURCE_RELIABILITY.get(evidence.source_type, 0.5)

        # Adjust for vendor control
        if evidence.vendor_controlled:
            reliability *= 0.85

        # Adjust for verification
        if evidence.verification_status.value == "verified":
            reliability = min(1.0, reliability * 1.1)
        elif evidence.verification_status.value == "disputed":
            reliability *= 0.4

        adjusted = round(evidence.confidence * reliability, 3)

        notes = self._build_notes(evidence, reliability)

        return SourceAssessment(
            evidence_id=evidence.evidence_id,
            source_type=evidence.source_type,
            reliability=round(reliability, 3),
            vendor_controlled=evidence.vendor_controlled,
            adjusted_quality=adjusted,
            notes=notes,
        )

    def assess_batch(
        self, evidence_list: list[EvidenceObject]
    ) -> list[SourceAssessment]:
        """Assess a batch of evidence objects."""
        return [self.assess(e) for e in evidence_list]

    def aggregate_quality(
        self, evidence_list: list[EvidenceObject]
    ) -> float:
        """Compute aggregate adjusted quality across all evidence."""
        if not evidence_list:
            return 0.0
        assessments = self.assess_batch(evidence_list)
        return round(
            sum(a.adjusted_quality for a in assessments) / len(assessments), 3
        )

    def _build_notes(self, evidence: EvidenceObject, reliability: float) -> str:
        parts = []
        if reliability >= 0.85:
            parts.append("High-reliability source.")
        elif reliability >= 0.6:
            parts.append("Moderate-reliability source.")
        else:
            parts.append("Low-reliability source — cross-reference recommended.")

        if evidence.vendor_controlled:
            parts.append("Vendor-sourced (bias-adjusted).")
        else:
            parts.append("Independent source.")

        if evidence.is_stale:
            parts.append("Evidence is stale — freshness penalty applied.")

        return " ".join(parts)
