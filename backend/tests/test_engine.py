"""Tests for the Assignment Engine and Brief Generator."""

import pytest

from app.engine.assignment import AssignmentEngine, AssignmentResult
from app.engine.brief import BriefGenerator
from app.taxonomy.diagnosis import BuyerInput
from app.taxonomy.loader import TaxonomyLoader
from app.vendors.loader import VendorLoader


@pytest.fixture
def categories():
    loader = TaxonomyLoader()
    return loader.load_all()


@pytest.fixture
def vendors():
    loader = VendorLoader()
    return loader.load_all()


@pytest.fixture
def engine(categories, vendors):
    return AssignmentEngine(categories=categories, vendors=vendors)


@pytest.fixture
def brief_generator():
    return BriefGenerator()


# ─────────────────────────────────────────────────────────────────────────────
# ASSIGNMENT ENGINE TESTS
# ─────────────────────────────────────────────────────────────────────────────


class TestAssignmentEngine:
    def test_document_processing_assigns_docuai(self, engine):
        buyer = BuyerInput(
            problem_description=(
                "We manually enter data from invoices into our ERP system. "
                "Our team processes hundreds of documents per week and the error rate is high."
            ),
            keywords=["invoice", "data entry", "OCR", "ERP"],
            signals={"documents_per_week": 200, "has_target_system": True},
            existing_systems=["SAP S/4HANA"],
        )
        result = engine.assign(buyer)

        assert result.primary_category_id == "ai_document_processing"
        assert len(result.assignments) >= 1
        # DocuAI should rank high for document processing + SAP
        vendor_ids = [a.vendor_id for a in result.assignments]
        assert "docuai" in vendor_ids

    def test_finance_automation_assigns_finops(self, engine):
        buyer = BuyerInput(
            problem_description=(
                "Month-end close takes 8 days. AP processing is manual. "
                "We need to reduce close time and automate reconciliation."
            ),
            keywords=["month-end close", "AP automation", "reconciliation"],
            signals={"monthly_transactions": 2000, "finance_team_size": 5, "has_accounting_system": True},
            existing_systems=["SAP S/4HANA"],
        )
        result = engine.assign(buyer)

        assert result.primary_category_id == "finance_backoffice_automation"
        assert len(result.assignments) >= 1
        vendor_ids = [a.vendor_id for a in result.assignments]
        assert "finops-ai" in vendor_ids

    def test_support_automation_assigns_supportwise(self, engine):
        buyer = BuyerInput(
            problem_description=(
                "Support tickets are growing faster than our team can handle. "
                "Repetitive questions consume senior agent time. "
                "Response times are too slow."
            ),
            keywords=["support tickets", "auto-resolution", "chatbot"],
            signals={"support_interactions_per_month": 2000, "repetitive_question_percentage": 60},
            existing_systems=["Zendesk"],
        )
        result = engine.assign(buyer)

        assert result.primary_category_id == "customer_support_automation"
        vendor_ids = [a.vendor_id for a in result.assignments]
        assert "supportwise" in vendor_ids

    def test_workflow_assigns_flowmatic(self, engine):
        buyer = BuyerInput(
            problem_description=(
                "We have manual handoffs between systems that cause delays. "
                "Approval processes are slow. Our teams use different tools "
                "that don't talk to each other."
            ),
            keywords=["workflow", "approval", "automation", "integration"],
            signals={"systems_to_connect": 4, "process_steps": 8, "process_frequency_per_week": 50},
            existing_systems=["Salesforce", "SAP"],
        )
        result = engine.assign(buyer)

        assert result.primary_category_id == "workflow_orchestration"
        vendor_ids = [a.vendor_id for a in result.assignments]
        assert "flowmatic" in vendor_ids

    def test_assignment_returns_ranked_results(self, engine):
        buyer = BuyerInput(
            problem_description=(
                "We manually enter data from invoices and need automation. "
                "High volume, high error rate, need SAP integration."
            ),
            keywords=["invoice", "automation", "SAP"],
            signals={"documents_per_week": 300, "has_target_system": True},
            existing_systems=["SAP S/4HANA"],
        )
        result = engine.assign(buyer)
        if len(result.assignments) > 1:
            assert result.assignments[0].rank < result.assignments[1].rank
            assert result.assignments[0].overall_score >= result.assignments[1].overall_score

    def test_no_match_returns_explanation(self, engine):
        buyer = BuyerInput(
            problem_description="something completely unrelated to any category",
            keywords=[],
            signals={},
        )
        result = engine.assign(buyer)
        assert result.explanation != ""


# ─────────────────────────────────────────────────────────────────────────────
# BRIEF GENERATOR TESTS
# ─────────────────────────────────────────────────────────────────────────────


class TestBriefGenerator:
    def _get_result(self, engine) -> AssignmentResult:
        buyer = BuyerInput(
            problem_description=(
                "We manually enter data from invoices into SAP. "
                "Processing hundreds of documents per week. High error rate."
            ),
            keywords=["invoice", "OCR", "SAP"],
            signals={"documents_per_week": 200, "has_target_system": True},
            existing_systems=["SAP S/4HANA"],
        )
        return engine.assign(buyer)

    def test_free_tier_no_vendors(self, engine, brief_generator):
        result = self._get_result(engine)
        brief = brief_generator.generate_free(result)
        assert brief.tier == "free"
        assert brief.diagnosed_category != "unknown"
        assert len(brief.recommendations) == 0

    def test_starter_tier_has_vendor_names(self, engine, brief_generator):
        result = self._get_result(engine)
        brief = brief_generator.generate_starter(result)
        assert brief.tier == "starter"
        assert len(brief.recommendations) >= 1
        # Starter has no detailed strengths
        for rec in brief.recommendations:
            assert rec.vendor_name != ""
            assert len(rec.strengths) == 0

    def test_pro_tier_has_full_details(self, engine, brief_generator):
        result = self._get_result(engine)
        brief = brief_generator.generate_pro(result)
        assert brief.tier == "pro"
        assert len(brief.recommendations) >= 1
        for rec in brief.recommendations:
            assert rec.vendor_name != ""
            assert rec.fit_summary != ""
            assert rec.overall_score > 0

    def test_brief_has_id_and_timestamp(self, engine, brief_generator):
        result = self._get_result(engine)
        brief = brief_generator.generate_pro(result)
        assert brief.brief_id.startswith("brief_")
        assert brief.created_at != ""
