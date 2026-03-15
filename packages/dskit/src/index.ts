/**
 * dskit — Design System Audit CLI
 *
 * Spirit: same as gstack/browse — fast, headless, used by Claude Code.
 * Point it at any URL and get the design token inventory.
 *
 * Commands:
 *   audit      <url>          Full audit with issues flagged
 *   tokens     <url>          All tokens as JSON
 *   colors     <url>          Color palette only
 *   typography <url>          Type system only
 *   spacing    <url>          Spacing values only
 *   report     <url>          Save a markdown client report
 *   compare    <url1> <url2>  Compare two sites for consistency
 */

import { chromium } from 'playwright';
import * as fs from 'fs';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tokens {
  colors: string[];
  fontFamilies: string[];
  fontSizes: string[];
  fontWeights: string[];
  lineHeights: string[];
  borderRadius: string[];
  boxShadows: string[];
  spacing: string[];
}

interface Issue {
  level: 'ok' | 'warning' | 'info';
  message: string;
}

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];
const url = args[1];
const url2 = args[2]; // for compare command
const outputFlag = args.find(a => a.startsWith('--output='))?.split('=')[1];
const jsonFlag = args.includes('--json');

if (!command || (command !== 'help' && !url)) {
  printHelp();
  process.exit(0);
}

// ─── Token extraction (runs inside the browser) ───────────────────────────────

