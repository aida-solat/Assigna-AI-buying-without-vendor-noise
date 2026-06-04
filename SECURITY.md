# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Assigna, please report it responsibly.

**Do not open a public issue.**

Email: security@deciwa.com

We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Scope

- Backend API endpoints and data handling
- Evidence integrity and audit trail tampering
- Brief hash verification bypass
- Vendor data exposure or manipulation

## Design Principles

- Buyer problem data is hashed (SHA-256) in audit traces, not stored as PII
- Decision Brief integrity is verified via SHA-256 hash
- Scoring is deterministic — no external API calls during scoring
- No vendor payment data influences ranking logic
