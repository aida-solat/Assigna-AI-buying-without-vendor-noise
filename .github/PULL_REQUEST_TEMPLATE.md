## Summary

What does this change and why?

## Component

- [ ] Backend (API / engine)
- [ ] Evidence engine
- [ ] Audit trail
- [ ] Taxonomy / data
- [ ] Frontend

## Determinism & trust checklist

- [ ] Scoring, gates, and ranking remain deterministic (no LLM in the decision path)
- [ ] Any taxonomy change validates against the schema (weights sum to 1, adjacency resolves)
- [ ] New behavior that affects a ranking is covered by a test
- [ ] Audit trace still captures the decision accurately

## Verification

```bash
# Backend
cd backend && python -m pytest tests/ -v && ruff check app/ tests/

# Frontend
cd frontend && pnpm lint && pnpm build
```

- [ ] Backend tests pass
- [ ] Frontend lints and builds
