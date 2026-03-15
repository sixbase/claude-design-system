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

### Components built (18 total)

#### Foundation (v1)
| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ Complete | 4 variants, 3 sizes, loading, icon-only, asChild, leading/trailing icons |
| Input | ✅ Complete | Label, hint, error, leading/trailing adornments, sm/md/lg sizes |
| Typography | ✅ Complete | Heading (h1–h4), Text, Caption, Code |
| ColorSwatch | ✅ Complete | Docs utility — not a user-facing component |
| Badge | ✅ Complete | 6 variants, 2 sizes |
| Card | ✅ Complete | 3 variants, interactive mode (hover lift + image zoom) |
| Select | ✅ Complete | 3 sizes, groups, separators, hint/error, Radix UI |
| Checkbox | ✅ Complete | Indeterminate state, 2 sizes, hint/error, Radix UI |

#### Ecommerce components (v1.x)
| Component | Status | Notes |
|-----------|--------|-------|
| Modal | ✅ Complete | Compound API (Trigger, Content, Header, Body, Footer, Close), Radix Dialog |
| Accordion | ✅ Complete | Radix primitive, single/multiple mode, 3 sizes |
| Breadcrumb | ✅ Complete | CSS-based responsive collapse, maxItems truncation |
| QuantitySelector | ✅ Complete | Controlled stepper, min/max bounds, 3 sizes |
| ImageGallery | ✅ Complete | Main + thumbnails, keyboard nav, aspect ratio control |
| ProductCard | ✅ Complete | Composed from Card + Badge + image, price formatting |
| StarRating | ✅ Complete | SVG stars (full/half/empty), review count, 3 sizes |
| StockIndicator | ✅ Complete | 3 statuses (in-stock/low-stock/out-of-stock), pulse animation |
| Carousel | ✅ Complete | Scroll-snap, responsive slide sizes (sm/md/lg), gap variants |
| FeatureBlock | ✅ Complete | Image + text grid, `reverse` prop for alternating layouts |

### Documentation pages (18 components + 4 foundation + 1 example)
| Page | URL |
|------|-----|
| Introduction | `/` |
| Getting Started | `/getting-started` |
| Colors | `/tokens/colors` |
| Typography | `/tokens/typography` |
| Spacing | `/tokens/spacing` |
| Accordion | `/components/accordion` |
| Badge | `/components/badge` |
| Breadcrumb | `/components/breadcrumb` |
| Button | `/components/button` |
| Card | `/components/card` |
| Carousel | `/components/carousel` |
| Checkbox | `/components/checkbox` |
| Color Swatch | `/components/color-swatch` |
| Feature Block | `/components/feature-block` |
| Image Gallery | `/components/image-gallery` |
| Input | `/components/input` |
| Modal | `/components/modal` |
| Product Card | `/components/product-card` |
| Quantity Selector | `/components/quantity-selector` |
| Select | `/components/select` |
| Star Rating | `/components/star-rating` |
| Stock Indicator | `/components/stock-indicator` |
| Typography | `/components/typography` |
| Product Detail Page | `/examples/product-detail` |

---

## Scope: What's Deferred

### Remaining ecommerce component priority

| Priority | Component | Why ecommerce needs it |
|----------|-----------|------------------------|
| P1 | Toast | Add-to-cart confirmation, error notifications |
| P2 | Pagination | Product listing navigation |
| P2 | Skeleton | Loading state for product grids |
| P3 | Tabs | Product detail: description / reviews / specs |

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
