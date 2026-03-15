# 05 — Workflows

> End-to-end processes for building components, running CI, and releasing packages.

---

## Running the Dev Environment

Two servers run simultaneously. Start them both:

```bash
# From monorepo root — starts both in parallel
pnpm dev
```

Or start individually:
```bash
pnpm --filter @ds/docs dev        # Astro docs → http://localhost:4321
pnpm --filter @ds/storybook dev   # Storybook  → http://localhost:6006
```

**Which do I use for what?**

| Task | Use |
|------|-----|
| Building a new component | Storybook (`:6006`) |
| Checking component stories | Storybook (`:6006`) |
| Reading about a component | Docs site (`:4321`) |
| Writing a docs page | Docs site (`:4321`) |
| Checking the token color palette | Docs site (`:4321`) |
| Running visual regression | Chromatic (CI) |

The `.claude/launch.json` file tells Claude Code's preview tool about both servers:
```json
{
  "configurations": [
    { "name": "docs",      "runtimeExecutable": "pnpm", "runtimeArgs": ["--filter", "@ds/docs", "dev"],      "port": 4321 },
    { "name": "storybook", "runtimeExecutable": "pnpm", "runtimeArgs": ["--filter", "@ds/storybook", "dev"], "port": 6006 }
  ]
}
```

---

## Build Order

Turborepo enforces the correct order via `"dependsOn": ["^build"]` in `turbo.json`. But if you're running individual package builds manually:

```bash
# Always in this order:
pnpm --filter @ds/tokens build       # 1. tokens first (others depend on its dist/)
pnpm --filter @ds/primitives build   # 2. primitives second
pnpm --filter @ds/components build   # 3. components last

# Or just let Turborepo handle it:
pnpm build
```

**Why does order matter?** When `@ds/components` builds, tsup resolves imports from `@ds/tokens`. It looks in `packages/tokens/dist/`. If tokens hasn't been built yet, `dist/` doesn't exist and the build fails.

---

## New Component Checklist

Follow this sequence every time. Don't skip steps.

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
  // ... component-specific props
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  function Component({ variant = 'primary', size = 'md', className, ...props }, ref) {
    // Build class list
    // Return JSX with correct ARIA attributes
  }
)
Component.displayName = 'Component'
```

Required checklist:
- [ ] `forwardRef` with correct element type
- [ ] `displayName` set
- [ ] Extends native HTML element attributes
- [ ] Default values for variant and size
- [ ] `type="button"` if it's a button element
- [ ] Correct `aria-*` attributes for the component type
- [ ] `role="alert"` on error messages

### Step 3 — Write `{Component}.css`

Start with component tokens, then base styles, then variants:
```css
/* Component tokens */
.ds-component {
  --component-radius: var(--radius-md);
}

/* Base styles */
.ds-component {
  border-radius: var(--component-radius);
  transition: var(--transition-fast);  /* use shorthand */
}

/* Variants */
.ds-component--primary { ... }
.ds-component--secondary { ... }

/* States */
.ds-component:hover:not(:disabled) { ... }
.ds-component:focus-visible { ... }
.ds-component:disabled { opacity: 0.5; cursor: not-allowed; }

/* prefers-reduced-motion for any animations */
@media (prefers-reduced-motion: reduce) {
  .ds-component__animated-child { animation: none; }
}
```

### Step 4 — Write `{Component}.test.tsx`

Minimum test cases (see [04-components.md](./04-components.md#testing-every-component) for full template):
- [ ] Renders without crashing
- [ ] Correct HTML element rendered
- [ ] `asChild` renders child element (if applicable)
- [ ] Disabled state behavior
- [ ] User interaction (click/keyboard)
- [ ] `axe` no accessibility violations

```bash
# Run tests in watch mode while writing
pnpm --filter @ds/components test:watch
```

### Step 5 — Write `{Component}.stories.tsx`

One story per meaningful state. Use `autodocs` tag:
```tsx
const meta: Meta<typeof Component> = {
  title: 'Components/ComponentName',
  component: Component,
  tags: ['autodocs'],
}
export default meta

