# 04 — Components

> Architecture, patterns, and accessibility requirements for every component.

---

## The 4-File Rule

Every component lives in its own folder under `packages/components/src/` and always has exactly these files:

```
packages/components/src/{component}/
├── {Component}.tsx          ← React component implementation
├── {Component}.css          ← Styles (component tokens + all variants)
├── {Component}.test.tsx     ← Vitest + Testing Library + axe tests
├── {Component}.stories.tsx  ← Storybook stories (one per variant/state)
└── index.ts                 ← Re-exports
```

No exceptions. If you're building a component, you're building all four files in the same session. "I'll add tests later" is how you end up with no tests.

---

## TypeScript Patterns

### Always use `forwardRef`

Every component must accept a `ref`. Consumers need ref access for focus management, animations, and third-party integrations.

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', ...props }, ref) {
    return <button ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
```

Always set `displayName` — without it, React DevTools shows `ForwardRef` instead of the component name.

### Extend native HTML attributes

Props interfaces extend the native HTML element's attributes. This means consumers get all native props (like `onClick`, `disabled`, `aria-*`) for free:

```tsx
// Button extends all native <button> attributes
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  loading?: boolean
}

// Input omits 'size' because it conflicts with our size prop
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
}
```

### String literal unions, not enums

```tsx
// ✓ Do this
type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

// ✗ Don't do this
enum Variant { Primary = 'primary', Secondary = 'secondary' }
```

Enums generate extra runtime code. String literal unions are zero-cost and more idiomatic in modern TypeScript.

### Default variant and size

Always define defaults in the function signature:
```tsx
function Button({ variant = 'primary', size = 'md', ... })
```

---

## The `asChild` / Slot Pattern

Some design decisions require a `<Button>` that renders as an `<a>` tag — for example, a navigation link styled as a primary button. The naive solution wraps `<a>` inside `<button>`, which is invalid HTML. The correct solution uses the Radix `Slot` component.

```tsx
import { Slot } from '@radix-ui/react-slot'

// Inside Button:
const Comp = asChild ? Slot : 'button'
return <Comp className={classes} {...props}>{children}</Comp>
```

When `asChild` is true, `Slot` merges the Button's props (className, ref, aria attributes) onto whatever child element you provide:

```tsx
// The <a> gets all Button styles and aria attributes
<Button asChild>
  <a href="/checkout">Proceed to checkout</a>
</Button>
```

This pattern is used in:
- Button — render as `<a>`, `<Link>`, anything
- Typography Text — render as `<p>`, `<span>`, `<div>`, `<label>`, etc.

---

## CSS Class Naming

BEM-inspired with a `ds-` namespace prefix to prevent collisions with consumer CSS:

```
.ds-{component}                    ← root element
.ds-{component}--{variant}         ← variant modifier
.ds-{component}--{state}           ← state modifier
.ds-{component}__{part}            ← child element
```

**Examples:**
```css
.ds-button                    /* root */
.ds-button--primary           /* variant */
.ds-button--sm                /* size */
.ds-button--loading           /* state */
.ds-button__spinner           /* child element */
.ds-input-root                /* root (compound component) */
.ds-input-field               /* the actual <input> */
.ds-input-label               /* the <label> */
.ds-input-label--required     /* state on child */
.ds-input-error               /* error message child */
```

Classes are assembled in the component with the **array pattern** — always this pattern, never template literals:
```tsx
// ✓ Always use this pattern
const classes = [
  'ds-button',
  `ds-button--${variant}`,
  `ds-button--${size}`,
  loading && 'ds-button--loading',
  className,
].filter(Boolean).join(' ')

// ✗ Don't use template literals for conditional classes
const classes = `ds-button ds-button--${variant}${loading ? ' ds-button--loading' : ''}`
```

### CSS `font-family` inheritance

Declare `font-family` once on the component root element. Let children inherit.

```css
/* ✓ Declare once on root */
.ds-input-root { font-family: var(--font-family-body); }
/* Children inherit automatically — no font-family needed */

