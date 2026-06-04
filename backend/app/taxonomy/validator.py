"""Validates taxonomy integrity beyond individual schema validation.

Checks cross-category constraints:
- category_id uniqueness
- adjacent_categories reference existing IDs
- evidence weights sum to ~1.0
- budget min < max
- timeline min < max
- no orphan references
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.taxonomy.schema import TaxonomyCategory


@dataclass
class ValidationError:
    category_id: str
    field: str
    message: str
    severity: str = "error"  # "error" or "warning"


@dataclass
class ValidationResult:
    valid: bool = True
    errors: list[ValidationError] = field(default_factory=list)
    warnings: list[ValidationError] = field(default_factory=list)

    def add_error(self, category_id: str, field_name: str, message: str) -> None:
        self.errors.append(ValidationError(category_id, field_name, message, "error"))
        self.valid = False

    def add_warning(self, category_id: str, field_name: str, message: str) -> None:
        self.warnings.append(ValidationError(category_id, field_name, message, "warning"))


class TaxonomyValidator:
    """Cross-category validation for taxonomy integrity."""

    SPECIAL_ADJACENT_IDS = {"all_product_categories"}

    def validate(self, categories: dict[str, TaxonomyCategory]) -> ValidationResult:
        result = ValidationResult()

        all_ids = set(categories.keys())

        for cat_id, cat in categories.items():
            self._validate_adjacent_references(cat, all_ids, result)
            self._validate_evidence_weights(cat, result)
            self._validate_budget_range(cat, result)
            self._validate_timeline_range(cat, result)
            self._validate_differentiation_keys(cat, result)

        self._validate_uniqueness(categories, result)

        return result

    def _validate_adjacent_references(
        self,
        cat: TaxonomyCategory,
        all_ids: set[str],
        result: ValidationResult,
    ) -> None:
        for adj_id in cat.adjacent_categories:
            if adj_id in self.SPECIAL_ADJACENT_IDS:
                continue
            if adj_id not in all_ids:
                result.add_error(
                    cat.category_id,
                    "adjacent_categories",
                    f"References non-existent category: '{adj_id}'",
                )

    def _validate_evidence_weights(
        self, cat: TaxonomyCategory, result: ValidationResult
    ) -> None:
        total = sum(e.weight for e in cat.evidence_requirements)
        if not (0.95 <= total <= 1.05):
            result.add_error(
                cat.category_id,
                "evidence_requirements",
                f"Weights sum to {total:.2f}, expected ~1.0",
            )

        types_seen: set[str] = set()
        for ev in cat.evidence_requirements:
            if ev.type in types_seen:
                result.add_error(
                    cat.category_id,
                    "evidence_requirements",
                    f"Duplicate evidence type: '{ev.type}'",
                )
            types_seen.add(ev.type)

    def _validate_budget_range(
        self, cat: TaxonomyCategory, result: ValidationResult
    ) -> None:
        if cat.budget_band.min >= cat.budget_band.max:
            result.add_error(
                cat.category_id,
                "budget_band",
                f"min ({cat.budget_band.min}) >= max ({cat.budget_band.max})",
            )

    def _validate_timeline_range(
        self, cat: TaxonomyCategory, result: ValidationResult
    ) -> None:
        if cat.typical_timeline_weeks.min >= cat.typical_timeline_weeks.max:
            result.add_error(
                cat.category_id,
                "typical_timeline_weeks",
                f"min ({cat.typical_timeline_weeks.min}) >= max ({cat.typical_timeline_weeks.max})",
            )

    def _validate_differentiation_keys(
        self, cat: TaxonomyCategory, result: ValidationResult
    ) -> None:
        for key in cat.differentiation_from_adjacent:
            if not key.startswith("vs_"):
                result.add_warning(
                    cat.category_id,
                    "differentiation_from_adjacent",
                    f"Key '{key}' should start with 'vs_'",
                )

    def _validate_uniqueness(
        self,
        categories: dict[str, TaxonomyCategory],
        result: ValidationResult,
    ) -> None:
        names_seen: dict[str, str] = {}
        for cat_id, cat in categories.items():
            if cat.category_name in names_seen:
                result.add_error(
                    cat_id,
                    "category_name",
                    f"Duplicate name '{cat.category_name}' (also in '{names_seen[cat.category_name]}')",
                )
            names_seen[cat.category_name] = cat_id
