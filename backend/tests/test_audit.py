"""Tests for the audit trail module."""


from app.audit.trace import TraceBuilder
from app.engine.assignment import AssignmentEngine
from app.engine.brief import BriefGenerator
from app.taxonomy.diagnosis import BuyerInput
from app.taxonomy.loader import TaxonomyLoader
from app.vendors.loader import VendorLoader


def _run_full_pipeline():
    """Helper: run full pipeline and return (result, brief, trace)."""
    tax = TaxonomyLoader()
    tax.load_all()
    ven = VendorLoader()
    ven.load_all()

    engine = AssignmentEngine(categories=tax.categories, vendors=ven.vendors)
    buyer_input = BuyerInput(
        problem_description=(
            "We receive hundreds of supplier invoices every week. "
            "Our team manually enters data into SAP. Errors are increasing."
        ),
        keywords=["invoice", "SAP", "OCR"],
        signals={"documents_per_week": 200, "has_target_system": True},
        budget_eur=100000,
        company_size=350,
        existing_systems=["SAP"],
    )

    result = engine.assign(buyer_input)
    brief_gen = BriefGenerator()
    brief = brief_gen.generate_pro(result)

    trace_builder = TraceBuilder()
    trace = trace_builder.build(result, brief)

    return result, brief, trace


class TestDecisionTrace:
    def test_trace_has_brief_id(self):
        _, brief, trace = _run_full_pipeline()
        assert trace.brief_id == brief.brief_id

    def test_trace_has_buyer_hash(self):
        _, _, trace = _run_full_pipeline()
        assert len(trace.buyer_problem_hash) == 16

    def test_trace_has_taxonomy_version(self):
        _, _, trace = _run_full_pipeline()
        assert trace.taxonomy_version == "0.2.0"

    def test_trace_has_scoring_snapshots(self):
        _, _, trace = _run_full_pipeline()
        assert len(trace.scoring_snapshots) > 0
        snap = trace.scoring_snapshots[0]
        assert snap.overall_score > 0
        assert snap.rank >= 1

    def test_trace_has_evidence_snapshots(self):
        _, _, trace = _run_full_pipeline()
        assert len(trace.evidence_snapshots) > 0
        snap = trace.evidence_snapshots[0]
        assert snap.evidence_count > 0

    def test_trace_has_brief_hash(self):
        _, _, trace = _run_full_pipeline()
        assert len(trace.brief_hash) == 24

    def test_same_input_same_buyer_hash(self):
        _, _, trace1 = _run_full_pipeline()
        _, _, trace2 = _run_full_pipeline()
        assert trace1.buyer_problem_hash == trace2.buyer_problem_hash

    def test_trace_summary(self):
        _, _, trace = _run_full_pipeline()
        summary = trace.summary
        assert summary.brief_id == trace.brief_id
        assert summary.vendor_count > 0
        assert summary.top_vendor is not None

    def test_trace_to_dict(self):
        _, _, trace = _run_full_pipeline()
        d = trace.to_dict()
        assert isinstance(d, dict)
        assert "trace_id" in d
        assert "brief_hash" in d
        assert "scoring_snapshots" in d

    def test_trace_records_disqualified_vendors(self):
        _, _, trace = _run_full_pipeline()
        # disqualified_vendor_count should be >= 0
        assert trace.disqualified_vendor_count >= 0
        assert isinstance(trace.disqualification_reasons, dict)

    def test_trace_records_diagnosis_method(self):
        _, _, trace = _run_full_pipeline()
        assert trace.diagnosis_method == "deterministic_rule_based"