/* Exception: Radix Portal content renders outside the DOM tree */
.ds-select-trigger { font-family: var(--font-family-body); }  /* Portalled */
.ds-select-item    { font-family: var(--font-family-body); }  /* Portalled */
```

**Exception:** Select dropdown, Modal content, and any other Radix `<Portal>` elements don't inherit from the component root because they render at the document body level. These must declare `font-family` explicitly.

---

## No Overrides Rule

**Block components (composed components) must never override a primitive's internal CSS classes.** If a primitive doesn't support the layout or behavior you need, go back and update the primitive first, then use it cleanly.

### What counts as an override

Any CSS rule in a composed component that targets a primitive's internal class name:

```css
/* ✗ NEVER do this — reaching into Accordion internals from CookieConsent */
.ds-cookie-consent__preferences .ds-accordion__trigger {
  padding: var(--spacing-1) 0;
}

.ds-cookie-consent__preferences .ds-accordion__item:first-child {
  border-top: none;
}

.ds-cookie-consent__category-row .ds-checkbox-field {
  align-items: center;
}
```

### What to do instead

1. **Identify the gap** — what does the primitive not support that the block component needs?
2. **Update the primitive** — add a prop, variant, or smarter default that handles the use case generically
3. **Use the primitive's new API** in the block component with zero overrides

### Examples of correct primitive fixes

| Need | Wrong (override) | Right (fix primitive) |
|------|-----------------|----------------------|
| Accordion without outer borders | `.parent .ds-accordion__item:first-child { border-top: none }` | Add `flush` prop to Accordion: `<Accordion flush>` |
| Checkbox centered in flex row (no label) | `.parent .ds-checkbox-field { align-items: center }` | Make Checkbox default to `center` when no label, `flex-start` when label present (`:has(.ds-checkbox-label)`) |
| Accordion header leaks global h3 styles | `.parent .ds-accordion__header { margin: 0; font-size: inherit }` | Add `font-size: inherit` to `.ds-accordion__header` in the primitive CSS |
| Different hover style | `.parent .ds-accordion__trigger:hover { text-decoration: underline }` | Change the primitive's default hover to the better pattern |

### Why this matters

- **Overrides are invisible contracts.** If someone refactors the Accordion's internal class names, every override silently breaks.
- **Overrides don't scale.** The next block component that needs flush borders would duplicate the same override.
- **Primitives should be self-sufficient.** If a primitive can't handle a common composition case, that's a gap in the primitive, not a reason to patch it from the outside.

### What IS allowed in block component CSS

- **Layout rules for the block's own elements** — flex, grid, gap, positioning on `.ds-cookie-consent__*` classes
- **Block-specific styles** — `.ds-cookie-consent__category-description` typography, `.ds-cookie-consent__actions` layout
- **Generic child selectors for layout** — `.ds-cookie-consent__actions > * { width: 100% }` (targets children by position, not by primitive class name)
- **Responsive rules for the block's own elements**

---

## Optical Text Centering (`text-box-trim`)

Fixed-height control components (buttons, badges, inputs, selects, quantity selectors) appear to have vertically off-center text because browsers center the full em box, not the visible ink (cap height → baseline). The fix is CSS `text-box-trim`.

### The rule

Every component that renders text inside a fixed-height, flex-centered container gets:

```css
text-box-trim: both;
text-box-edge: cap alphabetic;
```

This trims extra leading above the cap height and below the baseline so `align-items: center` aligns the visible glyphs, not the invisible em box.

### Which components get it

| Component | Selector | Why |
|-----------|----------|-----|
| Button | `.ds-button` | Fixed-height, flex-centered label |
| Badge | `.ds-badge` | Fixed-height pill with centered text |
| Input | `.ds-input-field` | Fixed-height field with centered text |
| Select | `.ds-select-trigger` | Fixed-height trigger with centered text |
| QuantitySelector | `.ds-quantity-selector__value` | Fixed-height centered number display |

### Which components do NOT get it

- **Accordion** — multi-line content, no fixed-height container
- **Card** — body/description is flowing text
- **Checkbox label** — multi-line capable, no fixed height
- **Typography** — body/paragraph text
- **Modal** — body content
- **Breadcrumb** — no fixed-height containers

### `@supports not` fallback

Browsers without `text-box-trim` support (Firefox as of early 2026) get a `translateY` nudge to approximate optical centering:

```css
@supports not (text-box-trim: both) {
  .ds-button {
    transform: translateY(0.05em);
  }
}
```

**Important:** If the component already uses `transform` (e.g. Button's `:active` state uses `scale(0.98)`), the fallback must combine both transforms:

```css
@supports not (text-box-trim: both) {
  .ds-button {
    transform: translateY(0.05em);
  }
  .ds-button:active:not(:disabled) {
    transform: translateY(0.05em) scale(0.98);
  }
}
```

The `0.05em` offset is tuned for Ancizar Serif. If the font changes, re-inspect in a browser without `text-box-trim` support and adjust.

### Browser support

- Chrome 133+ (Jan 2025)
- Safari 18.2+ (Dec 2024)
- Firefox: not yet supported — uses `@supports not` fallback

The property degrades gracefully — unsupported browsers simply ignore it and fall through to the `@supports not` block.

---

## Component Token Scoping

Each component opens its CSS file by declaring component-level tokens on its root class. These are the "knobs" consumers can turn to customize the component without overriding individual properties:

```css
/* Button.css */
.ds-button {
  /* Component tokens — override these to customize */
  --button-radius:      var(--radius-md);
  --button-font-weight: var(--font-weight-medium);

  /* Base styles — use the component tokens */
  border-radius: var(--button-radius);
  font-weight: var(--button-font-weight);
}
```

Consumer override:
```css
/* Only affects buttons in .my-app — no global side effects */
.my-app .ds-button {
  --button-radius: var(--radius-full);
}
```

---

## Focus Management

**Rule:** Never use `outline: none` without providing an alternative focus indicator.

```css
/* ✓ Remove outline, provide a better ring */
.ds-button {
  outline: none;
}
.ds-button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-focus-ring);
}

