# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0]

### Added

- **Evidence engine** — structured `EvidenceObject` with source type, freshness
  decay, verification status, vendor-control bias, and effective-confidence scoring.
- **Source registry** — reliability weights per source type (third-party reports
  through vendor websites).
- **Hard disqualifier gates** — six deterministic rejection criteria that run
  before scoring, so unfit vendors are never ranked.
- **Audit trace** — every decision brief emits a replayable `DecisionTrace` with
  taxonomy version, evaluated/disqualified vendors, scoring breakdown, and a
  SHA-256 brief hash.
- **Audit API** — `/audit/trace/{brief_id}` and `/audit/traces`.
- `ARCHITECTURE.md` documenting design rationale and the LLM boundary.

### Changed

- Assignment pipeline restructured to a fixed five-step sequence with gates
  before scoring.
- Backend test suite expanded to 71 tests.

## [0.1.0]

### Added

- Versioned solution taxonomy (10 categories) with schema validation.
- Deterministic diagnosis engine (buyer signals → candidate categories).
- Weighted vendor scoring formula (need fit, evidence quality, industry fit,
  integration fit, risk penalty).
- Tiered decision brief generation (free / starter / pro).
- Next.js 16 frontend (26 routes) for intake, diagnosis, vendor shortlist, and
  brief viewing.
