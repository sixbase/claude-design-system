# The Shopify theme moved out 🛍️➡️

The Shopify storefront theme that used to live here (`apps/theme/`) was
extracted into its own repository on 2026-06-25:

**→ https://github.com/sixbase/mason-storefront**

## Why
A Shopify theme deploys cleanest when its files sit at the **repository root**
(Shopify's GitHub integration and the `shopify` CLI both expect that). Buried at
`apps/theme/`, the theme couldn't use Shopify's native auto-deploy. It also
changes at a different cadence than the design system, so it now has its own box.

This **reverses** the earlier decision recorded in
`docs/playbook/06-decisions-log.md` ("Theme location: `apps/theme/` in monorepo").
Those playbook entries (`06-decisions-log.md`, `10-shopify-theme.md`) are now
**historical** — accurate for the monorepo era, superseded by the split.

## The link that remains 🤝
This repo is the **source of truth for design tokens**. The storefront consumes
the built token file (`assets/tokens.css`) as an artifact. Token changes happen
here, then get published into the storefront's `assets/`.

The full theme history was preserved in the new repo via `git subtree split`.
