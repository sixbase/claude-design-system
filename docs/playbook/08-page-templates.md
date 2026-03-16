# 08 — Page Templates

Reusable, token-driven page compositions for core e-commerce views. These are design system specifications — not Shopify templates — but structured to map cleanly to Shopify sections/blocks during theming.

**Global rules that apply to every page:**

1. **Token discipline** — every spacing, color, typography, and layout value references an existing design system token. No hardcoded `px`, `rem`, `hex`, or raw values. Token gaps are flagged explicitly.
2. **Composition over invention** — each page is built from existing components and layout primitives. New components are only proposed when no existing pattern can solve the need.
3. **Responsive breakpoints** — all pages follow the system breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
4. **Page shell** — every page renders inside the shared `FullWidthLayout` shell: `Header` → `<main>` (max-width 1280px, responsive padding) → `Footer`.

---

## Table of Contents

- [Product Listing Page (PLP)](#product-listing-page-plp)
- [Search Results Page](#search-results-page)
- [Account / Login Page](#account--login-page)
- [Terms & Conditions Page](#terms--conditions-page)
- [Sale Page](#sale-page)
- [Token Gap Report](#token-gap-report)

---

## Product Listing Page (PLP)

The canonical grid-based product browsing page. An existing implementation lives in `CollectionDemo.tsx` / `CollectionDemo.css` — this spec formalizes and extends it.

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
│ Product Grid                                    │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│ │Card │ │Card │ │Card │ │Card │               │
│ └─────┘ └─────┘ └─────┘ └─────┘               │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│ │Card │ │Card │ │Card │ │Card │               │
│ └─────┘ └─────┘ └─────┘ └─────┘               │
├─────────────────────────────────────────────────┤
│ Pagination                                      │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### Component Reuse Map

| Region | Component(s) | Notes |
|---|---|---|
| Navigation | `Breadcrumb` | Items: Home → Collections → {Collection Name} |
| Page title | `Heading` (level 1, size `2xl`) | Collection name |
| Product count | `Text` (size `sm`, `muted`) | e.g. "24 products" |
| Sort control | `Select` + `SelectItem` (size `sm`) | Options: Newest, Price Low→High, Price High→Low, Best Selling |
| Product cards | `ProductCard` wrapped in unstyled `<a>` | Links to PDP. Inherits `Card` ghost+interactive variant |
| Pagination | **Gap — no component exists** | See token gap report |

### Product Grid Specification

The grid uses CSS Grid with responsive column counts and gap tokens:

| Breakpoint | Columns | Gap Token | Computed Gap |
|---|---|---|---|
| Default (< 768px) | 2 | `--spacing-4` | 16px |
| `md` (≥ 768px) | 3 | `--spacing-5` | 20px |
| `lg` (≥ 1024px) | 4 | `--spacing-6` | 24px |

```css
.ds-collection__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .ds-collection__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-5);
  }
}

@media (min-width: 1024px) {
  .ds-collection__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-6);
  }
}
```

`ProductCard` has a fixed `--product-card-width` of 220px by default, but within the grid it stretches to fill its column via `1fr`. The card's ghost variant renders transparent with no border/shadow, relying on image + text hierarchy alone.

### Page Header Spacing

| Relationship | Token | Computed |
|---|---|---|
| Breadcrumb → page header | Component's own bottom margin | Breadcrumb has no built-in bottom margin; add `--spacing-4` (16px) via page layout |
| Title ↔ count (vertical gap within header) | `--spacing-1` | 4px |
| Title row ↔ sort (horizontal at ≥ md) | `flex` justify-content: space-between | Auto |
| Title row ↔ sort (stacked at < md) | `--spacing-3` | 12px |
| Page header → grid | `--spacing-phi-13` | 26px |

### Filter & Sort Control Placement

**Current state:** Sort uses a `Select` (size `sm`) right-aligned at ≥ md, stacked below heading at < md. This matches the `CollectionDemo` implementation.

**Filter bar:** Not yet implemented. When added, it should sit between the page header and the product grid. Recommended approach:

- Use `Checkbox` components for binary filters (e.g., "In Stock Only")
- Use `Select` for category/multi-value filters
- Layout: horizontal flex row with `--spacing-3` gap, wrapping at mobile
- **This will require a `FilterBar` composition** (not a new primitive — a documented layout pattern using existing components)

### States

#### Default (products loaded)
- Breadcrumb, heading, count, sort, and grid all render
- Grid shows all matching products

#### Empty (no products in collection)
```
┌─────────────────────────────────────────────────┐
│ [Breadcrumb]                                    │
│                                                 │
│ [Heading: Collection Name]                      │
│ [Text: 0 products]                              │
│                                                 │
│        ┌──────────────────────┐                 │
│        │                      │                 │
│        │   No products found  │  ← Heading h2   │
│        │   in this collection │    size "lg"     │
│        │                      │                 │
│        │  [Browse all products]│  ← Button       │
│        │   (secondary, md)    │    secondary     │
│        │                      │                 │
│        └──────────────────────┘                 │
│                                                 │
└─────────────────────────────────────────────────┘
```
- Empty state container: centered, `text-align: center`
- Vertical padding: `--spacing-phi-34` (68px) top and bottom
- Message hierarchy: `Heading` level 2, size `lg` → `Text` size `sm` muted → `Button` secondary md
- Gap between message elements: `--spacing-4` (16px)

#### Loading
- Grid area replaced with skeleton placeholders
- **Skeleton component does not exist** — flagged in token gap report
- Interim: show nothing (defer to Shopify's loading behavior)

### Responsive Behavior

| Breakpoint | Layout Change |
|---|---|
| < 640px | 2-col grid, heading + sort stacked vertically |
| ≥ 768px | 3-col grid, heading + sort on same row (space-between) |
| ≥ 1024px | 4-col grid, no other layout change |

### Shopify Integration Notes

- **Collection page** maps to Shopify's `collection.liquid` / `main-collection.liquid` section
- The product grid maps to a **section** with a `product-card` **block** that repeats per product
- Sort control maps to Shopify's native `collection.sort_options` or a custom `sort_by` URL parameter
- Filter bar (when added) maps to Shopify's Storefront Filtering API (`collection.filters`)
- Pagination maps to `paginate` Liquid tag — Shopify provides `paginate.pages`, `paginate.next`, `paginate.previous`
- Product count comes from `collection.products_count`
- Consider: Shopify collections have a configurable `products_per_page` (max 50) — pagination component should accept a `totalPages` prop

---

## Search Results Page

Reuses the PLP grid and card components for product results. The key difference is the persistent search input at the top and three distinct result states.

### Relationship to PLP

The Search Results Page is a **composition variant of the PLP**. It shares:
- The same product grid (columns, gaps, responsive breakpoints)
- The same `ProductCard` component and link behavior
- The same sort `Select` control
- The same pagination pattern

It differs by:
- Adding a persistent search input at the top of the page
- Replacing the Breadcrumb + collection heading with a search context header
- Having a distinct "no results" state with suggestions

### Page Anatomy

```
┌─────────────────────────────────────────────────┐
│ Header                                          │
├─────────────────────────────────────────────────┤
│ Search Bar                                      │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔍  [search input, size lg]                 │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Results Header                                  │
│ ┌───────────────────────────┬─────────────────┐ │
│ │ "Results for '{query}'"   │ Sort (Select)   │ │
│ │ "{n} products"            │                 │ │
│ └───────────────────────────┴─────────────────┘ │
├─────────────────────────────────────────────────┤
│ Product Grid (same as PLP)                      │
├─────────────────────────────────────────────────┤
│ Pagination (same as PLP)                        │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### Component Reuse Map

| Region | Component(s) | Notes |
|---|---|---|
| Search bar | `Input` (size `lg`, `leadingAdornment` = search icon) | Persistent; pre-filled with current query |
| Results heading | `Heading` (level 1, size `2xl`) | "Results for '{query}'" |
| Result count | `Text` (size `sm`, `muted`) | e.g. "12 products" |
| Sort control | `Select` + `SelectItem` (size `sm`) | Same options as PLP |
| Product grid | `ProductCard` in CSS Grid | Identical to PLP grid spec |
| Pagination | Same as PLP | See PLP pagination spec |

### Search Bar Specification

- `Input` component, size `lg`
- `leadingAdornment`: search icon (SVG inline or from icon set — **icon system is a known gap**, see decisions log entry on icon strategy)
- Full width within the main content area
- Bottom spacing to results header: `--spacing-phi-13` (26px)
- The input should have `type="search"` and an associated `<label>` (visually hidden via `ds-sr-only` class): "Search products"
- On submit (Enter key), triggers search — this is application logic, not design system concern

### Spacing

| Relationship | Token | Computed |
|---|---|---|
| Search bar → results header | `--spacing-phi-13` | 26px |
| Results header layout | Same as PLP page header | See PLP spec |
| Results header → grid | `--spacing-phi-13` | 26px |

### States

#### Results Found
- Standard layout: search bar → results header → grid → pagination
- Results header shows query in quotes and product count

#### No Results
```
┌─────────────────────────────────────────────────┐
│ [Search bar — pre-filled with query]            │
│                                                 │
│        ┌──────────────────────┐                 │
│        │                      │                 │
│        │  No results for      │  ← Heading h2   │
│        │  "{query}"           │    size "lg"     │
│        │                      │                 │
│        │  Try a different     │  ← Text sm muted │
│        │  search term or      │                 │
│        │  browse our          │                 │
│        │  collections         │                 │
│        │                      │                 │
│        │  [Browse collections]│  ← Button        │
│        │   (secondary, md)    │    secondary     │
│        │                      │                 │
│        └──────────────────────┘                 │
│                                                 │
└─────────────────────────────────────────────────┘
```
- Empty state container: centered, `text-align: center`
- Vertical padding: `--spacing-phi-34` (68px) top and bottom
- Heading: `Heading` level 2, size `lg` — "No results for '{query}'"
- Body: `Text` size `sm`, muted — suggestion text
- CTA: `Button` variant `secondary`, size `md` — links to collection page
- Gap between elements: `--spacing-4` (16px)

#### Loading
- Search bar remains interactive (user can type a new query)
- Grid area shows loading state (skeleton or spinner — see token gap report)
- Sort control is disabled during loading

### Responsive Behavior

Same as PLP (2 → 3 → 4 column grid). Search bar is always full-width. At < 640px, the results header stacks (heading above sort).

### Shopify Integration Notes

- Maps to Shopify's `search.liquid` template
- Search query available via `search.terms`
- Results via `search.results` (can filter by type: `product`, `article`, `page`)
- Consider: Shopify's predictive search API (`/search/suggest.json`) can power autocomplete — this would need a dropdown/popover pattern (does not exist yet)
- Product results use the same card rendering as collection pages
- Pagination via `paginate` Liquid tag, same as PLP

---

## Account / Login Page

Three views rendered as distinct states of a single page composition: **Login**, **Register**, and **Forgot Password**. All form fields, labels, error states, and CTAs use existing `Input` and `Button` components.

### Page Anatomy

The page uses a centered, narrow-width card layout. All three views share the same container structure — only the form content changes.

```
┌─────────────────────────────────────────────────┐
│ Header                                          │
├─────────────────────────────────────────────────┤
│                                                 │
│           ┌────────────────────┐                │
│           │  Card (outlined)   │                │
│           │                    │                │
│           │  [Heading]         │                │
│           │  [Subtitle text]   │                │
│           │                    │                │
│           │  [Form fields]     │                │
│           │                    │                │
│           │  [Primary CTA]     │                │
│           │                    │                │
│           │  [Link to          │                │
│           │   alternate view]  │                │
│           │                    │                │
│           └────────────────────┘                │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### Shared Container

- Outer: centered flex column, `align-items: center`
- Vertical padding: `--spacing-phi-34` (68px) top and bottom
- Form card: `Card` variant `outlined`, max-width `--size-modal-sm` (400px), full width below that
- Card internal padding: `--spacing-8` (32px) — uses `CardBody` default

### Component Reuse Map

| Region | Component(s) | Notes |
|---|---|---|
| Container | `Card` (variant `outlined`) | Centered, max-width 400px |
| Title | `Heading` (level 1, size `xl`) | View-specific: "Sign In", "Create Account", "Reset Password" |
| Subtitle | `Text` (size `sm`, `muted`) | Contextual description |
| Form fields | `Input` (size `md`) with `label`, `error`, `hint` | See per-view specs below |
| Primary CTA | `Button` (variant `primary`, size `md`, `fullWidth`) | View-specific label |
| Secondary link | `Button` (variant `ghost`, size `sm`) | View toggle: "Create account" / "Sign in instead" |
| Divider | `<hr>` styled with `border-color: var(--color-border)` | Between CTA and alternate view link |

### View: Login

**Fields:**
| Field | Type | Label | Props |
|---|---|---|---|
| Email | `Input` | "Email address" | `type="email"`, `required`, `autoComplete="email"` |
| Password | `Input` | "Password" | `type="password"`, `required`, `autoComplete="current-password"` |

**CTA:** `Button` primary, fullWidth — "Sign In"

**Links:**
- "Forgot password?" — `Button` ghost sm, triggers Forgot Password view
- "Don't have an account? Create one" — `Button` ghost sm, triggers Register view

**Error states:**
- Field-level: `Input` `error` prop — "Please enter a valid email address", "Password is required"
- Form-level: `Text` size `sm` with `color: var(--color-destructive)` above the form — "Invalid email or password. Please try again."
- Form-level error uses `role="alert"` for screen reader announcement

**Spacing:**
| Relationship | Token | Computed |
|---|---|---|
| Heading → subtitle | `--spacing-2` | 8px |
| Subtitle → first field | `--spacing-6` | 24px |
| Field → field | `--spacing-4` | 16px |
| Last field → CTA | `--spacing-6` | 24px |
| CTA → divider | `--spacing-4` | 16px |
| Divider → alternate link | `--spacing-4` | 16px |

### View: Register

**Fields:**
| Field | Type | Label | Props |
|---|---|---|---|
| First name | `Input` | "First name" | `type="text"`, `required`, `autoComplete="given-name"` |
| Last name | `Input` | "Last name" | `type="text"`, `required`, `autoComplete="family-name"` |
| Email | `Input` | "Email address" | `type="email"`, `required`, `autoComplete="email"` |
| Password | `Input` | "Password" | `type="password"`, `required`, `autoComplete="new-password"`, `hint="At least 8 characters"` |

**Layout note:** First name and Last name can be placed in a 2-column row at ≥ sm breakpoint:

```css
.ds-auth-form__name-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 640px) {
  .ds-auth-form__name-row {
    grid-template-columns: 1fr 1fr;
  }
}
```

**CTA:** `Button` primary, fullWidth — "Create Account"

**Links:**
- "Already have an account? Sign in" — `Button` ghost sm

**Error states:**
- Same field-level pattern as Login
- Email: "This email is already registered"
- Password: "Password must be at least 8 characters"

### View: Forgot Password

**Fields:**
| Field | Type | Label | Props |
|---|---|---|---|
| Email | `Input` | "Email address" | `type="email"`, `required`, `autoComplete="email"` |

**CTA:** `Button` primary, fullWidth — "Send Reset Link"

**Links:**
- "Back to sign in" — `Button` ghost sm

**Success state:**
- After submission, replace form content with:
  - `Heading` level 2, size `lg` — "Check your email"
  - `Text` size `sm`, muted — "We've sent a password reset link to {email}"
  - `Button` secondary, md — "Back to sign in"

### Accessibility Requirements

All three views must meet these requirements:

1. **Label association:** Every `Input` has a `label` prop — the Input component auto-links via `htmlFor`/`id` using `useId()`
2. **Error announcement:** `Input` `error` prop renders with `role="alert"` — screen readers announce errors immediately
3. **Hint linking:** `Input` `hint` prop is linked via `aria-describedby`
4. **Focus order:** Tab order follows visual order: fields top-to-bottom → CTA → alternate links
5. **Form-level errors:** Use `role="alert"` on the container so screen readers announce without focus shift
6. **Required fields:** `Input` `required` prop adds `required` attribute and visual indicator via `ds-input-label--required`
7. **Password field:** Consider adding a show/hide toggle — **this requires a `trailingAdornment` eye icon** (Input already supports `trailingAdornment`, just needs an icon)
8. **Autocomplete attributes:** All fields must have appropriate `autoComplete` values for password managers

### Responsive Behavior

| Breakpoint | Layout Change |
|---|---|
| < 640px | Card fills available width with horizontal padding. Name fields stack vertically. |
| ≥ 640px | Card constrained to 400px max-width. Register name fields go side-by-side. |

### Shopify Integration Notes

- Maps to Shopify's `customers/login.liquid`, `customers/register.liquid`, `customers/reset_password.liquid`
- Shopify provides `form 'customer_login'`, `form 'create_customer'`, `form 'recover_customer_password'` Liquid tags
- Field names must match Shopify's expected form field names: `customer[email]`, `customer[password]`, `customer[first_name]`, `customer[last_name]`
- Error handling: Shopify populates `form.errors` — map these to `Input` `error` props
- Consider: Shopify's customer accounts can be "classic" or "new" (passwordless). The passwordless flow uses email verification — this would skip the password field entirely. Flag this as a theme setting.
- Social login (Google, Facebook) is a Shopify Multipass feature — if needed, add social auth buttons below the divider using `Button` variant `secondary` with a leading icon

---

## Terms & Conditions Page

A content-focused page using the established typography scale. No interactive components beyond links.

### Page Anatomy

```
┌─────────────────────────────────────────────────┐
│ Header                                          │
├─────────────────────────────────────────────────┤
│ Breadcrumb                                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──── Content container (narrow) ────────┐     │
│  │                                        │     │
│  │  [Heading h1: "Terms & Conditions"]    │     │
│  │  [Text: "Last updated: {date}"]        │     │
│  │                                        │     │
│  │  [Heading h2: Section title]           │     │
│  │  [Text: paragraph body]               │     │
│  │  [Text: paragraph body]               │     │
│  │                                        │     │
│  │  [Heading h2: Section title]           │     │
│  │  [Text: paragraph body]               │     │
│  │  [Text: paragraph body]               │     │
│  │                                        │     │
│  │  ...                                   │     │
│  │                                        │     │
│  └────────────────────────────────────────┘     │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### Content Container

- Max-width: `--size-content-md` (768px)
- Centered: `margin: 0 auto`
- Vertical padding: `--spacing-phi-21` (42px) top, `--spacing-phi-34` (68px) bottom

### Component Reuse Map

| Region | Component(s) | Notes |
|---|---|---|
| Navigation | `Breadcrumb` | Items: Home → Terms & Conditions |
| Page title | `Heading` (level 1, size `2xl`) | "Terms & Conditions" |
| Last updated | `Text` (size `sm`, `muted`) | "Last updated: March 15, 2026" |
| Section titles | `Heading` (level 2, size `lg`) | e.g. "1. General Terms", "2. Privacy Policy" |
| Subsection titles | `Heading` (level 3, size `base`) | Nested sections if needed |
| Body text | `Text` (size `base`) | Default paragraph text |
| Inline links | `<a>` elements | Styled via global link styles (see below) |
| Inline code | `Code` | For technical terms if applicable |
| Lists | Native `<ul>` / `<ol>` | Styled via page CSS (see below) |

### Typography Mapping

| Element | Component | Size Token | Weight | Line Height | Color |
|---|---|---|---|---|---|
| Page title | `Heading` h1 | `--font-size-2xl` (33px) | `--font-weight-bold` | `--line-height-tight` | `--color-foreground` |
| Last updated | `Text` | `--font-size-sm` (14px) | `--font-weight-normal` | `--line-height-normal` | `--color-foreground-muted` |
| Section title | `Heading` h2 | `--font-size-lg` (20px) | `--font-weight-semibold` | `--line-height-tight` | `--color-foreground` |
| Subsection title | `Heading` h3 | `--font-size-base` (16px) | `--font-weight-semibold` | `--line-height-tight` | `--color-foreground` |
| Body text | `Text` | `--font-size-base` (16px) | `--font-weight-normal` | `--line-height-relaxed` (φ = 1.618) | `--color-foreground` |
| Links | `<a>` | Inherits | Inherits | Inherits | `--color-foreground` with underline |

### Spacing Relationships

| Relationship | Token | Computed |
|---|---|---|
| Breadcrumb → page title | `--spacing-4` | 16px |
| Page title → last updated | `--spacing-2` | 8px |
| Last updated → first section | `--spacing-phi-21` | 42px |
| Section title (h2) → body text | `--spacing-4` | 16px |
| Paragraph → paragraph | `--spacing-4` | 16px |
| Body text → next section title | `--spacing-phi-13` | 26px |
| Subsection title (h3) → body text | `--spacing-3` | 12px |
| List item → list item | `--spacing-2` | 8px |

### Link Styles

Inline links within body text should use underline decoration referencing existing tokens:

```css
.ds-legal-content a {
  color: var(--color-foreground);
  text-decoration: underline;
  text-decoration-color: var(--color-border-strong);
  text-underline-offset: 0.15em;
  transition: var(--transition-fast);
}

.ds-legal-content a:hover {
  text-decoration-color: var(--color-foreground);
}
```

### List Styles

```css
.ds-legal-content ul,
.ds-legal-content ol {
  padding-left: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.ds-legal-content li {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-foreground);
}
```

### States

This page has only one state — content rendered. There is no empty, loading, or error state because the content is static (authored in the CMS or hardcoded in the template).

### Responsive Behavior

| Breakpoint | Layout Change |
|---|---|
| < 640px | Content container uses full width with `--spacing-4` horizontal padding |
| ≥ 768px | Content container constrained to `--size-content-md` (768px) centered |

The typography scale is fluid by nature — `--font-size-2xl` at 33px reads well at all viewports. No font-size overrides per breakpoint needed.

### Shopify Integration Notes

- Maps to a Shopify **page template** (`page.legal.liquid` or similar)
- Content typically comes from a Shopify **page object** (`page.content`) rendered as rich text HTML
- The Heading/Text components won't be used in Shopify — instead, the rich text HTML output from Shopify's WYSIWYG editor needs to be styled via the `.ds-legal-content` wrapper class
- Approach: create a `.ds-legal-content` class that styles `h1`, `h2`, `h3`, `p`, `a`, `ul`, `ol`, `li` to match the token-driven specs above
- This "prose" or "rich text" styling class is reusable across all content pages (About, FAQ, Privacy Policy, etc.)
- Consider: Shopify metafields can store structured content — if sections need individual rendering, use metafield groups rather than a single rich text blob

---

## Sale Page

A variant of the PLP. Documents what changes and what stays the same.

### Relationship to PLP

The Sale Page inherits the **entire PLP composition** — grid, sort, pagination, responsive behavior, empty state. It modifies:

1. **Page header** — different heading, optional promotional banner
2. **Product cards** — show sale pricing and sale badges
3. **Visual treatment** — optional banner/accent to distinguish from standard collections

Everything else (grid columns, gap tokens, sort options, pagination) is identical.

### Page Anatomy

```
┌─────────────────────────────────────────────────┐
│ Header                                          │
├─────────────────────────────────────────────────┤
│ Breadcrumb                                      │
├─────────────────────────────────────────────────┤
│ Sale Banner (optional)                          │
│ ┌─────────────────────────────────────────────┐ │
│ │  Background: --color-background-subtle      │ │
│ │  [Heading: "End of Season Sale"]            │ │
│ │  [Text: "Up to 40% off select items"]       │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Results Header (same as PLP)                    │
│ ┌───────────────────────────┬─────────────────┐ │
│ │ "Sale" + count            │ Sort (Select)   │ │
│ └───────────────────────────┴─────────────────┘ │
├─────────────────────────────────────────────────┤
│ Product Grid (with sale pricing)                │
│ ┌─────────────────┐ ┌─────────────────┐        │
│ │ [Badge: "Sale"] │ │ [Badge: "Sale"] │        │
│ │ [Product image] │ │ [Product image] │        │
│ │ [Name]          │ │ [Name]          │        │
│ │ [$89 ~~$112~~]  │ │ [$48 ~~$65~~]   │        │
│ └─────────────────┘ └─────────────────┘        │
├─────────────────────────────────────────────────┤
│ Pagination (same as PLP)                        │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

### What Changes vs. PLP

| Aspect | PLP | Sale Page |
|---|---|---|
| Breadcrumb | Home → Collections → {name} | Home → Sale |
| Heading | Collection name | "Sale" or custom sale name |
| Banner | None | Optional promotional banner |
| Product card badge | Per-product (optional) | "Sale" badge on all items |
| Price display | Current price only | Current price + compare-at (strikethrough) |
| Data source | Collection products | Products filtered by `compareAtPrice > price` |

### Sale Banner Specification

An optional promotional section above the results header:

- Container: `background-color: var(--color-background-subtle)`, `border-radius: var(--radius-lg)`
- Padding: `--spacing-8` (32px) vertical, `--spacing-4` (16px) horizontal
- Centered text
- Heading: `Heading` level 1, size `2xl` — Sale title
- Subtitle: `Text` size `base`, muted — Sale description
- Gap between heading and subtitle: `--spacing-2` (8px)
- Bottom margin to results header: `--spacing-phi-13` (26px)

### Sale Pricing Treatment

Each product card in the sale grid needs to show:

1. **Sale badge** — `Badge` positioned over the card image
2. **Compare-at price** — original price with strikethrough
3. **Sale price** — current discounted price

#### Badge Placement

The `ProductCard` component currently does not support badges. Two approaches:

**Option A (Recommended): Extend `ProductCard` with a `badge` prop**

```tsx
// ProductCard receives an optional badge string
<ProductCard
  name="Relaxed Linen Shirt"
  price={8900}
  compareAtPrice={11200}
  image="/products/linen-shirt.jpg"
  badge="Sale"
/>
```

The badge would render as an absolutely-positioned `Badge` component over the card image:

```css
.ds-product-card__badge {
  position: absolute;
  top: var(--spacing-2);
  left: var(--spacing-2);
  z-index: var(--z-index-raised);
}
```

**Option B: Compose externally**

Wrap `ProductCard` in a positioned container and place `Badge` alongside. This is more flexible but less consistent.

**Recommendation:** Option A. The product data already has a `badge` field (see `products.ts`), and the card should own its badge rendering.

#### Sale Badge Variant

The current Badge variants are: `default`, `secondary`, `success`, `warning`, `destructive`, `outline`.

For sale badges, use the existing `destructive` variant (brick/red tones) which conveys urgency. If a distinct sale-specific color is desired:

**Proposed new variant: `sale`**
- Background: `color-mix(in srgb, var(--color-destructive) 12%, transparent)` — slightly stronger than standard 8%
- Text color: `var(--color-destructive)`
- This follows the existing `color-mix()` pattern used by all Badge variants

**However:** The `destructive` variant already works well for "Sale" badges and avoids adding a variant for a single use case. **Recommendation: use `destructive` variant for sale badges unless the brand requires a distinct treatment.** Flag this as a [PENDING DECISION].

#### Sale Price in ProductCard

The `ProductCard` currently only accepts `price`. To show compare-at pricing, it needs:

**Proposed addition to `ProductCardProps`:**

```tsx
export interface ProductCardProps {
  // ... existing props
  /** Original price in cents (shown with strikethrough when present) */
  compareAtPrice?: number;
}
```

When `compareAtPrice` is provided, render using the `PriceDisplay` component (which already supports `comparePrice` with strikethrough):

```tsx
// Inside ProductCard render:
{compareAtPrice ? (
  <PriceDisplay
    price={formatPrice(price, currency)}
    comparePrice={formatPrice(compareAtPrice, currency)}
    size="sm"
  />
) : (
  <Text size="sm" muted>{formatPrice(price, currency)}</Text>
)}
```

This composes the existing `PriceDisplay` component rather than duplicating strikethrough logic.

### States

Same as PLP — default (products loaded), empty (no sale items), loading.

Empty state messaging: "No items on sale right now. Check back soon or browse our collections."

### Responsive Behavior

Identical to PLP.

### Shopify Integration Notes

- Can map to a Shopify collection with an automated rule: `compare_at_price > price`
- Or use a manual "Sale" collection with hand-picked products
- `product.compare_at_price` is a native Shopify field — no metafields needed
- Sale badge logic: `{% if product.compare_at_price > product.price %}` → render badge
- Sale banner content can be driven by collection metafields (`collection.metafields.custom.sale_heading`, `collection.metafields.custom.sale_description`)
- Consider: Shopify doesn't have a native "sale percentage" — calculate in Liquid: `{% assign discount = product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price %}` and optionally display "20% off" in the badge

---

## Token Gap Report

Tokens, components, and patterns identified as missing during page template design. Each entry includes the context it resolves, a recommended name following existing conventions, and proposed value.

### Missing Components

#### 1. Pagination

**Context:** PLP, Search Results, and Sale pages all need pagination below the product grid.
**Recommended component:** `Pagination`
**Composition:** Uses `Button` (ghost variant) for page numbers, `Button` (secondary variant) for Previous/Next, `Text` for ellipsis.
**Props:**
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max page buttons to show before truncating with ellipsis */
  maxVisible?: number; // default: 5
  size?: 'sm' | 'md';
}
```
**Shopify note:** Maps directly to `paginate.pages`, `paginate.previous.url`, `paginate.next.url`.

#### 2. Skeleton / Loading Placeholder

**Context:** PLP, Search Results, and Sale pages need loading states for the product grid.
**Recommended component:** `Skeleton`
**Description:** A pulsing placeholder block that mimics content shape during loading. Common pattern: rounded rectangle with `background-color: var(--color-background-subtle)` and a shimmer animation.
**Props:**
```tsx
interface SkeletonProps {
  width?: string;   // CSS value, default '100%'
  height?: string;  // CSS value, default '1em'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; // maps to --radius-* tokens
}
```
**Animation token dependency:** Would use `--transition-slow` (262ms) for the shimmer cycle.

#### 3. EmptyState (Layout Pattern)

**Context:** PLP empty collection, Search no-results, and Sale no-items all share the same layout pattern: centered icon/heading + body text + CTA.
**Recommendation:** Not a new component — document as a **layout pattern** (CSS class) that composes `Heading`, `Text`, and `Button`. No new tokens needed.

```css
.ds-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-phi-34) var(--spacing-4);
  gap: var(--spacing-4);
}
```

### Missing Component Features

#### 4. ProductCard: `badge` prop

**Context:** Sale page needs badges overlaid on product images. General utility for "New", "Best Seller", "Sold Out" badges.
**Proposed change:** Add optional `badge?: string` and `badgeVariant?: BadgeVariant` props to `ProductCard`.
**No new tokens required** — uses existing `Badge` component and absolute positioning with `--spacing-2` offset and `--z-index-raised`.

#### 5. ProductCard: `compareAtPrice` prop

**Context:** Sale page needs strikethrough original pricing alongside sale price.
**Proposed change:** Add optional `compareAtPrice?: number` prop. When present, renders `PriceDisplay` instead of plain `Text` for the price.
**No new tokens required** — composes existing `PriceDisplay` component.

### Missing Tokens

#### 6. Content Prose / Rich Text Styles

**Context:** Terms & Conditions (and other legal/content pages) need styled HTML output from CMS rich text editors.
**Recommended:** A `.ds-prose` or `.ds-legal-content` CSS class that styles native HTML elements (`h1`–`h3`, `p`, `a`, `ul`, `ol`, `li`) using existing typography and spacing tokens.
**No new tokens** — this is a composition of existing tokens applied to native HTML elements.

### Decisions Pending

| ID | Decision | Context | Options |
|---|---|---|---|
| PT-1 | Sale badge variant | Should sale badges use existing `destructive` variant or a new `sale` variant? | `destructive` (reuse) vs. new `sale` variant |
| PT-2 | Filter bar component | PLP filtering — compose from existing components or create a dedicated `FilterBar`? | Composition pattern vs. new component |
| PT-3 | Search autocomplete | Should the search input support predictive search / autocomplete? | Defer vs. implement as dropdown/popover |
| PT-4 | Skeleton component priority | Is the `Skeleton` component needed for v1 or can loading states defer to Shopify? | Build now vs. defer |
| PT-5 | Customer account type | Shopify classic (password) vs. new (passwordless) accounts | Classic (documented above) vs. passwordless variant |
