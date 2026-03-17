# 02 — Tooling Setup

> Every tool, why it was chosen over alternatives, and the configuration that makes it work.

---

## Rules for This File

- **When adding a new tool:** Document what it does, why it was chosen over alternatives, the exact configuration, and any gotchas. Add a decisions log entry in `06-decisions-log.md`.
- **When removing a tool:** Remove its section here and add a decisions log entry explaining why.
- **When hitting a config bug:** Add it to the tool's "Gotchas" subsection AND to `07-lessons-learned.md`.

---

## Known Gotchas — Read First

These are the configuration mistakes that have cost the most time. Check this before debugging any tooling issue.

| Tool | Gotcha | What Happens | Fix |
|------|--------|-------------|-----|
| tsup | Assumes `.cjs` output for CJS | "Module not found" — file doesn't exist | CJS is `.js`, ESM is `.mjs` |
| package.json | `import` before `types` in exports | TypeScript can't find declarations | Always put `types` first |
| Storybook | Stories glob relative to package root | Empty Storybook, no error, no stories | Path is relative to `.storybook/` dir |
| Storybook | Uses `@(ts\|tsx)` glob syntax | No stories found | Use `{ts,tsx}` instead |
| Astro | JSON import path relative to project root | Import fails or 404 at runtime | Path is relative to `.astro` file location |
| Chromatic | `fetch-depth: 1` in GitHub Actions | Every run treated as first build | Must use `fetch-depth: 0` |
| Tokens | Only runs `tsup --watch`, not CSS script | Token CSS doesn't regenerate | `build` chains tsup + `build-css.mjs` — watch only covers tsup |

---

## Package Management: pnpm Workspaces

**Why pnpm over npm/Yarn:**
- **Strict isolation** — packages can only import what they explicitly declare as dependencies. npm/Yarn hoist everything to `node_modules` root, creating "phantom dependencies" that work locally but break in CI or consumer projects.
- **Disk efficiency** — packages are stored once in a content-addressable store and hard-linked.
- **Workspace protocol** — `"@ds/tokens": "workspace:*"` means "use the local version." pnpm handles symlinking automatically.
- **Speed** — significantly faster installs than npm, comparable to Yarn Berry.

**Rejected alternatives:** npm workspaces (no strict isolation), Yarn Berry (PnP mode adds complexity without enough benefit at this scale).

**Configuration:**
```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

**Commands:**
```bash
pnpm install                    # Install all workspace deps
pnpm install --frozen-lockfile  # CI — fail if lockfile is stale
```

---

## Build Orchestration: Turborepo

**Why Turborepo over Nx / Lerna / custom scripts:**
- **`^build` syntax** — one line declares that `@ds/components` build depends on `@ds/tokens` build. Turborepo figures out order and parallelizes the rest.
- **Content-based caching** — unchanged packages restore from cache. CI gets dramatically faster after first run.
- **Zero configuration** — just declare tasks in `turbo.json`.

**Rejected alternatives:** Nx (over-engineered for this scale), Lerna (legacy, unmaintained for build orchestration).

**Configuration:**
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint":      { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test":      { "dependsOn": ["^build"], "outputs": ["coverage/**"] }
  }
}
```

**Critical concept:** `"dependsOn": ["^build"]` means "run `build` in all my dependencies first." Without this, `@ds/components` tries to import from `@ds/tokens` before tokens has been built → "module not found."

---

## Package Bundler: tsup

**Why tsup over Rollup / esbuild directly / tsc:**
- **Dual ESM + CJS output** — one config, both formats, correct extensions
- **CSS bundling** — concatenates all CSS imports into a single `dist/index.css`
- **Source maps + declarations** — enabled by default
- **esbuild under the hood** — fast

**Rejected alternatives:** Rollup (more config), esbuild directly (no declaration generation), tsc (slow, no CSS bundling), Vite library mode (adds Vite plugin dependency).

### ⚠️ Critical: tsup output extensions

**This is one of the most common setup mistakes.** tsup does NOT output `.cjs` for CommonJS.

| Format | Actual Extension | package.json exports |
|--------|-----------------|---------------------|
| ESM | `.mjs` | `"import": "./dist/index.mjs"` |
| CJS | `.js` | `"require": "./dist/index.js"` |

### ⚠️ Critical: package.json exports ordering

`types` MUST be the first condition. TypeScript resolves conditions in order.

```json
// ✅ Correct — types first
"exports": {
  ".": {
    "types":   "./dist/index.d.ts",
    "import":  "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}

// ❌ Broken — TypeScript finds .mjs, can't read it as declarations
"exports": {
  ".": {
    "import":  "./dist/index.mjs",
    "require": "./dist/index.js",
    "types":   "./dist/index.d.ts"
  }
}
```

