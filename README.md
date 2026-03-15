# Design System

A production-grade, token-driven React design system. Built with the same infrastructure used by large product teams — typed tokens, accessible primitives, visual regression testing, and a living documentation site.

## Monorepo structure

```
├── apps/
│   ├── docs/         # Astro docs site (public-facing)
│   └── storybook/    # Component dev + Chromatic visual testing
├── packages/
│   ├── tokens/       # @ds/tokens — design tokens
│   ├── primitives/   # @ds/primitives — Radix UI wrappers
│   └── components/   # @ds/components — styled components
└── tooling/
    ├── eslint/       # shared ESLint config
    ├── typescript/   # shared tsconfig
    └── vitest/       # shared vitest config
```

## Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9 (`npm i -g pnpm`)

## Setup

```bash
pnpm install
pnpm turbo build --filter='./packages/*'
```

## Development

```bash
# Component dev (Storybook)
pnpm --filter @ds/storybook dev

# Docs site
pnpm --filter @ds/docs dev

# Watch all packages
pnpm turbo dev
```

## Quality checks

```bash
pnpm turbo lint        # ESLint
pnpm turbo typecheck   # TypeScript
pnpm turbo test        # Vitest
```

## Packages

### `@ds/tokens`

Design tokens in three formats:

```ts
import '@ds/tokens/css';              // CSS variables — import in app entry
import tokens from '@ds/tokens/json'; // Raw JSON — for tooling
import { colorPrimitive } from '@ds/tokens'; // TypeScript constants
```

### `@ds/components`

```ts
import { Button, Input, Heading, Text, Caption, Code } from '@ds/components';
import '@ds/components/styles'; // Required CSS
```

## Versioning

This repo uses [Changesets](https://github.com/changesets/changesets).

```bash
# Create a changeset for your changes
pnpm changeset

# Apply versions (done by CI automatically)
pnpm version
```

## CI/CD

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Every PR + push to main | Lint, typecheck, test |
| `chromatic.yml` | Every PR + push to main | Visual regression diff |
| `release.yml` | Push to main | Version bumps + npm publish |

## Adding a new component

1. Create `packages/components/src/<name>/` with `Component.tsx`, `Component.css`, `Component.test.tsx`, `Component.stories.tsx`, `index.ts`
2. Export from `packages/components/src/index.ts`
3. Add a docs page at `apps/docs/src/pages/components/<name>.astro`
4. Run `pnpm changeset` to record the addition

## Secrets required

| Secret | Where to add | Purpose |
|---|---|---|
| `CHROMATIC_PROJECT_TOKEN` | GitHub repo → Settings → Secrets | Visual regression |
| `NPM_TOKEN` | GitHub repo → Settings → Secrets | Publishing to npm |
