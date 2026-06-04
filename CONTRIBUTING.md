# Contributing to Assigna

Assigna is built and maintained by Deciwa. We welcome contributions that improve the decision engine, taxonomy coverage, or evidence quality.

## How to contribute

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`python -m pytest tests/ -v` for backend, `pnpm build` for frontend)
5. Submit a pull request

## Guidelines

- All scoring logic must remain deterministic — no LLM in the scoring pipeline
- Evidence objects must follow the structured schema in `app/evidence/schema.py`
- New taxonomy categories must validate against `TaxonomyCategory` schema
- Vendor profiles must include at least 3 evidence items per category
- All PRs must pass CI (tests + lint + build)

## What we're looking for

- New taxonomy categories with full schema compliance
- Evidence quality improvements and source verification
- Frontend UX improvements for the buyer flow
- Test coverage improvements
- Documentation

## Code style

- **Backend**: Python 3.11+, formatted with ruff, type hints required
- **Frontend**: TypeScript strict, Tailwind CSS, no inline styles

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
