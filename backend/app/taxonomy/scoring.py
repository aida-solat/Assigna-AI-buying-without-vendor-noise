"""Evidence scoring engine.

Calculates vendor evidence scores using weighted evidence requirements.

Formula:
    evidence_score = sum(provided_evidence.weight × evidence_quality)
                     / sum(required_evidence.weight)

Where:
- evidence_quality is 0.0-1.0 (how good the evidence is)
- Only required evidence weights are in the denominator (max possible score)
- Non-required evidence provides bonus up to 1.0 total
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from app.taxonomy.schema import TaxonomyCategory


@dataclass
class EvidenceItem:
    """A single piece of evidence provided by a vendor."""

    type: str
    quality: float  # 0.0 - 1.0 (how good this evidence is)
    description: str = ""
    source_url: Optional[str] = None
    verified: bool = False


@dataclass
class ScoringBreakdown:
    """Detailed breakdown of evidence scoring for transparency."""

    category_id: str
    total_score: float  # 0.0 - 1.0
    max_possible_score: float
    required_met: int
    required_total: int
    items: list[EvidenceItemScore] = field(default_factory=list)
    missing_required: list[str] = field(default_factory=list)
    explanation: str = ""


@dataclass
class EvidenceItemScore:
    """Score contribution of a single evidence item."""

    type: str
    weight: float
    quality: float
    contribution: float  # weight × quality
    required: bool
    provided: bool


class EvidenceScorer:
    """Calculates evidence-based vendor scores per category."""

    def score(
        self,
        category: TaxonomyCategory,
        provided_evidence: list[EvidenceItem],
    ) -> ScoringBreakdown:
        """Score vendor evidence against category requirements.

        Returns detailed breakdown with transparency into scoring logic.
        """
        evidence_map = {e.type: e for e in provided_evidence}
        requirements = category.evidence_requirements

        items: list[EvidenceItemScore] = []
        missing_required: list[str] = []
        total_weighted_score = 0.0
        max_score_denominator = 0.0
        required_met = 0
        required_total = 0

        for req in requirements:
            provided = req.type in evidence_map
            quality = evidence_map[req.type].quality if provided else 0.0
            contribution = req.weight * quality

            item_score = EvidenceItemScore(
                type=req.type,
                weight=req.weight,
                quality=quality,
                contribution=contribution,
                required=req.required,
                provided=provided,
            )
            items.append(item_score)

            total_weighted_score += contribution

            if req.required:
                required_total += 1
                max_score_denominator += req.weight
                if provided and quality > 0:
                    required_met += 1
                else:
                    missing_required.append(req.type)
            else:
                # Optional evidence still adds to max possible
                max_score_denominator += req.weight

        # Normalize score
        if max_score_denominator > 0:
            normalized_score = total_weighted_score / max_score_denominator
        else:
            normalized_score = 0.0

        # Penalty for missing required evidence
        if required_total > 0 and required_met < required_total:
            missing_penalty = (required_total - required_met) / required_total * 0.3
            normalized_score = max(0.0, normalized_score - missing_penalty)

        breakdown = ScoringBreakdown(
            category_id=category.category_id,
            total_score=round(normalized_score, 3),
            max_possible_score=round(max_score_denominator, 3),
            required_met=required_met,
            required_total=required_total,
            items=items,
            missing_required=missing_required,
            explanation=self._build_explanation(
                normalized_score, required_met, required_total, missing_required
            ),
        )

        return breakdown

    def _build_explanation(
        self,
        score: float,
        required_met: int,
        required_total: int,
        missing: list[str],
    ) -> str:
        """Build human-readable scoring explanation."""
        parts = []

        # Overall score assessment
        if score >= 0.8:
            parts.append("Strong evidence match.")
        elif score >= 0.5:
            parts.append("Moderate evidence match.")
        elif score >= 0.3:
            parts.append("Weak evidence match.")
        else:
            parts.append("Insufficient evidence.")

        # Required evidence status
        parts.append(f"Required evidence: {required_met}/{required_total} provided.")

        if missing:
            parts.append(f"Missing required: {', '.join(missing)}.")

        return " ".join(parts)

    def compare_vendors(
        self,
        category: TaxonomyCategory,
        vendors_evidence: dict[str, list[EvidenceItem]],
    ) -> dict[str, ScoringBreakdown]:
        """Score multiple vendors and return ranked results."""
        results: dict[str, ScoringBreakdown] = {}
        for vendor_id, evidence in vendors_evidence.items():
            results[vendor_id] = self.score(category, evidence)

        # Sort by score descending
        return dict(
            sorted(results.items(), key=lambda x: x[1].total_score, reverse=True)
        )
