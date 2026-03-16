# 03 — Design Tokens

> The most important part of the system. Everything else builds on top of this.

---

## Golden Ratio Foundation

Every numeric scale in this token system is derived from the golden ratio **φ = 1.618033...** and its inverse **1/φ = 0.618**. This is not ornamental — it encodes a mathematical relationship that appears at every level: within a component, between components, between sections, and across the full page.

### Why φ?

The human eye perceives proportions close to φ as balanced without being static. Equal ratios feel rigid; random ratios feel chaotic; φ-ratios feel resolved. For an editorial, premium ecommerce system the governing proportion needs to feel unhurried and considered.

### The Math Reference Table

| Constant | Value | Role |
|----------|-------|------|
| φ | 1.618 | Step ratio for display/expressive type scale |
| √φ | 1.272 | Step ratio for default product type scale |
| φ^(1/3) | 1.175 | Step ratio for tight/dense UI type scale |
| 1/φ | 0.618 | Opacity "high", spacing contraction factor |
| (1/φ)^2 | 0.382 | Opacity "medium", layout minor split |
| (1/φ)^3 | 0.236 | Opacity "low" |
| Fibonacci | 1,1,2,3,5,8,13,21,34,55,89 | Integer approximation of φ; used for radius and spacing |

### Three Type Scales

Three scales exist for different contexts, each using a different fractional power of φ as the step multiplier:

| Scale | CSS prefix | Step ratio | Use case |
|-------|-----------|-----------|----------|
| **Tight** | `--font-size-tight-*` | φ^(1/3) ≈ 1.175 | Dense UI: labels, captions, table cells, form hints |
| **Default** | `--font-size-*` | √φ ≈ 1.272 | Product UI: body text, component text, headings |
| **Display** | `--font-size-display-*` | φ ≈ 1.618 | Editorial: hero text, campaign headlines, pull quotes |

**Default scale values** (base 16px, √φ step):
```
xs   = 12px (0.75rem)    sm   = 14px (0.875rem)   base = 16px (1rem)
lg   = 20px (1.25rem)    xl   = 26px (1.625rem)    2xl  = 33px (2.0625rem)
3xl  = 42px (2.625rem)   4xl  = 54px (3.375rem)    5xl  = 68px (4.25rem)
```
Note: xs and sm are anchored at 12px/14px rather than the strict φ value (10px/13px) to maintain accessibility at small sizes.

**Display scale values** (base 16px, φ step):
```
display-2xs = 6px     display-xs = 10px    display-sm = 16px
display-md  = 26px    display-lg = 42px    display-xl = 68px    display-2xl = 110px
```

### Fibonacci Spacing Reference

The `--spacing-phi-*` tokens express the Fibonacci × 2px scale directly:
```
phi-1=2px  phi-2=4px  phi-3=6px  phi-5=10px  phi-8=16px
phi-13=26px  phi-21=42px  phi-34=68px  phi-55=110px  phi-89=178px
```
Note how φ naturally includes 16px (base font size) at Fibonacci step 8. The existing `--spacing-*` tokens (4px grid) are preserved for component layout; use the φ-spacing tokens for section-level spacing and layout splits.

### Fractal Coherence Principle

The same ratio should appear at every scale level simultaneously:
- Inner padding × φ ≈ outer margin
- Component gap × φ ≈ section gap
- Section gap × φ ≈ page gap
- Minor column (38.2%) × φ ≈ major column (61.8%)

This creates a layout where the eye moves naturally from detail to structure to page without abrupt visual transitions.

### φ-Derived Opacity Scale

Successive powers of 1/φ, available as `--opacity-*`:
```
full=1.0   high=0.618   medium=0.382   low=0.236   subtle=0.146   ghost=0.09
```

### φ-Derived Shadows

Shadow blur and spread values follow the Fibonacci sequence. Going up one elevation level means the next Fibonacci number:

| Token | y-offset | blur | Fibonacci step |
|-------|----------|------|----------------|
| `--shadow-sm` | 1px | 2px | Fib(1), Fib(3) |
| `--shadow-md` | 2px | 5px | Fib(3), Fib(5) |
| `--shadow-lg` | 5px | 13px | Fib(5), Fib(7) |
| `--shadow-xl` | 8px | 21px | Fib(6), Fib(8) |
| `--shadow-2xl` | 13px | 34px | Fib(7), Fib(9) |

