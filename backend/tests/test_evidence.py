"""Tests for the evidence engine: schema, freshness, source registry, disqualifier."""

from datetime import date

import pytest

from app.evidence.schema import EvidenceObject, SourceType, VerificationStatus
from app.evidence.freshness import FreshnessScorer
from app.evidence.source_registry import SourceRegistry
from app.evidence.disqualifier import VendorDisqualifier


def _make_evidence(
    evidence_id: str = "ev_001",
    vendor_id: str = "docuai",
    category_id: str = "ai_document_processing",
    source_type: SourceType = SourceType.CASE_STUDY,
    claim: str = "95% accuracy on manufacturing invoices",
    extracted_signal: str = "accuracy_rate:0.95",
    confidence: float = 0.8,
    freshness_days: int = 90,
    vendor_controlled: bool = True,
    verification_status: VerificationStatus = VerificationStatus.SELF_DECLARED,
    **kwargs,
) -> EvidenceObject:
    return EvidenceObject(
        evidence_id=evidence_id,
        vendor_id=vendor_id,
        category_id=category_id,
        source_type=source_type,
        claim=claim,
        extracted_signal=extracted_signal,
        confidence=confidence,
        collected_date=date.today(),
        freshness_days=freshness_days,
        vendor_controlled=vendor_controlled,
        verification_status=verification_status,
        **kwargs,
    )


class TestEvidenceSchema:
    def test_creates_valid_evidence(self):
        ev = _make_evidence()
        assert ev.evidence_id == "ev_001"
        assert ev.confidence == 0.8

    def test_effective_confidence_self_declared(self):
        ev = _make_evidence(confidence=0.9, verification_status=VerificationStatus.SELF_DECLARED)
        # Self-declared: 0.9 * 0.8 (self_declared) * 0.9 (vendor_controlled)
        assert ev.effective_confidence < 0.9

    def test_effective_confidence_verified_boost(self):
        ev = _make_evidence(
            confidence=0.8,
            verification_status=VerificationStatus.VERIFIED,
            vendor_controlled=False,
            verified_by="assigna_team",
        )
        # Verified + not vendor-controlled: should boost
        assert ev.effective_confidence > 0.8

    def test_stale_evidence_detected(self):
        ev = _make_evidence(freshness_days=400)
        assert ev.is_stale is True

    def test_fresh_evidence_not_stale(self):
        ev = _make_evidence(freshness_days=30)
        assert ev.is_stale is False

    def test_verified_requires_verified_by(self):
        with pytest.raises(ValueError, match="verified_by"):
            _make_evidence(verification_status=VerificationStatus.VERIFIED)

    def test_effective_confidence_decays_with_age(self):
        fresh = _make_evidence(freshness_days=30)
        stale = _make_evidence(freshness_days=400)
        assert fresh.effective_confidence > stale.effective_confidence


class TestFreshnessScorer:
    def test_fresh_evidence_scores_high(self):
        scorer = FreshnessScorer()
        ev = _make_evidence(freshness_days=30)
        result = scorer.score(ev)
        assert result.freshness_score == 1.0
        assert result.category == "fresh"

    def test_aging_evidence(self):
        scorer = FreshnessScorer()
        ev = _make_evidence(freshness_days=120)
        result = scorer.score(ev)
        assert result.freshness_score == 0.85
        assert result.category == "aging"

    def test_stale_evidence(self):
        scorer = FreshnessScorer()
        ev = _make_evidence(freshness_days=300)
        result = scorer.score(ev)
        assert result.freshness_score == 0.6
        assert result.category == "stale"

    def test_expired_evidence(self):
        scorer = FreshnessScorer()
        ev = _make_evidence(freshness_days=800)
        result = scorer.score(ev)
        assert result.freshness_score == 0.3
        assert result.category == "expired"

    def test_average_freshness(self):
        scorer = FreshnessScorer()
        evidence = [
            _make_evidence(evidence_id="a", freshness_days=30),  # 1.0
            _make_evidence(evidence_id="b", freshness_days=300),  # 0.6
        ]
        avg = scorer.average_freshness(evidence)
        assert avg == 0.8


class TestSourceRegistry:
    def test_third_party_report_highest(self):
        registry = SourceRegistry()
        ev = _make_evidence(
            source_type=SourceType.THIRD_PARTY_REPORT,
            vendor_controlled=False,
            confidence=0.9,
        )
        result = registry.assess(ev)
        assert result.reliability > 0.8

    def test_vendor_website_lowest(self):
        registry = SourceRegistry()
        ev = _make_evidence(source_type=SourceType.VENDOR_WEBSITE, confidence=0.9)
        result = registry.assess(ev)
        assert result.reliability < 0.5

    def test_vendor_controlled_penalty(self):
        registry = SourceRegistry()
        independent = _make_evidence(vendor_controlled=False, confidence=0.9)
        vendor_sourced = _make_evidence(vendor_controlled=True, confidence=0.9)
        r1 = registry.assess(independent)
        r2 = registry.assess(vendor_sourced)
        assert r1.adjusted_quality > r2.adjusted_quality

    def test_aggregate_quality(self):
        registry = SourceRegistry()
        evidence = [
            _make_evidence(evidence_id="a", confidence=0.8),
            _make_evidence(evidence_id="b", confidence=0.6),
        ]
        agg = registry.aggregate_quality(evidence)
        assert 0.0 < agg < 1.0


class TestVendorDisqualifier:
    def test_passes_when_evidence_provided(self):
        from app.taxonomy.loader import TaxonomyLoader
        from app.vendors.loader import VendorLoader

        tax = TaxonomyLoader()
        tax.load_all()
        ven = VendorLoader()
        ven.load_all()

        disq = VendorDisqualifier()
        cat = tax.categories["ai_document_processing"]
        vendor = ven.vendors["docuai"]
        capability = vendor.get_capability("ai_document_processing")

        result = disq.check(
            vendor=vendor,
            capability=capability,
            category=cat,
            buyer_systems=[],
        )
        assert result.passed is True

    def test_fails_on_zero_evidence(self):
        from app.taxonomy.loader import TaxonomyLoader
        from app.vendors.schema import VendorProfile, VendorCapability

        tax = TaxonomyLoader()
        tax.load_all()

        cat = list(tax.categories.values())[0]
        vendor = VendorProfile(
            vendor_id="test-empty",
            vendor_name="Empty Vendor",
            description="A vendor with zero evidence for testing",
            website="https://empty.example.com",
            categories=[
                VendorCapability(
                    category_id=cat.category_id,
                    strength=0.5,
                    evidence=[],
                    integrations_supported=[],
                )
            ],
        )
        capability = vendor.categories[0]

        disq = VendorDisqualifier()
        result = disq.check(
            vendor=vendor,
            capability=capability,
            category=cat,
            buyer_systems=[],
        )
        assert result.passed is False
        assert any("No evidence" in r for r in result.reasons)
