# Assigna — Frontend

Evidence-based B2B AI solution assignment engine. Converts ambiguous business problems into structured, scored vendor recommendations with explainable reasoning.

Built & designed by **Deciwa**.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **TanStack Query** for server state
- **Framer Motion** for transitions
- **Zod v4** for form validation
- **Geist** typeface

## Setup

```bash
pnpm install
pnpm dev --port 3002
```

Backend must be running on `localhost:8000` for API calls.

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public routes)     # /, /about, /pricing, /taxonomy, etc.
│   ├── app/                # Buyer application
│   │   ├── problems/       # Problem intake + diagnosis
│   │   ├── vendors/        # Vendor detail (buyer-facing)
│   │   ├── briefs/         # Decision brief viewer + export
│   │   ├── categories/     # Category detail with 6 tabs
│   │   └── settings/       # Account & plan management
│   └── admin/              # Internal curation panel
│       ├── vendors/        # Vendor CRUD
│       ├── evidence/       # Evidence registry
│       ├── categories/     # Taxonomy browser (read-only)
│       └── briefs/         # Brief management
├── components/
│   ├── ui/                 # Base components (Button, Card, Badge, ScoreBar)
│   ├── landing/            # Public website sections
│   ├── intake/             # Problem intake form components
│   ├── diagnosis/          # Diagnosis result components
│   ├── decision/           # Category/vendor/evidence cards
│   └── vendors/            # Vendor shortlist components
└── lib/
    ├── types.ts            # Shared TypeScript interfaces
    ├── validation.ts       # Zod schemas
    ├── api.ts              # API client
    └── utils.ts            # Utilities
```

## Design Principles

- **Decision-first** — users enter with a problem, not to browse vendors
- **Evidence over claims** — all scores are explainable and deterministic
- **Taxonomy-driven** — form fields and questions derive from the solution taxonomy
- **Trust by default** — ranking is not for sale, and the system can say "don't buy"

## Build

```bash
pnpm build    # TypeScript check + static generation
```
