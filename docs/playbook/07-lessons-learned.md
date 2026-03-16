# 07 — Lessons Learned

> What worked, what didn't, bugs we hit, and recommendations for anyone following this playbook.

---

## What Went Well

### The 3-tier token system made dark mode nearly free

Once primitive and semantic tokens were in place, dark mode was just a matter of writing the `.dark {}` block in `build-css.mjs` with different primitive references for the same semantic names. No component needed any dark-mode-specific code. This is the entire point of the semantic layer — prove it works before you write your first component, not after.

### Turborepo `^build` eliminated build-order errors

The first time you run `pnpm build` in a clean monorepo and it figures out that tokens → primitives → components without being told explicitly — that's when Turborepo justifies itself. Before this, these errors were common: `Cannot find module '@ds/tokens'` because you forgot to build it first. Now it's automatic.

### Radix Slot / asChild is a superpower

Discovered early: the `asChild` / Slot pattern from Radix UI makes polymorphic components trivial to implement correctly. A `<Button asChild><a href="...">` merges all button behavior (styles, aria attributes, ref) onto the `<a>` tag. This is the right way to build polymorphic components — not `as={Link}` prop patterns that break type safety.

### Starting with Button was the right call

Button is the simplest component that exercises every pattern: variants, sizes, states, `forwardRef`, `asChild`, `aria-*` attributes, CSS transitions, loading state with animation, disabled state. Getting all the patterns right on Button means every subsequent component is easier to write because the template is proven.

### Documenting as you go actually worked

Every component got a docs page in the same session. The temptation is always to batch documentation at the end ("I'll write the docs when I'm done with all the components"). That never happens. The discipline of writing the doc page immediately after the component meant the docs site was always up to date.

---

## What Was Harder Than Expected

### tsup output extensions

**Expected:** `index.cjs` for CommonJS output (common assumption from other bundlers)
**Reality:** tsup outputs `index.js` for CJS and `index.mjs` for ESM

This caused "module not found" errors that took a while to trace. The package.json exports map was pointing to `.cjs` files that didn't exist. The fix was straightforward once diagnosed, but the assumption cost time.

### Storybook stories glob path

**Expected:** Path relative to `apps/storybook/` (the package root, where `package.json` lives)
**Reality:** Path is relative to `apps/storybook/.storybook/` (where `main.ts` lives)

This means you need three `../` to get out of `.storybook/` to the monorepo root, then navigate to packages. Writing `../../packages/...` when you need `../../../packages/...` silently finds no stories and shows an empty Storybook. No error, just nothing.

### Astro JSON import paths

**Expected:** Path relative to the project root or some consistent base
**Reality:** Path relative to the `.astro` file's location

A page at `apps/docs/src/pages/tokens/colors.astro` that imports `packages/tokens/src/tokens.json` needs:
```
../../../../../packages/tokens/src/tokens.json
```
That's five levels up. Getting it wrong means the import silently fails or throws a 404 at runtime. No helpful error message.

### Two separate build steps for tokens

The token package needs two separate commands to fully build:
1. `tsup` — compiles TypeScript exports (JS/TS consumers)
2. `node scripts/build-css.mjs` — generates the CSS file (CSS consumers)

The `build` script in `packages/tokens/package.json` chains them: `"build": "tsup && node scripts/build-css.mjs"`. But if you only watch with `tsup --watch`, the CSS doesn't regenerate when you change `tokens.json`. You need a separate watcher for the CSS script, or just rebuild manually.

---

## Bugs We Hit

### `types` export order in package.json {#types-export-order}

**Bug:** TypeScript couldn't find type declarations for `@ds/tokens`. Everything compiled fine but IDEs showed "could not find declaration file" errors.

**Cause:** The `exports` map in `package.json` had `import` before `types`:
```json
// ✗ Broken
"exports": {
  ".": {
    "import":  "./dist/index.mjs",
    "require": "./dist/index.js",
    "types":   "./dist/index.d.ts"   // ← TypeScript finds import first, stops
  }
}
```

**Fix:** Move `types` to be the first condition:
```json
// ✓ Fixed
"exports": {
  ".": {
    "types":   "./dist/index.d.ts",  // ← TypeScript finds this first
    "import":  "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}
```

**Rule:** `types` must always be the first key in every exports condition object.

---

### Storybook glob `@(ts|tsx)` not supported {#storybook-glob}

**Bug:** Storybook found zero stories.

**Cause:** The stories glob used extglob syntax that Storybook's glob resolver doesn't support:
```ts
stories: ['../../../packages/components/src/**/*.stories.@(ts|tsx)']
//                                                            ↑ invalid
```

**Fix:** Use brace expansion:
```ts
stories: ['../../../packages/components/src/**/*.stories.{ts,tsx}']
//                                                            ↑ valid
```

---

### Hardcoded color references broke on palette rename {#color-rename-bug}

**Bug:** Code blocks in the docs site became unstyled (dark background disappeared, text invisible).

**Cause:** The prose pre/code styles in `base.css` had hardcoded fallback values:
```css
/* ✗ Broken after renaming gray → stone */
.prose pre { background: var(--color-gray-950, #030712); }
```

