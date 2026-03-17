# 04 — Components

> Architecture, patterns, accessibility requirements, and documentation standards for every component.

---

## Rules — Non-Negotiable

Read these before building or modifying any component.

1. **4-file rule.** Every component has exactly: `{Component}.tsx`, `{Component}.css`, `{Component}.test.tsx`, `{Component}.stories.tsx`, `index.ts`. All built in the same session. No exceptions.
2. **Components own their styles.** All visual styling lives in the component's CSS file. Demo pages and example pages never override component appearance.
3. **If something looks wrong on a page, fix the component — not the page.** The fix must benefit every page that uses the component.
4. **No overrides.** Block components never target a primitive's internal CSS classes. If the primitive doesn't support what you need, update the primitive first. See the No Overrides section below.
5. **No raw values.** Every CSS value references a token. If the token doesn't exist, flag it as a gap.
6. **`forwardRef` on everything.** Every component accepts a ref. Set `displayName`.
7. **Accessibility passes or the component doesn't ship.** Every component passes axe with zero violations. Keyboard navigation works. Focus states are visible.
8. **Always use `<Heading>` and `<Text>`.** Never raw `<h1>`–`<h6>` or `<p>` — not in components, not in demos, not anywhere.
9. **Disabled state uses `opacity: var(--opacity-medium)`.** Never `opacity: 0.5`.
10. **`display: none` on a child component's class = missing API.** Flag it and fix the component. Don't work around it in consumer CSS.

---

## Common Mistakes

| Mistake | What Happens | Correct Approach |
|---------|-------------|-----------------|
| Styling a component from the page CSS | Same component looks different across pages | Fix the component, create a variant if needed |
| `.parent .ds-accordion__trigger { padding }` | Invisible contract — breaks if primitive refactors | Update the primitive to support the use case |
| `display: none` on child's internal class | Fragile, invisible, breaks on refactor | Add a prop or render slot to the component |
| Forgetting `font-family` on portalled content | Select dropdown, Modal content use wrong font | Explicitly declare `font-family: var(--font-family-body)` on Radix Portal elements |
| `color-mix(… 8%, transparent)` for badge bg | Fails WCAG contrast — mathematically impossible | Use solid primitive (e.g., `--color-sage-50`) |
| Inline `style={{ }}` in gallery/demo code | Invisible to search, impossible to update globally | Use `demo-utilities.css` shared classes |
| Raw `<p>` or `<h2>` in demos | Doesn't use the design system's own components | Use `<Text>` and `<Heading>` |
| Hardcoded `opacity: 0.5` | Not φ-derived, inconsistent | `var(--opacity-medium)` — 0.382 |
| Fixed-width component in fluid grid | Phantom gaps, uneven whitespace | Provide a `fluid` variant |

---

## The 4-File Rule

Every component lives in its own folder:

```
packages/components/src/{component}/
├── {Component}.tsx          ← React implementation
├── {Component}.css          ← Styles (component tokens + all variants)
├── {Component}.test.tsx     ← Vitest + Testing Library + axe
├── {Component}.stories.tsx  ← Storybook stories (one per variant/state)
└── index.ts                 ← Re-exports
```

---

## TypeScript Patterns

### Required on every component

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', size = 'md', ...props }, ref) {
    return <button ref={ref} type="button" {...props} />
  }
)
Button.displayName = 'Button'
```

| Requirement | Why |
|------------|-----|
| `forwardRef` with correct element type | Consumers need ref for focus, animation, 3rd-party libs |
| `displayName` | Without it, React DevTools shows "ForwardRef" |
| Extends native HTML attributes | Consumers get `onClick`, `disabled`, `aria-*` for free |
| Default `variant` and `size` in signature | Most common usage needs zero props |
| `type="button"` on buttons | Prevents accidental form submission |
| String literal unions, not enums | Enums generate runtime code. Unions are zero-cost. |

### Props interface pattern

```tsx
// Extends all native <button> attributes
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  loading?: boolean
}

// When native prop conflicts with ours — Omit it
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
}
```

### Component API conventions

| Convention | Example | Why |
|------------|---------|-----|
| Default variant is `'primary'` | `variant = 'primary'` | Most common, no prop required |
| Default size is `'md'` | `size = 'md'` | Middle of scale |
| Boolean props false by default | `loading = false` | Opt-in |
| Polymorphic via `asChild` | `asChild?: boolean` | Radix Slot — the correct way |
| Loading disables interaction | `disabled={loading}` | Prevents double-submit |
| Icons are `ReactNode` | `leadingIcon?: ReactNode` | Accepts any icon library |
| Error strings, not booleans | `error?: string` | Text is both indicator and message |

---

## The `asChild` / Slot Pattern

The correct way to make polymorphic components. **Do not use `as={Link}` prop patterns — they break type safety.**

```tsx
import { Slot } from '@radix-ui/react-slot'

