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

**[NEEDS INPUT]** Deployment target for the Astro docs site. Options: Vercel, Netlify, GitHub Pages. Currently running locally only.

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
