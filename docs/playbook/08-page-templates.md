# 08 — Page Templates

> Token-driven page compositions for core e-commerce views. These are design system specifications — not Shopify templates — but structured to map cleanly to Shopify sections/blocks during theming.

---

## Rules for All Page Templates

1. **Token discipline.** Every spacing, color, typography, and layout value references a token. No hardcoded `px`, `rem`, `hex`, or raw values. Token gaps are flagged explicitly in the Token Gap Report at the bottom.
2. **Composition over invention.** Build from existing components and layout primitives. New components are only proposed when nothing existing works — and they're flagged in the Token Gap Report.
3. **Components own their styles.** Page CSS handles layout composition (grid placement, section spacing, content order) — never component appearance. If a component doesn't look right on a page, fix the component.
4. **Layout grid system.** All pages use `.ds-page-container` (1200px), `.ds-layout` (12-column), and `.ds-section` (64px rhythm). See `09-layout-grid.md`.
5. **Responsive breakpoints.** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
6. **Page shell.** Every page renders inside `FullWidthLayout`: Header → `<main class="ds-page-container">` → Footer.
7. **Always use `<Heading>` and `<Text>`.** Never raw HTML tags — except inside `.ds-legal-content` where Shopify rich text HTML is styled via CSS class.
8. **Prices in cents.** 4800 = $48.00. Use `formatPrice()` from shared data layer.

---

## Template Index