const Comp = asChild ? Slot : 'button'
return <Comp className={classes} {...props}>{children}</Comp>
```

```tsx
// The <a> gets all Button styles and aria attributes
<Button asChild>
  <a href="/checkout">Proceed to checkout</a>
</Button>
```

Used in: Button, Typography Text.

---

## CSS Patterns

### BEM with `ds-` namespace

```
.ds-{component}                ← root
.ds-{component}--{variant}     ← variant modifier
.ds-{component}--{state}       ← state modifier
.ds-{component}__{part}        ← child element
```

### Class assembly — always this pattern

```tsx
// ✅ Array + filter
const classes = [
  'ds-button',
  `ds-button--${variant}`,
  `ds-button--${size}`,
  loading && 'ds-button--loading',
  className,
].filter(Boolean).join(' ')

// ❌ Never template literals for conditional classes
const classes = `ds-button ds-button--${variant}${loading ? ' ds-button--loading' : ''}`
```

### Component token scoping

Each component declares tokens on its root class — the "knobs" consumers can turn:

```css
.ds-button {
  --button-radius:      var(--radius-md);
  --button-font-weight: var(--font-weight-medium);
  border-radius: var(--button-radius);
  font-weight: var(--button-font-weight);
}
```

### `font-family` inheritance

Declare once on root. Children inherit. **Exception:** Radix Portal content (Select dropdown, Modal) renders at `document.body` — must declare `font-family` explicitly.

```css
/* Root — declare once */
.ds-input-root { font-family: var(--font-family-body); }

/* Portalled content — must be explicit */
.ds-select-trigger { font-family: var(--font-family-body); }
.ds-select-item    { font-family: var(--font-family-body); }
```

### Transition shorthand

```css
/* ✅ */  transition: background-color var(--transition-fast);
/* ❌ */  transition: background-color 100ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## No Overrides Rule

**Block components must never override a primitive's internal CSS classes.**

### What counts as an override

Any CSS in a composed component that targets a primitive's internal class:

```css
/* ❌ NEVER — reaching into Accordion internals from CookieConsent */
.ds-cookie-consent__preferences .ds-accordion__trigger { padding: var(--spacing-1) 0; }
.ds-cookie-consent__preferences .ds-accordion__item:first-child { border-top: none; }
```

### What to do instead

1. **Identify the gap** — what doesn't the primitive support?
2. **Update the primitive** — add a prop, variant, or smarter default
3. **Use the new API** with zero overrides

| Need | ❌ Override | ✅ Fix primitive |
|------|-----------|-----------------|
| Accordion without outer borders | `.parent .ds-accordion__item:first-child { border-top: none }` | Add `flush` prop |
| Checkbox centered (no label) | `.parent .ds-checkbox-field { align-items: center }` | Default to `center` when no label (`:has()`) |
| Accordion header leaks h3 styles | `.parent .ds-accordion__header { margin: 0 }` | Add `font-size: inherit` in primitive CSS |

### What IS allowed in block component CSS

