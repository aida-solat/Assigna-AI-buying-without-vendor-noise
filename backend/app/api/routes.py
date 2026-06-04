"""FastAPI routes for Assigna."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.api.models import (
    BuyerProblemRequest,
    DecisionBriefResponse,
    DiagnosisResponse,
    HealthResponse,
    TaxonomyCategoryResponse,
    VendorRecommendationResponse,
    VendorSummaryResponse,
)
from app.audit.trace import TraceBuilder
from app.engine.assignment import AssignmentEngine
from app.engine.brief import BriefGenerator
from app.taxonomy.diagnosis import BuyerInput
from app.taxonomy.loader import TaxonomyLoader
from app.taxonomy.validator import TaxonomyValidator
from app.vendors.loader import VendorLoader

# ─── Bootstrap ────────────────────────────────────────────────────────────────

taxonomy_loader = TaxonomyLoader()
taxonomy_loader.load_all()

vendor_loader = VendorLoader()
vendor_loader.load_all()

validator = TaxonomyValidator()
brief_generator = BriefGenerator()
trace_builder = TraceBuilder()

# In-memory trace store (production: persist to database)
_traces: dict[str, dict] = {}

# ─── Routers ──────────────────────────────────────────────────────────────────

router = APIRouter()


# ─── Health ───────────────────────────────────────────────────────────────────


@router.get("/health", response_model=HealthResponse, tags=["System"])
def health():
    return HealthResponse(
        status="ok",
        version="0.2.0",
        categories_loaded=len(taxonomy_loader.categories),
        vendors_loaded=len(vendor_loader.vendors),
    )


# ─── Core Assignment Endpoint ─────────────────────────────────────────────────


@router.post("/assign", response_model=DecisionBriefResponse, tags=["Assignment"])
def assign_vendors(request: BuyerProblemRequest):
    """Main endpoint: Submit buyer problem → Get diagnosis + vendor recommendations.

    Tier controls output depth:
    - free: diagnosis only (category + explanation)
    - starter: + vendor names and scores
    - pro: full brief with reasoning, evidence breakdown, decision questions
    """
    buyer_input = BuyerInput(
        problem_description=request.problem_description,
        keywords=request.keywords,
        signals=request.signals,
        budget_eur=request.budget_eur,
        company_size=request.company_size,
        existing_systems=request.existing_systems,
    )

    engine = AssignmentEngine(
        categories=taxonomy_loader.categories,
        vendors=vendor_loader.vendors,
    )

    result = engine.assign(buyer_input)

    # Generate brief based on tier
    if request.tier == "pro":
        brief = brief_generator.generate_pro(result)
    elif request.tier == "starter":
        brief = brief_generator.generate_starter(result)
    else:
        brief = brief_generator.generate_free(result)

    # Build response
    top_candidates = [
        DiagnosisResponse(
            category_id=c.category_id,
            category_name=c.category_name,
            confidence=c.confidence,
            rank=c.rank,
            positive_signals_matched=c.positive_signals_matched,
            negative_signals_matched=c.negative_signals_matched,
            explanation=c.explanation,
        )
        for c in result.diagnosis.top_3
    ]

    recommendations = [
        VendorRecommendationResponse(
            rank=r.rank,
            vendor_name=r.vendor_name,
            vendor_id=r.vendor_id,
            overall_score=r.overall_score,
            fit_summary=r.fit_summary,
            strengths=r.strengths,
            concerns=r.concerns,
            score_breakdown=r.score_breakdown,
            decision_questions=r.decision_questions,
        )
        for r in brief.recommendations
    ]

    # Build audit trace
    trace = trace_builder.build(result, brief)
    _traces[brief.brief_id] = trace.to_dict()

    return DecisionBriefResponse(
        brief_id=brief.brief_id,
        tier=brief.tier,
        problem_summary=brief.problem_summary,
        diagnosed_category=brief.diagnosed_category,
        diagnosed_category_name=brief.diagnosed_category_name,
        diagnosis_confidence=brief.diagnosis_confidence,
        diagnosis_explanation=brief.diagnosis_explanation,
        top_candidates=top_candidates,
        recommendations=recommendations,
        not_recommended_reasons=brief.not_recommended_reasons,
        decision_questions=brief.decision_questions,
        red_flags_to_watch=brief.red_flags_to_watch,
        next_steps=brief.next_steps,
    )


# ─── Taxonomy Endpoints ───────────────────────────────────────────────────────


@router.get("/taxonomy", response_model=list[TaxonomyCategoryResponse], tags=["Taxonomy"])
def list_categories():
    """List all taxonomy categories."""
    return [
        TaxonomyCategoryResponse(
            category_id=c.category_id,
            category_name=c.category_name,
            category_type=c.category_type.value,
            parent_category=c.parent_category,
            description=c.description,
            buyer_problem_patterns=c.buyer_problem_patterns,
            typical_use_cases=c.typical_use_cases,
            not_for=c.not_for,
            implementation_complexity=c.implementation_complexity.value,
            budget_band=c.budget_band.model_dump(),
        )
        for c in taxonomy_loader.categories.values()
    ]


@router.get("/taxonomy/{category_id}", response_model=TaxonomyCategoryResponse, tags=["Taxonomy"])
def get_category(category_id: str):
    """Get a specific taxonomy category."""
    cat = taxonomy_loader.get_category(category_id)
    if not cat:
        raise HTTPException(status_code=404, detail=f"Category '{category_id}' not found")
    return TaxonomyCategoryResponse(
        category_id=cat.category_id,
        category_name=cat.category_name,
        category_type=cat.category_type.value,
        parent_category=cat.parent_category,
        description=cat.description,
        buyer_problem_patterns=cat.buyer_problem_patterns,
        typical_use_cases=cat.typical_use_cases,
        not_for=cat.not_for,
        implementation_complexity=cat.implementation_complexity.value,
        budget_band=cat.budget_band.model_dump(),
    )


# ─── Vendor Endpoints ─────────────────────────────────────────────────────────


@router.get("/vendors", response_model=list[VendorSummaryResponse], tags=["Vendors"])
def list_vendors():
    """List all vendors (summary view)."""
    return [
        VendorSummaryResponse(
            vendor_id=v.vendor_id,
            vendor_name=v.vendor_name,
            description=v.description,
            website=v.website,
            categories=v.category_ids,
            certifications=v.certifications,
            deployment_model=v.deployment_model,
        )
        for v in vendor_loader.vendors.values()
    ]


@router.get("/vendors/{vendor_id}", response_model=VendorSummaryResponse, tags=["Vendors"])
def get_vendor(vendor_id: str):
    """Get a specific vendor."""
    vendor = vendor_loader.get_vendor(vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail=f"Vendor '{vendor_id}' not found")
    return VendorSummaryResponse(
        vendor_id=vendor.vendor_id,
        vendor_name=vendor.vendor_name,
        description=vendor.description,
        website=vendor.website,
        categories=vendor.category_ids,
        certifications=vendor.certifications,
        deployment_model=vendor.deployment_model,
    )


# ─── Validation Endpoint (Internal/Admin) ────────────────────────────────────


@router.get("/admin/validate", tags=["Admin"])
def validate_taxonomy():
    """Run taxonomy validation and return results."""
    result = validator.validate(taxonomy_loader.categories)
    return {
        "valid": result.valid,
        "errors": [
            {"category_id": e.category_id, "field": e.field, "message": e.message}
            for e in result.errors
        ],
        "warnings": [
            {"category_id": e.category_id, "field": e.field, "message": e.message}
            for e in result.warnings
        ],
    }


# ─── Audit Endpoints ─────────────────────────────────────────────────────────


@router.get("/audit/trace/{brief_id}", tags=["Audit"])
def get_trace(brief_id: str):
    """Get full audit trace for a decision brief.

    Returns the complete forensic record: taxonomy version, vendor profiles,
    evidence snapshots, scoring breakdown, and brief hash for integrity verification.
    """
    trace = _traces.get(brief_id)
    if not trace:
        raise HTTPException(status_code=404, detail=f"No trace found for brief '{brief_id}'")
    return trace


@router.get("/audit/traces", tags=["Audit"])
def list_traces():
    """List all available audit traces (summary view)."""
    summaries = []
    for brief_id, trace in _traces.items():
        summaries.append({
            "brief_id": brief_id,
            "trace_id": trace.get("trace_id"),
            "generated_at": trace.get("generated_at"),
            "primary_category": trace.get("primary_category_name"),
            "vendor_count": trace.get("vendor_count"),
            "disqualified_count": trace.get("disqualified_vendor_count"),
            "brief_hash": trace.get("brief_hash"),
        })
    return summaries
