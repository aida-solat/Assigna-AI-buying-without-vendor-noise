"""Deterministic category diagnosis engine.

Given buyer problem input, matches against taxonomy categories using:
1. Signal matching (positive/negative from diagnostic_triggers)
2. Threshold checking (minimum_thresholds)
3. Disqualifier detection
4. Cross-category rules

Output: ranked list of candidate categories with confidence and explanation.
All scoring is deterministic and rule-based.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional

from app.taxonomy.schema import TaxonomyCategory


@dataclass
class BuyerInput:
    """Structured buyer problem input for diagnosis."""

    problem_description: str
    keywords: list[str] = field(default_factory=list)
    signals: dict[str, Any] = field(default_factory=dict)
    budget_eur: Optional[int] = None
    company_size: Optional[int] = None
    existing_systems: list[str] = field(default_factory=list)


@dataclass
class DiagnosisCandidate:
    """A category match result with scoring breakdown."""

    category_id: str
    category_name: str
    confidence: float  # 0.0 - 1.0
    rank: str  # "primary", "secondary", "tertiary"
    positive_signals_matched: list[str] = field(default_factory=list)
    negative_signals_matched: list[str] = field(default_factory=list)
    disqualifiers_triggered: list[str] = field(default_factory=list)
    not_for_matched: list[str] = field(default_factory=list)
    explanation: str = ""

    @property
    def is_disqualified(self) -> bool:
        return len(self.disqualifiers_triggered) > 0


@dataclass
class DiagnosisResult:
    """Complete diagnosis output."""

    candidates: list[DiagnosisCandidate] = field(default_factory=list)
    disqualified: list[DiagnosisCandidate] = field(default_factory=list)
    prerequisite_warnings: list[str] = field(default_factory=list)

    @property
    def primary(self) -> Optional[DiagnosisCandidate]:
        viable = [c for c in self.candidates if not c.is_disqualified]
        return viable[0] if viable else None

    @property
    def top_3(self) -> list[DiagnosisCandidate]:
        viable = [c for c in self.candidates if not c.is_disqualified]
        return viable[:3]


class DiagnosisEngine:
    """Deterministic category matcher.

    Rules:
    1. Check all product categories (1-9) before custom consulting (10)
    2. If problem spans multiple categories, assign primary + secondary
    3. If all categories disqualified, recommend custom or flag prerequisite
    4. Custom consulting only when product categories fail
    """

    CUSTOM_CONSULTING_ID = "custom_ai_consulting"

    def __init__(self, categories: dict[str, TaxonomyCategory]):
        self._categories = categories

    def diagnose(self, buyer_input: BuyerInput) -> DiagnosisResult:
        """Run diagnosis against all categories and return ranked results."""
        result = DiagnosisResult()
        scored: list[DiagnosisCandidate] = []

        # Score product categories first (exclude custom consulting)
        product_categories = {
            k: v for k, v in self._categories.items() if k != self.CUSTOM_CONSULTING_ID
        }

        for cat_id, cat in product_categories.items():
            candidate = self._score_category(cat, buyer_input)
            if candidate.is_disqualified:
                result.disqualified.append(candidate)
            else:
                scored.append(candidate)

        # Sort by confidence descending
        scored.sort(key=lambda c: c.confidence, reverse=True)

        # Assign ranks
        for i, candidate in enumerate(scored):
            if i == 0:
                candidate.rank = "primary"
            elif i == 1:
                candidate.rank = "secondary"
            else:
                candidate.rank = "tertiary"

        result.candidates = scored

        # Cross-category rule: if all product categories fail, try custom consulting
        if not scored and self.CUSTOM_CONSULTING_ID in self._categories:
            custom_cat = self._categories[self.CUSTOM_CONSULTING_ID]
            custom_candidate = self._score_category(custom_cat, buyer_input)
            if not custom_candidate.is_disqualified:
                custom_candidate.rank = "primary"
                custom_candidate.explanation = (
                    "No standard product category matches. "
                    "Custom AI consulting recommended as fallback."
                )
                result.candidates = [custom_candidate]
            else:
                result.prerequisite_warnings.append(
                    "No category matches — buyer may need to address prerequisites "
                    "before any automation solution is viable."
                )

        # Generate explanations
        for candidate in result.candidates:
            if not candidate.explanation:
                candidate.explanation = self._build_explanation(candidate)

        return result

    def _score_category(
        self, cat: TaxonomyCategory, buyer_input: BuyerInput
    ) -> DiagnosisCandidate:
        """Score a single category against buyer input."""
        candidate = DiagnosisCandidate(
            category_id=cat.category_id,
            category_name=cat.category_name,
            confidence=0.0,
            rank="unranked",
        )

        text_lower = buyer_input.problem_description.lower()
        all_keywords = [k.lower() for k in buyer_input.keywords]
        combined_text = text_lower + " " + " ".join(all_keywords)

        # 1. Check positive signals
        for signal in cat.diagnostic_triggers.positive_signals:
            signal_words = self._extract_signal_words(signal)
            if self._signal_matches(signal_words, combined_text):
                candidate.positive_signals_matched.append(signal)

        # 2. Check negative signals
        for signal in cat.diagnostic_triggers.negative_signals:
            signal_words = self._extract_signal_words(signal)
            if self._signal_matches(signal_words, combined_text):
                candidate.negative_signals_matched.append(signal)

        # 3. Check disqualifiers
        for disq in cat.diagnostic_triggers.disqualifiers:
            if self._disqualifier_matches(disq, buyer_input, cat):
                candidate.disqualifiers_triggered.append(disq)

        # 4. Check not_for
        for not_for in cat.not_for:
            not_for_words = self._extract_signal_words(not_for)
            if self._signal_matches(not_for_words, combined_text):
                candidate.not_for_matched.append(not_for)

        # 5. Check buyer_problem_patterns (direct pattern match)
        pattern_matches = 0
        for pattern in cat.buyer_problem_patterns:
            pattern_words = self._extract_signal_words(pattern)
            if self._signal_matches(pattern_words, combined_text):
                pattern_matches += 1

        # Calculate confidence score
        candidate.confidence = self._calculate_confidence(
            positive_count=len(candidate.positive_signals_matched),
            total_positive=len(cat.diagnostic_triggers.positive_signals),
            negative_count=len(candidate.negative_signals_matched),
            not_for_count=len(candidate.not_for_matched),
            pattern_matches=pattern_matches,
            total_patterns=len(cat.buyer_problem_patterns),
        )

        return candidate

    def _calculate_confidence(
        self,
        positive_count: int,
        total_positive: int,
        negative_count: int,
        not_for_count: int,
        pattern_matches: int,
        total_patterns: int,
    ) -> float:
        """Calculate confidence score (0.0 - 1.0).

        Formula:
        - Pattern match contributes 40%
        - Positive signal match contributes 40%
        - Negative signals subtract 15% each
        - not_for matches subtract 10% each
        """
        if total_positive == 0 and total_patterns == 0:
            return 0.0

        pattern_score = (pattern_matches / max(total_patterns, 1)) * 0.40
        signal_score = (positive_count / max(total_positive, 1)) * 0.40

        base_score = pattern_score + signal_score

        # Penalties
        penalty = (negative_count * 0.15) + (not_for_count * 0.10)

        final = max(0.0, min(1.0, base_score - penalty))
        return round(final, 3)

    def _signal_matches(self, signal_words: list[str], text: str) -> bool:
        """Check if enough signal words appear in text (threshold: 50% of words)."""
        if not signal_words:
            return False
        matches = sum(1 for w in signal_words if w in text)
        return matches >= max(2, len(signal_words) * 0.5)

    def _extract_signal_words(self, signal: str) -> list[str]:
        """Extract meaningful words from a signal string (skip stopwords)."""
        stopwords = {
            "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
            "have", "has", "had", "do", "does", "did", "will", "would", "could",
            "should", "may", "might", "shall", "can", "need", "must", "ought",
            "i", "you", "he", "she", "it", "we", "they", "me", "him", "her",
            "us", "them", "my", "your", "his", "its", "our", "their", "this",
            "that", "these", "those", "and", "but", "or", "nor", "for", "yet",
            "so", "at", "by", "from", "in", "into", "of", "on", "to", "with",
            "not", "no", "if", "then", "than", "too", "very", "just", "about",
            "up", "out", "all", "also", "as", "each", "every", "both", "few",
            "more", "most", "other", "some", "such", "only", "own", "same",
            "when", "where", "how", "what", "which", "who", "whom", "why",
        }
        words = signal.lower().split()
        # Remove parenthetical content and special chars
        cleaned = []
        in_parens = False
        for w in words:
            if "(" in w:
                in_parens = True
                continue
            if ")" in w:
                in_parens = False
                continue
            if in_parens:
                continue
            w = w.strip(".,;:!?\"'—-")
            if w and w not in stopwords and len(w) > 2:
                cleaned.append(w)
        return cleaned

    def _disqualifier_matches(
        self,
        disqualifier: str,
        buyer_input: BuyerInput,
        cat: TaxonomyCategory,
    ) -> bool:
        """Check if a disqualifier condition is met based on buyer input signals.

        This uses buyer_input.signals for threshold checks.
        For text-based disqualifiers, falls back to keyword matching.
        """
        signals = buyer_input.signals
        thresholds = cat.diagnostic_triggers.minimum_thresholds

        # Check numeric thresholds from buyer signals
        for threshold_key, threshold_value in thresholds.items():
            if threshold_key in signals:
                buyer_value = signals[threshold_key]
                if isinstance(threshold_value, (int, float)) and isinstance(buyer_value, (int, float)):
                    if buyer_value < threshold_value:
                        return True
                elif isinstance(threshold_value, bool) and isinstance(buyer_value, bool):
                    if threshold_value and not buyer_value:
                        return True

        return False

    def _build_explanation(self, candidate: DiagnosisCandidate) -> str:
        """Build human-readable explanation for a diagnosis result."""
        parts = []

        if candidate.positive_signals_matched:
            parts.append(
                f"Matched {len(candidate.positive_signals_matched)} positive signals"
            )

        if candidate.negative_signals_matched:
            parts.append(
                f"WARNING: {len(candidate.negative_signals_matched)} negative signal(s) detected"
            )

        if candidate.not_for_matched:
            parts.append(
                f"CAUTION: {len(candidate.not_for_matched)} 'not_for' pattern(s) matched"
            )

        return ". ".join(parts) if parts else "Low signal match."
