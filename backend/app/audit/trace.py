"""Decision trace — full audit trail for every recommendation.

Every Decision Brief can be replayed: given the same taxonomy version,
vendor profiles, evidence snapshot, and buyer input, the same scores
must be reproduced. This is the audit-grade guarantee.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any, Optional

from app.engine.assignment import AssignmentResult
from app.engine.brief import DecisionBrief


@dataclass
class EvidenceSnapshot:
    """Frozen evidence state at decision time."""

    vendor_id: str
    category_id: str
    evidence_types: list[str]
    evidence_count: int
    total_quality: float
    required_met: int
    required_total: int
    missing_required: list[str]


@dataclass
class ScoringSnapshot:
    """Frozen scoring breakdown at decision time."""

    vendor_id: str
    vendor_name: str
    rank: int
    overall_score: float
    need_fit: float
    evidence_quality: float
    integration_fit: float
    risk_penalty: float
    strengths: list[str]
    concerns: list[str]


@dataclass
class TraceSummary:
    """Human-readable trace summary."""

    brief_id: str
    generated_at: str
    buyer_problem_hash: str
    primary_category: str
    vendor_count: int
    disqualified_count: int
    top_vendor: Optional[str]
    top_score: Optional[float]


@dataclass
class DecisionTrace:
    """Complete audit trace for a single decision brief.

    This is the forensic record that makes every recommendation
    replayable and auditable.
    """

    trace_id: str
    brief_id: str
    generated_at: str

    # Input snapshot
    buyer_problem_hash: str
    buyer_input_snapshot: dict[str, Any]

    # Taxonomy version
    taxonomy_version: str
    taxonomy_categories_used: list[str]

    # Diagnosis snapshot
    primary_category_id: str
    primary_category_name: str
    diagnosis_confidence: float
    diagnosis_method: str
    disqualified_categories: list[str]

    # Vendor snapshots
    vendor_count: int
    disqualified_vendor_count: int
    disqualified_vendors: list[str]
    disqualification_reasons: dict[str, list[str]]

    # Evidence snapshots
    evidence_snapshots: list[EvidenceSnapshot]

    # Scoring snapshots
    scoring_snapshots: list[ScoringSnapshot]

    # Brief integrity
    brief_hash: str

    @property
    def summary(self) -> TraceSummary:
        top = self.scoring_snapshots[0] if self.scoring_snapshots else None
        return TraceSummary(
            brief_id=self.brief_id,
            generated_at=self.generated_at,
            buyer_problem_hash=self.buyer_problem_hash,
            primary_category=self.primary_category_name,
            vendor_count=self.vendor_count,
            disqualified_count=self.disqualified_vendor_count,
            top_vendor=top.vendor_name if top else None,
            top_score=top.overall_score if top else None,
        )

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class TraceBuilder:
    """Builds DecisionTrace from AssignmentResult + DecisionBrief."""

    TAXONOMY_VERSION = "0.2.0"

    def build(
        self,
        result: AssignmentResult,
        brief: DecisionBrief,
    ) -> DecisionTrace:
        """Build a complete audit trace."""
        now = datetime.now(timezone.utc).isoformat()

        # Hash buyer input for fingerprinting
        buyer_hash = self._hash_input(result.buyer_input.problem_description)

        # Build evidence snapshots
        evidence_snaps = self._build_evidence_snapshots(result)

        # Build scoring snapshots
        scoring_snaps = [
            ScoringSnapshot(
                vendor_id=a.vendor_id,
                vendor_name=a.vendor_name,
                rank=a.rank,
                overall_score=a.overall_score,
                need_fit=a.need_fit_score,
                evidence_quality=a.evidence_score,
                integration_fit=a.integration_score,
                risk_penalty=a.risk_penalty,
                strengths=a.strengths,
                concerns=a.concerns,
            )
            for a in result.assignments
        ]

        # Build disqualification reasons map
        disq_reasons: dict[str, list[str]] = {}
        for d in result.disqualification_details:
            disq_reasons[d.vendor_name] = d.reasons

        # Hash the brief for integrity
        brief_hash = self._hash_brief(brief)

        # Build buyer input snapshot (sanitized)
        buyer_snapshot = {
            "problem_length": len(result.buyer_input.problem_description),
            "keywords": result.buyer_input.keywords,
            "budget_eur": result.buyer_input.budget_eur,
            "company_size": result.buyer_input.company_size,
            "existing_systems": result.buyer_input.existing_systems,
            "signal_count": len(result.buyer_input.signals),
        }

        return DecisionTrace(
            trace_id=f"trace_{brief.brief_id}",
            brief_id=brief.brief_id,
            generated_at=now,
            buyer_problem_hash=buyer_hash,
            buyer_input_snapshot=buyer_snapshot,
            taxonomy_version=self.TAXONOMY_VERSION,
            taxonomy_categories_used=[
                c.category_id for c in result.diagnosis.candidates
            ] + [
                c.category_id for c in result.diagnosis.disqualified
            ],
            primary_category_id=result.primary_category_id or "none",
            primary_category_name=(
                result.diagnosis.primary.category_name
                if result.diagnosis.primary
                else "none"
            ),
            diagnosis_confidence=(
                result.diagnosis.primary.confidence
                if result.diagnosis.primary
                else 0.0
            ),
            diagnosis_method="deterministic_rule_based",
            disqualified_categories=[
                c.category_id for c in result.diagnosis.disqualified
            ],
            vendor_count=len(result.assignments),
            disqualified_vendor_count=len(result.disqualified_vendors),
            disqualified_vendors=result.disqualified_vendors,
            disqualification_reasons=disq_reasons,
            evidence_snapshots=evidence_snaps,
            scoring_snapshots=scoring_snaps,
            brief_hash=brief_hash,
        )

    def _build_evidence_snapshots(
        self, result: AssignmentResult
    ) -> list[EvidenceSnapshot]:
        """Build evidence snapshots for each vendor assignment."""
        snaps = []
        for a in result.assignments:
            eb = a.evidence_breakdown
            if eb:
                snaps.append(
                    EvidenceSnapshot(
                        vendor_id=a.vendor_id,
                        category_id=a.category_id,
                        evidence_types=[item.type for item in eb.items if item.provided],
                        evidence_count=sum(1 for item in eb.items if item.provided),
                        total_quality=eb.total_score,
                        required_met=eb.required_met,
                        required_total=eb.required_total,
                        missing_required=eb.missing_required,
                    )
                )
        return snaps

    def _hash_input(self, text: str) -> str:
        """SHA-256 hash of buyer input for fingerprinting."""
        return hashlib.sha256(text.encode()).hexdigest()[:16]

    def _hash_brief(self, brief: DecisionBrief) -> str:
        """SHA-256 hash of brief content for integrity verification."""
        content = json.dumps(
            {
                "brief_id": brief.brief_id,
                "tier": brief.tier,
                "category": brief.diagnosed_category,
                "confidence": brief.diagnosis_confidence,
                "vendor_count": len(brief.recommendations),
                "created_at": brief.created_at,
            },
            sort_keys=True,
        )
        return hashlib.sha256(content.encode()).hexdigest()[:24]
