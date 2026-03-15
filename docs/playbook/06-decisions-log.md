# 06 — Decisions Log

> Every significant decision made during this build, with context and rationale.
> Add new entries at the bottom as decisions are made.

---

### Framework: React over Vue / Svelte

**Date/Phase:** Project kickoff
**Context:** Choosing the UI framework for the component library.
**Options considered:** React, Vue 3, Svelte
**Decision:** React
**Rationale:** React has the deepest ecosystem for design systems specifically. Radix UI (our primitives layer) is React-only. Storybook's best integrations are React-first. The target users (large ecommerce teams) are overwhelmingly React-based.
**Status:** Active

---

### Package Manager + Monorepo: pnpm Workspaces + Turborepo

**Date/Phase:** Project kickoff
**Context:** Choosing how to structure the multi-package monorepo.
**Options considered:** npm workspaces, Yarn Berry, pnpm workspaces; Nx, Lerna, Turborepo
**Decision:** pnpm workspaces + Turborepo
**Rationale:** pnpm enforces strict dependency isolation (no phantom deps), which is critical for a published component library. Turborepo's `^build` dependency graph is simple and zero-config compared to Nx. Lerna is legacy. This combination is used by Vercel, Shopify, Radix, shadcn — battle-tested at scale.
**Status:** Active

---

### Token Architecture: 3-Tier Shadcn-Inspired

**Date/Phase:** Before first component
**Context:** Choosing how to structure design tokens for flexibility, dark mode, and consumer overrides.
**Options considered:** Flat CSS variables, 2-tier (primitive + semantic), 3-tier (primitive + semantic + component), Style Dictionary
**Decision:** 3-tier system with `tokens.json` as single source of truth
**Rationale:** Flat variables can't support dark mode cleanly. 2-tier works but doesn't give consumers a clean override story at the component level. 3-tier (inspired by shadcn) adds component-scoped tokens that let consumers customize specific components without global side effects. Style Dictionary was evaluated but adds complexity without enough benefit at this scale.
**Status:** Active

---

### Package Bundler: tsup

**Date/Phase:** Before first component
**Context:** Choosing how to bundle `@ds/tokens`, `@ds/primitives`, and `@ds/components` for distribution.
**Options considered:** Rollup, esbuild directly, Vite library mode, tsup
**Decision:** tsup
**Rationale:** Zero-config dual ESM + CJS output. CSS concatenation built in (important for components). Used by shadcn component packages. esbuild under the hood so it's fast.
**Status:** Active

---

### Documentation: Two Apps (Storybook + Astro)

**Date/Phase:** Project setup
**Context:** Deciding how to handle both component development and documentation.
**Options considered:** Storybook only, Astro only, Storybook with MDX docs, separate Storybook + Astro
**Decision:** Separate apps — Storybook for internal dev, Astro for public docs
**Rationale:** Storybook serves engineers who are building components. The Astro docs site serves consumers who are using components. They have fundamentally different needs. Storybook as the only documentation leads to a poor consumer experience (too technical, no prose explanation). A custom docs site can be more opinionated and brand-appropriate.
**Status:** Active

---

### Primitive Components: Radix UI

**Date/Phase:** Before first component
**Context:** Choosing whether to write accessible primitives from scratch or use a library.
**Options considered:** Write from scratch, Headless UI, Reach UI, Ariakit, Radix UI
**Decision:** Radix UI
**Rationale:** Keyboard navigation and WAI-ARIA patterns are notoriously hard to get right. Radix has been audited and is used in production at scale. Completely unstyled so our token system drives all visual design. Used by shadcn/ui which has extremely wide adoption — the patterns are proven.
**Status:** Active

---

### CSS Strategy: Plain CSS with BEM-like Naming (no CSS Modules)

