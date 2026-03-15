---
name: dskit
description: |
  Design system audit tool. Point it at any URL to extract design tokens
  (colors, typography, spacing, shadows, radii), identify inconsistencies,
  and generate client-ready markdown reports. Use before starting any design
  system project to inventory what a client currently has.
allowed-tools:
  - Bash
---

# dskit — Design System Audit

## Setup (run once before first use)

```bash
_DSKIT=~/dskit/dist/dskit
if [ ! -x "$_DSKIT" ]; then
  echo "NEEDS_SETUP"
else
  echo "READY: $_DSKIT"
fi
```

If `NEEDS_SETUP`: run `cd ~/dskit && ./setup`

## Commands

```bash
D=~/dskit/dist/dskit

# Full audit with health check
$D audit <url>

# Generate markdown client report (saves to file)
$D report <url> --output=<filename>.md

# Extract specific token types
$D colors <url>
$D typography <url>
$D spacing <url>

# All tokens as JSON
$D tokens <url>

# Compare two sites side by side
$D compare <url1> <url2>
```

## When to use each command

- **audit** — start here for any new client. Shows token counts and flags design inconsistencies.
- **report** — generates a markdown file you can send to a client or use in a proposal.
- **compare** — benchmark a client's site against a reference (e.g. their competitor, or a well-designed site in their category).
- **tokens --json** — pipe to a file when you want raw data to work with later.
- **colors / typography / spacing** — when you only need one category quickly.

## Example workflow for a new client

```bash
D=~/dskit/dist/dskit

# 1. Full audit first
$D audit https://client.com

# 2. Compare against a well-designed competitor
$D compare https://client.com https://competitor.com

# 3. Generate the report for the proposal
$D report https://client.com --output=client-name-audit.md
```

## Reading the output

- ✓ green  — within healthy range for a design system
- ⚠ yellow — needs consolidation before or during design system work
- ℹ blue   — informational, worth noting

### Healthy ranges (what to aim for)

| Token       | Healthy range |
|-------------|---------------|
| Colors      | 15-25         |
| Font families | 1-2         |
| Font sizes  | 6-9           |
| Spacing values | 8-12       |
| Border radii | 3-5          |