### φ-Derived Transition Timing

Durations grow by φ at each step:
```
fast = 100ms   normal = 162ms (100 × φ)   slow = 262ms (162 × φ)
```

### φ-Derived Border Radius

Radius values follow the Fibonacci sequence directly:
```
none=0   sm=2px   md=5px   lg=8px   xl=13px   2xl=21px
```
Fib: (1), (2), (3), (5), (8), (13), (21)

### Card Aspect Ratios

The natural φ proportions for image containers:
- **Portrait:** 1:φ ≈ 1:1.618 (product photos, editorial images)
- **Square:** 1:1 (avatar, thumbnail)
- **Landscape:** φ:1 ≈ 1.618:1 (banners, hero images)
- **Default Card:** 4:3 (practical compromise for product grids) — set via `--card-image-ratio`

### Layout Split

Sidebar : content = 38.2% : 61.8% = (1/φ²) : (1/φ). The docs site sidebar approximates this ratio.

---

## What Are Design Tokens?

Design tokens are named values for every visual decision in the system — colors, spacing, font sizes, shadows, animation durations. Instead of writing `color: #342F2A` in a CSS file, you write `color: var(--color-primary)`. The actual hex value lives in one place and flows everywhere.

**ELI5 analogy:** Tokens are like variables in a spreadsheet. Instead of typing `$42.00` in 50 cells, you put it in cell A1 and reference `=A1` everywhere. When the price changes, you change it once.

The source of truth for all tokens is a single file: `packages/tokens/src/tokens.json`.

---

## The 3-Tier Architecture

```
Tier 1: Primitive tokens   →  raw named values    (the paint store)
Tier 2: Semantic tokens    →  intent-mapped        (the design spec)
Tier 3: Component tokens   →  scoped overrides     (the sticky note)
```

### Tier 1: Primitive Tokens

Raw values with no meaning attached. Named by **scale**, not by intent.

```json
// packages/tokens/src/tokens.json → primitive.color
"stone": {
  "0":   "#FFFFFF",
  "50":  "#FAF9F7",   // warm parchment
  "100": "#F2F0EB",
  "200": "#E3DED6",
  "300": "#C8C2B8",
  "400": "#A59E94",
  "500": "#847D73",   // mid-grey
  "600": "#675F56",
  "700": "#4E473F",
  "800": "#342F2A",   // primary button color (light mode)
  "900": "#1F1C18",
  "950": "#131010"    // near-black
}
```

**Why named palettes instead of generic `gray`?**
1. They carry personality — `stone` communicates warm and earthy, `gray` communicates nothing
2. Avoids naming collisions with Tailwind CSS (which uses `gray`, `slate`, etc.)
3. Easier to find the right value when the name matches the brand feel

**Complete palette in this system:**

| Palette | Personality | Used for |
|---------|-------------|----------|
| `stone` | Warm neutral greys | Primary, backgrounds, text, borders |
| `brick` | Muted terracotta red | Destructive / error states |
| `sage` | Earthy green | Success states |
| `amber` | Warm yellow-gold | Warning states |
| `slate` | Cool blue-grey | Info / informational states |

### Tier 2: Semantic Tokens

Map primitive values to **purpose**. This is the layer that components use. It's also what makes dark mode possible — you swap the semantic layer without touching components.

```json
// packages/tokens/src/tokens.json → semantic.color
"primary":              { "$value": "{primitive.color.stone.800}" },
"primary-hover":        { "$value": "{primitive.color.stone.900}" },
"primary-foreground":   { "$value": "{primitive.color.stone.0}" },
"background":           { "$value": "{primitive.color.stone.0}" },
"foreground":           { "$value": "{primitive.color.stone.950}" }
```

**The naming contract:** Semantic tokens always come in pairs where applicable:
- `--color-primary` = the background/fill color
- `--color-primary-foreground` = the text color on top of primary

This makes it impossible to get illegible text — both sides of the contrast pair are defined together.