/* ✗ Never do this — keyboard users have no idea where focus is */
.ds-button:focus {
  outline: none;
}
```

**`:focus-visible` vs `:focus`:**
- `:focus` triggers on mouse clicks AND keyboard navigation
- `:focus-visible` only triggers when the browser determines a focus indicator is needed (keyboard, not mouse)

This means keyboard users see the focus ring, mouse users don't. Both get correct behavior.

A **global fallback** is also emitted in `tokens.css`:
```css
*:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```
This catches any interactive element that doesn't have a component-level focus style.

---

## Accessibility Requirements by Component Type

### Button
```tsx
// type="button" prevents accidental form submission
<button type="button" ...>

// For JS-disabled state (not HTML disabled) — still focusable for screen readers
<button aria-disabled={true} ...>

// Loading state
<button aria-busy={true} aria-label="Saving...">
  <Spinner aria-hidden="true" />
  Save
</button>
```

### Input
```tsx
// Label must be associated with input via htmlFor/id
const id = useId()
<label htmlFor={id}>Email</label>
<input id={id} ... />

// Error message announced immediately
<input aria-invalid={true} aria-describedby={errorId} />
<span id={errorId} role="alert">   {/* role="alert" → announced immediately */}
  Please enter a valid email
</span>

// Hint text linked but not announced immediately
<input aria-describedby={hintId} />
<span id={hintId}>We'll never share your email</span>
```

### Typography
- `Heading` renders the correct semantic element (`h1`–`h4`) — not a styled `<div>`
- `Heading` supports decoupled `size` (xl | 2xl | 3xl | 4xl) and `weight` (normal | medium | semibold | bold) props — semantic level (`as`) and visual size are independent. Default size maps to the level (h1 → 4xl, h2 → 3xl, h3 → 2xl, h4 → xl). Use `size` to render a visually smaller heading without changing the HTML element: `<Heading as="h1" size="2xl" weight="normal">`.
- Icon-only content needs `aria-label` or `aria-hidden` + accompanying visible text

### Dialog / Modal *(implemented — `@radix-ui/react-dialog`)*
- Focus trapped inside the modal while open
- Focus returns to the trigger element when closed
- `role="dialog"`, `aria-labelledby`, `aria-describedby`
- `Escape` key closes
- Compound API: `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody`, `ModalFooter`, `ModalClose`

### Select / Dropdown *(implemented — `@radix-ui/react-select`)*
- `aria-expanded`, `aria-haspopup="listbox"`
- Arrow keys navigate options
- `Enter` / `Space` select an option
- `Escape` closes without selecting
- Compound API: `Select`, `SelectItem`, `SelectGroup`, `SelectSeparator`

### Universal rules
- All icons are either `aria-hidden="true"` (decorative) or have an `aria-label`
- Disabled elements use `opacity: 0.5` not color alone
- Color is never the only indicator of state — also use icons, text, or borders

---

## Testing Every Component

Minimum test coverage for every component:

```tsx
describe('ComponentName', () => {
  // 1. Renders without crashing
  it('renders', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  // 2. Correct HTML element rendered
  it('renders as button by default', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button').tagName).toBe('BUTTON')
  })

  // 3. asChild renders child element, not wrapper
  it('renders as anchor with asChild', () => {
    render(<Button asChild><a href="/path">Link</a></Button>)
    expect(screen.getByRole('link').tagName).toBe('A')
  })

  // 4. Disabled state
  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // 5. User interaction
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  // 6. Accessibility scan
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

---

## Storybook Story Conventions

```tsx
// Meta object — enables autodocs
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],           // generates an automatic props table
  argTypes: {
    variant: { control: 'select' },
    size: { control: 'select' },
  },
}
export default meta

// One story per meaningful state
export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
}

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
}

// Use render for complex layouts (multiple components side by side)
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}
```

---

## Component API Conventions

Establish these conventions and hold to them across every component:

| Convention | Example | Rationale |
|------------|---------|-----------|
| Default variant is `'primary'` | `variant = 'primary'` | Most common usage, no prop required |
| Default size is `'md'` | `size = 'md'` | Middle of the scale |
| Boolean props are false by default | `loading = false` | Opt-in to states |
| Polymorphic via `asChild` | `asChild?: boolean` | Radix Slot pattern |
| Loading disables interaction | `disabled={loading}` | Prevents double-submit |
| Icons are `ReactNode`, not strings | `leadingIcon?: ReactNode` | Flexible, accepts any icon library |
| Error strings, not booleans | `error?: string` | The error text is both the indicator and the message |

---

## Component Catalog

All 21 components shipped, organized by complexity tier.

### Tier 1 — Primitives (single element, no state)
| Component | Element | Key Pattern |
|-----------|---------|-------------|
| Badge | `<span>` | `variant` + `size`, no interaction |
| ColorSwatch | `<div>` | Display-only, used in docs token pages |
| PriceDisplay | `<div>` | `price` + optional `comparePrice` (strikethrough), `size` prop |
| Typography (Heading/Text) | `<h1>`–`<h4>`, `<p>` | `asChild` for polymorphism, semantic level prop |
| StockIndicator | `<p>` | Status-based color + pulse animation, `status` prop maps to defaults |

### Tier 2 — Interactive (single element, has state or events)
| Component | Element | Key Pattern |
|-----------|---------|-------------|
| Button | `<button>` | `asChild` + Slot, `variant`/`size`, loading state |
| Input | `<input>` wrapper | Compound: label + field + error, `useId()` for a11y linking |
| Checkbox | `<input type="checkbox">` | Radix primitive, `checked`/`onCheckedChange` |
| ColorPicker | `<div>` group | `options` array of `{ value, color, label }`, controlled `value`/`onChange`, renders ColorSwatch buttons with selection ring |
| Select | Radix Select | Compound API, portal rendering, keyboard nav |
| QuantitySelector | `<div>` group | Controlled stepper, `role="group"`, min/max bounds |
| StarRating | `<div role="img">` | SVG stars with clipPath half-fill, clamped 0–5 |

### Tier 3 — Compound (multiple parts, complex state)
| Component | Parts | Key Pattern |
|-----------|-------|-------------|
| Accordion | Item, Trigger, Content | Radix primitive, `type="single"|"multiple"`, `size` prop, inner-only dividers by default, `bordered` variant, checkbox trigger variant |
| Modal | Trigger, Content, Header, Body, Footer, Close | Radix Dialog, focus trap, portal |
| ImageGallery | Main image + thumbnails | `thumbnailPosition`, `aspectRatio`, keyboard nav |
| Breadcrumb | Nav > List > Items | CSS-based responsive collapse (not JS filtering) |

### Tier 4 — Composed (combine other components or complex layout)
| Component | Composition | Key Pattern |
|-----------|-------------|-------------|
| Card | Layout wrapper | Semantic slots (image, header, body, footer) |
| ProductCard | Card + Badge + image | Composed from primitives, aspect ratio control |
| Carousel + CarouselSlide | Scroll container + children | `scroll-snap-type`, responsive `flex-basis` sizes |
| FeatureBlock | Image + text grid | `reverse` prop uses CSS `order` swap at tablet+ |
| CookieConsent | Accordion + Button | `position: fixed` banner, controlled/uncontrolled, i18n labels, uses `bordered` accordion with native checkbox variant |

### Site-Level Layout Components

These are not in `@ds/components` — they live in `apps/docs/src/layouts/` as Astro components. They form the site chrome that wraps every example page.

| Component | File | Description |
|-----------|------|-------------|
| FullWidthLayout | `FullWidthLayout.astro` | Full-bleed layout with Header, Footer, and `<slot>` for page content. Used by all example pages (Homepage, Collection, PDP, Cart). |
| BaseLayout | `BaseLayout.astro` | Sidebar + content layout used by docs/component pages. Includes sidebar navigation with Getting Started, Foundation, Components, and Examples sections. |

#### Header (`FullWidthLayout.astro`)

The site header is built directly in the layout file (not a standalone component) and contains:

| Element | Implementation | Notes |
|---------|---------------|-------|
| Logo | `<a>` + `<img>` SVG | Links to `/`, inverted via `filter: invert(1)` in dark mode |
| Navigation | `<nav>` with `<a>` links | Hidden on mobile (`display: none`), visible at 768px+. Links: Shop → `/examples/homepage`, Collections → `/examples/collection`, About → `#` |
| Dark mode toggle | `<button>` with sun/moon SVG icons | Toggles `.dark` class on `<html>`, persists to `localStorage('ds-theme')`. Sun icon hidden in dark mode, moon icon hidden in light mode via `:global(.dark)` selectors. |
| Cart icon | `<a>` with shopping bag SVG | Links to `/examples/cart`. Changed from `<button>` to `<a>` for proper navigation. |

**Responsive behavior:**
- Mobile: logo + actions only (nav hidden)
- Tablet (768px+): nav links appear between logo and actions
- Padding scales: `--spacing-4` → `--spacing-8` → `--spacing-16` at sm/md/lg

#### Footer (`FullWidthLayout.astro`)

Four-column grid footer built directly in the layout:

| Column | Content |
|--------|---------|
| Brand | Logo + tagline ("Thoughtfully designed accessories for everyday carry.") |
| Shop | Phone Cases, Wallets, Bags, Accessories |
| Company | About, Journal, Sustainability, Careers |
| Support | Contact, Shipping & Returns, FAQ, Warranty |

Bottom bar: copyright + Privacy Policy / Terms of Service links.

**Responsive:** Single column on mobile, `2fr 1fr 1fr 1fr` grid at 768px+. Bottom bar stacks on mobile, row with `space-between` on tablet+.

**Dark mode:** Logo gets `filter: invert(1)`, all colors use CSS custom properties so they adapt automatically.

### Cookie Consent — Copy Conventions & Structure

**Tone:** Conversational and clear — no legalese. Explain what each category does in plain language so users understand their choices without feeling pressured.

**Main Dialog:**
- Heading: "We use cookies"
- Body: "We use cookies to improve your experience and understand how our site is used. You can manage your preferences anytime."
- Buttons (left → right): `Manage Preferences` (secondary) · `Decline All` (secondary) · `Accept All` (primary)

**Preferences Screen — Category Structure:**

| Category | Default State | Toggle Behavior | Copy Tone |
|----------|--------------|-----------------|-----------|
| Strictly Necessary Cookies | Always on | Disabled (greyed out, no interaction) | "These keep the site running…" — frame as essential, not optional |
| Functional Cookies | On | On/Off | "These remember your preferences…" — explain the trade-off of turning off |
| Performance Cookies | On | On/Off | "These help us understand…" — emphasize anonymity ("None of it is tied to you personally") |
| Targeting Cookies | Off | On/Off | "These may be placed by our advertising partners…" — honest about ads, explain what happens if turned off |

Each category includes a per-category "Learn more" link (`learnMoreHref` on `CookieCategory`) pointing to the relevant privacy policy section. Links use a consistent underline style (`.ds-cookie-consent__link`).

**Preferences Screen Buttons:**
- `Back` (secondary) — returns to main dialog without saving
- `Save Preferences` (primary) — confirms custom choices and closes banner

**Mobile Button Order:**
On small screens (<640px), buttons stack vertically with the primary action first (using CSS `order: -1` on `.ds-button--primary`). This ensures the most important action — Accept All on the main dialog, Save Preferences on the preferences screen — is always immediately visible without scrolling. Desktop keeps the conventional left-secondary / right-primary order.

**Key API Props:**
- `learnMoreHref` on `CookieConsentProps` — global learn more link in the description
- `learnMoreHref` on `CookieCategory` — per-category learn more link in accordion content
- `rejectLabel` defaults to "Decline All" (not "Reject All" — softer tone)
- `closeLabel` defaults to "Back" (used in preferences view)

---

## Responsive Component Patterns

### CSS-based responsive collapse (Breadcrumb)
Render all items in the DOM, use CSS classes to hide/show at breakpoints. This is better than JS filtering because:
- No layout shift on hydration
- Works without JS
- Animatable with transitions

```css
/* Mobile: hide middle items */
.ds-breadcrumb__item--collapsible { display: none; }
.ds-breadcrumb__ellipsis { display: inline; }

/* Tablet+: show everything */
@media (min-width: 768px) {
  .ds-breadcrumb__item--collapsible { display: flex; }
  .ds-breadcrumb__ellipsis { display: none; }
}
```

### Scroll-snap carousel
The Carousel component uses native CSS scroll-snap instead of JavaScript-driven sliding. This gives:
- 60fps scrolling on all devices
- Native touch/trackpad physics
- No JS bundle cost for scroll behavior

```css
.ds-carousel__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* hide scrollbar */
}
.ds-carousel__slide {
  flex-shrink: 0;
  scroll-snap-align: start;
}
```

Responsive slide widths use `flex-basis` at breakpoints (not JS resize observers).

### Primary-first button stacking (CookieConsent)
On mobile, action buttons stack vertically with the primary button promoted to the top via `order: -1`. DOM order stays secondary → primary (correct for desktop's left-to-right reading), but mobile shows the primary action first since it's the most important tap target:

```css
@media (max-width: 639px) {
  .ds-cookie-consent__actions {
    display: flex;
    flex-direction: column;
  }
  .ds-cookie-consent__actions > .ds-button--primary {
    order: -1;
  }
}
```

This pattern generalizes to any action bar where the primary CTA should lead on small screens.

### CSS order swap (FeatureBlock)
Alternating image/text layouts use `order` instead of duplicating markup:

```css
@media (min-width: 768px) {
  .ds-feature-block--reverse .ds-feature-block__image { order: 2; }
  .ds-feature-block--reverse .ds-feature-block__text { order: 1; }
}
```

DOM order stays image → text (correct reading order), only visual order changes.

---

## Status-based Component Pattern (StockIndicator)

When a component has a finite set of states with default labels and colors, use a `status` prop with lookup maps:

```tsx
const defaultLabels: Record<StockStatus, string> = {
  'in-stock': 'In stock and ready to ship',
  'low-stock': 'Low stock — order soon',
  'out-of-stock': 'Out of stock',
};

// Consumer uses: <StockIndicator status="low-stock" />
// Or overrides:  <StockIndicator status="low-stock" label="Only 3 left" />
```

This pattern works for any status indicator (order status, shipping, verification badges).

---

## Accordion Divider Convention

Accordion groups use **inner-only dividers** — no border above the first item, no border below the last item. Only the borders between items are visible.

This is the default behavior, not an opt-in variant. The CSS uses `:last-child` to remove the bottom border:

```css
.ds-accordion__item {
  border-bottom: 1px solid var(--color-border);
}

.ds-accordion__item:last-child {
  border-bottom: none;
}
```

No `border-top` is added to the first item — dividers are purely `border-bottom` between siblings.

**Why:** Inner-only dividers create a cleaner edge when the accordion sits within a larger layout. Outer borders cause doubled lines when the accordion abuts other bordered elements (cards, panels, page sections) and add unnecessary visual weight at the boundaries.

The `bordered` variant wraps the accordion in a panel container with its own border + radius — the inner-only dividers nest cleanly inside without doubled borders.

The legacy `flush` prop is retained for API compatibility but is now a no-op since the default behavior matches.

---

## Optimal Reading Width (65ch)

All body and paragraph text is constrained to `max-width: 65ch` — approximately 65 characters per line. This is the typographic sweet spot for comfortable reading (Bringhurst recommends the 45–75 character range; 65 is the center of that range).

### Why `ch` units, not `px`

The `ch` unit is based on the width of the "0" character in the current font. If the font or font size changes, the reading width adapts automatically. A fixed `px` value would break when type sizes change — `65ch` stays correct regardless of context.

### Where it's applied

| Location | How | Notes |
|----------|-----|-------|
| **`.ds-text`** (Typography.css) | `max-width: 65ch` on base class | Covers all `<Text>` component body copy. Only affects block-level elements (p, div) — inline elements (span, label) ignore max-width automatically. |
| **`.ds-feature-block__desc`** | `max-width: 65ch` | FeatureBlock description paragraphs |
| **`.ds-cookie-consent__description`** | `max-width: 65ch` | Cookie consent body text |
| **`.ds-readable-width`** (utility) | `max-width: 65ch` | Apply to any non-component paragraph that needs the constraint |

### Where it does NOT apply

- **Headings** — exempt. Headings can run wider than body text, creating a natural visual hierarchy where headings span the available space and body text tucks underneath at a comfortable reading width.
- **Captions, labels, metadata** — UI text, not reading text
- **Text inside compact components** — buttons, badges, tags, table cells
- **Single-line text that doesn't wrap** — truncated text, breadcrumbs

### Using the utility class

For raw HTML or Astro templates outside the `<Text>` component:

```html
<p class="ds-readable-width">
  This paragraph will be constrained to 65 characters per line.
</p>
```

**If body text renders wider than 65ch anywhere, it's a bug.**

---

## SVG Star Rating Pattern

Half-star rendering uses SVG `clipPath` — draw the full star shape twice, clip one to 50% width:

```tsx
<defs>
  <clipPath id="ds-star-half">
    <rect x="0" y="0" width="10" height="20" />
  </clipPath>
</defs>
<path d="..." className="star-bg" />      {/* empty star behind */}
<path d="..." clipPath="url(#ds-star-half)" className="star-fill" /> {/* filled half on top */}
```

---

## Doc Page Blueprint

Every component doc page follows the same structure. Copy this when adding a new component:

1. **Gallery file** (`apps/docs/src/components/{Name}Gallery.tsx`) — React components that render live examples wrapped in `<Preview>`
2. **Astro page** (`apps/docs/src/pages/components/{name}.astro`) — imports gallery with `client:load`
3. **Sidebar link** (`apps/docs/src/layouts/BaseLayout.astro`) — add alphabetically in Components section

Page sections in order:
```
h1 → Component Name
p  → One-line description
h2 → Installation (import snippet)
h2 → Default (live example + code)
h2 → Variants/Sizes (live examples + code)
h2 → Props (table: Prop, Type, Default, Description)
h2 → Accessibility (ul of ARIA/keyboard details)
```

Props table CSS is duplicated per page (Astro scoped styles). This is intentional — no shared stylesheet needed.

---

## Example Page Compositions

Four full-page prototypes live in `apps/docs/src/pages/examples/` and demonstrate how the component library composes into real storefront pages. Each page follows the same file pattern: an `.astro` wrapper (using `FullWidthLayout`) + a React component (`client:load`) + a CSS file for page-specific layout.

### Shared Data Layer

All pages consume from `apps/docs/src/data/products.ts`:
- `Product` interface — `id`, `name`, `price` (cents), `compareAtPrice`, `image`, `category`, `badge`, `description`
- `PRODUCTS` — 12 mock products with earthy SVG placeholder images
- `formatPrice(cents, currency)` — `Intl.NumberFormat` currency formatter

Prices are stored in **cents** (e.g., `4800` = $48.00) to avoid floating-point issues — the same convention Shopify and Stripe use.

### Page: Homepage (`/examples/homepage`)

| Section | Components Used | Layout Pattern |
|---------|----------------|----------------|
| Hero | Heading (h1, 4xl), Text (lg, muted), Button (primary, lg, `asChild` → `<a>`) | Centered flex column, `min-height: 60vh`, subtle background |
| Featured Products | Heading (h2), Text, Carousel + CarouselSlide (sm), ProductCard | Horizontal scroll, each card links to PDP |
| Feature Blocks | FeatureBlock (×3, alternating `reverse`) | Stacked with `--spacing-phi-21` gap |
| Newsletter | Heading (h3), Text, Input (email), Button (primary, submit) | Centered, `max-width: 480px`, row on tablet+, stacked mobile |

**State:** Single `email` string for the newsletter input. Form submit clears the field.

**Key patterns:**
- `Button asChild` wrapping `<a>` for the hero CTA — renders a link styled as a primary button
- `CarouselSlide size="sm"` for tighter product card widths in the featured section
- `FeatureBlock reverse={i % 2 === 1}` for alternating left/right image placement
- Newsletter form uses `flex-direction: column` on mobile, `row` on tablet+ via media query

### Page: Collection (`/examples/collection`)

| Section | Components Used | Layout Pattern |
|---------|----------------|----------------|
| Breadcrumb | Breadcrumb | Home › Collections › All Products |
| Header + Sort | Heading (h1, 2xl), Text (sm, muted, count), Select + SelectItem (sm) | Flex row, sort right-aligned on tablet+ |
| Product Grid | ProductCard (×12) | CSS Grid: 2-col mobile → 3-col tablet → 4-col desktop |

**State:** `sortValue` string controlling sort order via `useMemo` re-sort.

**Sort options:** Newest (default order), Price Low→High, Price High→Low, Best Selling (badge-based simulation).

**Key patterns:**
- Responsive grid uses `grid-template-columns: repeat(N, 1fr)` at breakpoints — no JS resize logic
- Sort dropdown uses `Select size="sm"` to stay compact in the header row
- Each ProductCard is wrapped in an `<a>` linking to the PDP
- Header row uses `flex-direction: column` on mobile, `row` with `justify-content: space-between` on tablet+

### Page: Product Detail (`/examples/product-detail`)

| Section | Components Used | Layout Pattern |
|---------|----------------|----------------|
| Gallery | ImageGallery (left thumbnails) | Golden ratio grid: `1.618fr 1fr` at lg |
| Details | Heading, Text, Badge, StarRating, ColorPicker, Select, QuantitySelector, Button, StockIndicator | Sticky sidebar, flex column |
| Accordion | Accordion (multiple, sm, bordered) | Product info sections |
| Lifestyle | Carousel + CarouselSlide | Lifestyle image gallery |
| Features | FeatureBlock (×3, alternating) | Same pattern as Homepage |

**State:** Color, size, quantity selections. Pre-populated with product data.

### Page: Cart (`/examples/cart`)

| Section | Components Used | Layout Pattern |
|---------|----------------|----------------|
| Header | Heading (h1, 2xl), Text (sm, muted, item count) | Full-width span at lg |
| Line Items | Text (sm), QuantitySelector (sm), inline SVG remove button | Grid: `80px 1fr auto` mobile, `100px 1fr auto auto` tablet+ |
| Order Summary | Heading (h2, lg), Text, Button (primary, lg, fullWidth), Button (secondary, asChild → `<a>`) | Sticky sidebar at lg, subtle background |
| Empty State | Heading (h3), Text (muted), Button (secondary, asChild → `<a>`) | Centered, full-width span |

**State:** `CartItem[]` (product + quantity) with 3 pre-populated items. Derived values: subtotal, shipping (free over $50), total, item count.

**Key patterns:**
- Golden ratio grid (`1.618fr 1fr`) matching PDP layout at desktop
- Sticky order summary sidebar with `position: sticky; top: var(--spacing-6)`
- `QuantitySelector size="sm"` inline within line items — uses `align-items: start` to prevent stretch
- Conditional shipping: free over `FREE_SHIPPING_THRESHOLD` (5000 cents / $50)
- Empty state renders when all items are removed — centered CTA to continue shopping
- Remove button uses inline SVG × icon with `aria-label={`Remove ${name}`}` for accessibility

### Cross-Page Navigation

| Link | From → To |
|------|-----------|
| Header "Shop" | Any page → Homepage |
| Header "Collections" | Any page → Collection |
| Header cart icon | Any page → Cart (`<a>` instead of `<button>`) |
| Hero CTA | Homepage → Collection |
| Product cards | Homepage/Collection → PDP |
| Breadcrumb | Collection → Homepage |
| "Continue Shopping" | Cart → Collection |

### Page Layout Conventions

All example pages follow these conventions established by the PDP:

- **BEM with `ds-` prefix**: `.ds-homepage__hero`, `.ds-collection__grid`, `.ds-cart__line-item`
- **Phi spacing tokens**: `--spacing-phi-34` (68px) for major section breaks, `--spacing-phi-21` (42px) for paragraph-level breaks, `--spacing-phi-13` (26px) for minor spacing
- **Responsive breakpoints**: 640px (sm), 768px (md), 1024px (lg)
- **Golden ratio grid**: `grid-template-columns: 1.618fr 1fr` at lg breakpoint for two-column layouts (PDP, Cart)
- **Placeholder images**: SVG data URIs via `makePlaceholder()` (800×1000 portrait) and `makeLifestylePlaceholder()` (1000×800 landscape) — earthy tones matching the brand palette
- **Typography**: Always use Heading/Text components, never raw HTML heading or paragraph tags
- **Icons**: Inline SVG, no icon library dependency
- **`asChild` for link-buttons**: Use `<Button asChild><a href="...">Label</a></Button>` instead of `onClick` navigation
