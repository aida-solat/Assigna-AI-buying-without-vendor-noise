"""Hard disqualifier gates for vendor assignment.

Before scoring, vendors are checked against hard gates.
If any gate fails, the vendor is rejected from the shortlist
with a clear reason — no scoring is performed.

This separates "not good enough" (low score) from "must not be considered" (disqualified).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from app.taxonomy.schema import TaxonomyCategory
from app.vendors.schema import VendorProfile, VendorCapability


@dataclass
class DisqualificationResult:
    """Result of vendor disqualification check."""

    vendor_id: str
    vendor_name: str
    passed: bool
    reasons: list[str] = field(default_factory=list)


class VendorDisqualifier:
    """Hard gates that reject vendors before scoring.

    Gates:
    1. Missing security documentation for regulated industries
    2. No integration path to buyer's systems
    3. No evidence at all for target category
    4. Regulated industry mismatch
    5. Implementation model mismatch (cloud-only vs on-prem required)
    6. Budget floor/ceiling violation
    """

    def check(
        self,
        vendor: VendorProfile,
        capability: VendorCapability,
        category: TaxonomyCategory,
        buyer_systems: list[str],
        buyer_budget: Optional[int] = None,
        buyer_industry: Optional[str] = None,
        buyer_deployment_requirement: Optional[str] = None,
    ) -> DisqualificationResult:
        """Run all hard gates. Returns passed=False if any gate fails."""
        result = DisqualificationResult(
            vendor_id=vendor.vendor_id,
            vendor_name=vendor.vendor_name,
            passed=True,
        )

        # Gate 1: Zero evidence
        if not capability.evidence:
            result.passed = False
            result.reasons.append(
                "No evidence provided for this category. Cannot score."
            )

        # Gate 2: No required evidence types at all
        required_types = {
            r.type for r in category.evidence_requirements if r.required
        }
        provided_types = {e.type for e in capability.evidence}
        coverage = required_types & provided_types
        if required_types and not coverage:
            result.passed = False
            result.reasons.append(
                f"Missing all required evidence types: {', '.join(required_types)}"
            )

        # Gate 3: No integration path
        if buyer_systems:
            vendor_integrations_lower = {
                s.lower() for s in capability.integrations_supported
            }
            buyer_lower = {s.lower() for s in buyer_systems}
            if not (vendor_integrations_lower & buyer_lower):
                result.passed = False
                result.reasons.append(
                    f"No integration path to buyer systems: {', '.join(buyer_systems)}"
                )

        # Gate 4: Deployment model mismatch
        if buyer_deployment_requirement:
            vendor_models_lower = {
                m.lower() for m in vendor.deployment_model
            }
            if buyer_deployment_requirement.lower() not in vendor_models_lower:
                result.passed = False
                result.reasons.append(
                    f"Deployment model mismatch: buyer requires '{buyer_deployment_requirement}', "
                    f"vendor offers {vendor.deployment_model}"
                )

        # Gate 5: Budget floor violation
        if buyer_budget is not None:
            budget_min = category.budget_band.min
            budget_max = category.budget_band.max
            if buyer_budget < budget_min * 0.5:
                result.passed = False
                result.reasons.append(
                    f"Budget (€{buyer_budget:,}) is below viable threshold "
                    f"for this category (min €{budget_min:,})"
                )

        # Gate 6: Missing security documentation for compliance-sensitive categories
        compliance_categories = {
            "compliance_document_review",
            "finance_backoffice_automation",
        }
        if category.category_id in compliance_categories:
            has_security = any(
                cert.lower() in ("soc2 type ii", "soc 2 type ii", "iso 27001", "iso27001")
                for cert in vendor.certifications
            )
            if not has_security:
                result.passed = False
                result.reasons.append(
                    "Missing security certification (SOC2/ISO27001) required "
                    "for compliance-sensitive category"
                )

        return result

    def check_batch(
        self,
        vendors: list[tuple[VendorProfile, VendorCapability]],
        category: TaxonomyCategory,
        buyer_systems: list[str],
        buyer_budget: Optional[int] = None,
        buyer_industry: Optional[str] = None,
        buyer_deployment_requirement: Optional[str] = None,
    ) -> tuple[
        list[tuple[VendorProfile, VendorCapability]],
        list[DisqualificationResult],
    ]:
        """Check all vendors, return (qualified, disqualified)."""
        qualified = []
        disqualified = []

        for vendor, capability in vendors:
            result = self.check(
                vendor=vendor,
                capability=capability,
                category=category,
                buyer_systems=buyer_systems,
                buyer_budget=buyer_budget,
                buyer_industry=buyer_industry,
                buyer_deployment_requirement=buyer_deployment_requirement,
            )
            if result.passed:
                qualified.append((vendor, capability))
            else:
                disqualified.append(result)

        return qualified, disqualified