- Layout rules for the block's own elements (flex, grid, gap on `.ds-cookie-consent__*`)
- Block-specific styles (typography on block's own class)
- Generic child selectors for layout (`.ds-cookie-consent__actions > *`)
- Responsive rules for the block's own elements

---

## Optical Text Centering (`text-box-trim`)

Fixed-height controls appear off-center because browsers center the em box, not the visible glyphs.

### Apply to these components

| Component | Selector | Why |
|-----------|----------|-----|
| Button | `.ds-button` | Fixed-height, flex-centered label |
| Badge | `.ds-badge` | Fixed-height pill |
| Input | `.ds-input-field` | Fixed-height field |
| Select | `.ds-select-trigger` | Fixed-height trigger |
| QuantitySelector | `.ds-quantity-selector__value` | Fixed-height number |

### Do NOT apply to

Accordion, Card, Checkbox label, Typography, Modal, Breadcrumb — these have flowing/multi-line content.

### Implementation

```css
text-box-trim: both;
text-box-edge: cap alphabetic;
```

### Fallback (Firefox)

```css
@supports not (text-box-trim: both) {
  .ds-button { transform: translateY(0.05em); }
  /* If component uses transform (e.g. :active scale), combine: */
  .ds-button:active:not(:disabled) { transform: translateY(0.05em) scale(0.98); }
}
```

`0.05em` is tuned for Ancizar Serif. If the font changes, re-inspect and adjust.

Browser support: Chrome 133+, Safari 18.2+, Firefox not yet.

---

## Accordion Divider Convention

**Inner-only dividers.** No border above first item, no border below last. Dividers only between siblings.

```css
.ds-accordion__item { border-bottom: 1px solid var(--color-border); }
.ds-accordion__item:last-child { border-bottom: none; }
```

No `border-top` on first item. The `bordered` variant wraps in a panel with its own border + radius — inner dividers nest cleanly.

---

## Optimal Reading Width (65ch)

All body/paragraph text: `max-width: 65ch`. Typographic sweet spot (Bringhurst 45–75 range).

**Applied to:** `.ds-text`, `.ds-feature-block__desc`, `.ds-cookie-consent__description`, `.ds-readable-width` utility.

**NOT applied to:** Headings (run wider), captions, labels, buttons, badges, single-line text.

**Uses `ch` units** — adapts automatically if font or size changes. Never `px`.

**If body text renders wider than 65ch anywhere, it's a bug.**

---

## Focus Management

```css
/* ✅ Remove outline, provide ring */
.ds-button { outline: none; }
.ds-button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-focus-ring);
}

/* ❌ Never — keyboard users lose focus visibility */
.ds-button:focus { outline: none; }
```

Use `:focus-visible` not `:focus`. Keyboard users see the ring, mouse users don't.

### Focus ring tokens

```css
.ds-button:focus-visible { box-shadow: var(--focus-ring); }
.ds-button--primary:focus-visible { box-shadow: var(--shadow-sm), var(--focus-ring); }
.ds-accordion__trigger:focus-visible { box-shadow: var(--focus-ring-inset); }
.ds-input-field[aria-invalid="true"]:focus { box-shadow: var(--focus-ring-error); }
```

Never write the `color-mix()` expression directly — always use the composite token.

Global fallback in `tokens.css`: `*:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }`

---

## Accessibility Requirements by Component Type

### Button
- `type="button"` (prevents form submission)
- `aria-disabled={true}` for JS-disabled (stays focusable for screen readers)
- `aria-busy={true}` + `aria-label` for loading state
- Spinner gets `aria-hidden="true"`

### Input
- Label associated via `htmlFor`/`id` (use `useId()`)
- Error: `aria-invalid={true}` + `aria-describedby={errorId}` + `role="alert"` on error element
- Hint: `aria-describedby={hintId}` (no `role="alert"` — not announced immediately)

### Typography
- `Heading` renders correct semantic element (`h1`–`h4`)
- **Semantic level ≠ visual size.** `as` controls HTML element, `size` controls visual scale. They're independent. `<Heading as="h1" size="2xl">` is correct for an h1 in a narrow column.
- Heading supports `weight` prop (normal, medium, semibold, bold) — default is semibold

### Typography token mapping

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Heading h1 (4xl) | 54px | semibold | tight (1.15) | normal |
| Heading h2 (3xl) | 42px | semibold | tight | normal |
| Heading h3 (2xl) | 33px | semibold | tight | normal |
| Heading h4 (xl) | 26px | semibold | tight | normal |
| Text lg | 20px | normal | snug (1.375) | normal |
| Text base | 16px | normal | snug (1.375) | normal |
| Text sm | 14px | normal | normal (1.5) | normal |
| Caption | 12px | normal | normal (1.5) | normal |
| Code | 0.9em | normal | inherited | normal |

### Modal (Radix Dialog)
- Focus trapped inside. Returns to trigger on close.
- `role="dialog"`, `aria-labelledby`, `aria-describedby`
- `Escape` closes

### Select (Radix Select)
- `aria-expanded`, `aria-haspopup="listbox"`
- Arrow keys navigate, Enter/Space select, Escape closes

### Universal
- All icons: `aria-hidden="true"` (decorative) or `aria-label`
- Disabled: `opacity: var(--opacity-medium)`, not color alone
- Color is never the only state indicator — also use icons, text, or borders

---

## Testing Every Component

Minimum test coverage — no exceptions:

1. Renders without crashing
2. Correct HTML element rendered
3. `asChild` renders child element (if applicable)
4. Disabled state behavior
5. User interaction (click/keyboard)
6. `axe` no accessibility violations

```tsx
it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  expect(await axe(container)).toHaveNoViolations()
})
```

---

## Storybook Story Conventions

- `tags: ['autodocs']` on every meta object
- One story per meaningful state
- Use `render` for complex layouts (multiple components side by side)
- Inline styles in stories use token references: `gap: 'var(--spacing-3)'` not `gap: '12px'`
- Container widths for constraining stories are acceptable as inline styles (test harness, not patterns)

---

## Demo & Gallery Standards

- **Use design system components.** If `PriceDisplay` exists, use it — don't reimplement inline.
- **Use `<Text>` and `<Heading>`**, never raw `<p>` or `<h2>`.
- **Repeated patterns → `demo-utilities.css`.** 3+ occurrences = extract to shared class.
- **Every Storybook story must have a live preview** in the docs page. A heading + code snippet without `<Gallery client:load />` is a gap.

### Demo utility classes (in `apps/docs/src/styles/demo-utilities.css`)

| Class | Purpose |
|-------|---------|
| `.ds-unstyled-link` | Removes decoration for card-wrapping links |
| `.ds-demo-cover-image` | Full-width, 5:4 ratio, cover-fit, rounded |
| `.ds-demo-slide-image` | Full-width, block, rounded (carousel slides) |
| `.ds-demo-prose` | Max-width reading width for text demos |
| `.ds-demo-section-label` | Font sm, weight medium, bottom margin |
| `.ds-results-header` | Responsive results header (flex col → row at md) |
| `.ds-gallery-card` | Fixed 200px width for card demos |
| `.ds-gallery-card--wide` | Fixed 220px for product card demos |
| `.ds-gallery-input` | Max-width 360px for input demos |
| `.ds-gallery-select` | Fixed 220px for select demos |
| `.ds-gallery-full` | Width 100% for accordion/full-width demos |
| `.ds-gallery-label` | Size label (xs, muted) for variant labels |
| `.ds-viewport-indicator` | Fixed-position breakpoint indicator pill |

---

## Doc Page Blueprint

Every component docs page follows this structure:

### Files to create

1. **Gallery:** `apps/docs/src/components/{Name}Gallery.tsx` — live examples in `<Preview>`
2. **Page:** `apps/docs/src/pages/components/{name}.astro` — imports gallery with `client:load`
3. **Sidebar:** add link in `apps/docs/src/layouts/BaseLayout.astro` (alphabetical)

### Page sections in order

```
h1 → Component Name
p  → One-line description
h2 → Installation (import snippet)
h2 → Default (live example + code)
h2 → Variants/Sizes (live examples + code)
h2 → Props (table: Prop, Type, Default, Description)
h2 → Accessibility (ARIA/keyboard details)
```

### Parity check

Before marking done: open Storybook (`:6006`) and the docs page (`:4321`) side by side. **Every feature in Storybook must have a live preview in docs.** A code-only section is a gap.

### Foundation token pages

Must include:
1. **Visual previews for every token category** — not just value tables
2. **Semantic mapping tables** — showing which tokens each component variant uses

**Rule:** If a developer has to read component CSS to find what tokens a component uses, the docs are incomplete.

---

## Component Catalog

### Tier 1 — Primitives (single element, no state)

| Component | Element | Key Pattern |
|-----------|---------|-------------|
| Badge | `<span>` | 6 variants, 2 sizes. Solid primitive colors for contrast (not `color-mix`). |
| ColorSwatch | `<div>` | Docs utility only |
| PriceDisplay | `<div>` | `price` + optional `comparePrice` (strikethrough), `size` prop |
| Typography | `<h1>`–`<h4>`, `<p>` | `asChild` for polymorphism. Semantic level ≠ visual size. |
| StockIndicator | `<p>` | Status-based color + pulse, `prefers-reduced-motion` |

### Tier 2 — Interactive (has state or events)

| Component | Element | Key Pattern |
|-----------|---------|-------------|
| Button | `<button>` | `asChild` + Slot, loading state, leading/trailing icons |
| Input | wrapper | Compound: label + field + error, `useId()` for a11y |
| Checkbox | Radix | `checked`/`onCheckedChange`, indeterminate |
| ColorPicker | `<div>` group | `options` array, controlled value, selection ring |
| Select | Radix | Compound API, portal (needs explicit `font-family`) |
| QuantitySelector | `<div>` group | Controlled stepper, `role="group"`, min/max |
| StarRating | `<div role="img">` | SVG clipPath half-fill, clamped 0–5 |

### Tier 3 — Compound (multiple parts)

| Component | Parts | Key Pattern |
|-----------|-------|-------------|
| Accordion | Item, Trigger, Content | Radix, single/multiple, inner-only dividers, `bordered` variant |
| Modal | Trigger, Content, Header, Body, Footer, Close | Radix Dialog, focus trap, portal (needs explicit `font-family`) |
| ImageGallery | Main + thumbnails | `thumbnailPosition`, `aspectRatio`, keyboard nav |
| Breadcrumb | Nav > List > Items | CSS-based responsive collapse (not JS) |

### Tier 4 — Composed (combine other components)

| Component | Composition | Key Pattern |
|-----------|-------------|-------------|
| Card | Layout wrapper | Semantic slots (image, header, body, footer), 3 variants |
| ProductCard | Card + Badge + image | `renderPrice` prop, `badge` prop, `hoverImage`, `fluid` variant |
| Carousel + CarouselSlide | Scroll container | `scroll-snap-type`, responsive `flex-basis` sizes |
| FeatureBlock | Image + text grid | `reverse` prop, CSS `order` swap at tablet+ |
| CookieConsent | Accordion + Button | `position: fixed`, controlled/uncontrolled, i18n, `bordered` accordion |

---

## Responsive Component Patterns

### CSS-based collapse (Breadcrumb)
All items in DOM, CSS hides/shows at breakpoints. Better than JS: no layout shift, works without JS, animatable.

### Scroll-snap carousel
Native CSS `scroll-snap-type: x mandatory`. 60fps, native touch physics, zero JS bundle cost. Slide widths via `flex-basis` at breakpoints.

### Primary-first button stacking (CookieConsent)
Mobile: buttons stack vertically, primary promoted via `order: -1`. DOM order stays secondary→primary (correct for desktop left-to-right). Generalizes to any action bar.

### CSS order swap (FeatureBlock)
Alternating layouts via `order` property. DOM stays image→text (correct reading order), only visual order changes.

---

## Cookie Consent — Copy & Structure

**Tone:** Conversational, no legalese.

**Main dialog:** "We use cookies" heading. Three buttons: Manage Preferences (secondary) · Decline All (secondary) · Accept All (primary).

**Category defaults:** Strictly Necessary (always on, disabled toggle) · Functional (on) · Performance (on) · Targeting (off).

Each category has `learnMoreHref` for per-category privacy policy links.

**Mobile:** Primary button promoted to top via `order: -1`. Desktop keeps left-secondary / right-primary.

---

## Example Page Conventions

All example pages follow these rules:

- **BEM with `ds-` prefix:** `.ds-homepage__hero`, `.ds-collection__grid`
- **Layout grid system:** `.ds-page-container`, `.ds-layout`, `.ds-section` — see `09-layout-grid.md`
- **Section spacing:** `--spacing-16` (64px) between major sections via `.ds-section`
- **Component internals:** Standard 4px grid (`--spacing-1` through `--spacing-8`)
- **Typography:** Always `<Heading>` and `<Text>`, never raw tags
- **Icons:** Inline SVG, no icon library
- **Link-buttons:** `<Button asChild><a href="...">Label</a></Button>`, not `onClick` navigation
- **Prices in cents:** 4800 = $48.00. `formatPrice()` from shared data layer.
- **Placeholders:** SVG data URIs via `makePlaceholder()` / `makeLifestylePlaceholder()` — earthy tones matching palette
- **Responsive breakpoints:** 640px (sm), 768px (md), 1024px (lg)

### Page-level CSS rules

- **Pages handle composition only** — grid placement, section ordering, content arrangement
- **Pages never override component styles** — no page CSS targeting `.ds-button`, `.ds-accordion__trigger`, etc.
- **All values from tokens** — no hardcoded px or hex in page CSS

### Shared data layer

`apps/docs/src/data/products.ts`:
- `Product` interface with `id`, `name`, `price` (cents), `compareAtPrice`, `image`, `category`, `badge`, `description`
- `PRODUCTS` — 12 mock products with earthy SVG placeholders
- `formatPrice(cents, currency)` — `Intl.NumberFormat` formatter

---

## Site-Level Layout Components

These live in `apps/docs/src/layouts/` (not `@ds/components`):

| Component | File | Used By |
|-----------|------|---------|
| FullWidthLayout | `FullWidthLayout.astro` | All example pages (Homepage, Collection, PDP, Cart) |
| BaseLayout | `BaseLayout.astro` | Docs/component pages, sidebar navigation |

### Header (in FullWidthLayout)
Logo + nav (hidden mobile, visible 768px+) + dark mode toggle + cart icon (`<a>`, not `<button>`).

### Footer (in FullWidthLayout)
Four-column grid (brand, shop, company, support) + bottom bar (copyright, legal links). Single column mobile, `2fr 1fr 1fr 1fr` at 768px+.

Dark mode: logo `filter: invert(1)`, all colors via CSS custom properties.
