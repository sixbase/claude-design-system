# 05 — Workflows

> Step-by-step processes for building components, adding tokens, running CI, and releasing packages.

---

## Rules for Workflows

1. **Follow the new component checklist exactly.** Steps are ordered for a reason. Skipping ahead (e.g., writing the docs page before tests) creates gaps that compound.
2. **Build order is tokens → primitives → components.** Always. Turborepo handles this with `pnpm build`, but if building manually, respect the order.
3. **Every component ships with all 4 files in the same session.** No "I'll add tests later." No "docs can wait."
4. **Parity check before marking any component done.** Storybook and docs side by side — every story must have a live preview in docs.
5. **CSS variables fail silently.** After renaming or removing any token, `grep -r "old-name" .` is mandatory. There is no build error for missing variables.
6. **Disabled state in CSS templates uses `opacity: var(--opacity-medium)`, not `opacity: 0.5`.**

---

## Running the Dev Environment

Two servers run simultaneously:

```bash
pnpm dev    # Starts both in parallel from monorepo root
```

Or individually:

```bash
pnpm --filter @ds/docs dev        # Astro docs  → http://localhost:4321
pnpm --filter @ds/storybook dev   # Storybook   → http://localhost:6006
```

### Which server for which task

| Task | Server |
|------|--------|
| Building a new component | Storybook (`:6006`) |
| Checking component stories | Storybook (`:6006`) |
| Checking a11y panel | Storybook (`:6006`) |
| Writing / reviewing a docs page | Docs site (`:4321`) |
| Checking token colors, typography, spacing | Docs site (`:4321`) |
| Reviewing example pages (Homepage, PDP, etc.) | Docs site (`:4321`) |
| Visual regression | Chromatic (CI — not local) |

### Claude Code preview configuration

```json
// .claude/launch.json
{
  "configurations": [
    { "name": "docs",      "runtimeExecutable": "pnpm", "runtimeArgs": ["--filter", "@ds/docs", "dev"],      "port": 4321 },
    { "name": "storybook", "runtimeExecutable": "pnpm", "runtimeArgs": ["--filter", "@ds/storybook", "dev"], "port": 6006 }
  ]
}
```

---

## Build Order

```bash
# Turborepo handles order automatically:
pnpm build

# Manual order (if needed):
pnpm --filter @ds/tokens build       # 1. Tokens first
pnpm --filter @ds/primitives build   # 2. Primitives second
pnpm --filter @ds/components build   # 3. Components last
```

**Why order matters:** `@ds/components` imports from `@ds/tokens`. tsup looks in `packages/tokens/dist/`. If tokens hasn't been built, `dist/` doesn't exist → "module not found."

---

## New Component Checklist

Follow this sequence every time. Do not skip steps. Do not reorder.

### Step 1 — Create the folder

```bash
mkdir packages/components/src/{component-name}
```

### Step 2 — Write `{Component}.tsx`

Start with the interface, then the implementation:

```tsx
export interface ComponentProps extends HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  function Component({ variant = 'primary', size = 'md', className, ...props }, ref) {
    const classes = [
      'ds-component',
      `ds-component--${variant}`,
      `ds-component--${size}`,
      className,
    ].filter(Boolean).join(' ')

    return <div ref={ref} className={classes} {...props} />
  }
)
Component.displayName = 'Component'
```

**Checklist before moving to Step 3:**

- [ ] `forwardRef` with correct element type
- [ ] `displayName` set
- [ ] Extends native HTML element attributes
- [ ] Default values for `variant` and `size` in function signature
- [ ] `type="button"` if it's a button element
- [ ] Correct `aria-*` attributes for the component type
- [ ] `role="alert"` on error messages
- [ ] Class assembly uses array + filter pattern (not template literals)

### Step 3 — Write `{Component}.css`

Structure: component tokens → base styles → variants → states → reduced motion.

```css
/* 1. Component tokens — the "knobs" consumers can turn */
.ds-component {
  --component-radius: var(--radius-md);
  --component-font-weight: var(--font-weight-medium);
}

/* 2. Base styles — reference component tokens */
.ds-component {
  border-radius: var(--component-radius);
  font-weight: var(--component-font-weight);
  font-family: var(--font-family-body);
  transition: var(--transition-fast);
}

/* 3. Variants */
.ds-component--primary { ... }
.ds-component--secondary { ... }

/* 4. Size variants */
.ds-component--sm { height: var(--size-control-sm); }
.ds-component--md { height: var(--size-control-md); }
.ds-component--lg { height: var(--size-control-lg); }

/* 5. Interactive states */
.ds-component:hover:not(:disabled) { ... }
.ds-component:focus-visible { box-shadow: var(--focus-ring); }
.ds-component:disabled {
  opacity: var(--opacity-medium);   /* ← 0.382, NOT 0.5 */
  cursor: not-allowed;
}

/* 6. Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ds-component { transition: none; }
}
```

