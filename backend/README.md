# Assigna — Backend

B2B solution assignment engine. Diagnoses buyer problems against a structured solution taxonomy, scores vendors using evidence quality, and generates tiered decision briefs.

Built & designed by **Deciwa**.

## Stack

- **Python 3.11+**
- **FastAPI** with Pydantic v2
- **Deterministic scoring** — no LLM in the scoring pipeline

## Setup

```bash
conda activate assigna
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
```

## Architecture

```
app/
├── api/
│   ├── models.py           # Request/response Pydantic models
│   └── routes.py           # FastAPI endpoints
├── engine/
│   ├── assignment.py       # Core: diagnosis → disqualify → score → rank
│   └── brief.py            # Decision brief generation (free/starter/pro tiers)
├── evidence/
│   ├── schema.py           # EvidenceObject: structured evidence with source type, freshness, verification
│   ├── freshness.py        # Freshness scoring with decay thresholds
│   ├── source_registry.py  # Source type reliability weights and adjusted quality
│   └── disqualifier.py     # Hard gates: reject vendors before scoring
├── audit/
│   └── trace.py            # DecisionTrace: full audit trail per brief (replayable)
├── taxonomy/
│   ├── schema.py           # TaxonomyCategory Pydantic model (source of truth)
│   ├── loader.py           # Load/validate category JSON files
│   ├── diagnosis.py        # Deterministic category diagnosis engine
│   ├── scoring.py          # Evidence quality scorer
│   └── validator.py        # Cross-category validation rules
├── vendors/
│   ├── schema.py           # VendorProfile model
│   └── loader.py           # Load vendor JSON files
├── data/
│   ├── taxonomy/           # 10 category JSON files + index
│   └── vendors/            # Curated vendor profiles
└── main.py                 # FastAPI app entrypoint
```

## API Endpoints

| Method | Path                      | Description                                                             |
| ------ | ------------------------- | ----------------------------------------------------------------------- |
| `POST` | `/assign`                 | Main pipeline: problem → diagnosis → disqualify → score → brief + trace |
| `GET`  | `/taxonomy`               | List all solution categories                                            |
| `GET`  | `/taxonomy/{id}`          | Get category detail                                                     |
| `GET`  | `/vendors`                | List curated vendors                                                    |
| `GET`  | `/vendors/{id}`           | Get vendor detail                                                       |
| `GET`  | `/health`                 | System health + loaded counts                                           |
| `GET`  | `/admin/validate`         | Run taxonomy cross-validation                                           |
| `GET`  | `/audit/trace/{brief_id}` | Full audit trace for a decision brief                                   |
| `GET`  | `/audit/traces`           | List all audit traces (summary)                                         |

## Assignment Pipeline

```
Step 1: Diagnose buyer need (deterministic category matching)
Step 2: Find vendors serving matched category
Step 3: Hard disqualifier gates (reject before scoring)
        - Zero evidence → rejected
        - Missing all required evidence types → rejected
        - No integration path to buyer systems → rejected
        - Deployment model mismatch → rejected
        - Budget below viable threshold → rejected
        - Missing security certs for compliance categories → rejected
Step 4: Score qualified vendors (weighted formula)
Step 5: Rank and generate brief + audit trace
```

## Scoring Formula

```
Overall Score =
  (need_fit × 0.30) +
  (evidence_quality × 0.25) +
  (industry_fit × 0.15) +
  (integration_fit × 0.15) +
  (risk_penalty × -0.15)
```

## Evidence Engine

Every evidence claim is a structured `EvidenceObject` with:

- **Source type** — case study, benchmark, integration doc, third-party report, etc.
- **Reliability weight** — third-party reports (0.95) vs vendor website (0.40)
- **Freshness scoring** — fresh (90d), aging (180d), stale (365d), expired (730d+)
- **Verification status** — verified, self-declared, pending, disputed
- **Effective confidence** — base confidence × freshness × source reliability × verification

## Audit Trace

Every decision brief generates a `DecisionTrace` containing:

- Buyer input hash (fingerprint, not PII)
- Taxonomy version used
- All categories evaluated + disqualified
- All vendors evaluated + disqualified (with reasons)
- Evidence snapshot per vendor (types, quality, coverage)
- Scoring snapshot per vendor (all score components)
- Brief hash (SHA-256 integrity)

Every recommendation is **replayable**: same taxonomy + same vendors + same evidence = same scores.

## Tests

```bash
python -m pytest tests/ -v
```

71 tests covering evidence engine, audit traces, disqualifier gates, taxonomy validation, diagnosis matching, assignment scoring, and API endpoints.
