"""Assignment Engine — the core of Assigna.

Workflow:
1. Buyer input → DiagnosisEngine → candidate categories
2. For each candidate category → find matching vendors
3. Score each vendor using EvidenceScorer
4. Apply combined scoring formula
5. Return ranked vendor assignments with reasoning

Scoring formula:
    Overall Score =
      (need_fit × 0.30) +
      (evidence_quality × 0.25) +
      (industry_fit × 0.15) +
      (integration_fit × 0.15) +
      (risk_penalty × -0.15)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from app.evidence.disqualifier import DisqualificationResult, VendorDisqualifier
from app.taxonomy.diagnosis import BuyerInput, DiagnosisEngine, DiagnosisResult
from app.taxonomy.schema import TaxonomyCategory
from app.taxonomy.scoring import EvidenceItem, EvidenceScorer, ScoringBreakdown
from app.vendors.schema import VendorCapability, VendorProfile


@dataclass
class VendorAssignment:
    """A single vendor assignment with full scoring breakdown."""

    vendor_id: str
    vendor_name: str
    category_id: str
    overall_score: float
    rank: int

    # Score components
    need_fit_score: float
    evidence_score: float
    integration_score: float
    risk_penalty: float

    # Detail
    evidence_breakdown: Optional[ScoringBreakdown] = None
    strengths: list[str] = field(default_factory=list)
    concerns: list[str] = field(default_factory=list)
    decision_questions: list[str] = field(default_factory=list)


@dataclass
class AssignmentResult:
    """Complete assignment output for a buyer problem."""

    buyer_input: BuyerInput
    diagnosis: DiagnosisResult
    primary_category_id: Optional[str]
    assignments: list[VendorAssignment] = field(default_factory=list)
    disqualified_vendors: list[str] = field(default_factory=list)
    disqualification_details: list[DisqualificationResult] = field(default_factory=list)
    explanation: str = ""


class AssignmentEngine:
    """Orchestrates diagnosis → vendor matching → scoring → ranking."""

    # Scoring weights
    WEIGHT_NEED_FIT = 0.30
    WEIGHT_EVIDENCE = 0.25
    WEIGHT_INTEGRATION = 0.15
    WEIGHT_INDUSTRY = 0.15
    WEIGHT_RISK = 0.15

    def __init__(
        self,
        categories: dict[str, TaxonomyCategory],
        vendors: dict[str, VendorProfile],
    ):
        self._categories = categories
        self._vendors = vendors
        self._diagnosis_engine = DiagnosisEngine(categories)
        self._evidence_scorer = EvidenceScorer()
        self._disqualifier = VendorDisqualifier()

    def assign(self, buyer_input: BuyerInput) -> AssignmentResult:
        """Run full assignment pipeline."""
        # Step 1: Diagnose buyer need
        diagnosis = self._diagnosis_engine.diagnose(buyer_input)

        result = AssignmentResult(
            buyer_input=buyer_input,
            diagnosis=diagnosis,
            primary_category_id=None,
        )

        if not diagnosis.primary:
            result.explanation = (
                "Could not determine a primary category match. "
                "Buyer problem may need clarification or prerequisites addressed."
            )
            return result

        primary_category_id = diagnosis.primary.category_id
        result.primary_category_id = primary_category_id

        category = self._categories[primary_category_id]

        # Step 2: Find vendors serving this category
        matching_vendors = self._get_matching_vendors(primary_category_id)

        if not matching_vendors:
            result.explanation = (
                f"Category '{category.category_name}' matched, "
                f"but no vendors in our database serve this category yet."
            )
            return result

        # Step 3: Hard disqualifier gates (reject before scoring)
        vendor_caps = []
        for vendor in matching_vendors:
            capability = vendor.get_capability(primary_category_id)
            if capability:
                vendor_caps.append((vendor, capability))

        qualified, disqualified = self._disqualifier.check_batch(
            vendors=vendor_caps,
            category=category,
            buyer_systems=buyer_input.existing_systems,
            buyer_budget=buyer_input.budget_eur,
        )

        result.disqualified_vendors = [d.vendor_name for d in disqualified]
        result.disqualification_details = disqualified

        # Step 4: Score qualified vendors only
        assignments: list[VendorAssignment] = []

        for vendor, capability in qualified:
            assignment = self._score_vendor(
                vendor=vendor,
                capability=capability,
                category=category,
                buyer_input=buyer_input,
                diagnosis_confidence=diagnosis.primary.confidence,
            )
            assignments.append(assignment)

        # Step 5: Sort by overall_score descending and assign ranks
        assignments.sort(key=lambda a: a.overall_score, reverse=True)
        for i, a in enumerate(assignments):
            a.rank = i + 1

        result.assignments = assignments
        result.explanation = (
            f"Found {len(assignments)} vendor(s) for "
            f"'{category.category_name}' (confidence: {diagnosis.primary.confidence:.0%})"
        )

        return result

    def _get_matching_vendors(self, category_id: str) -> list[VendorProfile]:
        """Get all vendors that claim capability in this category."""
        return [
            v for v in self._vendors.values()
            if category_id in v.category_ids
        ]

    def _score_vendor(
        self,
        vendor: VendorProfile,
        capability: VendorCapability,
        category: TaxonomyCategory,
        buyer_input: BuyerInput,
        diagnosis_confidence: float,
    ) -> VendorAssignment:
        """Calculate combined score for a vendor in a category."""

        # 1. Need fit = diagnosis confidence × vendor strength in category
        need_fit = diagnosis_confidence * capability.strength

        # 2. Evidence quality = weighted evidence scoring
        evidence_items = [
            EvidenceItem(
                type=e.type,
                quality=e.quality,
                description=e.description,
                source_url=e.source_url,
                verified=(e.status.value == "verified"),
            )
            for e in capability.evidence
        ]
        evidence_breakdown = self._evidence_scorer.score(category, evidence_items)
        evidence_score = evidence_breakdown.total_score

        # 3. Integration fit = match buyer's systems with vendor's supported integrations
        integration_score = self._calculate_integration_fit(
            buyer_systems=buyer_input.existing_systems,
            vendor_integrations=capability.integrations_supported,
        )

        # 4. Risk penalty = based on red flags and missing required evidence
        risk_penalty = self._calculate_risk_penalty(
            vendor=vendor,
            evidence_breakdown=evidence_breakdown,
        )

        # Combined score
        overall_score = (
            (need_fit * self.WEIGHT_NEED_FIT)
            + (evidence_score * self.WEIGHT_EVIDENCE)
            + (integration_score * self.WEIGHT_INTEGRATION)
            + (capability.strength * self.WEIGHT_INDUSTRY)  # Proxy for industry fit
            - (risk_penalty * self.WEIGHT_RISK)
        )
        overall_score = max(0.0, min(1.0, overall_score))

        # Build strengths and concerns
        strengths = self._identify_strengths(vendor, capability, evidence_breakdown)
        concerns = self._identify_concerns(vendor, capability, evidence_breakdown)

        return VendorAssignment(
            vendor_id=vendor.vendor_id,
            vendor_name=vendor.vendor_name,
            category_id=category.category_id,
            overall_score=round(overall_score, 3),
            rank=0,
            need_fit_score=round(need_fit, 3),
            evidence_score=round(evidence_score, 3),
            integration_score=round(integration_score, 3),
            risk_penalty=round(risk_penalty, 3),
            evidence_breakdown=evidence_breakdown,
            strengths=strengths,
            concerns=concerns,
            decision_questions=category.decision_questions[:5],
        )

    def _calculate_integration_fit(
        self,
        buyer_systems: list[str],
        vendor_integrations: list[str],
    ) -> float:
        """Calculate how well vendor integrations match buyer's existing systems."""
        if not buyer_systems:
            return 0.5  # Neutral if unknown

        buyer_lower = {s.lower() for s in buyer_systems}
        vendor_lower = {s.lower() for s in vendor_integrations}

        matches = buyer_lower & vendor_lower
        if not buyer_lower:
            return 0.5

        return len(matches) / len(buyer_lower)

    def _calculate_risk_penalty(
        self,
        vendor: VendorProfile,
        evidence_breakdown: ScoringBreakdown,
    ) -> float:
        """Calculate risk penalty (0.0-1.0)."""
        penalty = 0.0

        # Missing required evidence = major risk
        if evidence_breakdown.required_total > 0:
            missing_ratio = (
                (evidence_breakdown.required_total - evidence_breakdown.required_met)
                / evidence_breakdown.required_total
            )
            penalty += missing_ratio * 0.5

        # Red flags from editorial notes
        if vendor.red_flags:
            penalty += min(len(vendor.red_flags) * 0.15, 0.4)

        return min(1.0, penalty)

    def _identify_strengths(
        self,
        vendor: VendorProfile,
        capability: VendorCapability,
        evidence_breakdown: ScoringBreakdown,
    ) -> list[str]:
        """Identify top vendor strengths."""
        strengths = []

        if capability.strength >= 0.85:
            strengths.append(f"Strong specialist in this category (strength: {capability.strength:.0%})")

        verified_count = sum(
            1 for e in capability.evidence if e.status.value == "verified"
        )
        if verified_count >= 3:
            strengths.append(f"{verified_count} verified evidence items")

        if evidence_breakdown.required_met == evidence_breakdown.required_total:
            strengths.append("All required evidence provided")

        if "SOC2 Type II" in vendor.certifications:
            strengths.append("SOC2 Type II certified")

        if len(vendor.deployment_model) > 1:
            strengths.append(f"Flexible deployment: {', '.join(vendor.deployment_model)}")

        return strengths

    def _identify_concerns(
        self,
        vendor: VendorProfile,
        capability: VendorCapability,
        evidence_breakdown: ScoringBreakdown,
    ) -> list[str]:
        """Identify vendor concerns/risks."""
        concerns = []

        if evidence_breakdown.missing_required:
            concerns.append(
                f"Missing required evidence: {', '.join(evidence_breakdown.missing_required)}"
            )

        concerns.extend(vendor.red_flags)

        unverified = sum(
            1 for e in capability.evidence if e.status.value != "verified"
        )
        if unverified > 0:
            concerns.append(f"{unverified} evidence item(s) not yet verified by Assigna")

        return concerns