export const Default: Story = { args: { ... } }
export const Variant2: Story = { args: { ... } }
// ...
```

Verify in Storybook that:
- [ ] All stories render
- [ ] Controls panel works
- [ ] A11y panel shows no violations
- [ ] Dark mode story looks correct (toggle background in toolbar)

### Step 6 — Create `index.ts`
```ts
export { Component } from './Component'
export type { ComponentProps } from './Component'
```

### Step 7 — Export from `packages/components/src/index.ts`
```ts
export * from './component-name'
```

### Step 8 — Write the docs page
Create `apps/docs/src/pages/components/{component-name}.astro`.

**Before writing the page**, list every named story export from Step 5. Each one needs a corresponding live preview section:

| Storybook story | Docs section | Has `<Gallery client:load />`? |
|-----------------|-------------|-------------------------------|
| `Default`       | Default     | ✅ |
| `WithIcons`     | With icons  | ← must exist, not just a heading + code |
| `Sizes`         | Sizes       | ✅ |

Every docs page must have:
- [ ] One-line description
- [ ] Import snippet
- [ ] **For every Storybook story group: a `<XxxGallery client:load />` live preview** — a section with only a heading + code snippet is not sufficient
- [ ] Code snippet under each preview
- [ ] Props table
- [ ] Accessibility notes

Add the link to the sidebar in `apps/docs/src/layouts/BaseLayout.astro`.

**Parity check before marking done:** Open both Storybook (`:6006`) and the docs page (`:4321`) side by side. Every feature visible in Storybook must have a live preview in the docs. A code-only section is a gap.

### Step 9 — Build and verify
```bash
pnpm --filter @ds/components build
# Check dist/ for index.mjs, index.js, index.css
```

Then reload the docs site and verify the new component page renders.

---

## Adding a New Token

1. Open `packages/tokens/src/tokens.json`
2. Add the value in the correct section (primitive or semantic)
3. Rebuild:
   ```bash
   pnpm --filter @ds/tokens build
   pnpm --filter @ds/components build  # if components use the new token
   ```
4. The new CSS variable is now available everywhere

**Renaming a token:** Search the entire codebase for the old CSS variable name before renaming:
```bash
grep -r "var(--color-old-name)" .
```
Update every reference. CSS variables fail silently — no build error when a variable is missing.

---

## CI/CD Pipeline

### On every PR and push to `main`

`.github/workflows/ci.yml` runs:
1. `pnpm install --frozen-lockfile` — fail if lockfile is stale
2. `pnpm turbo build --filter='./packages/*'` — build all packages
3. `pnpm turbo lint` — ESLint across all packages
4. `pnpm turbo typecheck` — TypeScript `--noEmit`
5. `pnpm turbo test` — Vitest (unit + a11y)
6. Upload coverage artifact

`.github/workflows/chromatic.yml` runs in parallel:
1. Build packages
2. Build Storybook
3. Upload to Chromatic for visual diffing

### On merge to `main`

`.github/workflows/release.yml` runs:
1. All CI checks must have passed (branch protection required)
2. Changesets Action checks for `.changeset/*.md` files
3. **If changesets exist:** Creates a "Version Packages" PR
4. **If the version PR is merged:** Publishes to npm with `pnpm release`

---

## Release Process (Changesets)

### Day-to-day (when making a change)

```bash
# After making your code changes:
pnpm changeset

# Interactive prompt:
# 1. Select which packages changed (space to select, enter to confirm)
# 2. Choose bump type: major / minor / patch
# 3. Write a description (this becomes the changelog entry)

# Commit the generated .changeset/random-name.md alongside your code
git add .changeset/random-name.md
git commit -m "feat: add Badge component"
```

### What happens automatically

When the PR merges:
1. GitHub Actions sees the `.changeset/*.md` file
2. Creates a PR titled "chore: release packages" that bumps version numbers
3. When that PR merges, it publishes to npm

### Package access

All published packages use `"access": "public"` in `.changeset/config.json`. This is required for scoped packages (`@ds/*`) to be publicly installable on npm.

---

## How to Add a New Doc Page

1. Create `apps/docs/src/pages/{section}/{page-name}.astro`
2. Use `BaseLayout` for the shell:
   ```astro
   ---
   import BaseLayout from '../../layouts/BaseLayout.astro'
   ---
   <BaseLayout title="Page Title">
     <div class="prose">
       <!-- content -->
     </div>
   </BaseLayout>
   ```
3. Add the link to `apps/docs/src/layouts/BaseLayout.astro` sidebar nav
4. If importing `tokens.json`, count the `../` carefully — the path is relative to the `.astro` file's location, not the project root

---

## Storybook Glob Path Reference

The stories array in `apps/storybook/.storybook/main.ts` is relative to the `.storybook/` directory:

```
apps/storybook/.storybook/   ← you are here
  ↓ ../                       → apps/storybook/
  ↓ ../../                    → apps/
  ↓ ../../../                 → monorepo root
  ↓ ../../../packages/components/src/  → component source
```

So the correct glob is:
```ts
stories: ['../../../packages/components/src/**/*.stories.{ts,tsx}']
//         ↑ three levels up from .storybook/
```

Also: use `{ts,tsx}` not `@(ts|tsx)` — the extglob syntax is not supported in Storybook's glob handling.