**Date/Phase:** Before first component
**Context:** Choosing the CSS approach for component styles.
**Options considered:** CSS Modules, styled-components, vanilla-extract, plain CSS + naming convention
**Decision:** Plain CSS with `ds-` namespace prefix + BEM-like modifiers
**Rationale:** CSS Modules work fine but add build complexity and make the "component token" override pattern harder (consumers can't predict the generated class names). styled-components adds a runtime. vanilla-extract requires a Vite plugin. Plain CSS with a namespace prefix is the simplest option that still prevents collisions, and it works in any bundler.
**Status:** Active

---

### package.json Exports: `types` Must Come First

**Date/Phase:** First package build (hit as a bug)
**Context:** TypeScript couldn't find type declarations for `@ds/tokens`.
**Options considered:** N/A — this is a TypeScript constraint, not a choice
**Decision:** `types` condition must be the first key in every `exports` map
**Rationale:** TypeScript resolves package.json exports conditions in order. If `import` appears before `types`, TypeScript finds the `.mjs` file and can't read it as declarations. See [07-lessons-learned.md](./07-lessons-learned.md#types-export-order).
**Status:** Active (applies to all packages)

---

### tsup Output Extensions: `.mjs` for ESM, `.js` for CJS

**Date/Phase:** First package build (hit as a bug)
**Context:** Package imports were resolving to the wrong files.
**Options considered:** N/A — this is tsup's actual output format
**Decision:** ESM output is `.mjs`, CJS output is `.js` (not `.cjs`)
**Rationale:** tsup's default behavior does not produce `.cjs` files. It produces `.js` for CommonJS. The package.json exports map must reflect actual output files. See [07-lessons-learned.md](./07-lessons-learned.md#tsup-extensions).
**Status:** Active (applies to all packages)

---

### Color Palette: Named Palettes Instead of Generic `gray`

**Date/Phase:** Token design
**Context:** Naming the warm neutral grey scale.
**Options considered:** `gray`, `neutral`, `stone`, `sand`, `clay`
**Decision:** `stone`
**Rationale:** Generic names like `gray` collide with Tailwind CSS's color system and communicate nothing about the brand. A named palette like `stone` communicates warmth and earthiness — it fits the ecommerce aesthetic. `sand` was considered but felt less premium. `clay` was the runner-up but felt more orange than grey. `stone` is also Tailwind's warm grey — familiar to developers.
**Status:** Active

---

### Typography: Source Serif 4 (Not EB Garamond) → Superseded by Ancizar Serif

**Date/Phase:** Early build — font was changed twice
**Context:** Choosing the brand typeface for an ecommerce design system.
**Options considered:** Inter (system), EB Garamond, Source Serif 4
**Decision:** Source Serif 4 (Google Fonts, opsz axis)
**Rationale:**
- **Inter** was the default — too generic, no personality for a premium brand
- **EB Garamond** was tried first — too ornate and heavy at small UI sizes (12–14px labels, input text). Looks beautiful as display type but fights readability as UI text.
- **Source Serif 4** has an optical size (`opsz`) axis that makes it render cleanly at small sizes while remaining elegant at display sizes. Warm and literary without being heavy.
**Status:** Changed — replaced by Ancizar Serif (see below)

---

### Design Context: Ecommerce — Warm, Premium, Earth Tones

**Date/Phase:** Planning
**Context:** The client use case for the design system.
**Options considered:** N/A — defined by the project
**Decision:** Ecommerce design system with warm, premium, editorial aesthetic
**Rationale:** High-end ecommerce (luxury goods, considered lifestyle brands) informed every choice: warm stone palette instead of cold grey, serif typography instead of sans-serif, subdued color accents (brick, sage, amber) instead of saturated primaries.
**Status:** Active

---

### Global Focus Ring: In `tokens.css` as a Safety Net

**Date/Phase:** Primitive fixes session
**Context:** Deciding where to define the global focus visible style.
**Options considered:** Each component handles its own focus (already done), global rule in tokens.css, global rule in a separate reset file
**Decision:** Both — components have their own focus rings, PLUS a global fallback in `tokens.css`
**Rationale:** Components that aren't part of this system (third-party, consumer-written) would have no focus ring without the global fallback. The two-level approach means every interactive element is covered without components being forced to use a specific implementation.
**Status:** Active

---

### `prefers-reduced-motion`: Global Rule in `tokens.css`

**Date/Phase:** Primitive fixes session
**Context:** Accessibility requirement — respect user's OS motion preference.
**Options considered:** Per-component media queries, global rule in tokens.css
**Decision:** Global rule in `tokens.css` PLUS per-component overrides where needed
**Rationale:** The global rule (`animation-duration: 0.01ms`) covers the entire app at once. Components with animations (e.g. the button spinner) add a component-specific rule for finer control (spinner becomes static rather than invisible). Belt and suspenders approach.
**Status:** Active

---

### Design Principle: The Golden Ratio (φ) Governs All Scale Decisions

**Date/Phase:** Ongoing — applies to all future token and component work
**Context:** Establishing a mathematical foundation for visual proportions across the system.
**Options considered:** Tailwind-style integer multiples, arbitrary scale, modular scale (Major Third, Perfect Fourth), golden ratio φ
**Decision:** The golden ratio (φ ≈ 1.618) is the guiding ratio for all scale decisions — type, spacing, radius, shadow, layout proportions, timing. Not a rigid formula, but the spirit: ratios between related values should tend toward 1:φ or be derivable from it.
**Rationale:** φ appears throughout nature and classical design because it produces proportions that feel balanced without being rigid. For a premium, editorial ecommerce system, it provides a principled aesthetic backbone — proportions feel "right" rather than arbitrary. It also gives a decision rule when choosing between options: prefer the ratio closer to φ.
**Status:** Active — applies to all future token definitions and component sizing decisions

#### What φ means in practice

φ = 1.6180339887...
φ² = 2.618
√φ = 1.272 (useful for closer-spaced steps)
1/φ = 0.618 (the complement — also appears in the ratio)

**The golden rectangle:** width:height = φ:1 ≈ 1.618:1
This is the basis for image aspect ratios, card proportions, layout column splits.

---

#### Type scale — ideal vs. current *(updated post-φ implementation)*

The default type scale now uses √φ (≈ 1.272) as the step ratio:

| Step | φ-ideal (base 16px) | Current token | Delta |
|------|---------------------|---------------|-------|
| xs   | 10px (16 ÷ φ)       | 12px          | +2px  |
| sm   | 12.6px (16 ÷ √φ)    | 14px          | +1.4px|
| base | 16px                | 16px          | ✅    |
| lg   | 20.4px (16 × √φ)    | 20px          | ≈ ✅  |
| xl   | 25.9px (16 × φ)     | 26px          | ≈ ✅  |
| 2xl  | 32.9px (16 × φ√φ)   | 33px          | ≈ ✅  |
| 3xl  | 41.9px (16 × φ²)    | 42px          | ≈ ✅  |
| 4xl  | 53.3px (16 × φ²√φ)  | 54px          | ≈ ✅  |
| 5xl  | 67.8px (16 × φ³)    | 68px          | ≈ ✅  |

The scale from `lg` upward now matches φ-ideal values. Two additional scales were added: `tight-*` (φ^(1/3) step ≈ 1.175) for dense data UIs and `display-*` (full φ step) for editorial/marketing. See "Token Scales: Full φ Implementation" below for details.

**Already φ:** `lineHeight.relaxed` = 1.618 (exact φ). The optimal reading line height is the golden ratio.

---

#### Spacing scale — ideal vs. current

Base unit: 4px. φ-derived steps multiply by φ at each level:

| Step | φ-ideal        | Current token | Notes |
|------|----------------|---------------|-------|
| 1    | 4px            | 4px  (--spacing-1) | ✅ |
| 2    | 6.5px ≈ 6px    | 8px  (--spacing-2) | current is 2× base |
| 3    | 10.5px ≈ 10px  | 12px (--spacing-3) | close |
| 4    | 16.9px ≈ 16px  | 16px (--spacing-4) | ✅ approx |
| 5    | 27.4px ≈ 28px  | 20px (--spacing-5) | diverges |
| 6    | 44.3px ≈ 44px  | 24px (--spacing-6) | diverges significantly |
| 8    | 71.7px ≈ 72px  | 32px (--spacing-8) | diverges |

The φ scale grows faster than the current integer-multiple scale. The practical implication: use φ ratios when deciding **relationships between spacing values** (e.g. a component's outer padding should be φ× its inner gap). Absolute spacing values can remain as-is for compatibility.

**φ spacing rule of thumb:** If inner padding is 16px, outer margin should be ~26px (16 × φ). If gap between items is 8px, section gap should be ~13px (8 × φ).

---

#### Radius scale — ideal φ derivation *(updated post-φ implementation)*

Radius now uses the Fibonacci sequence directly:

| Step | Fibonacci value | Current token |
|------|-----------------|---------------|
| sm   | 2px             | 2px  ✅       |
| md   | 5px             | 5px  ✅       |
| lg   | 8px             | 8px  ✅       |
| xl   | 13px            | 13px ✅       |
| 2xl  | 21px            | 21px ✅       |

All radius values now follow the Fibonacci sequence (2, 5, 8, 13, 21). Each step ratio approaches φ.

---

#### Layout proportions

When dividing space into two sections, the φ split is **38.2% : 61.8%** (1/φ² : 1/φ).

- Sidebar vs. main content: sidebar ≈ 38%, content ≈ 62%
- Filter panel vs. product grid: similar split
- Card image vs. card body height
- Hero text block vs. hero image

The current docs sidebar is approximately 240px wide in a 640px+ layout — roughly a 37.5%:62.5% split, which approximates φ well.

---

#### Image / card aspect ratios

| Ratio | Value   | Use |
|-------|---------|-----|
| 1:φ   | 1:1.618 | Portrait product image (e.g. fashion, beauty) |
| φ:1   | 1.618:1 | Landscape hero image |
| φ:φ   | 1:1     | Square product thumbnail |
| 4:3   | 1.333:1 | Standard card (current CardImage default) |

**Recommendation:** Add `aspectRatio="1/1.618"` (portrait golden) as a named option in `CardImage`. Fashion and luxury ecommerce almost always shoots product in portrait φ ratio.

---

#### Animation timing *(updated post-φ implementation)*

Transition durations now follow φ progression exactly:

| Duration | φ derivation | Current token |
|----------|-------------|---------------|
| fast     | 100ms (base) | 100ms ✅     |
| normal   | fast × φ ≈ 162ms | 162ms ✅ |
| slow     | fast × φ² ≈ 262ms | 262ms ✅ |

All three duration values are now φ-derived. Shorthand tokens `--transition-fast/normal/slow` combine duration + default easing.

---

#### Summary: how to apply φ going forward

1. **When choosing between two candidate values**, prefer the one whose ratio to its neighbor is closer to φ
2. **Type scale**: heading h1:h2:h3:h4 ratios should tend toward φ (or √φ for tighter scales)
3. **Spacing**: component inner gap : outer padding ratio should approach φ
4. **Layout**: two-column splits should default to 38%:62%
5. **Aspect ratios**: default card/image ratio should be φ:1 or 1:φ
6. **Radius**: each step should be φ× the previous
7. **Shadows**: blur radius : spread radius ratio ≈ φ
8. **Line height**: body text line height = φ (1.618) — already correct

---

### Accessibility Testing: jest-axe in Every Component Test

**Date/Phase:** Select + Checkbox build
**Context:** Deciding how to enforce accessibility requirements in CI, not just as guidelines.
**Options considered:** Manual a11y audit only, Storybook a11y addon only, jest-axe in unit tests
**Decision:** jest-axe axe-core scan as a required test case in every component's test file
**Rationale:** Storybook a11y addon only runs when a developer opens Storybook and looks at the panel. Unit test axe scans run in CI on every PR. Catching a missing `aria-label` or broken label association in CI is the only reliable way to prevent a11y regressions from shipping.
**Status:** Active

---

### Icons in Docs: Inline SVG (No External Package)

**Date/Phase:** Button docs page — "With icons" section
**Context:** The Button component accepts `ReactNode` for `leadingIcon`/`trailingIcon`. The docs needed real icons to demonstrate the feature.
**Options considered:** Add Lucide React, add Radix Icons, use Hero Icons, inline SVG directly in the gallery component
**Decision:** Inline SVG in `ButtonGallery.tsx` — no external icon package
**Rationale:** Adding an icon package to `apps/docs` just for four demo icons adds a dep that has nothing to do with the design system itself. Inline SVG is self-contained, ships zero bytes to consumers, and documents the pattern (you bring your own icons). The component accepts `ReactNode` by design — the docs should demonstrate that without prescribing a specific library.
**Status:** Active — revisit if an `@ds/icons` package is added in the future

---

### Transparent Colors: `color-mix()` Instead of `rgba()`

**Date/Phase:** Input component focus ring
**Context:** Creating a semi-transparent focus ring color that works in dark mode.
**Options considered:** Hardcoded `rgba(hex, alpha)`, CSS `color-mix()`, `oklch` with alpha
**Decision:** `color-mix(in srgb, var(--color-focus-ring) 20%, transparent)`
**Rationale:** Hardcoded `rgba()` references a specific hex value and doesn't update when `.dark` swaps `--color-focus-ring` to a different value. `color-mix()` evaluates the CSS variable first (after dark mode applies) then mixes it. Supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+).
**Status:** Active

---

### Token Scales: Full φ Implementation Across All Categories

**Date/Phase:** Post-v1 token revision
**Context:** After establishing that φ should govern all proportional decisions (see "Design Principle: The Golden Ratio" entry above), the token scales needed to be updated to actually encode φ-derived values rather than leaving them as aspirational targets.
**Options considered:**
1. Derive all token values strictly from φ — maximum mathematical purity, some values unusable at small sizes
2. Replace existing spacing tokens with Fibonacci scale — would break all component CSS referencing `--spacing-*`
3. Keep existing spacing tokens, add Fibonacci reference scale as new `--spacing-phi-*` tokens — additive, non-breaking
4. Update only the "safe" categories (font sizes, radius, shadow, timing) and add phi-spacing alongside

**Decision:** Option 3+4 combined:
- Updated `font.size` default scale to √φ step ratios (base 16px): lg→20px, xl→26px, 2xl→33px, 3xl→42px, 4xl→54px, 5xl→68px
- Added two new type scales: `tight-*` (φ^1/3 step) and `display-*` (φ step)
- Updated `font.lineHeight.relaxed` to exact φ = 1.618 (was 1.625)
- Updated `radius` to Fibonacci sequence: md→5px (was 6), xl→13px (was 12), 2xl→21px (was 16)
- Updated `shadow` blur/offset values to Fibonacci progression: 2, 5, 13, 21, 34px
- Updated `transition.duration` to φ progression: normal→162ms (was 200ms), slow→262ms (was 300ms)
- Added `opacity` section: successive powers of 1/φ → 1.0, 0.618, 0.382, 0.236, 0.146, 0.09
- Added `spacing.phi-*` tokens: Fibonacci × 2px reference scale (2, 4, 6, 10, 16, 26, 42, 68, 110, 178px)
- Updated `build-css.mjs` to emit opacity tokens as `--opacity-*`

**Rationale:** Updating values in-place for font sizes, radius, shadows, and transitions is safe — components reference these by name (`--font-size-sm`, `--radius-md`), and the visual change from the token update is subtle and intentional. Replacing existing spacing tokens would break component layout CSS throughout the library, so new `--spacing-phi-*` tokens are added as a reference scale for new work and section-level spacing.

**What breaks:** None — 73/73 component tests pass after the change. Border radius changes from 6px→5px (md) are a 1px visual refinement. Transition speed changes from 200ms→162ms are imperceptible in practice.

**Status:** Active

---

### Size Tokens: φ-Derived Control Heights Replace Magic Numbers

**Date/Phase:** Post-v1 elegance pass
**Context:** Component CSS had hardcoded pixel heights (`height: 32px`, `height: 40px`, `height: 48px`, `width: 14px`, etc.) that had no connection to the token system. Any change to component sizing required hunting down multiple hardcoded values across multiple CSS files.
**Decision:** Add `primitive.size` token category with φ/Fibonacci-derived control heights and checkbox dimensions. Update all component CSS to reference `--size-control-sm/md/lg` and `--size-checkbox-sm/md`.
**New values:**
- `control-sm`: 34px (Fibonacci, was 32px — 2px change)
- `control-md`: 42px (phi-21, was 40px — 2px change)
- `control-lg`: 55px (Fibonacci, was 48px — 7px change)
- `checkbox-sm`: 13px (Fibonacci, was 14px)
- `checkbox-md`: 21px (Fibonacci, was 18px — `checkbox-md / checkbox-sm = 21/13 ≈ φ`)
**Rationale:** The step ratio 34→42→55 ≈ √φ (average ratio ≈ 1.272), matching the default type scale. Component sizes and type sizes now share the same proportional system. Zero magic pixel values remain in component CSS.
**Status:** Active

---

### Z-Index: Now Emitted as CSS Variables

**Date/Phase:** Post-v1 elegance pass
**Context:** `primitive.zIndex` was defined in `tokens.json` but `build-css.mjs` never emitted it. Components that needed z-index values had no token to reference.
**Decision:** Add emission of `--z-index-*` tokens to `build-css.mjs`.
**Status:** Active

---

### Typography Page: Display Scale Demoted to Optional

**Date/Phase:** Post-v1 docs refinement
**Context:** The typography foundation page listed all three type scales (default, tight, display) as equally prominent in a single flat table. A user reviewing the page couldn't tell which scale to use for standard work, leading to confusion about whether the scales were for different screen sizes (mobile/desktop).
**Options considered:**
1. Remove the display scale entirely from the token system
2. Keep all three scales in one flat table with no hierarchy
3. Split into labelled sections with explicit priority badges and context descriptions
**Decision:** Option 3 — three sections with badges: "Use this" (default), "Dense UI only" (tight), "Editorial / optional" (display). Display table rendered at `opacity: var(--opacity-high)` to visually deprioritize it.
**Rationale:** The display scale is mathematically justified and genuinely useful for editorial/marketing contexts, but it creates cognitive overhead if presented as equally important. Most product work never touches it. The badge + opacity treatment communicates hierarchy without removing the tokens. Single-scale systems (Material, Carbon, Polaris) are the industry default — our three-scale system needs clear signposting to not feel like unnecessary complexity.
**Status:** Active

---

### Token Removal: `display-2xs` (0.375rem / 6px) Dropped

**Date/Phase:** Post-v1 docs refinement
**Context:** During the typography page rewrite, the `display-2xs` token (0.375rem / 6px) was flagged as genuinely unusable. At 6px, text is unreadable on any screen — it fails WCAG minimum text size guidelines and has no practical application in any UI context.
**Options considered:**
1. Keep it for mathematical completeness (the display scale starts from φ^0 = 1rem and steps down)
2. Remove it entirely from `tokens.json`
**Decision:** Option 2 — removed from `tokens.json`. The display scale now starts at `display-xs` (0.625rem / 10px).
**Rationale:** Mathematical elegance doesn't justify shipping a token that no one should ever use. A 6px token is a footgun — if someone references it, it's a bug. The display scale remains φ-stepped from `display-xs` upward.
**Status:** Active

---

### New Component: Modal (Radix Dialog)

**Date/Phase:** Post-v1, P1 ecommerce roadmap
**Context:** The component library needed a dialog/modal for confirmations, quick-edit forms, and order detail previews — all critical ecommerce patterns. No existing modal component existed.
**Options considered:** Custom dialog from scratch, Radix Dialog, HeadlessUI Dialog
**Decision:** Radix Dialog (`@radix-ui/react-dialog`) with compound component API: `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody`, `ModalFooter`, `ModalClose`.
**Rationale:** Radix Dialog provides focus trapping, focus return, Escape key handling, `aria-labelledby`/`aria-describedby` linking, and background scroll lock out of the box. The compound API matches our existing Select pattern and gives consumers full layout flexibility. Three size presets (sm/md/lg) cover confirmation dialogs, forms, and detail views.
**Status:** Active

---

### Warm Page Background + 3-Layer Background Token System

**Date/Phase:** Post-v1, visual refinement
**Context:** The page background was pure white (`stone.0`), which felt flat and clinical against the warm earth-tone palette. The user requested shifting the page background to the warmer `background-subtle` value and adjusting the rest of the color system for visual harmony.
**Options considered:** (1) Simply swap background ↔ background-subtle, (2) Shift all background tokens down one step and add a new surface token, (3) Keep background white and adjust other tokens for warmth.
**Decision:** Option 2 — shift background tokens down one step and introduce a 3-layer system:
- `--color-background`: stone.50 (#FAF9F7) — warm off-white page background
- `--color-background-subtle`: stone.100 (#F2F0EB) — sidebar, code blocks, section differentiation
- `--color-background-surface`: stone.0 (#FFFFFF) — **new** — cards, modals, inputs, dropdowns (elevated surfaces)
- `--color-secondary`: stone.200 (shifted from stone.100 to maintain contrast against new bg-subtle)
- `--color-secondary-hover`: stone.300 (shifted from stone.200)
**Rationale:** A 3-layer background system (page → section → surface) creates natural visual hierarchy without relying on heavy shadows. Elevated elements (inputs, cards, modals) use pure white to "lift" off the warm page, giving the UI a layered, premium feel that matches the ecommerce brand. The secondary button shift was necessary so secondary fills remain distinct from `background-subtle`. Dark mode only needed the new `background-surface` token added (mapped to stone.900); the existing dark bg/bg-subtle values remained correct.
**Status:** Active

---

### Font: Ancizar Serif over Source Serif 4

**Date/Phase:** Post-v1, visual refinement
**Context:** The design system used Source Serif 4 as its primary typeface. The user wanted to switch to UNAL Ancizar Serif for a different character.
**Options considered:** Keep Source Serif 4, switch to Ancizar Serif, switch to another serif
**Decision:** Ancizar Serif via Google Fonts (`'Ancizar Serif', ui-serif, Georgia, serif`). Added `light` (300) font weight alongside existing normal (400), medium (500), semibold (600), bold (700). Italic variants loaded for 300, 400, 500.
**Rationale:** Ancizar Serif (designed by Universidad Nacional de Colombia) is an open-source scholarly serif with 9 weights. It balances academic authority with everyday readability. Available on Google Fonts with SIL Open Font License. The light weight (300) adds a new option for decorative or large display text.
**Status:** Active

---

### Active State Tokens and Interaction Pattern

**Date/Phase:** Post-v1, interaction polish
**Context:** Interactive components (Button, Checkbox, Select, Modal close) had hover and focus states but no `:active` (pressed) states. Card was the only component with an active state. Missing press feedback makes the UI feel unresponsive.
**Options considered:**
1. CSS-only `color-mix()` darkening on `:active` — no new tokens, but dark mode gets the same darken which often looks wrong
2. Explicit semantic tokens (`primary-active`, `secondary-active`, `destructive-active`) — independent light/dark control
3. Transform-only (`scale(0.98)`) with no color change — fast to implement, but no visual color feedback

**Decision:** Option 2 + transform. Three new semantic tokens:
- `--color-primary-active`: stone.950 (light) / stone.50 (dark) — one step past hover
- `--color-secondary-active`: stone.300 (light) / stone.700 (dark)
- `--color-destructive-active`: brick.700 (light) / brick.400 (dark)

Combined with `transform: scale(0.98)` on buttons/selects, `scale(0.92)` on small controls (checkbox, modal close). Transform disabled via `@media (prefers-reduced-motion: reduce)`.

**Rationale:** Explicit tokens give dark mode independent control — a 10% darken in light mode would be wrong in dark mode. `scale()` over `translateY()` because it works uniformly for all shapes (pills, squares, icon-only). The 0.98/0.92 split: larger elements need less scale change to feel pressed; small elements (13–21px checkboxes) need a bigger ratio to register visually.

**Components affected:** Button (4 variants), Checkbox (unchecked + checked), Select trigger, Modal close button. Input skipped (focus already handles interaction). Badge/Typography skipped (non-interactive). Card already had active state.

**Status:** Active

---

### First Composed Component: ProductCard

**Date/Phase:** Post-v1, product UI phase
**Context:** With 8 primitive components built, we needed to validate the system by composing real product UI rather than continuing to build primitives speculatively. A minimal product card is the first "composed" component — it doesn't add new primitives but composes existing ones (Card, CardImage, Typography).

**Options considered:**
1. Keep building primitives (Radio, Toggle, Textarea) before composing — thorough but risks building things we don't need
2. Jump to composed product UI and backfill primitives as gaps emerge — faster feedback loop
3. Build a full product page first — too ambitious without validating the card pattern

**Decision:** Option 2. Build a minimal ProductCard component that composes Card + CardImage + CardBody + Text. Intentionally minimal: 4:5 image, product name, formatted price. No badge, no button, no footer.

**Key design decisions:**
- **Price as cents (number):** `price={3200}` → `$32.00`. Using `Intl.NumberFormat` for formatting with configurable `currency` prop. Cents avoids floating-point issues.
- **4:5 aspect ratio:** Added to CardImage's `aspectRatio` union type. Works via existing `--card-image-ratio` CSS custom property — no CSS changes needed.
- **`variant="outlined"` + `interactive`:** Outlined cards are cleaner in product grids (no competing shadows). Interactive gives hover lift + image zoom for free.
- **Minimal CSS:** Only overrides `--card-padding` and body gap. Everything else is inherited from Card primitives.

**What this validated:**
- Card's compound API (Card + CardImage + CardBody) composes well for real use cases
- The `noPadding` + `CardBody` pattern works cleanly for image-first layouts
- Typography's `truncate` prop handles long product names
- Token system provides all needed values without new tokens

**Status:** Active

---

### Breakpoint Tokens: CSS Custom Properties + Raw Values in Media Queries

**Date/Phase:** PDP build
**Context:** Adding responsive breakpoints to the design system. CSS custom properties cannot be used inside `@media` query conditions (`@media (min-width: var(--bp))` does not work). The project has no CSS preprocessor.
**Options considered:**
1. PostCSS with `@custom-media` — adds build dependency
2. SCSS variables — requires preprocessor migration
3. CSS custom properties for JS access + raw values with comments in media queries
**Decision:** Option 3 — emit `--breakpoint-*` custom properties in `:root` for JS access and documentation. Use raw pixel values in `@media` with a comment referencing the token name: `/* @breakpoint-lg = 1024px */`
**Rationale:** Zero new build dependencies. The raw-value-with-comment approach is searchable, easy to find/replace if values change, and keeps the zero-preprocessor philosophy. JS constants exported from `@ds/tokens` for programmatic access.
**Status:** Active

---

### PDP Layout: Page-Specific CSS Grid, Not a Generic Component

**Date/Phase:** PDP build
**Context:** Deciding whether to build a reusable `<Grid>` component or a PDP-specific layout.
**Options considered:**
1. Generic `<Grid columns={12}>` / `<GridItem span={6}>` component
2. PDP-specific CSS class with `grid-template-columns: 1.618fr 1fr`
**Decision:** PDP-specific layout. The golden ratio column split (`1.618fr 1fr`) is the defining feature — a generic Grid component would either be too restrictive or too flexible to capture this.
**Rationale:** The PDP layout is a single, well-defined layout. Building a generic Grid for one consumer is premature. If more page layouts emerge, we'll extract a pattern. The `1.618fr 1fr` split gives the image gallery ~62% width and details ~38% — matching φ exactly (verified: 726.8/449.2 = 1.618).
**Status:** Active

---

### New Components: Breadcrumb, QuantitySelector, ImageGallery

**Date/Phase:** PDP build
**Context:** Three new components built to compose the Product Detail Page.

**Breadcrumb:** `<nav aria-label="Breadcrumb">` → `<ol>` → `<li>` items. Last item gets `aria-current="page"`. Separators are `aria-hidden="true"`. Simple data-driven API: `items: BreadcrumbItem[]`.

**QuantitySelector:** Standalone component (not composing Input). `<div role="group">` → decrement button → `<output>` → increment button. Three sizes matching control height tokens. Controlled component with `value`/`onChange`.

**ImageGallery:** Main image with aspect-ratio CSS custom property + thumbnail strip as `role="tablist"`. Keyboard navigation (arrow keys, Home/End). Pointer event swipe support. `thumbnailPosition: 'bottom' | 'left'` with responsive override (always bottom on mobile).

**Status:** Active

---

### Tighten `--line-height-tight` from 1.25 to 1.15

**Date/Phase:** PDP refinement
**Context:** PDP title (42px at desktop) had visually excessive leading at `line-height: 1.25` (52.5px line-height, 10.5px total leading). Same issue observed earlier with ProductCard name/price gaps — line-height inflation creates perceived spacing that doesn't match explicit gap values.
**Options considered:**
1. Tighten `--line-height-tight` globally from 1.25 → 1.15
2. Add a new `--line-height-tighter` token at 1.15, keep tight at 1.25
3. Override only the PDP title with a fixed value
**Decision:** Option 1 — tighten globally
**Rationale:** `tight` is used exclusively for headings (Typography component, Modal title, PDP title). 1.15 is standard for heading line-heights across design systems (Apple HIG uses 1.1–1.2 for display text). The global change improves all heading contexts simultaneously.
**Impact:** 42px font → 48.3px line-height (was 52.5px). 6.3px total leading instead of 10.5px.
**Status:** Active

---

### CI/CD & Code Quality: Full Pipeline + Branch Protection

**Date/Phase:** Post-PDP, workflow maturity
**Context:** Moving from local-only development to a collaborative workflow with automated quality gates. Needed to ensure accessibility standards are enforced automatically and code changes are reviewed before merging.
**Options considered:**
1. Full CI pipeline (lint, typecheck, test, build) + branch protection with required reviews
2. Tests + a11y only in CI, no review gate
3. Manual checks only, formalize later

**Decision:** Full CI pipeline + branch protection with required PR reviews.

**What's in place:**
- **GitHub Actions CI** (`.github/workflows/ci.yml`): Runs on every PR and push to `main`. Steps: `pnpm install --frozen-lockfile` → `turbo build` (packages only) → `turbo lint` → `turbo typecheck` → `turbo test` (includes axe a11y scans). Turbo cache enabled for faster reruns.
- **Branch protection on `main`**: Direct pushes blocked. Requires the "Lint · Typecheck · Test" status check to pass. Requires 1 approving review. Stale reviews dismissed on new pushes.
- **Storybook addon-a11y** (`@storybook/addon-a11y`): Already installed and configured with color-contrast enforcement. Provides real-time a11y panel during development.
- **Repo made public**: Required for branch protection on GitHub Free tier.

**Accessibility enforcement layers (3 total):**
1. **Dev time** — Storybook a11y panel (visual, interactive)
2. **Test time** — `jest-axe` / axe-core in every component's `.test.tsx` (programmatic)
3. **CI time** — `pnpm turbo test` runs all axe tests as a required status check (automated gate)

**Rationale:** Three layers of a11y enforcement means a violation has to slip past development, testing, AND CI to ship. The branch protection + required review ensures no code reaches `main` without passing all checks and being reviewed by another human.
**Status:** Active