When we renamed the color palette from `gray` to `stone`, `--color-gray-950` stopped existing. The CSS variable resolved to nothing, but the **fallback value** (`#030712`) kept it visually working — for a while. Then another change removed the fallback entirely and the styles broke silently.

**Fix:** Never use CSS variable fallbacks with hardcoded values:
```css
/* ✓ Fixed — no fallback, fails visibly if the token is missing */
.prose pre { background: var(--color-stone-950); }
```

**Rule:** Use CSS variables without fallback values. If the token is missing, you want a visible failure (obvious white/blank) not a silent one (wrong color that looks fine until it doesn't).

---

### Referencing `@ds/primitives` before building it

**Bug:** `pnpm --filter @ds/components build` failed with `Cannot find module '@ds/primitives'`.

**Cause:** `@ds/primitives` hadn't been built yet. The `dist/` directory didn't exist. pnpm's workspace symlink points to the `dist/` folder, which is empty until you build.

**Fix:** Build in the correct order:
```bash
pnpm --filter @ds/tokens build
pnpm --filter @ds/primitives build
pnpm --filter @ds/components build
```

Or just run `pnpm build` from the root and let Turborepo handle it.

**Longer term:** This is why `"dependsOn": ["^build"]` in `turbo.json` exists. Turborepo ensures this order automatically.

---

### `@radix-ui/react-slot` v1.2.4 is stricter about `asChild` children {#radix-slot-aschild}

**Bug:** `Button` with `asChild` + icons threw `React.Children.only expected to receive a single React element child`.

**Cause:** Slot v1.2.4 enforces `React.Children.only` strictly. When `asChild=true`, passing a fragment like:
```tsx
<Slot>
  <span className="spinner" />
  {children}
</Slot>
```
...throws because Slot sees multiple children. Earlier Slot versions were lenient.

**Fix:** When `asChild=true`, pass only `{children}` directly. Wrap spinner/icons in a fragment only when `asChild=false`:
```tsx
const content = asChild
  ? children
  : (<>{loading && <span className="spinner" />}{children}</>);
return <Comp>{content}</Comp>;
```

**Rule:** When using Radix Slot with `asChild`, the Slot must receive exactly one child. Guard any extra elements behind `!asChild`.

---

### jest-axe requires both install AND `expect.extend()` in setup {#jest-axe-setup}

**Bug:** `expect(container).toHaveNoViolations()` threw `Invalid Chai property: toHaveNoViolations`.

**Cause:** Installing `jest-axe` is not enough. The matcher must be explicitly registered:
```ts
// vitest.setup.ts — required, not optional
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';
expect.extend(toHaveNoViolations);
```

**Additional setup:** Configure axe to suppress noisy "landmark region" warnings that fire in isolated test renders (no `<main>`, `<nav>`, etc.):
```ts
configureAxe({ rules: { region: { enabled: false } } });
```
Without this, every axe test fails on the landmark rule because test renders have no document-level landmarks.

**Rule:** Install jest-axe in both `@ds/vitest-config` (for the package) and `@ds/components` (for test code), then extend `expect` in `vitest.setup.ts`.

---

### Storybook Vite cache can duplicate React after adding Radix packages {#storybook-cache}

**Bug:** After adding `@radix-ui/react-checkbox`, Storybook threw `TypeError: Cannot read properties of null (reading 'useState')` — the invalid hook call error.

**Cause:** Vite/Storybook caches pre-bundled dependencies in `node_modules/.cache/storybook`. When a new Radix package is added that also bundles React internally, the cache can end up with two React instances that disagree on which one is "current". Hook calls on the secondary React instance see `null` for the fiber.

**Fix:** Delete the stale cache and restart:
```bash
rm -rf node_modules/.cache/storybook
pnpm --filter @ds/storybook dev
```

**Rule:** Any time you add a new package to `@ds/components` that transitively depends on React (all Radix packages do), clear the Storybook cache before restarting.

---

### Radix Select trigger needs `aria-labelledby`, not `htmlFor` {#radix-select-aria}

**Bug:** axe scan failed with `"Buttons must have discernible text"` on the Select trigger even when a `<label>` was present.

**Cause:** Radix Select renders a `<button role="combobox">`, not an `<input>`. HTML's `htmlFor` / `<label for="">` only links to form controls by ID. A `<button>` is not a form control, so `htmlFor` is silently ignored.

**Fix:** Use `useId()` to create a shared ID, set it on the `<label>`, and pass `aria-labelledby` to the trigger:
```tsx
const labelId = useId();
<label id={labelId}>{label}</label>
<RadixSelect.Trigger aria-labelledby={labelId}>
```

**Rule:** For Radix components that render `<button>` or custom roles instead of native inputs (Select, Combobox, etc.), always link labels via `aria-labelledby`, not `htmlFor`.

---

### Chromatic fails without full git history

**Bug:** Chromatic treated every run as a first build, couldn't find baseline to diff against.

**Cause:** GitHub Actions `actions/checkout@v4` does a shallow clone by default (only the most recent commit). Chromatic needs the full commit history to find the baseline.

**Fix:** Add `fetch-depth: 0` to the checkout step:
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # ← required for Chromatic
```

### Serif fonts sit high in small pill-shaped components (badges, tags) {#serif-text-centering}

**Symptom:** Badge text appeared to float above center in its pill background, even with `display: inline-flex; align-items: center`.

**Root cause:** Serif fonts (Ancizar Serif in our case, but applies to most serifs) have tall ascenders relative to x-height. CSS flex centering centers the *line box* (which includes ascender + descender space), not the visible ink. Since ascenders are taller than descenders, the ink sits above the mathematical center.

**What we tried (and why it didn't work):**
1. Asymmetric padding (more bottom than top) — fragile, magic numbers, different per font
2. `line-height: 1` + `min-height` + symmetric padding — centers the line box, not the ink
3. `transform: translateY()` — would work but requires an inner wrapper element

**The fix:** `text-box-trim: trim-both; text-box-edge: cap alphabetic;` — a CSS property designed exactly for this. It trims the extra leading space above cap-height and below the alphabetic baseline from the line box. After trimming, `align-items: center` centers the actual visible ink.

```css
.ds-badge {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  text-box-trim: trim-both;
  text-box-edge: cap alphabetic;
}
```

**Browser support:** Chrome 133+ (Feb 2025), Safari 18.2+. Firefox behind a flag. Degrades gracefully — without support, you get the slightly-high text which is acceptable.

**Lesson:** When switching to a serif font in a design system, immediately test small components (badges, tags, chips) for vertical centering. `text-box-trim` is the correct modern solution — don't waste time on padding hacks.

---

## Recommendations for Next Time

### 1. Define the token palette LAST, not first

We iterated on the token palette multiple times (renamed `gray` → `stone`, changed fonts twice, adjusted semantic mappings). The token names are infrastructure — changing them after components are built causes ripple effects. Consider building a rough prototype first to understand the brand direction, then locking the token names before writing any component.

### 2. Test the package.json exports map before writing any components

Before writing a single component, do a full end-to-end test of the package build → export → import chain:
```bash
pnpm --filter @ds/tokens build
# Then in a test file:
import { colorSemantic } from '@ds/tokens'
```
If TypeScript can't resolve it, fix the exports map now. Finding this issue after 10 components are built is much more painful.

### 3. Set up Chromatic from day one

Chromatic baselines are established from the first snapshot. If you set it up after building 10 components, all 10 trigger "changes detected" on the first run (they're all new). Setting it up with the first story means the baseline grows incrementally and reviews are manageable.

### 4. Write the docs page as you build each component

Not "this week." Not "before the sprint ends." The same session. The motivation to write good docs is highest when the component is fresh. Two weeks later, you've forgotten why the loading prop works the way it does.

### 5. Keep primitive token names stable

`--color-stone-800` becoming `--color-primary-dark` would break every direct reference to the primitive. The semantic layer exists so that primitives are never directly referenced in component CSS. Enforce this — if you see a primitive token in component CSS, it's a bug.

### 6. The two-server setup (docs + Storybook) is worth the overhead

It seems like maintenance overhead to run two servers. In practice, they serve different purposes that genuinely can't be merged cleanly. The Storybook is for building; the docs site is for consuming. Keep them separate.

### 7. `pnpm --filter @ds/tokens build` is the most frequently run command

Any time you change `tokens.json` — even one value — rebuild tokens before testing in Storybook or the docs site. Set up a watcher script if you're doing heavy token iteration:
```bash
# In a separate terminal
pnpm --filter @ds/tokens dev  # watches TypeScript
# Manually rerun:
node packages/tokens/scripts/build-css.mjs  # regenerates CSS
```

---

### Docs/Storybook parity audit checked pages, not sections — missed intra-page gaps {#docs-audit-gap}

**What happened:** User reported "the documentation site doesn't have the same components that Storybook has." The audit checked whether a docs page existed for each component (Badge? ✅ Card? ✅ Select? ✅) and declared parity. But the Button page had a "With icons" section that was a heading + code snippet with no live preview. Storybook had `WithLeadingIcon` and `WithTrailingIcon` stories. The gap was inside a page, not between pages — and the audit method couldn't see it.

**Why it was missed:** The mental model of "parity" was "does a page exist per component?" That's too coarse. A page can exist and still be missing coverage of a specific feature. The correct unit of comparison is Storybook story groups vs. docs sections, not component names vs. page filenames.

**The right audit method:**
For each component, compare at the story level:
1. List every named story group in Storybook (e.g. Default, Sizes, States, WithLeadingIcon, WithTrailingIcon, IconOnly)
2. Check that each group has a corresponding live preview section in the docs page
3. A section with only a code snippet and no `<ComponentGallery client:load />` is a gap

**Checklist to add to the new component workflow (see 05-workflows.md):**
- After writing Storybook stories, list every story name
- For each story or story group, confirm there is a corresponding `<XxxGallery client:load />` in the docs page
- A heading + code block alone is not sufficient — it documents the API but doesn't show the feature working

**Rule:** Parity is measured at the story level, not the component level. A docs page with no live preview for a feature is the same as no docs page for that feature from the user's perspective.

### 8. When changing fonts, immediately test small dense components

Fonts have wildly different vertical metrics (ascender height, descender depth, x-height ratio). When you swap fonts — especially from sans-serif to serif or between serif families — immediately test: badges, tags, chips, small buttons, and inline code blocks. These are the components where vertical centering issues are most visible because of tight padding. Use `text-box-trim: trim-both; text-box-edge: cap alphabetic;` proactively on any pill-shaped component to future-proof against font swaps.

---

## Open Questions

**[PENDING DECISION]** Should `tokens.json` be the source of truth for Figma variables as well? A Figma plugin that reads `tokens.json` and syncs to Figma variables would close the design-to-code gap. Options: Tokens Studio, the native Figma Variables API, or a custom sync script.

**[PENDING DECISION]** At what point should we add a `packages/icons` package? The current components accept `ReactNode` for icons which is flexible but inconsistent. A curated icon set (probably Lucide or Radix Icons) would make demos and docs more consistent.

**[RESOLVED]** Deployment target: GitHub Pages via GitHub Actions (`deploy-docs.yml`). Astro `base: '/claude-design-system'` config, all internal links prefixed with `import.meta.env.BASE_URL`. Live at `https://sixbase.github.io/claude-design-system/`.

---

## Gotchas Discovered During PDP Build

### CSS custom properties cannot be used in `@media` queries

You **cannot** write `@media (min-width: var(--breakpoint-lg))` — the spec doesn't allow it. This caught us when adding responsive breakpoints. The workaround: use raw pixel values in media queries with a comment referencing the token name (`/* @breakpoint-lg = 1024px */`), and emit the values as CSS custom properties separately for JS access. The `@custom-media` spec would solve this, but it requires PostCSS and isn't natively supported.

### Hydration mismatch with viewport-dependent components

The `ViewportIndicator` initially used `window.innerWidth` in `useState` initialization, causing a hydration mismatch in Astro's SSR. Fix: initialize state to `0` (renders `null`), then set the real value in `useEffect`. This is a general pattern for any component that reads browser APIs during render — always defer to `useEffect` for SSR compatibility.

### Golden ratio grid columns work perfectly with CSS Grid `fr` units

`grid-template-columns: 1.618fr 1fr` produces exactly a φ ratio between columns. Verified: at 1216px content width, the columns rendered as 726.8px and 449.2px — ratio of 1.618. This is a clean, memorable pattern for any layout that wants golden ratio proportions.

### Flex overflow chain: every ancestor needs `min-width: 0`

**Problem:** Breadcrumb text-overflow ellipsis wasn't working on mobile. The `text-overflow: ellipsis` rule was correct, but the text still overflowed its container.

**Root cause:** CSS grid and flex children default to `min-width: auto`, which prevents them from shrinking below their content size. If ANY ancestor in the chain lacks `min-width: 0`, the entire overflow chain breaks. We traced the issue from `<span>` → `<li>` → `<ol>` → `<nav>` → `.ds-pdp__breadcrumb` (grid child) and found the grid child was the one missing the constraint.

**Fix:** Add `min-width: 0` to every flex/grid child in the overflow chain:
```css
.ds-pdp__breadcrumb { min-width: 0; }           /* grid child */
.ds-breadcrumb { min-width: 0; overflow: hidden; } /* nav element */
.ds-breadcrumb__list { flex-wrap: nowrap; }      /* ol */
.ds-breadcrumb__item:last-child { flex: 1; min-width: 0; overflow: hidden; } /* li */
```

**Rule:** When `text-overflow: ellipsis` doesn't work, trace the width from the overflowing element up through every parent. The first ancestor that doesn't constrain its width is the bug.

### CSS changes in component library don't hot-reload in the docs site

**Problem:** Changed component CSS, but the docs dev server showed stale styles.

**Cause:** The docs site imports pre-built CSS from `@ds/components/dist/index.css`. Changing source CSS doesn't update the built output until you rebuild.

**Fix:** Run `pnpm turbo build --filter=@ds/components --force` after any CSS change, then reload the docs page. This is the most common "why isn't my change showing?" moment.

**Rule:** Component CSS changes require a library rebuild. Token changes require a token rebuild. Only page-level CSS (like `PDPDemo.css`) hot-reloads immediately.

### Prefer CSS-based responsive behavior over JS-based

**Example:** Breadcrumb truncation. First implementation filtered items in JS (`items.slice()`), which meant the DOM on mobile had fewer items than desktop. When we wanted responsive behavior (truncate on mobile, show all on tablet+), we had to rewrite to render all items and use CSS `display: none` on collapsible items at mobile breakpoints.

**Rule:** If a component might need different behavior at different breakpoints, render the full content and use CSS to control visibility. JS filtering locks you into a single breakpoint at render time.

### Sale price pattern: separate elements, not conditional styling

For pricing with original/sale display, use two separate `<p>` elements with distinct classes rather than toggling styles on a single element:
```tsx
<div className="ds-pdp__pricing">
  <p className="ds-pdp__price">$68.00</p>
  <p className="ds-pdp__price-compare">$85.00</p>
</div>
```
The compare price gets `text-decoration: line-through` and muted color. This is cleaner than conditional classes on a single price element and easier to animate/transition.

### Global heading styles leak into compound components with semantic heading elements

Global typography styles (`h1`–`h6` with `margin` and `font-size` rules) can leak into compound components that use semantic heading elements internally. Radix Accordion's `AccordionPrimitive.Header` renders an `<h3>` by default, and any site-level `h3 { margin: 24px 0 12px; }` rule will inflate the accordion row height and break alignment of sibling elements (like checkboxes). Always add defensive resets (`margin: 0; font-size: inherit;`) when embedding Accordion or similar primitives inside other components, especially when the consuming site has its own typography system. The reset should be scoped to the parent component's CSS (e.g., `.ds-cookie-consent__category-row .ds-accordion__header`) rather than modifying the primitive itself, so the fix is self-contained and doesn't risk side effects.

### SVG logos loaded as `<img>` can't use `currentColor` — use `filter: invert(1)` for dark mode

When an SVG is loaded via `<img src="logo.svg">`, CSS has no access to the SVG internals — `currentColor`, `fill`, and `stroke` are all sealed off by the `<img>` element boundary. The SVG renders with its baked-in colors (typically black fills for a logo).

For dark mode, the fix is `filter: invert(1)` on the `<img>` element:

```css
:global(.dark) .site-header__logo-img { filter: invert(1); }
:global(.dark) .site-footer__logo-img { filter: invert(1); }
```

This flips black → white and works perfectly for monochrome logos. For multi-color logos, `invert(1)` would distort the colors — in that case, you'd need two separate SVG files (light/dark) and swap them, or inline the SVG so `currentColor` works.

**Rule of thumb:** If the logo is monochrome (black on transparent), `<img>` + `filter: invert(1)` is the simplest approach. If it's multi-color, inline the SVG instead.

### Keep header and footer logos in sync

The header and footer should use the same logo asset and the same rendering approach. We initially had the header using `<img src="logo.svg">` and the footer using plain text styled to look like a logo. This created a visual inconsistency — different font rendering, different weight, different alignment. Both now use the same SVG `<img>` at the same height (20px), with identical dark mode handling. If you change one, change the other.

### Radix Portal content doesn't inherit from component roots

When consolidating `font-family` declarations, we initially removed them from Select trigger and item elements. The Select dropdown broke — items rendered in system font. Root cause: Radix Select uses `<Portal>` to render the dropdown outside the component's DOM tree, so CSS inheritance from the component root doesn't reach it. The same applies to Modal content.

**Rule:** Any element rendered via a Radix Portal (`Select.Content`, `Dialog.Content`, `Popover.Content`, etc.) must have its own `font-family` declaration. Only non-portalled children can rely on inheritance from the component root.

### Dead CSS classes are silent bugs

The ModalGallery used `className="gallery-row"` on 4 wrapper divs — a class that had no CSS definition anywhere in the codebase. These divs rendered as unstyled block elements. In two cases (ModalSizes, ModalControlled) they were the only thing providing row layout for sibling buttons, but since the class was dead, the buttons stacked vertically instead of flowing horizontally.

**Rule:** When you see a className that isn't defined in any CSS file, it's either dead code to remove or a missing style to add. Never leave unresolved class references.

### Shared doc utilities pay off immediately

Extracting the `makePlaceholder()` function (identical SVG-generation logic duplicated in 4 files) into a shared `apps/docs/src/lib/placeholder.ts` utility eliminated 60+ lines of duplication. More importantly, the next person who needs a placeholder image finds the utility via imports instead of copy-pasting from another gallery file.

**Rule:** If the same helper function appears in 2+ doc components, extract it to `apps/docs/src/lib/`. The bar for extraction in docs is lower than in the component library — docs code is internal, so DRY is always worth it.

### Redundant declarations are overrides in disguise

When auditing block components for primitive overrides, don't just look for **conflicting** values — also check for **redundant** ones. If a block component sets `font-size: var(--font-size-sm)` on a wrapper element inside an Accordion that already applies `font-size: var(--font-size-sm)` via its `sm` size variant, the output looks identical today. But it's a hidden coupling: if the primitive's `sm` size changes tomorrow, the block component won't follow because it has its own hardcoded copy. Treat redundant declarations the same as conflicting overrides — delete them and let the primitive own the value. Found this in `CookieConsent`, where `.ds-cookie-consent__category-description` duplicated `font-family`, `font-size`, `line-height`, and `color` that the Accordion primitive already provided.

### Form elements don't inherit `font-family` — always add a global reset {#form-font-inheritance}

**Problem:** `<input>`, `<select>`, `<textarea>`, and `<button>` elements rendered in the browser's default font (Arial/system font) instead of the design system's `--font-family-body`, even when all parent elements had the correct font set.

**Root cause:** Browser UA stylesheets set `font-family: monospace` (textarea), `font-family: -apple-system, ...` or similar on form controls, overriding CSS inheritance. Unlike `color` and most text properties, `font-family` on form elements does NOT inherit from parent elements by default.

**The fix:** Add a global reset in the token CSS output (`build-css.mjs`):
```css
button, input, select, textarea {
  font-family: inherit;
}
```

**Why system-level, not per-component:** We initially patched individual components (`Input.css`, `Accordion.css`) with `font-family: inherit`. This worked but was whack-a-mole — every new form-based component would need the same fix. Moving it to the global token CSS ensures any consumer of the design system gets the fix automatically. Zero-effort for future components.

**Rule:** Every design system should include this reset from day one. Add it to your CSS reset/normalize layer alongside `box-sizing: border-box`. Don't wait until someone notices the wrong font on an input.

### Token naming: role-based > classification-based {#token-naming-role-vs-classification}

**Problem:** `--font-family-sans` pointed to `'Ancizar Serif'` — a serif font. This was confusing and counterintuitive. Anyone reading the CSS would assume it was a sans-serif font.

**The fix:** Rename to role-based tokens: `--font-family-body` (for body/UI text) and `--font-family-code` (for code/monospace). The name describes what the token is *for*, not what the font *is*.

**Why it matters for the next system:** Classification-based names (`sans`/`mono`/`serif`) feel natural at first because Tailwind uses them. But they encode the *current value's classification* into the *token name*. When the brand direction changes and you swap a serif for a sans-serif, you either live with a misleading name or do a codebase-wide rename. Role-based names (`body`/`code`) survive any font swap without renaming.

**Rule:** Name tokens by intent/role, not by value classification. This applies beyond fonts — `--color-blue` should be `--color-info`, `--shadow-big` should be `--shadow-xl`.

### Doc/prose styles MUST use direct child selectors to prevent leaking into component previews {#prose-child-selectors}

**Problem:** `.prose h1 { letter-spacing: var(--letter-spacing-tighter) }` in the docs site's `base.css` was leaking into headings rendered inside `<Preview>` component galleries. The component's own `letter-spacing: var(--letter-spacing-tight)` was being overridden by the more specific `.prose h1` selector.

**Why it was hard to diagnose:** The component CSS was correct. The Typography component tests passed. The issue only appeared in the docs site because the gallery was nested inside a `.prose` container. DevTools showed the correct CSS rule on the component, but the computed value was wrong because of the cascade.

**The fix:** Scope all prose typography rules to direct children only:
```css
/* ✗ Leaks into any nested h1, including component previews */
.prose h1 { letter-spacing: var(--letter-spacing-tighter); }

/* ✓ Only targets h1 directly inside .prose */
.prose > h1 { letter-spacing: var(--letter-spacing-tight); }
```

**Rule:** Any docs site that wraps MDX/markdown content in a styling container (`.prose`, `.markdown-body`, etc.) MUST use `>` direct child selectors for heading and paragraph styles. Component preview boxes will inevitably contain these same elements, and descendant selectors will leak.

### Serif fonts don't need negative letter-spacing — start at normal {#serif-letter-spacing}

**Problem:** `--letter-spacing-tighter` (-0.05em) caused visible letter collision on Ancizar Serif at 54px (h1 size). Even `--letter-spacing-tight` (-0.025em) felt too tight. Serif typefaces have built-in optical spacing from their stroke terminals and decorative elements — negative tracking fights the type designer's intent.

**The fix:** Removed all negative letter-spacing from headings. All heading levels (h1–h4) now use `normal` (0em) letter-spacing, letting the serif's natural spacing breathe.

**Rule for the next system:** Always start with `normal` letter-spacing for serif fonts and only tighten if the typeface specifically calls for it. Negative tracking is primarily a tool for geometric sans-serifs at large display sizes. When tuning, test with the largest heading size in the actual brand font, not a generic system font.

### Line-height: golden ratio (1.618) is too airy for serif body text {#serif-line-height}

**Problem:** `--line-height-relaxed` (1.618, the golden ratio) was used for body text (`Text` component, lg and base sizes). While mathematically elegant, it created too much vertical spacing between lines in long paragraphs — the text felt sparse and disconnected.

**The fix:** Changed body text line-height from `relaxed` (1.618) to `snug` (1.375). The text immediately felt more cohesive and readable.

**Why serif fonts amplify this:** Serif fonts like Ancizar Serif have tall ascenders and x-heights relative to their body. Combined with generous line-height, each line of text sits in a visually isolated band of whitespace. Sans-serif fonts are more forgiving because their simpler letterforms create less visual weight per line.

**Rule:** Don't assume typographic "ideal" ratios work universally. Golden ratio line-height works great for short text blocks, pull quotes, and marketing copy where breathing room is desirable. For long-form reading paragraphs, especially with serif fonts, 1.375–1.5 is the sweet spot. Always test with realistic paragraph content (3+ sentences), not single-line samples.

### Always document semantic token mappings — they're invisible from raw token lists {#semantic-mapping-docs}

**Problem:** The Foundation Typography page documented every individual token (font sizes, weights, line heights, letter spacing) but had no section showing how the Typography *components* combine these tokens. A developer could see that `--line-height-snug` exists and that `--font-size-lg` exists, but had no way to know that `<Text size="lg">` uses both together. They'd have to read Typography.css to discover this.

**The fix:** Added a "Semantic mapping" table to the Foundation Typography docs page showing every typography component variant and the exact token combination it uses:

| Element | Size | Weight | Line height | Letter spacing |
|---------|------|--------|-------------|----------------|
| Heading h1 | `--font-size-4xl` | semibold | `--line-height-tight` | `--letter-spacing-tight` |
| Text base | `--font-size-base` | normal | `--line-height-snug` | normal |
| Caption | `--font-size-xs` | normal | `--line-height-normal` | normal |

**Rule:** For every token category that components combine (typography, spacing, color), document the semantic mapping alongside the raw token values. Raw values tell you what's available; semantic mappings tell you what's actually used and how. This is the single most useful reference when building new layouts — you can pick the right component variant without reading CSS source files.

### Typography token docs need visual previews for ALL categories, not just obvious ones {#visual-previews-all-tokens}

**Problem:** The Foundation Typography page had visual previews for font families and font sizes but showed line heights and letter spacing as raw token tables only (name + value). Developers had to guess what `--line-height-snug` vs `--line-height-normal` actually looked like.

**The fix:** Added visual preview sections for both line heights (two-line paragraph samples at each value) and letter spacing ("Design System" rendered at each tracking value).

**Rule:** Every token category in the docs should have a visual preview. If a token affects appearance, show it — don't just list the name and value. The cost of adding a preview is ~10 lines of HTML; the time saved by developers not having to build a mental model from raw numbers is enormous. Applies especially to: line heights, letter spacing, shadows, border radius, opacity, and transitions.

### Heading semantic level ≠ visual size — decouple them, but document it loudly {#heading-semantic-vs-visual}

**Problem:** Seeing `<Heading as="h1" size="2xl">` on the PDP product title caused confusion — "why isn't h1 using the h1 size?" The `Heading` component correctly decouples semantic level (`as`) from visual size (`size`), but this isn't obvious, and the size scale names (`xl`–`4xl`) create an implicit mental mapping to heading levels (h4–h1) that makes overrides feel wrong.

**Why decoupling is necessary:** Layout context determines appropriate visual size, not document hierarchy. A product name should be `h1` for SEO/accessibility, but a 54px heading inside a 50%-width PDP details column would dominate the viewport. The PDP uses `size="2xl"` (33px max) — visually proportional to the column, semantically correct for the page.

**Why not add semantic aliases (e.g. `size="h1"`):** Tempting, but creates two naming systems for the same scale. "Is `h3` the same as `2xl`?" becomes the new confusion. One abstract scale is cleaner — it just needs clear documentation.

**Rule:** When your Heading component decouples `as` from `size`, document this pattern prominently with a real-world example (like the PDP). The abstract size scale will confuse people who expect h1 = biggest. Make the default mapping intuitive (`<Heading as="h1">` defaults to `4xl`) so the common case just works, and explain overrides as the exception, not the rule.

### Focus ring duplication: use composite tokens, not raw expressions {#focus-ring-tokens}

**Problem:** The focus ring `box-shadow` expression (`0 0 0 3px color-mix(...)`) was copy-pasted into 14 locations across 10 component CSS files. Three variants existed: standard, error, and inset. Changing the ring width, color opacity, or style required editing all 14 locations with no guarantee of consistency.

**The fix:** Created composite CSS custom properties (`--focus-ring`, `--focus-ring-error`, `--focus-ring-inset`) in the token build script. Each component now references a single token.

**Why not a utility class:** A class like `.ds-focus-ring` can't compose with `box-shadow` — Button's primary variant needs `box-shadow: var(--shadow-sm), var(--focus-ring)`, which requires the value to be a CSS custom property, not a class.

**Rule:** When a CSS expression appears more than 3 times and varies in predictable ways (standard/error/inset), create a composite token. Composite tokens live in `build-css.mjs` alongside the semantic color tokens, not in `tokens.json` (which holds only primitive values).

### SVG IDs in reusable React components must use useId() {#svg-use-id}

**Problem:** `StarRating` used a hardcoded `id="ds-star-half"` for an SVG `<clipPath>`. When two StarRating components rendered on the same page (common on PDPs with product rating + review list), all half-stars referenced the first component's clipPath, breaking the second instance.

**The fix:** Used React's `useId()` hook in the parent component to generate a unique ID per instance.

**Rule:** Never hardcode SVG element IDs (`id`, `clipPath`, `mask`, `filter`, `linearGradient`) in reusable React components. Always use `useId()` to ensure uniqueness. Generate the ID at the highest component level that needs it, not inside mapped child elements.

### Never use !important in component CSS — restructure cascade instead {#no-important}

**Problem:** `Button.css` and `Card.css` used `!important` in `@media (prefers-reduced-motion: reduce)` blocks because the reduced-motion rules had lower specificity than the variant-specific `:active` rules they needed to override.

**The fix:** (1) Matched the specificity of the rules being overridden (e.g., `.ds-button:active:not(:disabled)` instead of `.ds-button:active`). (2) Moved the `@media` block to the end of the file so cascade order resolves ties.

**Rule:** `!important` in a design system is always a specificity problem in disguise. Fix it by restructuring cascade order (place overriding rules after the rules they override) and matching specificity. This prevents the `!important` arms race where each new rule needs `!important` to override the previous one.

### Story and demo files must use tokens — they're documentation {#story-tokens}

**Problem:** 60+ inline styles across story and gallery files used raw pixel values (`gap: '12px'`, `fontWeight: 600`) instead of token references. Developers copying story code as a starting point would inherit hardcoded values that bypass the token system.

**The fix:** Converted all pixel values to token references (`gap: 'var(--spacing-3)'`). Created `demo-utilities.css` with shared utility classes for common patterns (`.ds-unstyled-link`, `.ds-demo-cover-image`).

**Rule:** Story files are documentation — they're often the first code a developer copies. Every inline style in a story should use a token reference. Container widths for decorators are the one exception (test harness setup). For repeated patterns across stories, create utility classes in a shared CSS file rather than duplicating inline styles.

### Transition token naming: generated names must match consumed names {#transition-token-naming}

**Problem:** Accordion and CookieConsent CSS referenced `--transition-timing-ease-out` and `--transition-timing-ease-in`, but the token build generates `--transition-easing-out` and `--transition-easing-in`. The CSS variables silently failed to resolve, falling back to browser defaults. No error, no warning — the animation just used a different easing curve than intended.

**The fix:** Global find-and-replace: `--transition-timing-ease-*` → `--transition-easing-*` across all component CSS files.

**Rule:** After renaming tokens in `tokens.json` or `build-css.mjs`, grep the entire `packages/components/src/` directory for the OLD name. CSS custom properties fail silently — a reference to a non-existent variable simply returns `initial`, which is almost impossible to notice visually. Add a CI step or build-time check if this bites you more than once.

### Hardcoded easing values bypass the token system {#hardcoded-easing}

**Problem:** Select.css used `ease-out` (a hardcoded CSS keyword) while every other component used `var(--transition-easing-out)` for the same purpose. This meant changing the system-wide easing curve wouldn't affect the Select dropdown animation.

**The fix:** Replaced the hardcoded `ease-out` with `var(--transition-easing-out)`.

**Rule:** Easing functions are design decisions, not implementation details. If duration is tokenized, easing should be too. Grep for bare `ease-in`, `ease-out`, `ease-in-out`, and `cubic-bezier(` in component CSS — every instance should be a token reference.

### Demo/gallery components should use Typography primitives, not raw HTML {#gallery-typography}

**Problem:** Gallery components (CardGallery, ModalGallery, CarouselGallery) used raw `<p style={{ margin: 0, fontSize: '...' }}>` elements instead of the design system's `<Text>` and `<Heading>` components. This created two issues: (1) inline styles with hardcoded values that bypass tokens, (2) inconsistent rendering since raw `<p>` elements don't get the same optical centering, font-family, or line-height as `<Text>`.

**The fix:** Replaced all raw `<p>` elements with `<Text>` and `<Heading>` components. Created CSS utility classes in `demo-utilities.css` for repeated patterns (`.ds-demo-slide-image`, `.ds-demo-prose`, `.ds-demo-section-label`).

**Rule:** Gallery/demo code should use the component library's own primitives. If you wouldn't write `<p style={{ fontSize: '14px' }}>` in a real app, don't write it in a demo. Developers copy demo code — make it exemplary.

### Composite tokens turn magic numbers into named concepts {#composite-tokens}

**Problem:** Modal.css used `color-mix(in srgb, var(--color-foreground) 40%, transparent)` — the `40%` was an unnamed magic number. Even though the token system had `--opacity-medium: 0.382` (38.2%, derived from 1/φ), the overlay wasn't using it.

**The fix:** Added a `--color-overlay` composite token in `build-css.mjs` that uses the φ-derived 38.2% value. Modal.css now just says `background-color: var(--color-overlay)`.

**Rule:** When a value has semantic meaning (like "overlay dimming"), give it a composite token name. This is the same pattern used for `--focus-ring-color`. Composite tokens live in the build script alongside the focus ring definitions.

### Fixed heights on content containers are usually wrong {#fixed-height-antipattern}

**Problem:** CookieConsent had `max-height: 260px` on the preferences panel, forcing a scrollbar when the accordion content was taller. This is a common CSS instinct — cap the height, add `overflow: auto` — but it fights the content.

**The fix:** Removed the fixed max-height on desktop. On mobile, used `max-height: 50vh` as a viewport-relative safety cap.

**Rule:** Prefer content-driven sizing. Use `max-height` only when the container truly must be bounded (e.g., viewport-relative mobile constraints), and use viewport units (`vh`) rather than fixed pixels. If you're adding `overflow-y: auto`, ask: "Would the user prefer to scroll inside this box, or have it just be taller?"
