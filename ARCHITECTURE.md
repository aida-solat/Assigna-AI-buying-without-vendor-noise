# Architecture

This document explains *why* Assigna is built the way it is. The code shows
*what* happens; this explains the reasoning, the tradeoffs, and the boundaries
that keep the system trustworthy.

Built & designed by **Deciwa**.

---

## 1. The central design constraint

A buyer must be able to ask one question and get a defensible answer:

> "Why is this vendor ranked first, and would I get the same answer tomorrow?"

Everything in the architecture follows from making that question answerable.
That single constraint rules out three things most "AI recommender" systems do:

- It rules out **opaque model output** as the ranking authority.
- It rules out **non-reproducible** scoring (temperature, hidden state, drift).
- It rules out **pay-to-rank**, because ranking must be a pure function of evidence.

So the engine is deterministic by construction, and the LLM is pushed to the
edges where non-determinism is harmless.

---

## 2. The LLM boundary

This is the most important architectural decision in the system.

```
        ┌─────────────────────────────────────────────┐
        │  LLM-ASSISTED ZONE (non-authoritative)        │
        │  - Intake normalization (free text → signals) │
        │  - Brief wording / summarization              │
        └───────────────────────┬───────────────────────┘
                                 │  structured signals only
                                 ▼
        ┌─────────────────────────────────────────────┐
        │  DETERMINISTIC ZONE (authoritative)           │
        │  - Diagnosis (category matching)              │
        │  - Disqualifier gates                         │
        │  - Evidence scoring                           │
        │  - Ranking                                    │
        └─────────────────────────────────────────────┘
```

An LLM may help a buyer turn a messy paragraph into structured signals, and it
may help phrase the final brief in readable prose. It **never** assigns a score,
opens or closes a gate, or changes an ordering. Those operations are pure
functions over typed inputs.

Consequence: if you remove the LLM entirely, the recommendation does not change —
only the input ergonomics and the output prose do. That is the test for whether
the boundary is real.

---

## 3. Pipeline

The assignment pipeline (`backend/app/engine/assignment.py`) is a fixed
five-step sequence. Order matters: **gates run before scoring**, so a vendor
that fails a hard requirement is never ranked, regardless of how strong its
other signals are.

```
1. Diagnose      buyer signals → candidate categories          (taxonomy/diagnosis.py)
2. Match         category → vendors claiming that capability    (engine/assignment.py)
3. Disqualify    hard gates reject unfit vendors                (evidence/disqualifier.py)
4. Score         weighted formula over qualified vendors only   (engine/assignment.py)
5. Rank + trace  sort, assign ranks, emit audit trace           (audit/trace.py)
```

### Why gates *before* scores

A weighted score can hide a disqualifying fact. A vendor with no integration
path to the buyer's stack should not be "rank 3 with a penalty" — it should be
absent, with a stated reason. Mixing hard constraints into a soft score is how
recommenders end up suggesting things that cannot possibly work. Separating the
two keeps both honest: gates answer *"is this even viable?"*, scores answer
*"among viable options, which is best?"*.

---

## 4. Evidence as the atomic unit of trust

Most vendor directories store claims. Assigna stores **evidence about claims**.

The `EvidenceObject` (`backend/app/evidence/schema.py`) is the smallest unit the
engine reasons about. Each one carries not just a claim but the metadata needed
to discount it:

| Dimension | Why it exists |
|---|---|
| `source_type` | A third-party benchmark is worth more than a marketing page |
| `verification_status` | Verified vs. self-declared changes how much we trust it |
| `vendor_controlled` | Vendor-sourced evidence carries an inherent bias penalty |
| `freshness_days` | A 2-year-old benchmark is not a current capability |
| `category_relevance` | Does this evidence actually map to the requirement? |
| `buyer_relevance` | Is it from the buyer's industry / company size? |

`effective_confidence` is a pure function of these: base confidence decayed by
age, adjusted by source reliability, boosted for verification, penalized for
vendor control. No evidence is taken at face value, and the discounting is
explicit and inspectable rather than baked into a model weight.

This is the difference between *"the vendor says 95% accuracy"* and
*"a self-declared, vendor-controlled accuracy claim from 14 months ago, relevant
to a different industry — discounted accordingly."*

---

## 5. Determinism and reproducibility

Two guarantees:

1. **Same inputs → same output.** The scoring path contains no randomness, no
   wall-clock dependence, and no network calls. Given the same taxonomy version,
   the same vendor profiles, and the same evidence, the ranking is identical.

2. **Every output is auditable.** Each brief emits a `DecisionTrace`
   (`backend/app/audit/trace.py`) capturing the taxonomy version, every category
   and vendor evaluated, every disqualification reason, the full score breakdown,
   and a **SHA-256 brief hash**. The buyer's raw problem is hashed, not stored as
   PII.

Together these make a recommendation *replayable*: you can hand someone the trace
and they can reconstruct exactly how the engine reached its conclusion.

---

## 6. Taxonomy as versioned source of truth

The ten solution categories are not hard-coded logic — they are versioned data
(`backend/app/data/taxonomy/*.json`) validated against a strict Pydantic schema
(`backend/app/taxonomy/schema.py`). Each category declares its own diagnostic
triggers, disqualifiers, evidence requirements (with weights that must sum to 1),
red flags, and decision questions.

This means the *intelligence* of the system lives in reviewable, diffable data,
not in code branches. Adding a category or tightening a requirement is a data
change with schema validation and tests — not a logic rewrite. The taxonomy
version is recorded in every audit trace, so a recommendation is always tied to
the exact ruleset that produced it.

---

## 7. Layering

```
api/        HTTP surface. Thin. Translates requests, never decides anything.
engine/     Orchestration. Owns the pipeline order and the scoring formula.
evidence/   Trust primitives. Schema, freshness, source reliability, gates.
audit/      Observability. Turns a decision into a replayable record.
taxonomy/   Domain rules. Diagnosis, scoring, validation over versioned data.
vendors/    Vendor profiles and their evidence.
data/       The versioned source of truth (taxonomy + vendors).
```

Dependencies point inward: `api` depends on `engine`, `engine` depends on
`evidence`/`taxonomy`/`vendors`, and the trust primitives in `evidence` depend on
nothing but the schema. The domain rules don't know HTTP exists.

---

## 8. Tradeoffs taken deliberately

- **Curated over scraped.** Evidence is curated and versioned, not scraped live
  during a buyer's decision. Slower to grow, but every data point is accountable.
- **Fewer vendors, deeper evidence.** The value is in the depth of evidence per
  vendor, not the size of a directory.
- **Explainability over peak accuracy.** A transparent formula a buyer can audit
  beats a black box that scores marginally better but can't justify itself.
- **Hard gates over universal soft scoring.** Some facts are disqualifying, and
  the architecture treats them that way.

---

## 9. Testing strategy

71 backend tests cover the parts that must not silently drift:

- **Taxonomy validation** — every category conforms to schema, weights sum to 1,
  adjacency references resolve.
- **Diagnosis** — known problems map to expected categories; the consulting
  fallback only fires when nothing else fits.
- **Scoring** — full evidence scores high, missing required evidence is penalized,
  zero evidence scores zero, comparisons are stable.
- **Evidence engine** — freshness decay, source reliability, and gate behavior.
- **Audit** — traces capture diagnosis, disqualification, and a stable brief hash.

The intent is that any change altering a ranking must also change a test — so
drift is loud, not silent.
