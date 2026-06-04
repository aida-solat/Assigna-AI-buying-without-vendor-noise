"""Evidence freshness scoring.

Evidence decays over time. A case study from 2 years ago is less
reliable than one from 6 months ago. This module calculates
freshness-adjusted quality scores.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from app.evidence.schema import EvidenceObject


@dataclass
class FreshnessResult:
    """Result of freshness evaluation."""

    evidence_id: str
    freshness_days: int
    freshness_score: float  # 0.0-1.0 (1.0 = fresh, 0.0 = expired)
    category: str  # "fresh", "aging", "stale", "expired"
    recommendation: str


class FreshnessScorer:
    """Scores evidence freshness with configurable decay thresholds."""

    # Freshness thresholds (days)
    FRESH_THRESHOLD = 90
    AGING_THRESHOLD = 180
    STALE_THRESHOLD = 365
    EXPIRED_THRESHOLD = 730

    # Decay multipliers
    FRESH_MULTIPLIER = 1.0
    AGING_MULTIPLIER = 0.85
    STALE_MULTIPLIER = 0.6
    EXPIRED_MULTIPLIER = 0.3

    def score(self, evidence: EvidenceObject) -> FreshnessResult:
        """Calculate freshness score for a single evidence object."""
        days = evidence.freshness_days

        if days <= self.FRESH_THRESHOLD:
            score = self.FRESH_MULTIPLIER
            category = "fresh"
            rec = "Evidence is current."
        elif days <= self.AGING_THRESHOLD:
            score = self.AGING_MULTIPLIER
            category = "aging"
            rec = "Evidence is aging. Consider requesting an update."
        elif days <= self.STALE_THRESHOLD:
            score = self.STALE_MULTIPLIER
            category = "stale"
            rec = "Evidence is stale. Should be refreshed before relying on it."
        else:
            score = self.EXPIRED_MULTIPLIER
            category = "expired"
            rec = "Evidence is expired. Do not use without re-verification."

        return FreshnessResult(
            evidence_id=evidence.evidence_id,
            freshness_days=days,
            freshness_score=round(score, 3),
            category=category,
            recommendation=rec,
        )

    def score_batch(
        self, evidence_list: list[EvidenceObject]
    ) -> list[FreshnessResult]:
        """Score freshness for multiple evidence objects."""
        return [self.score(e) for e in evidence_list]

    def average_freshness(self, evidence_list: list[EvidenceObject]) -> float:
        """Calculate average freshness score across evidence set."""
        if not evidence_list:
            return 0.0
        results = self.score_batch(evidence_list)
        return round(
            sum(r.freshness_score for r in results) / len(results), 3
        )