**This applies to every package in the monorepo.** Check all three (`@ds/tokens`, `@ds/primitives`, `@ds/components`).

---

## TypeScript: Strict Shared Config

All packages extend from shared configs in `tooling/typescript/`:

```json
// tooling/typescript/base.json — non-React packages
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "isolatedModules": true,
    "moduleResolution": "bundler"
  }
}

// tooling/typescript/react.json — React packages
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

**Key setting: `noUncheckedIndexedAccess: true`** — `array[0]` returns `T | undefined` instead of `T`. Catches a huge class of runtime errors at compile time. Do not disable this.

**Key setting: `isolatedModules: true`** — required for tsup/esbuild. Without it, certain TypeScript features (const enums, namespace merging) that esbuild can't handle would compile locally but break in the bundle.

**Key setting: `jsx: "react-jsx"`** — no need for `import React from 'react'` in every file.

---

## ESLint: Flat Config

Using ESLint 9 flat config format (not legacy `.eslintrc`):

```js
// tooling/eslint/index.js
export const react = [
  ...base,  // TypeScript strict-type-checked rules
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...a11yPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    }
  }
]
```

**`eslint-plugin-jsx-a11y` is the first line of defense.** It catches missing `alt` attributes, incorrect ARIA roles, and label association errors at lint time — before runtime a11y testing. Do not remove or disable it.

---

## Primitive Components: Radix UI

**Why Radix over writing primitives from scratch:**
- Keyboard navigation implemented correctly and tested
- WAI-ARIA patterns correct by default (focus management, live regions, escape key)
- Completely unstyled — our token system drives all visual design
- Used by shadcn/ui — battle-tested at scale

**Rejected alternatives:** Headless UI (smaller component set), Reach UI (less maintained), Ariakit (smaller ecosystem), writing from scratch (keyboard navigation and ARIA are notoriously hard to get right).

**Key Radix packages used:**

| Package | What It Does | Used In |
|---------|-------------|---------|
| `@radix-ui/react-slot` | `Slot` for `asChild` pattern | Button, Typography |
| `@radix-ui/react-label` | Accessible label with `for` association | Input |
| `@radix-ui/react-visually-hidden` | Screen-reader-only content | Various |
| `@radix-ui/react-dialog` | Modal dialog | Modal |
| `@radix-ui/react-select` | Select dropdown | Select |
| `@radix-ui/react-checkbox` | Checkbox with indeterminate | Checkbox |
| `@radix-ui/react-accordion` | Collapsible sections | Accordion |

### ⚠️ Radix Portal gotcha

Select dropdown, Modal content, and any Radix `<Portal>` elements render at `document.body` level — **outside the component's DOM tree**. This means they don't inherit `font-family` from the component root.

**Fix:** Explicitly declare `font-family: var(--font-family-body)` on portalled content elements. See `04-components.md` CSS `font-family` inheritance section.

### The Slot / asChild pattern

```tsx
import { Slot } from '@radix-ui/react-slot'

const Comp = asChild ? Slot : 'button'
return <Comp className={classes} {...props}>{children}</Comp>
```

When `asChild` is true, `Slot` merges the component's props (className, ref, aria attributes) onto whatever child element is provided:

```tsx
// The <a> gets all Button styles and aria attributes
<Button asChild>
  <a href="/checkout">Proceed to checkout</a>
</Button>
```

**This is the correct way to build polymorphic components.** Do not use `as={Link}` prop patterns — they break type safety.

---

## Storybook 8

**Role:** Internal development tool and Chromatic integration point. NOT the public documentation site.

**Why Storybook over alternatives:** Histoire and Ladle were evaluated — smaller ecosystems, fewer addons, less Chromatic support. Storybook 8 with `@storybook/react-vite` is fast (Vite HMR). `@storybook/addon-a11y` runs axe-core in the panel.

**Configuration:**
```
apps/storybook/.storybook/
├── main.ts     — stories glob, addons, framework
└── preview.ts  — global CSS imports, decorators, addon config
```

### ⚠️ Critical: stories glob path

The path is relative to `.storybook/` directory, NOT `apps/storybook/`:

```
apps/storybook/.storybook/   ← you are here
  ../                         → apps/storybook/
  ../../                      → apps/
  ../../../                   → monorepo root
  ../../../packages/components/src/  → component source
```

```ts
// ✅ Correct
stories: ['../../../packages/components/src/**/*.stories.{ts,tsx}']

