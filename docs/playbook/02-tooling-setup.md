# 02 — Tooling Setup

> Every tool, why it was chosen over alternatives, and the configuration that makes it work.

---

## Package Management: pnpm Workspaces

**Why pnpm over npm/Yarn:**
- **Strict isolation** — packages can only import what they explicitly declare as dependencies. npm/Yarn hoist everything to `node_modules` root, creating "phantom dependencies" that work locally but break in CI or consumer projects.
- **Disk efficiency** — packages are stored once in a content-addressable store and hard-linked. A monorepo with 10 packages sharing React doesn't download React 10 times.
- **Workspace protocol** — `"@ds/tokens": "workspace:*"` in a `package.json` means "use the local version of this package." pnpm handles the symlinking automatically.
- **Speed** — significantly faster installs than npm, comparable to Yarn Berry.

**Configuration:**
```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

**Install command:**
```bash
pnpm install          # install all workspace deps
pnpm install --frozen-lockfile  # CI — fail if lockfile is out of date
```

---

## Build Orchestration: Turborepo

**Why Turborepo over Nx / Lerna / custom scripts:**
- **`^build` syntax** — declare that `@ds/components` build depends on `@ds/tokens` build with one line. Turborepo figures out the order and parallelizes everything else.
- **Content-based caching** — if `@ds/tokens` source files haven't changed, Turborepo restores the build output from cache instead of rebuilding. CI gets dramatically faster after the first run.
- **Zero configuration for common cases** — just declare tasks in `turbo.json`.
- **Nx** was evaluated but felt over-engineered for this scale. **Lerna** is legacy and unmaintained for build orchestration.

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

**Key detail:** `"dependsOn": ["^build"]` means "run the `build` task in all my dependencies first." Without this, you'd get "module not found" errors when `@ds/components` tries to import from `@ds/tokens` before tokens has been built.

---

## Package Bundler: tsup

**Why tsup over Rollup / esbuild directly / tsc:**
- **Dual ESM + CJS output with zero config** — one config file, both formats, correct extensions.
- **CSS bundling** — tsup concatenates all CSS imports into a single `dist/index.css` file. No separate CSS build step needed for components.
- **Source maps, declarations** — all enabled by default.
- **esbuild under the hood** — fast.

**Critical: tsup output extensions**

> This is one of the most common setup mistakes. tsup does NOT output `.cjs` for CommonJS. It outputs `.js`.

| Format | Extension | What `package.json` must say |
|--------|-----------|------------------------------|
| ESM | `.mjs` | `"import": "./dist/index.mjs"` |
| CJS | `.js` | `"require": "./dist/index.js"` |

**Package exports field — ordering matters:**
```json
"exports": {
  ".": {
    "types":   "./dist/index.d.ts",   // ← MUST be first
    "import":  "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}
```
TypeScript resolves conditions in order. If `import` comes before `types`, TypeScript finds the `.mjs` file and can't read it as declarations. **Always put `types` first.**

---

## TypeScript: Strict Shared Config

All packages extend from `tooling/typescript/`:

```json
// tooling/typescript/base.json — for non-React packages
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUncheckedIndexedAccess": true,  // array[0] is T | undefined, not T
    "noImplicitReturns": true,
    "isolatedModules": true,           // required for tsup/esbuild
    "moduleResolution": "bundler"      // modern resolution for ESM
  }
}

// tooling/typescript/react.json — for React packages
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"                 // no React import needed in every file
  }
}
```

**Why `noUncheckedIndexedAccess`:** Accessing `array[0]` without this returns `T`. With it, returns `T | undefined`. This catches a huge class of runtime errors at compile time.

---

## ESLint: Flat Config

Using ESLint 9's flat config format (not the legacy `.eslintrc` format):

```js
// tooling/eslint/index.js
export const react = [
  ...base,  // TypeScript strict-type-checked rules
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,         // catches a11y mistakes at lint time
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...a11yPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',  // not needed with react-jsx transform
    }
  }
]
```

**`eslint-plugin-jsx-a11y`** catches accessibility issues at lint time — missing `alt` attributes, incorrect ARIA roles, label associations. This is a first line of defense before runtime a11y testing.

---

## Primitive Components: Radix UI

**Why Radix over writing primitives from scratch:**
- Keyboard navigation is implemented correctly and tested
- WAI-ARIA patterns are correct by default (focus management, live regions, escape key, etc.)
- Completely unstyled — bring your own CSS
- Used by shadcn/ui, which is used by thousands of production apps. Battle-tested.

**Key Radix packages used:**
- `@radix-ui/react-slot` — the `Slot` component for the `asChild` pattern
- `@radix-ui/react-label` — accessible label element with correct `for` association
- `@radix-ui/react-visually-hidden` — screen-reader-only content

**The Slot / asChild pattern:**
```tsx
import { Slot } from '@radix-ui/react-slot'

