"""Audit trail — every recommendation is replayable.

With taxonomy version X, vendor profile version Y, evidence snapshot Z,
why did vendor A score 82%? This module answers that question.
"""

from app.audit.trace import DecisionTrace, TraceSummary

__all__ = ["DecisionTrace", "TraceSummary"]