// ❌ Wrong — finds nothing, no error
stories: ['../../packages/components/src/**/*.stories.{ts,tsx}']
```

**Also critical:** Use `{ts,tsx}` not `@(ts|tsx)`. Extglob syntax is not supported.

### Dark mode in Storybook

`preview.ts` has a decorator that watches for the dark background selection and toggles `.dark` on `document.body`. No component-level dark mode code needed.

---

## Astro 4 (Docs Site)

**Role:** Public-facing documentation site. Consumers read this.

**Why Astro over Next.js / Docusaurus / VitePress:**
- **Island architecture** — most pages are static HTML; React hydrates only where needed
- **MDX support** — Markdown with embedded React components
- **Static output** — pure HTML/CSS/JS, deployable to any CDN

**Rejected alternatives:** Docusaurus (too opinionated for non-blog), VitePress (Vue-focused), Next.js (full React runtime on every page is overkill for docs).

**Configuration:**
```js
// apps/docs/astro.config.mjs
export default defineConfig({
  integrations: [react(), mdx()],
  output: 'static',
})
```

### ⚠️ Critical: JSON import paths

Astro resolves imports relative to the `.astro` file's location, not the project root:

```astro
---
// In apps/docs/src/pages/tokens/colors.astro
import tokens from '../../../../../packages/tokens/src/tokens.json'
//               ↑ five levels up — count carefully
---
```

**Getting this wrong means silent failure or 404 at runtime. No helpful error message.**

---

## Vitest

**Why Vitest over Jest:** Vite-native (same transform pipeline as dev server), same API as Jest, faster in watch mode.

**Shared config factory — no duplicated configuration:**

```ts
// tooling/vitest/index.ts
export function createVitestConfig(options?) {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
  })
}
```

Each package creates a `vitest.config.ts` that calls this factory.

**Test command:**
```bash
pnpm --filter @ds/components test        # Run once
pnpm --filter @ds/components test:watch   # Watch mode during development
```

---

## Chromatic

**Role:** Visual regression testing. Screenshots every Storybook story on every PR, shows diffs.

### ⚠️ Critical: GitHub Actions checkout depth

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # ← MUST be 0 — Chromatic needs full git history
```

Without `fetch-depth: 0`, Chromatic can't find the baseline commit and treats every run as a first build. No diffs, no regression detection.

**How it works:**
1. PR opens → Chromatic builds Storybook and uploads screenshots
2. If any story looks different → PR gets "changes detected" status
3. Engineer reviews diff in Chromatic UI → accept or reject
4. `autoAcceptChanges: main` — merges to main auto-accept

---

## Changesets

**Role:** Versioning and changelog generation for published packages.

**Why Changesets over semantic-release / auto:**
- **Per-package versioning** — `@ds/tokens` at `1.2.0` while `@ds/components` at `0.8.3`
- **PR-based workflow** — changeset file added alongside code, not after
- **Human-readable changelogs** — the changeset description becomes the changelog entry

**Used by:** Radix UI, shadcn/ui, many other design systems.

**Day-to-day workflow:**
```bash
pnpm changeset              # Interactive: which packages? major/minor/patch? describe it.
git add .changeset/*.md     # Commit the changeset file alongside your code
git commit -m "feat: add Badge component"
```

**What happens on merge to main:**
1. GitHub Actions sees `.changeset/*.md`
2. Creates a "Version Packages" PR that bumps versions
3. When that PR merges → publishes to npm with `pnpm release`

**Configuration:**
```json
// .changeset/config.json
{
  "access": "public",
  "baseBranch": "main",
  "ignore": ["@ds/docs", "@ds/storybook"],
  "updateInternalDependencies": "patch"
}
```

**`access: "public"` is required** for scoped packages (`@ds/*`) to be publicly installable on npm.

**`ignore` excludes apps** — `@ds/docs` and `@ds/storybook` are never published.

---

## Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

Single quotes and trailing commas match the style of most large React codebases (React itself, Next.js). These are the opinionated choices — do not change without a decisions log entry.

---

## File Locations Quick Reference

| What | Where |
|------|-------|
| pnpm workspace config | `pnpm-workspace.yaml` |
| Turborepo config | `turbo.json` |
| TypeScript base config | `tooling/typescript/base.json` |
| TypeScript React config | `tooling/typescript/react.json` |
| ESLint config | `tooling/eslint/index.js` |
| Vitest config factory | `tooling/vitest/index.ts` |
| Prettier config | `.prettierrc` |
| Changesets config | `.changeset/config.json` |
| Storybook config | `apps/storybook/.storybook/main.ts` |
| Astro config | `apps/docs/astro.config.mjs` |
| Token source | `packages/tokens/src/tokens.json` |
| Token CSS build script | `packages/tokens/scripts/build-css.mjs` |
