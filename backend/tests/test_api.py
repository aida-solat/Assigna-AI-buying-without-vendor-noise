"""Tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


class TestHealthEndpoint:
    def test_health(self, client):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["categories_loaded"] == 10
        assert data["vendors_loaded"] == 5

    def test_root(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert resp.json()["name"] == "Assigna"


class TestTaxonomyEndpoints:
    def test_list_categories(self, client):
        resp = client.get("/api/v1/taxonomy")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 10

    def test_get_category(self, client):
        resp = client.get("/api/v1/taxonomy/ai_document_processing")
        assert resp.status_code == 200
        data = resp.json()
        assert data["category_id"] == "ai_document_processing"
        assert data["category_type"] == "product_category"

    def test_get_nonexistent_category(self, client):
        resp = client.get("/api/v1/taxonomy/nonexistent")
        assert resp.status_code == 404


class TestVendorEndpoints:
    def test_list_vendors(self, client):
        resp = client.get("/api/v1/vendors")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 5

    def test_get_vendor(self, client):
        resp = client.get("/api/v1/vendors/docuai")
        assert resp.status_code == 200
        data = resp.json()
        assert data["vendor_name"] == "DocuAI"

    def test_get_nonexistent_vendor(self, client):
        resp = client.get("/api/v1/vendors/nonexistent")
        assert resp.status_code == 404


class TestAssignEndpoint:
    def test_assign_free_tier(self, client):
        resp = client.post("/api/v1/assign", json={
            "problem_description": "We manually enter data from invoices into our ERP. Hundreds of documents per week with high error rates.",
            "keywords": ["invoice", "OCR", "data entry"],
            "signals": {"documents_per_week": 200, "has_target_system": True},
            "existing_systems": ["SAP S/4HANA"],
            "tier": "free",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["tier"] == "free"
        assert data["diagnosed_category"] == "ai_document_processing"
        assert data["diagnosis_confidence"] > 0
        assert len(data["recommendations"]) == 0

    def test_assign_starter_tier(self, client):
        resp = client.post("/api/v1/assign", json={
            "problem_description": "We manually enter data from invoices into our ERP. Hundreds of documents per week with high error rates.",
            "keywords": ["invoice", "OCR", "data entry"],
            "signals": {"documents_per_week": 200, "has_target_system": True},
            "existing_systems": ["SAP S/4HANA"],
            "tier": "starter",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["tier"] == "starter"
        assert len(data["recommendations"]) >= 1
        assert data["recommendations"][0]["vendor_name"] != ""

    def test_assign_pro_tier(self, client):
        resp = client.post("/api/v1/assign", json={
            "problem_description": "We manually enter data from invoices into our ERP. Hundreds of documents per week with high error rates.",
            "keywords": ["invoice", "OCR", "data entry"],
            "signals": {"documents_per_week": 200, "has_target_system": True},
            "existing_systems": ["SAP S/4HANA"],
            "tier": "pro",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["tier"] == "pro"
        assert len(data["recommendations"]) >= 1
        rec = data["recommendations"][0]
        assert rec["fit_summary"] != ""
        assert rec["overall_score"] > 0
        assert "score_breakdown" in rec

    def test_assign_validation_error(self, client):
        resp = client.post("/api/v1/assign", json={
            "problem_description": "too short",
        })
        assert resp.status_code == 422

    def test_assign_support_category(self, client):
        resp = client.post("/api/v1/assign", json={
            "problem_description": "Support tickets are growing faster than our team. Repetitive questions consume time. Response times are too slow and SLAs missed.",
            "keywords": ["support", "tickets", "auto-resolution"],
            "signals": {"support_interactions_per_month": 3000, "repetitive_question_percentage": 50},
            "existing_systems": ["Zendesk"],
            "tier": "pro",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["diagnosed_category"] == "customer_support_automation"


class TestValidationEndpoint:
    def test_validate_taxonomy(self, client):
        resp = client.get("/api/v1/admin/validate")
        assert resp.status_code == 200
        data = resp.json()
        assert data["valid"] is True
        assert len(data["errors"]) == 0
