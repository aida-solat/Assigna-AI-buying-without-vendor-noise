"""Evidence engine — structured evidence objects with source registry, freshness, and claim verification."""

from app.evidence.schema import EvidenceObject, SourceType
from app.evidence.freshness import FreshnessScorer
from app.evidence.source_registry import SourceRegistry

__all__ = ["EvidenceObject", "SourceType", "FreshnessScorer", "SourceRegistry"]