| Page | Relationship | Status | Key Differences from PLP |
|------|-------------|--------|-------------------------|
| [PLP](#product-listing-page-plp) | Canonical grid page | Implemented (`CollectionDemo`) | — |
| [Search Results](#search-results-page) | PLP variant | Implemented (`SearchDemo`) | Persistent search input, no-results state |
| [Account / Login](#account--login-page) | Standalone | Implemented (`AccountDemo`) | Centered card, 3 form views |
| [Terms & Conditions](#terms--conditions-page) | Standalone | Implemented (`TermsDemo`) | Prose content, `.ds-legal-content` |
| [Sale](#sale-page) | PLP variant | Implemented (`SaleDemo`) | Sale banner, badges, compare-at pricing |

---

## Product Listing Page (PLP)

The canonical grid-based product browsing page. Implementation: `CollectionDemo.tsx` / `CollectionDemo.css`.

### Page Anatomy

```
┌─────────────────────────────────────────────────┐
│ Header                                          │
├─────────────────────────────────────────────────┤
│ Breadcrumb                                      │
├─────────────────────────────────────────────────┤
│ Page Header                                     │
│ ┌───────────────────────────┬─────────────────┐ │
│ │ Heading (h1) + count      │ Sort (Select)   │ │
│ └───────────────────────────┴─────────────────┘ │
├─────────────────────────────────────────────────┤
│ Filter Bar (future — see token gap report)      │
├─────────────────────────────────────────────────┤
│ Product Grid (2→3→4 cols responsive)            │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│ │Card │ │Card │ │Card │ │Card │               │
│ └─────┘ └─────┘ └─────┘ └─────┘               │
├─────────────────────────────────────────────────┤
│ Pagination (gap — component needed)             │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### Component Reuse Map

| Region | Component(s) | Props/Notes |
|--------|-------------|-------------|
| Navigation | `Breadcrumb` | Home → Collections → {Collection Name} |
| Page title | `Heading` level 1, size `2xl` | Collection name |
| Product count | `Text` size `sm`, `muted` | "24 products" |
| Sort | `Select` + `SelectItem` size `sm` | Newest, Price Low→High, Price High→Low, Best Selling |
| Product cards | `ProductCard` wrapped in `<a>` | Ghost+interactive variant, `fluid` in grid context |
| Pagination | `Pagination` | Dual-mode: SPA (`onPageChange`) or SSR (`baseUrl`), truncation, responsive |

### Product Grid

| Breakpoint | Columns | Gap |
|-----------|---------|-----|
| < 768px | 2 | `--spacing-4` (16px) |
| ≥ 768px | 3 | `--spacing-4` (16px) |
| ≥ 1024px | 4 | `--spacing-6` (24px) |

Two gap tiers only (mobile/tablet + desktop). Same token for row-gap and column-gap. See `07-lessons-learned.md` [gap-escalation] for why.

### States

**Default:** Breadcrumb + header + sort + grid + pagination.

**Empty:** Centered empty state — `Heading` h2 lg + `Text` sm muted + `Button` secondary md. Padding `--spacing-16` (64px). Gap `--spacing-4`.

**Loading:** Skeleton placeholders (component gap — see Token Gap Report).

### Shopify Integration

- `collection.liquid` / `main-collection.liquid` section
- Product grid → section with `product-card` block per product
- Sort → `collection.sort_options` or custom `sort_by` URL param
- Filter → Storefront Filtering API (`collection.filters`) when added
- Pagination → `paginate` Liquid tag
- Count → `collection.products_count`

---

## Search Results Page

PLP variant. Shares grid, cards, sort, pagination. Adds persistent search input and distinct no-results state.

Implementation: `SearchDemo.tsx` / `SearchDemo.css`.

### What's Different from PLP

| Aspect | PLP | Search |
|--------|-----|--------|
| Top section | Breadcrumb | Search input (Input lg, leadingAdornment search icon) |
| Heading | Collection name | "Results for '{query}'" |
| Empty state | "No products in collection" | "No results for '{query}'" with suggestions |
| Loading | Grid skeletons | Grid skeletons, search input stays interactive |

### Search Bar

- `Input` size `lg`, `type="search"`, `leadingAdornment` = search SVG
- Visually hidden `<label>`: "Search products" (`ds-sr-only`)
- Full width, `--spacing-6` (24px) bottom margin

### Shopify Integration

- `search.liquid` template
- Query: `search.terms`
- Results: `search.results` (filterable by type: product, article, page)
- Predictive search: `/search/suggest.json` API (needs dropdown/popover — gap)

---

## Account / Login Page

Three form views in one page: Login, Register, Forgot Password.

Implementation: `AccountDemo.tsx` / `AccountDemo.css`.

### Shared Container

- Centered flex column
- `Card` variant `outlined`, max-width `--size-modal-sm` (400px)
- Card padding: `--spacing-8` (32px)
- Page padding: `--spacing-16` (64px) top/bottom

### Views

| View | Fields | CTA | Links |
|------|--------|-----|-------|
| **Login** | Email (`type="email"`), Password (`type="password"`) | "Sign In" (primary, fullWidth) | "Forgot password?" (ghost sm), "Create account" (ghost sm) |
| **Register** | First name, Last name, Email, Password (`hint="At least 8 characters"`) | "Create Account" (primary, fullWidth) | "Sign in" (ghost sm) |
| **Forgot Password** | Email | "Send Reset Link" (primary, fullWidth) | "Back to sign in" (ghost sm) |

All fields: `autoComplete` attributes set correctly. `required` prop. Error states via Input `error` prop with `role="alert"`.

Register name row: 2-column grid at ≥ sm, stacked below.

Forgot Password success: replaces form with "Check your email" + "Back to sign in" button.

### Shopify Integration

- `customers/login.liquid`, `customers/register.liquid`, `customers/reset_password.liquid`
- Field names: `customer[email]`, `customer[password]`, `customer[first_name]`, `customer[last_name]`
- Errors: `form.errors` → `Input` `error` props
- **[PENDING DECISION]** Classic (password) vs. new (passwordless) accounts

---

## Terms & Conditions Page

Prose content page. No interactive components beyond links.

Implementation: `TermsDemo.tsx` / `TermsDemo.css`.

### Content Container

- Max-width: `--size-content-md` (768px)
- Left-aligned (`margin: 0`), not centered. See `06-decisions-log.md` "Prose Content Alignment."
- Body text uses `--line-height-relaxed` (φ = 1.618) for comfortable long-form reading

### Typography Mapping

| Element | Component | Size | Weight | Line Height |
|---------|-----------|------|--------|-------------|
| Page title | `Heading` h1 | `2xl` (33px) | bold | tight |
| Last updated | `Text` | sm (14px) | normal | normal |
| Section title | `Heading` h2 | lg (20px) | semibold | tight |
| Subsection title | `Heading` h3 | base (16px) | semibold | tight |
| Body text | `Text` | base (16px) | normal | relaxed (φ) |
| Links | `<a>` | inherits | inherits | inherits |

### `.ds-legal-content` — Prose Styling Class

Styles native HTML elements from CMS/rich text output. Reusable across Terms, Privacy, About, FAQ.

```css
.ds-legal-content a { 
  text-decoration: underline; 
  text-decoration-color: var(--color-border-strong);
  text-underline-offset: 0.15em;
}
.ds-legal-content ul, .ds-legal-content ol {
  padding-left: var(--spacing-6);
  gap: var(--spacing-2);
}
```

### Shopify Integration

- Page template (`page.legal.liquid`)
- Content from `page.content` (rich text HTML)
- Heading/Text components NOT used — instead style `h1`–`h3`, `p`, `a`, `ul`, `ol`, `li` via `.ds-legal-content`
- Reusable across all content pages

---

## Sale Page

PLP variant with sale-specific additions.

Implementation: `SaleDemo.tsx` / `SaleDemo.css`.

### What Changes vs. PLP

| Aspect | PLP | Sale |
|--------|-----|------|
| Breadcrumb | Home → Collections → {name} | Home → Sale |
| Heading | Collection name | "Sale" or custom |
| Banner | None | Optional promotional banner |
| Product badges | Per-product | "Sale" on all items |
| Price | Current only | Current + compare-at (strikethrough) |
| Data source | Collection products | Products where `compareAtPrice > price` |

### Sale Banner

Optional. `background: var(--color-background-subtle)`, `border-radius: var(--radius-lg)`, centered text. `Heading` h1 2xl + `Text` base muted. Bottom margin `--spacing-6` (24px).

### Sale Pricing

Uses `ProductCard` `renderPrice` prop with `PriceDisplay` component (existing). `badge="Sale"` prop for overlays. `hoverImage` for hover swap.

**Do NOT use `display: none` to hide default price.** Use the `renderPrice` prop — that's why it exists. See `06-decisions-log.md` "ProductCard API Refinement."

### Shopify Integration

- Collection with automated rule: `compare_at_price > price`
- Sale badge: `{% if product.compare_at_price > product.price %}`
- Sale banner content: collection metafields
- Discount calculation: `{% assign discount = product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price %}`

---

## Token Gap Report

Components, features, and tokens identified as missing during page template design.

### Missing Components

| # | Component | Context | Composition | Priority |
|---|-----------|---------|-------------|----------|
| 1 | **Pagination** | PLP, Search, Sale need page navigation | ✅ **Resolved** — Dual-mode component built (SPA buttons + SSR anchors) |
| 2 | **Skeleton** | PLP, Search, Sale need loading states | ✅ **Resolved** — Component built with pulse animation + `prefers-reduced-motion` |
| 3 | **EmptyState** | PLP empty, Search no-results, Sale no-items | ✅ **Resolved** — Component built with icon slot, primary/secondary actions, compact variant for constrained contexts |

### Missing Component Features

| # | Component | Feature | What's Needed |
|---|-----------|---------|--------------|
| 4 | ProductCard | `badge` prop | ✅ **Resolved** — `badge?: ReactNode` added |
| 5 | ProductCard | `compareAtPrice` prop | ✅ **Resolved** — `renderPrice` prop added, composes `PriceDisplay` |

### Missing Tokens

| # | Token | Context | Recommendation |
|---|-------|---------|---------------|
| 6 | `.ds-prose` / `.ds-legal-content` | Terms, Privacy, About, FAQ | ✅ **Resolved** — `.ds-legal-content` implemented |

### Pending Decisions

| ID | Decision | Options | Status |
|----|----------|---------|--------|
| PT-1 | Sale badge variant | `destructive` (reuse) vs. new `sale` variant | **[PENDING]** — recommend `destructive` |
| PT-2 | Filter bar component | Composition pattern vs. dedicated `FilterBar` | ✅ **Resolved** — `CollectionFilters` component built. Accordion + Checkbox + Drawer composition pattern. Desktop sidebar, mobile drawer. |
| PT-3 | Search autocomplete | Defer vs. dropdown/popover | ✅ **Resolved** — `PredictiveSearch` component built. Custom WAI-ARIA combobox, consumer-controlled data fetching via `onSearch` + `results`/`loading` props. |
| PT-4 | Skeleton priority | Build now vs. defer to Shopify | ✅ **Resolved** — Skeleton component built. Pulse animation with `prefers-reduced-motion`. |
| PT-5 | Customer account type | Classic (password) vs. new (passwordless) | **[PENDING]** |
