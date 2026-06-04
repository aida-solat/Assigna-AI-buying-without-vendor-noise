# Assigna __ AI buying without vendor noise

[![CI](https://github.com/aida-solat/Assigna-AI-buying-without-vendor-noise/actions/workflows/ci.yml/badge.svg)](https://github.com/aida-solat/Assigna-AI-buying-without-vendor-noise/actions/workflows/ci.yml)
[![License: BSL 1.1](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](LICENSE)
[![Backend Tests](https://img.shields.io/badge/tests-71%20passing-brightgreen)](backend/)
[![Frontend Routes](https://img.shields.io/badge/routes-26-blue)](frontend/)

**Evidence-based AI solution assignment for B2B buyers.**

Assigna converts ambiguous business problems into structured, scored vendor recommendations — with explainable reasoning, evidence auditing, and decision briefs that protect buyers from vendor noise.

Built & designed by **Deciwa**.

---

## The Problem

Enterprise AI buying is broken:

- Vendor websites all sound the same
- Review platforms assume you already know what category you need
- Sales calls optimize for the vendor, not your decision
- Generic AI assistants give generic advice without accountability

The result: companies buy the wrong solution, overpay, or stall for months in decision paralysis.

## What Assigna Does

Assigna acts as a **decision analyst** — not a marketplace, not a directory.

```
Business Problem → Need Diagnosis → Category Fit → Vendor Assignment → Decision Brief
```

1. **Buyer describes a business problem** in plain language
2. **Assigna diagnoses the real need** — maps it to structured solution categories using a versioned taxonomy
3. **It tells you what NOT to buy** — disqualifies categories that don't fit, with reasoning
4. **Scores vendors using evidence** — not reviews, not popularity, not paid placement
5. **Delivers a Decision Brief** — scored vendors, risks, evidence gaps, questions for vendor calls, procurement checklist

## Key Differentiators

| What                      | How                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision-first**        | Users enter with a business problem, not a vendor search                                                                                               |
| **Taxonomy-driven**       | Versioned solution taxonomy with diagnostic triggers, disqualifiers, evidence requirements, red flags, and decision questions                          |
| **Evidence over claims**  | Vendor scoring uses structured evidence: case studies, integration proofs, benchmark signals, documentation quality, source reliability, and freshness |
| **Not Recommended**       | Assigna actively tells buyers which categories or vendors to avoid, with explainable reasoning                                                         |
| **Ranking not for sale**  | Payment unlocks brief depth, never vendor score manipulation or paid ordering                                                                          |
| **Deterministic scoring** | Category fit, vendor scoring, disqualification, and ranking are formula-based, auditable, and replayable                                               |
| **LLM-bounded**           | LLMs may assist intake normalization and brief wording, but they do not control scores, gates, or rankings                                             |

## Solution Taxonomy

Assigna's core intelligence is a structured taxonomy of B2B AI/automation solution categories:

| #   | Category                                    | Type               |
| --- | ------------------------------------------- | ------------------ |
| 1   | AI Document Processing & Extraction         | Product            |
| 2   | Email & Inbox Workflow Automation           | Product            |
| 3   | Internal Knowledge Search / Enterprise RAG  | Product            |
| 4   | Customer Support Automation                 | Product            |
| 5   | Procurement & Supplier Workflow Automation  | Product            |
| 6   | Finance Back-Office Automation              | Product            |
| 7   | Compliance Document Review                  | Product            |
| 8   | Workflow Orchestration / Process Automation | Product            |
| 9   | Sales Operations Automation                 | Product            |
| 10  | Custom AI Agent / Consulting                | Service (fallback) |

Each category includes: diagnostic triggers, positive/negative signals, minimum thresholds, disqualifiers, evidence requirements, red flags, decision questions, adjacent categories, and differentiation logic.

## Scoring Model

Assigna uses a two-step assignment model.

### Step 1 — Hard Disqualifier Gates

Before scoring, vendors or categories can be rejected by deterministic gates:

- Missing evidence for the buyer's required use case
- No credible integration path
- Security or compliance documentation gaps
- Industry mismatch for regulated workflows
- Implementation model mismatch
- High-risk claims without supporting evidence

### Step 2 — Weighted Vendor Score

```
Overall Score =
  (need_fit × 0.30) +
  (evidence_quality × 0.25) +
  (industry_fit × 0.15) +
  (integration_fit × 0.15) +
  (risk_penalty × -0.15)
```

All scoring is deterministic, explainable, replayable, and independent of vendor payment.

## Evidence & Audit Model

Every recommendation is backed by versioned evidence and a replayable decision trace.

```
Evidence Object
├── source_type
├── source_url
├── claim
├── extracted_signal
├── source_reliability
├── freshness_score
├── verification_status
├── vendor_controlled
├── category_relevance
└── buyer_relevance
```

Each Decision Brief stores:

- Buyer problem snapshot
- Taxonomy version
- Vendor profile version
- Evidence snapshot
- Disqualifier results
- Scoring breakdown
- Final ranking
- SHA-256 brief hash

This makes every vendor recommendation explainable and reproducible.

## Monetization

| Tier           | Price      | What Buyer Gets                                                          |
| -------------- | ---------- | ------------------------------------------------------------------------ |
| **Free**       | €0         | Problem intake + category diagnosis + not-recommended reasoning          |
| **Starter**    | €99        | + 3 vendor names with basic scores                                       |
| **Pro**        | €499       | + 5 scored vendors, full reasoning, comparison matrix, risks, PDF export |
| **Enterprise** | €1,500+/mo | Multi-problem, ongoing monitoring, custom playbook                       |

Free tier demonstrates diagnosis quality. Paid tiers unlock vendor identity and depth.

## Architecture

```
assigna/
├── backend/          # FastAPI + deterministic scoring engine
│   ├── app/
│   │   ├── api/      # REST endpoints (9 routes)
│   │   ├── engine/   # Assignment + brief generation
│   │   ├── evidence/ # Evidence schema, source registry, freshness, reliability, verification, disqualifiers
│   │   ├── audit/    # Replayable decision trace, scoring breakdown, brief hash
│   │   ├── taxonomy/ # Diagnosis, scoring, validation
│   │   ├── vendors/  # Vendor profiles + evidence
│   │   └── data/     # 10 category JSONs + vendor JSONs
│   └── tests/        # 71 tests
├── frontend/         # Next.js 16 + TypeScript + Tailwind
│   └── src/
│       ├── app/      # 26 routes (public + buyer + admin)
│       ├── components/ # 27 reusable components
│       └── lib/      # Types, validation, API client
└── docs/
    ├── prd.md
    └── solution-taxonomy.md
```

## Tech Stack

**Backend:**

- Python 3.11, FastAPI, Pydantic v2
- Deterministic rule-based scoring (no LLM in scoring pipeline)
- Evidence engine with source reliability, freshness decay, and verification status
- Hard disqualifier gates before scoring (6 rejection criteria)
- Audit trace with SHA-256 brief hash — every recommendation replayable
- 71 passing tests

**Frontend:**

- Next.js 16 (App Router, Turbopack)
- TypeScript, Tailwind CSS v4, TanStack Query
- Framer Motion, Zod v4, Lucide icons
- Geist typeface
- 26 routes, zero build errors

## What This Is NOT

Assigna does not have — and will never have:

- Vendor bidding or pay-to-rank
- Chat marketplace
- Public vendor reviews or community voting
- Ads
- Vendor self-serve portal (in current version)
- Complex CRM or team collaboration
- Real-time web scraping in user-facing recommendations

Evidence is curated, versioned, and periodically refreshed instead of scraped live during buyer decisions.

These constraints protect the decision-first model.

## Design Philosophy

> "This system is protecting my decision from vendor noise."

The product wins when a buyer feels they have a quiet, competent analyst on their side — one that structures the problem, suggests what fits, warns what doesn't, and says "don't buy" when the evidence isn't there.

Not dashboard glitter. A decision cockpit.

---

## Running Locally

```bash
# Backend
cd backend
conda activate assigna
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
pnpm install
pnpm dev --port 3002
```

## Tests

```bash
# Backend (71 tests)
cd backend
python -m pytest tests/ -v

# Frontend (build verification)
cd frontend
pnpm build
```

## Sponsor

If Assigna is useful to your work or research, consider [sponsoring the project](https://github.com/sponsors/aida-solat).

## License

[Business Source License 1.1](LICENSE) — free for non-commercial use. Converts to Apache 2.0 after 4 years.

---

© Assigna. Built & designed by Deciwa.
