import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import './Grid.css';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6;

export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns below sm breakpoint. Default: 1. */
  cols?: GridCols;
  /** Columns at sm (640px+). Default: 2. */
  colsSm?: GridCols;
  /** Columns at md (768px+). Default: 3. */
  colsMd?: GridCols;
  /** Columns at lg (1024px+). Default: 4. */
  colsLg?: GridCols;
  /** Gap spacing token scale (e.g. 4 = --spacing-4 = 16px). Applies to both row and column gap. */
  gap?: GridGap;
}

/**
 * Grid
 *
 * A responsive CSS Grid layout with token-driven gaps.
 * Default columns: 1 → 2 → 3 → 4 across breakpoints.
 * Default gap: spacing-4 (16px), stepping to spacing-6 (24px) at desktop.
 *
 * @example
 * <Grid cols={2} colsMd={3} colsLg={4}>
 *   {products.map(p => <ProductCard key={p.id} fluid {...p} />)}
 * </Grid>
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { cols, colsSm, colsMd, colsLg, gap, className, style, children, ...props },
  ref,
) {
  const cssVars: Record<string, string | number> = {};
  if (cols !== undefined) cssVars['--grid-cols'] = cols;
  if (colsSm !== undefined) cssVars['--grid-cols-sm'] = colsSm;
  if (colsMd !== undefined) cssVars['--grid-cols-md'] = colsMd;
  if (colsLg !== undefined) cssVars['--grid-cols-lg'] = colsLg;
  if (gap !== undefined) cssVars['--grid-gap'] = `var(--spacing-${gap})`;

  return (
    <div
      ref={ref}
      className={['ds-grid', className].filter(Boolean).join(' ')}
      style={{ ...style, ...cssVars } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});
Grid.displayName = 'Grid';
