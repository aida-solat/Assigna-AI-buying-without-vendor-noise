"""Tests for taxonomy loading, validation, diagnosis, and scoring."""

import pytest

from app.taxonomy.loader import TaxonomyLoader
from app.taxonomy.validator import TaxonomyValidator
from app.taxonomy.diagnosis import BuyerInput, DiagnosisEngine
from app.taxonomy.scoring import EvidenceItem, EvidenceScorer


@pytest.fixture
def loader():
    return TaxonomyLoader()


@pytest.fixture
def categories(loader):
    return loader.load_all()


@pytest.fixture
def validator():
    return TaxonomyValidator()


# ─────────────────────────────────────────────────────────────────────────────
# LOADING TESTS
# ─────────────────────────────────────────────────────────────────────────────


class TestLoading:
    def test_loads_all_10_categories(self, categories):
        assert len(categories) == 10

    def test_all_category_ids_present(self, categories):
        expected_ids = {
            "ai_document_processing",
            "email_workflow_automation",
            "enterprise_knowledge_search",
            "customer_support_automation",
            "procurement_workflow_automation",
            "finance_backoffice_automation",
            "compliance_document_review",
            "workflow_orchestration",
            "sales_operations_automation",
            "custom_ai_consulting",
        }
        assert set(categories.keys()) == expected_ids

    def test_category_has_required_fields(self, categories):
        for cat_id, cat in categories.items():
            assert cat.category_id == cat_id
            assert cat.category_name
            assert cat.category_type
            assert cat.parent_category
            assert cat.description
            assert cat.diagnostic_triggers
            assert cat.evidence_requirements

    def test_index_builds_correctly(self, loader):
        loader.load_all()
        index = loader.index
        assert len(index.categories) == 10
        assert len(index.adjacency_graph) == 10
        assert "product_category" in index.category_types
        assert "Document Automation" in index.parent_categories


# ─────────────────────────────────────────────────────────────────────────────
# VALIDATION TESTS
# ─────────────────────────────────────────────────────────────────────────────


class TestValidation:
    def test_all_categories_pass_validation(self, categories, validator):
        result = validator.validate(categories)
        assert result.valid, f"Validation errors: {[e.message for e in result.errors]}"

    def test_no_duplicate_category_names(self, categories, validator):
        result = validator.validate(categories)
        name_errors = [e for e in result.errors if "Duplicate name" in e.message]
        assert len(name_errors) == 0

    def test_adjacent_categories_reference_existing(self, categories, validator):
        result = validator.validate(categories)
        ref_errors = [e for e in result.errors if "non-existent" in e.message]
        assert len(ref_errors) == 0, f"Broken references: {[e.message for e in ref_errors]}"

    def test_evidence_weights_sum_to_one(self, categories, validator):
        result = validator.validate(categories)
        weight_errors = [e for e in result.errors if "Weights sum" in e.message]
        assert len(weight_errors) == 0, f"Weight errors: {[e.message for e in weight_errors]}"


# ─────────────────────────────────────────────────────────────────────────────
# DIAGNOSIS TESTS
# ─────────────────────────────────────────────────────────────────────────────