async function extract(page: import('playwright').Page): Promise<Tokens> {
  return page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const colors: Set<string> = new Set();
    const fontFamilies: Set<string> = new Set();
    const fontSizes: Set<string> = new Set();
    const fontWeights: Set<string> = new Set();
    const lineHeights: Set<string> = new Set();
    const borderRadius: Set<string> = new Set();
    const boxShadows: Set<string> = new Set();
    const spacing: Set<string> = new Set();

    const TRANSPARENT = 'rgba(0, 0, 0, 0)';
    const SKIP = new Set(['transparent', 'none', 'normal', 'inherit', 'initial', 'unset', 'auto', '']);

    function rgbToHex(rgb: string): string | null {
      const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      const r = parseInt(m[1]);
      const g = parseInt(m[2]);
      const b = parseInt(m[3]);
      return '#' + [r, g, b].map((x: number) => x.toString(16).padStart(2, '0')).join('');
    }

    els.forEach((el: Element) => {
      try {
        const s = window.getComputedStyle(el);

        // Colors — check all color-producing properties
        ['color', 'background-color', 'border-top-color', 'border-right-color',
          'border-bottom-color', 'border-left-color', 'outline-color'].forEach((p: string) => {
          const v = s.getPropertyValue(p);
          if (v && v !== TRANSPARENT && !SKIP.has(v)) {
            const hex = rgbToHex(v);
            if (hex) colors.add(hex);
          }
        });

        // Typography
        const ff = s.fontFamily?.split(',')[0]?.trim()?.replace(/['"]/g, '');
        if (ff && ff.length > 0 && !SKIP.has(ff)) fontFamilies.add(ff);

        const fSize = s.fontSize;
        if (fSize && fSize !== '0px' && !SKIP.has(fSize)) fontSizes.add(fSize);

        const fw = s.fontWeight;
        if (fw && !SKIP.has(fw)) fontWeights.add(fw);

        const lh = s.lineHeight;
        if (lh && lh !== '0px' && !SKIP.has(lh)) lineHeights.add(lh);

        // Shape
        const br = s.borderRadius;
        if (br && br !== '0px' && !SKIP.has(br)) borderRadius.add(br);

        // Shadow
        const bs = s.boxShadow;
        if (bs && !SKIP.has(bs)) boxShadows.add(bs);

        // Spacing — sample margins, paddings, gaps
        ['padding-top', 'padding-right', 'padding-bottom', 'padding-left',
          'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
          'gap', 'row-gap', 'column-gap'].forEach((p: string) => {
          const v = s.getPropertyValue(p);
          if (v && v !== '0px' && v.endsWith('px') && !SKIP.has(v)) {
            spacing.add(v);
          }
        });
      } catch (_) { /* skip elements that throw */ }
    });

    return {
      colors: Array.from(colors),
      fontFamilies: Array.from(fontFamilies),
      fontSizes: Array.from(fontSizes),
      fontWeights: Array.from(fontWeights),
      lineHeights: Array.from(lineHeights),
      borderRadius: Array.from(borderRadius),
      boxShadows: Array.from(boxShadows),
      spacing: Array.from(spacing),
    };
  });
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

function analyze(tokens: Tokens): Issue[] {
  const issues: Issue[] = [];
  const unique = (arr: string[]) => new Set(arr).size;

  const colorCount = unique(tokens.colors);
  if (colorCount > 40)
    issues.push({ level: 'warning', message: `${colorCount} unique colors — consolidate to 15-25 for a cohesive system` });
  else if (colorCount > 25)
    issues.push({ level: 'info', message: `${colorCount} colors — slightly high, review for duplicates` });
  else
    issues.push({ level: 'ok', message: `${colorCount} colors — within healthy range` });

  const familyCount = unique(tokens.fontFamilies);
  if (familyCount > 3)
    issues.push({ level: 'warning', message: `${familyCount} font families — recommend 1-2 max` });
  else
    issues.push({ level: 'ok', message: `${familyCount} font ${familyCount === 1 ? 'family' : 'families'} — clean` });

  const sizeCount = unique(tokens.fontSizes);
  if (sizeCount > 12)
    issues.push({ level: 'warning', message: `${sizeCount} font sizes — recommend 6-9 steps for a clear type scale` });
  else if (sizeCount >= 5)
    issues.push({ level: 'ok', message: `${sizeCount} font sizes — good type scale` });
  else
    issues.push({ level: 'info', message: `${sizeCount} font sizes — may need more typographic hierarchy` });

  const spacingCount = unique(tokens.spacing);
  if (spacingCount > 20)
    issues.push({ level: 'warning', message: `${spacingCount} spacing values — no clear grid, consider standardizing on 4px or 8px base` });
  else if (spacingCount > 12)
    issues.push({ level: 'info', message: `${spacingCount} spacing values — slightly fragmented` });
  else
    issues.push({ level: 'ok', message: `${spacingCount} spacing values — manageable` });

  const radiusCount = unique(tokens.borderRadius);
  if (radiusCount > 8)
    issues.push({ level: 'info', message: `${radiusCount} border radius values — consider standardizing to 3-5` });
  else
    issues.push({ level: 'ok', message: `${radiusCount} border radius values — consistent` });

  return issues;
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function sortPx(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => parseFloat(a) - parseFloat(b));
}

function dedup(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function section(title: string) {
  console.log(`\n${C.bold}${C.cyan}${title}${C.reset}`);
  console.log(C.gray + '─'.repeat(title.length) + C.reset);
}

function issueIcon(level: Issue['level']) {
  if (level === 'warning') return `${C.yellow}⚠${C.reset}`;
  if (level === 'ok') return `${C.green}✓${C.reset}`;
  return `${C.blue}ℹ${C.reset}`;
}

// ─── Output modes ─────────────────────────────────────────────────────────────

function printAudit(tokens: Tokens, targetUrl: string) {
  const issues = analyze(tokens);
  const warnings = issues.filter(i => i.level === 'warning').length;

  console.log(`\n${C.bold}DESIGN AUDIT${C.reset}  ${C.gray}${targetUrl}${C.reset}`);
  console.log(C.gray + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + C.reset);

  section('HEALTH CHECK');
  issues.forEach(i => console.log(`  ${issueIcon(i.level)}  ${i.message}`));

  if (warnings > 0) {
    console.log(`\n  ${C.yellow}${warnings} issue${warnings > 1 ? 's' : ''} to address before design system handoff${C.reset}`);
  } else {
    console.log(`\n  ${C.green}No critical issues — healthy foundation for a design system${C.reset}`);
  }

  section('COLORS');
  const uniqueColors = [...new Set(tokens.colors)];
  console.log(`  ${uniqueColors.length} unique values`);
  uniqueColors.slice(0, 24).forEach(c => console.log(`  ${c}`));
  if (uniqueColors.length > 24) console.log(`  ${C.gray}...and ${uniqueColors.length - 24} more${C.reset}`);

  section('TYPOGRAPHY');
  console.log(`  Families  (${new Set(tokens.fontFamilies).size}):  ${dedup(tokens.fontFamilies).join(', ')}`);
  console.log(`  Sizes     (${new Set(tokens.fontSizes).size}):  ${sortPx(tokens.fontSizes).join('  ')}`);
  console.log(`  Weights   (${new Set(tokens.fontWeights).size}):  ${dedup(tokens.fontWeights).join(', ')}`);
  console.log(`  Leading   (${new Set(tokens.lineHeights).size}):  ${sortPx(tokens.lineHeights).slice(0, 10).join('  ')}`);

  section('SPACING');
  const sp = sortPx(tokens.spacing);
  console.log(`  ${sp.length} values:  ${sp.slice(0, 16).join('  ')}${sp.length > 16 ? ' ...' : ''}`);

  section('BORDER RADIUS');
  const radii = sortPx(tokens.borderRadius);
  if (radii.length > 0)
    console.log(`  ${radii.length} values:  ${radii.join('  ')}`);
  else
    console.log(`  None`);

  if (tokens.boxShadows.length > 0) {
    section('SHADOWS');
    console.log(`  ${tokens.boxShadows.length} unique shadow${tokens.boxShadows.length > 1 ? 's' : ''}`);
    tokens.boxShadows.slice(0, 5).forEach(s => console.log(`  ${s.substring(0, 80)}${s.length > 80 ? '...' : ''}`));
  }

  console.log('');
}

function generateMarkdownReport(tokens: Tokens, targetUrl: string): string {
  const issues = analyze(tokens);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const warnings = issues.filter(i => i.level === 'warning').length;
  const uniqueColors = [...new Set(tokens.colors)];

  return `# Design Audit: ${targetUrl}

*Generated by dskit — ${date}*

---

## Health Check

${issues.map(i => {
    const icon = i.level === 'warning' ? '⚠️' : i.level === 'ok' ? '✅' : 'ℹ️';
    return `- ${icon} ${i.message}`;
  }).join('\n')}

**${warnings} issue${warnings !== 1 ? 's' : ''} found.** ${warnings === 0 ? 'Good foundation for a design system.' : 'These should be resolved before or during design system creation.'}

---

## Colors (${uniqueColors.length} found)

${uniqueColors.map(c => `- \`${c}\``).join('\n')}

> **Recommendation:** Organize into a structured palette — neutrals (5-7 steps), brand primary, brand secondary, and semantic colors (success, warning, error, info). Target 15-25 total tokens.

---

## Typography

### Font Families (${new Set(tokens.fontFamilies).size})
${dedup(tokens.fontFamilies).map(f => `- ${f}`).join('\n')}

### Font Sizes (${new Set(tokens.fontSizes).size})
${sortPx(tokens.fontSizes).map(s => `- \`${s}\``).join('\n')}

### Font Weights (${new Set(tokens.fontWeights).size})
${dedup(tokens.fontWeights).map(w => `- \`${w}\``).join('\n')}

### Line Heights (${new Set(tokens.lineHeights).size})
${sortPx(tokens.lineHeights).slice(0, 12).map(l => `- \`${l}\``).join('\n')}

> **Recommendation:** Define a type scale of 6-9 sizes on a consistent ratio (e.g. Major Third: 1.25). Limit to 2 font families max.

---

## Spacing (${new Set(tokens.spacing).size} values)

${sortPx(tokens.spacing).map(s => `- \`${s}\``).join('\n')}

> **Recommendation:** Establish a spacing system based on a 4px or 8px base unit. Common scales: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

---

## Border Radius (${new Set(tokens.borderRadius).size} values)

${sortPx(tokens.borderRadius).length > 0
    ? sortPx(tokens.borderRadius).map(r => `- \`${r}\``).join('\n')
    : '*None found*'}

> **Recommendation:** Define 3-5 radius tokens: none (0), sm, md, lg, full.

---

## Shadows (${tokens.boxShadows.length} found)

${tokens.boxShadows.length > 0
    ? tokens.boxShadows.map(s => `- \`${s}\``).join('\n')
    : '*None found*'}

---

## Recommended Next Steps

1. **Color:** Consolidate ${uniqueColors.length} colors into a structured palette of 15-25 tokens
2. **Typography:** Define a type scale with ${new Set(tokens.fontSizes).size > 9 ? 'fewer' : 'these'} sizes and consistent hierarchy
3. **Spacing:** Standardize on a base-8 spacing grid
4. **Components:** Begin with atoms (Button, Input, Typography) using the cleaned token system
5. **Documentation:** Define token naming convention (e.g. \`color.brand.primary.500\`)

---

*Audit generated by dskit — [uikit.com](https://uikit.com)*
`;
}

function printCompare(t1: Tokens, t2: Tokens, u1: string, u2: string) {
  const unique = (arr: string[]) => new Set(arr).size;

  console.log(`\n${C.bold}DESIGN COMPARISON${C.reset}`);
  console.log(`  ${C.cyan}A${C.reset} ${u1}`);
  console.log(`  ${C.cyan}B${C.reset} ${u2}\n`);

  const rows = [
    ['Colors', unique(t1.colors), unique(t2.colors)],
    ['Font families', unique(t1.fontFamilies), unique(t2.fontFamilies)],
    ['Font sizes', unique(t1.fontSizes), unique(t2.fontSizes)],
    ['Font weights', unique(t1.fontWeights), unique(t2.fontWeights)],
    ['Spacing values', unique(t1.spacing), unique(t2.spacing)],
    ['Border radii', unique(t1.borderRadius), unique(t2.borderRadius)],
    ['Shadows', t1.boxShadows.length, t2.boxShadows.length],
  ] as [string, number, number][];

  const colA = `${C.cyan}A${C.reset}`;
  const colB = `${C.cyan}B${C.reset}`;
  console.log(`  ${'TOKEN'.padEnd(20)} ${colA.padEnd(14)} ${colB}`);
  console.log(`  ${'─'.repeat(40)}`);

  rows.forEach(([label, a, b]) => {
    const diff = a > b ? `${C.yellow}A has more${C.reset}` : a < b ? `${C.yellow}B has more${C.reset}` : `${C.green}same${C.reset}`;
    console.log(`  ${label.padEnd(20)} ${String(a).padEnd(6)} ${String(b).padEnd(6)} ${diff}`);
  });
  console.log('');
}

function printHelp() {
  console.log(`
${C.bold}dskit${C.reset} — Design System Audit CLI

${C.cyan}Usage:${C.reset}
  dskit <command> <url> [options]

${C.cyan}Commands:${C.reset}
  audit      <url>          Full audit with health check and all tokens
  tokens     <url>          All tokens as JSON (pipe to file or jq)
  colors     <url>          Color palette only
  typography <url>          Type system only
  spacing    <url>          Spacing values only
  report     <url>          Save a markdown client report
  compare    <url1> <url2>  Side-by-side token count comparison

${C.cyan}Options:${C.reset}
  --output=<file>    Save report to specific file (default: audit-YYYY-MM-DD.md)
  --json             Output raw JSON (works with audit, colors, typography)

${C.cyan}Examples:${C.reset}
  dskit audit https://stripe.com
  dskit report https://client.com --output=client-audit.md
  dskit compare https://stripe.com https://linear.app
  dskit tokens https://vercel.com --json
  dskit colors https://airbnb.com
`);
}

// ─── Browser runner ───────────────────────────────────────────────────────────

async function withPage(targetUrl: string, fn: (page: import('playwright').Page) => Promise<void>) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    process.stderr.write(`\x1b[90mLoading ${targetUrl}...\x1b[0m\n`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(800); // let lazy/dynamic content settle
    await fn(page);
  } finally {
    await browser.close();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  switch (command) {
    case 'help':
      printHelp();
      break;

    case 'audit':
      await withPage(url, async page => {
        const tokens = await extract(page);
        if (jsonFlag) {
          console.log(JSON.stringify({ url, tokens, issues: analyze(tokens) }, null, 2));
        } else {
          printAudit(tokens, url);
        }
      });
      break;

    case 'tokens':
      await withPage(url, async page => {
        const tokens = await extract(page);
        console.log(JSON.stringify(tokens, null, 2));
      });
      break;

    case 'colors':
      await withPage(url, async page => {
        const tokens = await extract(page);
        const colors = [...new Set(tokens.colors)].sort();
        if (jsonFlag) {
          console.log(JSON.stringify(colors, null, 2));
        } else {
          console.log(`\n${C.bold}COLORS${C.reset}  ${C.gray}${url}${C.reset}`);
          console.log(`${colors.length} unique values\n`);
          colors.forEach(c => console.log(`  ${c}`));
          console.log('');
        }
      });
      break;

    case 'typography':
      await withPage(url, async page => {
        const tokens = await extract(page);
        if (jsonFlag) {
          console.log(JSON.stringify({
            fontFamilies: dedup(tokens.fontFamilies),
            fontSizes: sortPx(tokens.fontSizes),
            fontWeights: dedup(tokens.fontWeights),
            lineHeights: sortPx(tokens.lineHeights),
          }, null, 2));
        } else {
          console.log(`\n${C.bold}TYPOGRAPHY${C.reset}  ${C.gray}${url}${C.reset}\n`);
          console.log(`  Families  (${new Set(tokens.fontFamilies).size}):  ${dedup(tokens.fontFamilies).join(', ')}`);
          console.log(`  Sizes     (${new Set(tokens.fontSizes).size}):  ${sortPx(tokens.fontSizes).join('  ')}`);
          console.log(`  Weights   (${new Set(tokens.fontWeights).size}):  ${dedup(tokens.fontWeights).join(', ')}`);
          console.log(`  Leading   (${new Set(tokens.lineHeights).size}):  ${sortPx(tokens.lineHeights).slice(0, 12).join('  ')}`);
          console.log('');
        }
      });
      break;

    case 'spacing':
      await withPage(url, async page => {
        const tokens = await extract(page);
        const sp = sortPx(tokens.spacing);
        if (jsonFlag) {
          console.log(JSON.stringify(sp, null, 2));
        } else {
          console.log(`\n${C.bold}SPACING${C.reset}  ${C.gray}${url}${C.reset}`);
          console.log(`${sp.length} unique values\n`);
          sp.forEach(s => console.log(`  ${s}`));
          console.log('');
        }
      });
      break;

    case 'report':
      await withPage(url, async page => {
        const tokens = await extract(page);
        const report = generateMarkdownReport(tokens, url);
        const filename = outputFlag || `audit-${new Date().toISOString().split('T')[0]}.md`;
        fs.writeFileSync(filename, report);
        console.log(`${C.green}✓ Report saved: ${filename}${C.reset}`);
        console.log(report);
      });
      break;

    case 'compare':
      if (!url2) {
        console.error('compare requires two URLs: dskit compare <url1> <url2>');
        process.exit(1);
      }
      const browser = await chromium.launch({ headless: true });
      try {
        process.stderr.write(`\x1b[90mLoading ${url}...\x1b[0m\n`);
        const page1 = await browser.newPage();
        await page1.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page1.waitForTimeout(800);
        const t1 = await extract(page1);

        process.stderr.write(`\x1b[90mLoading ${url2}...\x1b[0m\n`);
        const page2 = await browser.newPage();
        await page2.goto(url2, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page2.waitForTimeout(800);
        const t2 = await extract(page2);

        if (jsonFlag) {
          console.log(JSON.stringify({ a: { url, tokens: t1 }, b: { url: url2, tokens: t2 } }, null, 2));
        } else {
          printCompare(t1, t2, url, url2);
        }
      } finally {
        await browser.close();
      }
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch(e => {
  console.error(`${C.red}Error: ${e.message}${C.reset}`);
  process.exit(1);
});
