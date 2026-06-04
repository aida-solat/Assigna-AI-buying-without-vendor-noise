"""DecisionBrief generator.

Produces the paid artifact: a structured, explainable vendor recommendation
with full scoring breakdown, reasoning, and decision questions.

Free tier: diagnosis only (category + explanation)
Paid tier: full brief with ranked vendors, evidence, and questions
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from app.engine.assignment import AssignmentResult, VendorAssignment


@dataclass
class VendorRecommendation:
    """A single vendor recommendation in the brief."""

    rank: int
    vendor_name: str
    vendor_id: str
    overall_score: float
    fit_summary: str
    strengths: list[str]
    concerns: list[str]
    score_breakdown: dict[str, float]
    decision_questions: list[str]


@dataclass
class DecisionBrief:
    """The paid artifact — complete vendor recommendation report."""

    brief_id: str
    created_at: str
    tier: str  # "free", "starter", "pro"

    # Diagnosis section
    problem_summary: str
    diagnosed_category: str
    diagnosed_category_name: str
    diagnosis_confidence: float
    diagnosis_explanation: str

    # Recommendations (paid only)
    recommendations: list[VendorRecommendation] = field(default_factory=list)
    not_recommended_reasons: list[str] = field(default_factory=list)

    # Context
    decision_questions: list[str] = field(default_factory=list)
    red_flags_to_watch: list[str] = field(default_factory=list)
    next_steps: list[str] = field(default_factory=list)


class BriefGenerator:
    """Generates DecisionBriefs from AssignmentResults at different tiers."""

    def generate_free(self, result: AssignmentResult) -> DecisionBrief:
        """Free tier: diagnosis only, no vendor names."""
        return DecisionBrief(
            brief_id=self._generate_id(),
            created_at=datetime.now(timezone.utc).isoformat(),
            tier="free",
            problem_summary=result.buyer_input.problem_description[:200],
            diagnosed_category=result.primary_category_id or "unknown",
            diagnosed_category_name=self._get_category_name(result),
            diagnosis_confidence=self._get_confidence(result),
            diagnosis_explanation=result.explanation,
            next_steps=[
                "Upgrade to Starter (€99) for vendor shortlist",
                "Upgrade to Pro (€499) for full Decision Brief with scoring and reasoning",
            ],
        )

    def generate_starter(self, result: AssignmentResult) -> DecisionBrief:
        """Starter tier: category + vendor names (no reasoning)."""
        brief = self.generate_free(result)
        brief.tier = "starter"
        brief.recommendations = [
            VendorRecommendation(
                rank=a.rank,
                vendor_name=a.vendor_name,
                vendor_id=a.vendor_id,
                overall_score=a.overall_score,
                fit_summary=f"Score: {a.overall_score:.0%}",
                strengths=[],  # Not included in starter
                concerns=[],
                score_breakdown={},
                decision_questions=[],
            )
            for a in result.assignments[:3]
        ]
        brief.next_steps = [
            "Upgrade to Pro (€499) for full scoring breakdown and decision questions",
        ]
        return brief

    def generate_pro(self, result: AssignmentResult) -> DecisionBrief:
        """Pro tier: full Decision Brief with all details."""
        brief = self.generate_free(result)
        brief.tier = "pro"

        brief.recommendations = [
            self._build_recommendation(a)
            for a in result.assignments[:5]
        ]

        # Add not-recommended reasons
        if result.disqualified_vendors:
            brief.not_recommended_reasons = [
                f"Vendor disqualified: {v}" for v in result.disqualified_vendors
            ]

        # Add category-level decision questions
        if result.diagnosis.primary:
            from app.taxonomy.loader import TaxonomyLoader
            loader = TaxonomyLoader()
            cat = loader.get_category(result.primary_category_id or "")
            if cat:
                brief.decision_questions = cat.decision_questions
                brief.red_flags_to_watch = cat.red_flags_for_buyer

        brief.next_steps = [
            "Schedule intro calls with top-ranked vendors",
            "Use decision questions in your vendor evaluation meetings",
            "Request POC/pilot from top 2 vendors before committing",
        ]

        return brief

    def _build_recommendation(self, assignment: VendorAssignment) -> VendorRecommendation:
        """Build a full vendor recommendation."""
        return VendorRecommendation(
            rank=assignment.rank,
            vendor_name=assignment.vendor_name,
            vendor_id=assignment.vendor_id,
            overall_score=assignment.overall_score,
            fit_summary=self._build_fit_summary(assignment),
            strengths=assignment.strengths,
            concerns=assignment.concerns,
            score_breakdown={
                "need_fit": assignment.need_fit_score,
                "evidence_quality": assignment.evidence_score,
                "integration_fit": assignment.integration_score,
                "risk_penalty": assignment.risk_penalty,
            },
            decision_questions=assignment.decision_questions,
        )

    def _build_fit_summary(self, assignment: VendorAssignment) -> str:
        """Generate a human-readable fit summary."""
        score_pct = f"{assignment.overall_score:.0%}"

        if assignment.overall_score >= 0.7:
            return f"Strong match ({score_pct}). Evidence quality high, good integration fit."
        elif assignment.overall_score >= 0.5:
            return f"Moderate match ({score_pct}). Some evidence gaps or integration concerns."
        elif assignment.overall_score >= 0.3:
            return f"Weak match ({score_pct}). Significant gaps in evidence or fit."
        else:
            return f"Poor match ({score_pct}). Major concerns — consider alternatives."

    def _get_category_name(self, result: AssignmentResult) -> str:
        if result.diagnosis.primary:
            return result.diagnosis.primary.category_name
        return "Unknown"

    def _get_confidence(self, result: AssignmentResult) -> float:
        if result.diagnosis.primary:
            return result.diagnosis.primary.confidence
        return 0.0

    def _generate_id(self) -> str:
        import uuid
        return f"brief_{uuid.uuid4().hex[:12]}"
