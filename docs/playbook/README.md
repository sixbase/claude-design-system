# Design System Playbook

> The instruction manual for building this design system — and the next one.

This playbook captures every decision, dead end, config file, and "oh that's how that works" moment from the build of this design system. It is written for two audiences: the next engineer who inherits this repo, and anyone building an equivalent system from scratch. The goal is to make the second build take a fraction of the time the first one did.

---

## Who This Is For

- Engineers onboarding to this repo who need context fast
- Anyone building a new React design system and wanting a proven starting structure
- Future-you, six months from now, who forgot why we made a particular decision

**Assumed knowledge:** Comfortable with React and TypeScript. Some familiarity with monorepos is helpful but not required.

---

## How to Use This

**First time building a design system:** Read sequentially, 01 through 07. The files are ordered to match the actual build sequence.

**Looking for something specific:** Jump directly to the relevant file using the table of contents below. The decisions log (`06`) and lessons learned (`07`) are especially useful if you're debugging a problem you've seen before.

**Maintaining this repo:** The playbook is a living document. See the [Maintenance Rules](#maintenance-rules) section below for what to update and when.

---

## Tech Stack

| Concern | Tool | Version |
|---------|------|---------|
| Language | TypeScript (strict) | `^5.4.5` |
| UI library | React | `>=18.0.0` |
| Package manager | pnpm workspaces | `9.0.0` |
| Build orchestration | Turborepo | `^2.0.0` |
| Package bundler | tsup | `^8.0.2` |
| Primitive components | Radix UI | various `^1.x` |
| Dev environment | Storybook | `8.x` |
| Public docs | Astro | `^4.x` |
| Unit testing | Vitest + Testing Library | `^1.6.0` |
| Visual regression | Chromatic | via GitHub Actions |
| Versioning | Changesets | `^2.27.1` |
| Linting | ESLint (flat config) + Prettier | `9.x` / `^3.2.5` |

---

## Table of Contents

| File | What It Covers |
|------|----------------|
| [01-planning.md](./01-planning.md) | Goals, scope decisions, v1 vs. deferred, design mandate |
| [02-tooling-setup.md](./02-tooling-setup.md) | Every tool, why it was chosen, alternatives rejected, config snippets |
| [03-tokens.md](./03-tokens.md) | 3-tier token system, naming conventions, dark mode, build pipeline |
| [04-components.md](./04-components.md) | Component architecture, 4-file rule, TypeScript patterns, a11y requirements |
| [05-workflows.md](./05-workflows.md) | New component checklist, dev environment, CI/CD, release process |
| [06-decisions-log.md](./06-decisions-log.md) | Chronological log of every significant decision with rationale |
| [07-lessons-learned.md](./07-lessons-learned.md) | What went well, harder than expected, bugs we hit, recommendations |

---

## Maintenance Rules

Claude is responsible for keeping this playbook current. Whenever work happens on this project:

- **New decision made** → add an entry to `06-decisions-log.md`
- **Bug or gotcha discovered** → add to the gotchas section of `07-lessons-learned.md`
- **New component built** → update the component status table in `01-planning.md`
- **New tool added or removed** → update `02-tooling-setup.md`
- **New section needed** → create it and add a link to this README

The measure of success: someone who has never spoken to us should be able to read this folder and build an equivalent design system in a fraction of the time it took us.

---

## Project Locations (Quick Reference)

```
Monorepo root:    /Users/alvinthong/claude-design-system
Docs site:        http://localhost:4321
Storybook:        http://localhost:6006
Token source:     packages/tokens/src/tokens.json
Component CSS:    packages/components/src/{name}/{Name}.css
Docs pages:       apps/docs/src/pages/
```
