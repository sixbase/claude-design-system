# 01 — Planning

> Goals, scope decisions, and the design mandate for this design system.

---

## Origin Story

This design system was started from an empty GitHub repository with one directive: build something that meets the standards of large engineering organizations — Apple, Meta, Google. That meant:

- A monorepo structure that scales to many teams and many packages
- A token system that makes consistent theming and dark mode non-optional
- Components that are accessible by default (keyboard navigation, screen reader support, WCAG contrast)
- Full test coverage and visual regression testing from day one
- A documentation site that consumers can actually use, not just a Storybook dump

The system is built for an **ecommerce context** — the color palette, typography, and component priorities all reflect that use case.

---

## Design Mandate

### Aesthetic Direction
Premium, warm, editorial. Think high-end ecommerce: luxury goods, considered lifestyle brands. Not clinical SaaS blues and greys.

#### The Golden Ratio (φ ≈ 1.618) governs all proportions

Every scale decision in this system — type sizes, spacing, radius, layout splits, aspect ratios, animation timing — should be guided by the golden ratio. This is not a rigid rule but the governing spirit: when choosing between candidate values, prefer the ratio closer to φ. When defining a new scale, derive it from φ multiplication.

See [06-decisions-log.md](./06-decisions-log.md) for the full φ analysis with current token values and ideal targets.

- **Color:** Warm earth tones. The primary palette (`stone`) is a warm off-white through near-black, not a cold grey. Supporting palettes (brick, sage, amber, slate) are muted and earthy.
- **Typography:** Literary serif. The brand voice is thoughtful and considered, not tech-forward.
- **Shape:** Restrained corner radius. Not pill buttons, not sharp corners — a refined middle ground.

### Font Journey

| Iteration | Font | Why Changed |
|-----------|------|-------------|
| Default | Inter | Too generic, no personality |
| v2 | EB Garamond | Too ornate and heavy at small UI sizes |
| v3 | Source Serif 4 | Warm and readable, but replaced for more character |
| **Final** | **Ancizar Serif** | Scholarly authority with everyday readability, 9 weights including light (300) |

Ancizar Serif is loaded from Google Fonts. Designed by Universidad Nacional de Colombia, it's an open-source scholarly serif (SIL OFL) with 9 weights from Thin to Black. We load Light (300), Regular (400), Medium (500), Semibold (600), and Bold (700) plus italic variants.

---

## Scope: What's in v1

The build strategy was **primitives-first**: establish the token system and foundational components before anything ecommerce-specific. This means v1 is mostly infrastructure with just enough UI to prove the system works.

### Packages built
| Package | What it contains |
|---------|-----------------|
| `@ds/tokens` | CSS variables, TypeScript exports, JSON source of truth |
| `@ds/primitives` | Radix UI wrappers, shared TypeScript types |
| `@ds/components` | Styled, accessible components |

### Components built in v1
| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ Complete | 4 variants, 3 sizes, loading, icon-only, asChild, leading/trailing icons |
| Input | ✅ Complete | Label, hint, error, leading/trailing adornments, sm/md/lg sizes |
| Typography | ✅ Complete | Heading (h1–h4), Text, Caption, Code |
| ColorSwatch | ✅ Complete | Docs utility — not a user-facing component |
| Badge | ✅ Complete | 6 variants, 2 sizes — P0 ecommerce |
| Card | ✅ Complete | 3 variants, interactive mode (hover lift + image zoom) — P0 ecommerce |
| Select | ✅ Complete | 3 sizes, groups, separators, hint/error, built on Radix UI — P0 ecommerce |
| Checkbox | ✅ Complete | Indeterminate state, 2 sizes, hint/error, built on Radix UI — P1 ecommerce |

### Documentation built in v1
| Page | URL |
|------|-----|
| Introduction | `/` |
| Getting Started | `/getting-started` |
| Colors | `/tokens/colors` |
| Typography | `/tokens/typography` |
| Spacing | `/tokens/spacing` |
| Button | `/components/button` |
| Input | `/components/input` |
| Typography | `/components/typography` |
| Badge | `/components/badge` |
| Card | `/components/card` |
| Select | `/components/select` |
| Checkbox | `/components/checkbox` |

---

## Scope: What's Deferred to v2+

These were consciously excluded from v1 to keep scope manageable. They are the next build phase.

### Ecommerce component priority order

| Priority | Component | Why ecommerce needs it |
|----------|-----------|------------------------|
| P0 | ~~Badge / Tag~~ | ✅ Built — product labels: "New", "Sale", "Out of stock" |
| P0 | ~~Card~~ | ✅ Built — the core ecommerce unit, product cards everywhere |
| P0 | ~~Select~~ | ✅ Built — size picker, quantity selector |
| P1 | ~~Checkbox~~ | ✅ Built — filter sidebar, cart item selection |
| P1 | Modal / Dialog | Quick view, confirm delete, address entry |
| P1 | Toast | Add-to-cart confirmation, error notifications |
| P2 | Breadcrumb | Category navigation path |
| P2 | Pagination | Product listing navigation |
| P2 | Skeleton | Loading state for product grids |
| P3 | Tabs | Product detail: description / reviews / specs |
| P3 | Accordion | FAQ, filter groups |
| P3 | Rating / Stars | Product review scores |

---

## Why Two Apps (Docs + Storybook)?

A common question: why maintain both an Astro docs site and a Storybook?

**They serve different audiences:**

| | Storybook | Astro Docs |
|--|-----------|------------|
| **Who uses it** | Component engineers | Consumers of the design system |
| **What they need** | Isolated rendering, controls, interaction testing | Usage examples, copy-paste code, prop tables |
| **Who runs it** | Locally during development | Deployed publicly |
| **Key job** | Visual regression baseline (Chromatic) | Documentation |

Storybook is a **development tool** that happens to be useful for demos. The docs site is the **source of truth for consumers**. Conflating the two leads to a docs experience that's either too technical or a Storybook that's cluttered with explanatory prose. Keep them separate.

---

## Infrastructure Decisions

### CI/CD from day one
GitHub Actions were set up before any components were built:
- `ci.yml` — runs lint, typecheck, and tests on every PR and push to main
- `chromatic.yml` — visual regression on every PR (requires Chromatic project token in repo secrets)
- `release.yml` — Changesets-powered versioning and publish on merge to main

### Testing from day one
Every component was written with its test file in parallel. This forced good a11y habits — if `axe` fails, the PR fails.

### Documentation from day one
Every component got a docs page the same session it was built. "I'll document it later" never happens.