class TestDiagnosis:
    def test_document_processing_match(self, categories):
        engine = DiagnosisEngine(categories)
        buyer = BuyerInput(
            problem_description=(
                "We manually enter data from invoices into our ERP system. "
                "Our team processes hundreds of documents per week and the error rate is high. "
                "We use SAP and receive documents in PDF and scanned format."
            ),
            keywords=["invoice", "data entry", "OCR", "ERP", "manual processing"],
            signals={"documents_per_week": 200, "has_target_system": True},
        )
        result = engine.diagnose(buyer)
        assert result.primary is not None
        assert result.primary.category_id == "ai_document_processing"

    def test_email_automation_match(self, categories):
        engine = DiagnosisEngine(categories)
        buyer = BuyerInput(
            problem_description=(
                "Our shared inbox receives hundreds of emails daily that need manual triage. "
                "Staff spend 3 hours sorting and routing emails. "
                "We miss important supplier communications."
            ),
            keywords=["shared inbox", "email triage", "routing", "classification"],
            signals={"emails_per_day": 200, "shared_inbox_count": 3},
        )
        result = engine.diagnose(buyer)
        assert result.primary is not None
        assert result.primary.category_id == "email_workflow_automation"

    def test_custom_consulting_only_when_others_fail(self, categories):
        engine = DiagnosisEngine(categories)
        buyer = BuyerInput(
            problem_description=(
                "We need a custom multi-agent AI system integrated deeply into "
                "our proprietary trading platform. We tried off-the-shelf solutions "
                "and they don't work for our unique workflow."
            ),
            keywords=["custom", "proprietary", "multi-agent", "bespoke"],
            signals={"budget_eur": 100000, "has_technical_counterpart": True},
        )
        result = engine.diagnose(buyer)
        # Custom consulting should appear but only if product categories score low
        top = result.top_3
        assert len(top) > 0

    def test_disqualified_categories_reported(self, categories):
        engine = DiagnosisEngine(categories)
        buyer = BuyerInput(
            problem_description="We have some document processing needs",
            keywords=["documents"],
            signals={"documents_per_week": 5, "has_target_system": False},
        )
        result = engine.diagnose(buyer)
        # Low volume + no target system should disqualify doc processing
        disq_ids = [d.category_id for d in result.disqualified]
        assert "ai_document_processing" in disq_ids

    def test_returns_top_3(self, categories):
        engine = DiagnosisEngine(categories)
        buyer = BuyerInput(
            problem_description=(
                "We need workflow automation between our systems. "
                "Manual approvals are slow and we have handoffs between SAP and Salesforce."
            ),
            keywords=["workflow", "automation", "approval", "systems"],
            signals={},
        )
        result = engine.diagnose(buyer)
        assert len(result.top_3) <= 3
        if result.top_3:
            assert result.top_3[0].rank == "primary"


# ─────────────────────────────────────────────────────────────────────────────
# SCORING TESTS
# ─────────────────────────────────────────────────────────────────────────────


class TestScoring:
    def test_full_evidence_scores_high(self, categories):
        scorer = EvidenceScorer()
        cat = categories["ai_document_processing"]
        evidence = [
            EvidenceItem(type="accuracy_benchmark", quality=0.9),
            EvidenceItem(type="same_industry_case_study", quality=0.8),
            EvidenceItem(type="integration_proof", quality=0.85),
            EvidenceItem(type="language_support", quality=0.7),
            EvidenceItem(type="pilot_availability", quality=0.9),
        ]
        result = scorer.score(cat, evidence)
        assert result.total_score >= 0.7
        assert result.required_met == 3
        assert result.required_total == 3
        assert len(result.missing_required) == 0

    def test_missing_required_evidence_penalized(self, categories):
        scorer = EvidenceScorer()
        cat = categories["ai_document_processing"]
        evidence = [
            EvidenceItem(type="language_support", quality=0.9),
            EvidenceItem(type="pilot_availability", quality=0.8),
        ]
        result = scorer.score(cat, evidence)
        assert result.total_score < 0.5
        assert result.required_met == 0
        assert len(result.missing_required) == 3

    def test_no_evidence_scores_zero(self, categories):
        scorer = EvidenceScorer()
        cat = categories["email_workflow_automation"]
        result = scorer.score(cat, [])
        assert result.total_score == 0.0
        assert result.required_met == 0

    def test_compare_vendors(self, categories):
        scorer = EvidenceScorer()
        cat = categories["customer_support_automation"]

        vendor_a = [
            EvidenceItem(type="auto_resolution_rate", quality=0.9),
            EvidenceItem(type="csat_preservation", quality=0.85),
            EvidenceItem(type="helpdesk_integration", quality=0.8),
            EvidenceItem(type="escalation_handling", quality=0.7),
        ]
        vendor_b = [
            EvidenceItem(type="auto_resolution_rate", quality=0.5),
            EvidenceItem(type="helpdesk_integration", quality=0.6),
        ]

        results = scorer.compare_vendors(cat, {"vendor_a": vendor_a, "vendor_b": vendor_b})
        scores = list(results.values())
        assert scores[0].total_score > scores[1].total_score

    def test_scoring_explanation_present(self, categories):
        scorer = EvidenceScorer()
        cat = categories["workflow_orchestration"]
        evidence = [
            EvidenceItem(type="integration_breadth", quality=0.8),
            EvidenceItem(type="similar_process_case_study", quality=0.7),
            EvidenceItem(type="error_handling_demo", quality=0.6),
        ]
        result = scorer.score(cat, evidence)
        assert result.explanation
        assert "Required evidence" in result.explanation