**Checklist before moving to Step 4:**

- [ ] Component tokens declared on root class
- [ ] All values from design tokens — no raw hex, px, or numbers
- [ ] Disabled uses `var(--opacity-medium)`, not `0.5`
- [ ] Focus uses `var(--focus-ring)` composite token
- [ ] Transitions use `var(--transition-fast/normal/slow)` shorthands
- [ ] `@media (prefers-reduced-motion)` for any animations or transitions
- [ ] If component uses `text-box-trim`, includes `@supports not` fallback (see `04-components.md`)
- [ ] If component uses Radix Portal, explicit `font-family` on portalled elements

### Step 4 — Write `{Component}.test.tsx`

Minimum 6 test cases. See `04-components.md` for the full template.

- [ ] Renders without crashing
- [ ] Correct HTML element rendered
- [ ] `asChild` renders child element (if applicable)
- [ ] Disabled state behavior
- [ ] User interaction (click/keyboard)
- [ ] `axe` no accessibility violations

```bash
pnpm --filter @ds/components test:watch   # Watch mode while writing tests
```

### Step 5 — Write `{Component}.stories.tsx`

One story per meaningful state. Always use `autodocs` tag.

```tsx
const meta: Meta<typeof Component> = {
  title: 'Components/ComponentName',
  component: Component,
  tags: ['autodocs'],
}
export default meta

export const Default: Story = { args: { variant: 'primary', children: 'Label' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Label' } }
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
      <Component size="sm">Small</Component>
      <Component size="md">Medium</Component>
      <Component size="lg">Large</Component>
    </div>
  ),
}
```

**Verify in Storybook:**

- [ ] All stories render
- [ ] Controls panel works
- [ ] A11y panel shows no violations
- [ ] Dark mode looks correct (toggle background in toolbar)

**Note:** Inline styles in stories use token references (`gap: 'var(--spacing-3)'`), never raw pixels. Container widths for constraining stories are acceptable as inline styles.

### Step 6 — Create `index.ts`

```ts
export { Component } from './Component'
export type { ComponentProps } from './Component'
```

### Step 7 — Export from package index

Add to `packages/components/src/index.ts`:

```ts
export * from './component-name'
```

### Step 8 — Write the docs page

Create `apps/docs/src/pages/components/{component-name}.astro`.

**Before writing:** List every named story export from Step 5. Each one needs a live preview section:

| Storybook story | Docs section | Has `<Gallery client:load />`? |
|-----------------|-------------|-------------------------------|
| `Default` | Default | ✅ Required |
| `WithIcons` | With Icons | ✅ Required — heading + code only is NOT sufficient |
| `AllSizes` | Sizes | ✅ Required |

**Every docs page must have:**

- [ ] One-line description
- [ ] Import snippet
- [ ] Live preview (`<Gallery client:load />`) for every Storybook story group
- [ ] Code snippet under each preview
- [ ] Props table (using shared CSS from `base.css`)
- [ ] Accessibility notes

**After writing:** Add the sidebar link in `apps/docs/src/layouts/BaseLayout.astro` (alphabetical order in Components section).

### Step 9 — Build and verify

```bash
pnpm --filter @ds/components build
# Verify dist/ contains: index.mjs, index.js, index.css, index.d.ts
```

Reload the docs site and verify the new component page renders.

### Step 10 — Parity check (mandatory)

Open both Storybook (`:6006`) and docs page (`:4321`) side by side.

**Every feature visible in Storybook must have a live preview in docs.** A code-only section without a rendered example is a gap. Fix it before moving on.

### Step 11 — Update the playbook

- [ ] Update component status table in `01-planning.md`
- [ ] Add decisions log entry in `06-decisions-log.md` if any non-obvious design decisions were made
- [ ] Update `04-components.md` component catalog if the component introduces a new pattern

---

## Adding a New Token

1. Add the value to `packages/tokens/src/tokens.json` in the correct tier (primitive, semantic, or both)
2. If it's a composite token (like `--color-overlay`), add it to `packages/tokens/scripts/build-css.mjs`
3. Rebuild tokens: `pnpm --filter @ds/tokens build`
4. Rebuild components if they use it: `pnpm --filter @ds/components build`
5. The new CSS variable is now available everywhere that imports `@ds/tokens/css`
6. Update `03-tokens.md` reference tables

## Renaming a Token

⚠️ **CSS variables fail silently. This is the single most dangerous operation in the token system.**

1. `grep -r "var(--old-name)" .` — find every usage
2. Update the name in `tokens.json` (and `build-css.mjs` if applicable)
3. Update every reference found in step 1
4. `pnpm --filter @ds/tokens build`
5. `grep -r "var(--old-name)" .` — verify zero results
6. `pnpm build && pnpm test` — full rebuild and test
7. Update `03-tokens.md` reference tables
8. Add decisions log entry in `06-decisions-log.md`