**Complete semantic color set:**
```
--color-background           --color-background-subtle
--color-foreground           --color-foreground-subtle      --color-foreground-muted
--color-border               --color-border-strong
--color-primary              --color-primary-hover          --color-primary-foreground
--color-secondary            --color-secondary-hover        --color-secondary-foreground
--color-destructive          --color-destructive-hover      --color-destructive-foreground
--color-success
--color-warning
--color-info
--color-focus-ring
```

### Tier 3: Component Tokens

Defined inside each component's CSS file, scoped to the component's root class. Lets consumers override a specific component without touching the global system.

```css
/* packages/components/src/button/Button.css */
.ds-button {
  --button-radius:      var(--radius-md);
  --button-font-weight: var(--font-weight-medium);
}
```

Consumer override:
```css
/* In the consuming app */
.my-app .ds-button {
  --button-radius: var(--radius-full);  /* pill buttons everywhere */
}
```

No forking. No `!important`. No specificity wars.

---

## Dark Mode

Dark mode is implemented by overriding semantic tokens under a `.dark` class on `<html>`.

```css
/* Light mode — emitted under :root */
:root {
  --color-background:  #FFFFFF;
  --color-foreground:  #131010;
  --color-primary:     #342F2A;
}

/* Dark mode — same names, different primitive values */
.dark {
  --color-background:  #131010;
  --color-foreground:  #FAF9F7;
  --color-primary:     #E3DED6;
}
```

**To enable dark mode:** Add `class="dark"` to `<html>`. Remove it for light mode. Components don't need any dark-mode-specific code — they just use semantic tokens, and the tokens change.

**In Storybook:** The preview.ts decorator watches for the dark background selection and toggles `.dark` on `document.body`.

---

## CSS Variable Naming Convention

```
--{category}-{subcategory?}-{modifier?}

Examples:
--color-primary                  (category: color, modifier: primary)
--color-primary-hover            (with state modifier)
--color-primary-foreground       (paired foreground)
--font-size-sm                   (category: font, subcategory: size, scale: sm)
--spacing-4                      (category: spacing, scale: 4 = 16px)
--shadow-md                      (category: shadow, scale: md)
--transition-fast                (shorthand, category: transition)
--radius-lg                      (category: radius, scale: lg)
--z-index-modal                  (category: z-index, context: modal)
```

**Never use raw values in component CSS.** If a value doesn't exist as a token, add it to `tokens.json` first.

---

## The Build Pipeline

`tokens.json` → CSS variables happens in two steps:

```bash
pnpm --filter @ds/tokens build
# Step 1: tsup compiles TypeScript exports → dist/index.mjs + dist/index.js
# Step 2: node scripts/build-css.mjs → dist/tokens.css
```

`build-css.mjs` reads `tokens.json` and generates the full CSS file programmatically. It:

1. Emits all **primitive tokens** under `:root` as `--color-stone-50`, `--spacing-4`, etc.
2. Emits **semantic tokens** in light mode under `:root, [data-theme="light"]`
3. Emits **semantic tokens** in dark mode under `.dark, [data-theme="dark"]`
4. Emits transition shorthand helpers: `--transition-fast`, `--transition-normal`, `--transition-slow`
5. Emits a **global `*:focus-visible` rule** — safety net for elements outside the component library
6. Emits **`@media (prefers-reduced-motion: reduce)`** — accessibility requirement

**Transition shorthands (φ-derived durations: 100ms → ×φ → 162ms → ×φ → 262ms):**
```css
--transition-fast:   100ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: 162ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow:   262ms cubic-bezier(0.4, 0, 0.2, 1)
```

Use these in component CSS instead of writing out the duration and easing separately:
```css
/* ✓ Do this */
transition: background-color var(--transition-fast);

/* ✗ Don't do this */
transition: background-color 100ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Transparent Color Variants

To create a semi-transparent version of a CSS variable (e.g. for focus rings, overlays):

```css
/* ✓ Works in dark mode — the variable resolves to the current mode's value first */
box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 20%, transparent);