// Inside Button component:
const Comp = asChild ? Slot : 'button'
return <Comp {...props}>{children}</Comp>
```
This lets consumers render a Button as any element: `<Button asChild><a href="/cart">...</a></Button>`. The Button's styles and accessibility attributes are applied to the `<a>` tag, not wrapped in a `<button>`.

---

## Storybook 8

**Role:** Internal development tool and Chromatic integration point. NOT the public documentation site.

**Why Storybook over alternatives:**
- Histoire and Ladle were evaluated — smaller ecosystems, fewer addons, less Chromatic support
- Storybook 8 with `@storybook/react-vite` is fast (Vite HMR)
- `@storybook/addon-a11y` runs axe-core in the Storybook panel — visual a11y feedback during development
- Chromatic is purpose-built for Storybook

**Configuration files:**
```
apps/storybook/.storybook/
├── main.ts     — stories glob, addons, framework
└── preview.ts  — global CSS imports, decorators, addon config
```

**Critical: stories glob path is relative to `.storybook/`, not the package root:**
```ts
// apps/storybook/.storybook/main.ts
stories: [
  '../../../packages/components/src/**/*.stories.{ts,tsx}'
  // ↑ relative to .storybook/ dir, NOT apps/storybook/
]
```

**Also critical: use `{ts,tsx}` not `@(ts|tsx)` — the latter isn't supported.**

---

## Astro 4 (Docs Site)

**Role:** Public-facing documentation site. Consumers read this.

**Why Astro over Next.js / Docusaurus / VitePress:**
- **Island architecture** — most pages are static HTML; React components only hydrate where needed. Docs sites don't need full React runtime on every page.
- **MDX support** — write documentation in Markdown with embedded React components
- **Static output** — `output: 'static'` generates pure HTML/CSS/JS, deployable to any CDN
- **Docusaurus** was considered but requires more opinionated structure for non-blog content
- **VitePress** is Vue-focused; React islands are awkward

**Key configuration:**
```js
// apps/docs/astro.config.mjs
export default defineConfig({
  integrations: [react(), mdx()],
  output: 'static',
})
```

**JSON import path gotcha:** Astro resolves imports relative to the `.astro` file's location, not the project root. A page deep in `apps/docs/src/pages/tokens/` needs many `../` to reach `packages/`:
```astro
---
// In apps/docs/src/pages/tokens/colors.astro
import tokens from '../../../../../packages/tokens/src/tokens.json'
//               ↑ this many levels up to get to monorepo root
---
```

---

## Vitest

**Why Vitest over Jest:**
- Vite-native — uses the same transform pipeline as the dev server. No separate Babel config.
- Same API as Jest — zero learning curve for Jest users
- Faster — especially in watch mode

**Shared config factory:**
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

Each package that needs tests creates a `vitest.config.ts` that calls this factory — no duplicated configuration.

---

## Chromatic

**Role:** Visual regression testing. Takes screenshots of every Storybook story on every PR and shows diffs.

**Critical GitHub Actions requirement:**
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # ← Chromatic needs FULL git history for baselines
```
Without `fetch-depth: 0`, Chromatic can't find the baseline commit to diff against and will treat every run as a first build.

**How it works:**
1. PR opens → Chromatic builds Storybook and uploads screenshots
2. If any story looks different → PR gets a "changes detected" status
3. Engineer reviews the diff in Chromatic UI and either accepts or rejects
4. `autoAcceptChanges: main` means merges to main auto-accept (no manual review needed for the main branch itself)

---

## Changesets

**Role:** Versioning and changelog generation for published packages.

**Why Changesets over semantic-release / auto:**
- **Per-package versioning** — `@ds/tokens` can be at `1.2.0` while `@ds/components` is at `0.8.3`
- **PR-based workflow** — engineers add a changeset file alongside their code change, not after
- **Human-readable changelogs** — the changeset description becomes the changelog entry
- **Used by** Radix UI, shadcn/ui, many other design systems — well-proven in this space

**Workflow:**
```bash
pnpm changeset           # interactive prompt: which packages changed? major/minor/patch? describe it
# → creates .changeset/random-name.md

# On merge to main, GitHub Actions runs:
pnpm changeset version   # bumps package.json versions, updates CHANGELOG.md
pnpm changeset publish   # publishes to npm
```

**`.changeset/config.json`:**
```json
{
  "access": "public",
  "baseBranch": "main",
  "ignore": ["@ds/docs", "@ds/storybook"],  // apps are never published
  "updateInternalDependencies": "patch"      // workspace deps auto-bump on patch
}
```

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

Single quotes and trailing commas are the opinionated choices here. These match the style of most large React codebases (React itself, Next.js, etc.).