---

## CI/CD Pipeline

### On every PR and push to `main`

| Step | Command | What It Checks |
|------|---------|---------------|
| 1 | `pnpm install --frozen-lockfile` | Lockfile is current |
| 2 | `pnpm turbo build --filter='./packages/*'` | All packages build |
| 3 | `pnpm turbo lint` | ESLint (including jsx-a11y) |
| 4 | `pnpm turbo typecheck` | TypeScript `--noEmit` |
| 5 | `pnpm turbo test` | Vitest (unit + axe a11y) |
| 6 | Upload coverage artifact | — |

### Branch protection on `main`

Direct pushes blocked. Every PR must:

1. ✅ Pass CI (lint + typecheck + all tests including axe)
2. ✅ Get 1 approving review
3. ✅ Stale reviews dismissed on new commits

**No code reaches `main` without passing all checks AND review.**

### On merge to `main`

Changesets Action checks for `.changeset/*.md` files:
1. If changesets exist → creates "Version Packages" PR with bumped versions
2. If that PR merges → publishes to npm with `pnpm release`

---

## Release Process (Changesets)

### When making a change

```bash
pnpm changeset              # Interactive: which packages? major/minor/patch? describe.
git add .changeset/*.md     # Commit changeset alongside code
git commit -m "feat: add Badge component"
```

### What happens on merge

1. GitHub Actions sees `.changeset/*.md`
2. Creates "chore: release packages" PR that bumps version numbers
3. Merging that PR publishes to npm

### Important

- `"access": "public"` is required for `@ds/*` scoped packages on npm
- Apps (`@ds/docs`, `@ds/storybook`) are in the `ignore` list — never published

---

## Adding a New Doc Page

1. Create `apps/docs/src/pages/{section}/{page-name}.astro`
2. Use the appropriate layout:

```astro
---
// For component/foundation pages — sidebar layout
import BaseLayout from '../../layouts/BaseLayout.astro'
---
<BaseLayout title="Page Title">
  <div class="prose"><!-- content --></div>
</BaseLayout>

---
// For example pages — full-width layout
import FullWidthLayout from '../../layouts/FullWidthLayout.astro'
---
<FullWidthLayout title="Page Title">
  <PageDemo client:load />
</FullWidthLayout>
```

3. Add the link to `apps/docs/src/layouts/BaseLayout.astro` sidebar nav
4. ⚠️ JSON import paths are relative to the `.astro` file's location, not project root. Count the `../` carefully.

---

## Storybook Glob Path Reference

The stories path in `apps/storybook/.storybook/main.ts` is relative to `.storybook/`, NOT `apps/storybook/`:

```
apps/storybook/.storybook/   ← you are here
  ../                         → apps/storybook/
  ../../                      → apps/
  ../../../                   → monorepo root
  ../../../packages/components/src/  → component source
```

```ts
// ✅ Correct — three levels up from .storybook/
stories: ['../../../packages/components/src/**/*.stories.{ts,tsx}']

// ❌ Wrong — only two levels, finds nothing, no error
stories: ['../../packages/components/src/**/*.stories.{ts,tsx}']
```

**Use `{ts,tsx}` not `@(ts|tsx)`.** Extglob syntax is not supported.

---

## When Things Go Wrong

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| "Module not found" for `@ds/tokens` | Tokens not built, or built after components | `pnpm --filter @ds/tokens build` first |
| Empty Storybook, no stories | Glob path wrong (relative to `.storybook/`) | Fix path — needs `../../../` |
| Storybook shows no stories, using `@(ts\|tsx)` | Extglob not supported | Change to `{ts,tsx}` |
| TypeScript can't find declarations | `types` not first in package.json exports | Move `types` above `import` |
| Token change didn't take effect | Only ran `tsup --watch`, CSS not regenerated | Run full `pnpm --filter @ds/tokens build` |
| Component looks right in Storybook but wrong in docs | CSS not imported in docs, or stale build | Rebuild: `pnpm --filter @ds/components build` |
| Renamed token, component now invisible/broken | CSS variable resolves to `initial` silently | `grep -r "var(--old-name)" .` and fix all references |
| Chromatic treats every run as first build | `fetch-depth: 1` in GitHub Actions checkout | Set `fetch-depth: 0` |
| Docs page 404 on `tokens.json` import | Path relative to `.astro` file, not project root | Count `../` from the file's actual location |
| Dark mode colors wrong | Using hardcoded hex or primitive directly | Use semantic token; add one if it doesn't exist |
| Font wrong in Select dropdown / Modal | Radix Portal renders outside DOM tree | Add explicit `font-family: var(--font-family-body)` |