/* ✗ Breaks in dark mode — hardcoded hex doesn't respond to .dark */
box-shadow: 0 0 0 3px rgba(78, 71, 63, 0.2);
```

`color-mix()` is supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+).

---

## Non-Color Tokens

### Spacing

4px base grid. Scale: 0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px), 10 (40px), 12 (48px), 16 (64px), 20 (80px), 24 (96px).

Gaps in the numeric scale are intentional to encourage consistency. For φ-proportioned spacing, use the dedicated `--spacing-phi-*` tokens (Fibonacci × 2px: 2, 4, 6, 10, 16, 26, 42, 68, 110, 178px).

### Typography
```
Font families:  body (Ancizar Serif), code (JetBrains Mono)
Note: Named by role, not classification — see 06-decisions-log.md "Font-Family Token Rename"

Default scale (√φ step ratio):
  xs (12px) → sm (14px) → base (16px) → lg (20px) → xl (26px) → 2xl (33px) → 3xl (42px) → 4xl (54px) → 5xl (68px)

Tight scale (φ^1/3 step ratio, for dense UI):
  tight-2xs (10px) → tight-xs (12px) → tight-sm (14px) → tight-base (16px)
  → tight-lg (19px) → tight-xl (22px) → tight-2xl (26px) → tight-3xl (30px) → tight-4xl (36px)

Display scale (φ step ratio, for editorial):
  display-2xs (6px) → display-xs (10px) → display-sm (16px) → display-md (26px)
  → display-lg (42px) → display-xl (68px) → display-2xl (110px)

Font weights:   normal (400) → medium (500) → semibold (600) → bold (700)
Line heights:   none (1) → tight (1.25) → snug (1.375) → normal (1.5) → relaxed (1.618=φ) → loose (2)
Letter spacing: tighter → tight → normal → wide → wider
```

### Radius

Follows the Fibonacci sequence directly: `none` (0) → `sm` (2) → `md` (5) → `lg` (8) → `xl` (13) → `2xl` (21) → `full` (9999px)

### Shadows

`none` → `sm` → `md` → `lg` → `xl` → `2xl`

Blur values follow Fibonacci progression: 2, 5, 13, 21, 34px. Warm shadows use lower alpha values (`rgb(0 0 0 / 0.05-0.18)`) than typical cold-grey design systems to match the warm palette.

### Size (Component Control Heights)

φ/Fibonacci-derived dimensions for all interactive controls. Zero magic numbers in component CSS — every height is a token reference.

```
control-sm  = 34px   (Fibonacci)         — small buttons, inputs, selects
control-md  = 42px   (phi-21 = Fib×2)   — default buttons, inputs, selects
control-lg  = 55px   (Fibonacci)         — large buttons, inputs, selects

checkbox-sm = 13px   (Fibonacci)         — 13 × φ ≈ 21.03
checkbox-md = 21px   (Fibonacci)         — the md/sm ratio is exactly φ

icon        = 16px   (base font size)    — standard icon dimension
```

Note: 34→42→55 approximates a √φ step ratio (42/34=1.235, 55/42=1.310, avg≈1.272=√φ).

### Size (Content Widths)

Max-width constraints for content areas at different layout levels:

```
content-sm = 640px   — constrained dialogs, cookie consent, narrow overlays
content-md = 768px   — medium content areas, form containers, settings panels
content-lg = 960px   — wide content areas, page-level containers, feature sections
content-xl = 1280px  — full-width page container (header, footer, main)
```

Use `var(--size-content-xl)` instead of hardcoding `1280px` for page-level `max-width`.

### Z-Index
```
base (0) → raised (10) → overlay (100) → modal (200) → toast (300) → tooltip (400)
```
Always use `var(--z-index-*)` — never hardcode z-index numbers. These are now emitted as CSS variables.

---

## How to Add a New Token

1. Add the value to `packages/tokens/src/tokens.json` in the correct tier
2. Run `pnpm --filter @ds/tokens build` to regenerate `dist/tokens.css`
3. Rebuild any downstream packages: `pnpm --filter @ds/components build`
4. The new CSS variable is now available everywhere that imports `@ds/tokens/css`

**Never rename a token without searching for all usages first.** CSS variables don't throw errors when missing — they silently resolve to `initial` (usually invisible or broken). See [07-lessons-learned.md](./07-lessons-learned.md#color-rename-bug).
