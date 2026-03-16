import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Container.css';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max-width constraint. Defaults to 'xl' (1280px). */
  size?: ContainerSize;
  /** Full bleed — removes max-width, keeps responsive padding. */
  fluid?: boolean;
  /** Removes horizontal padding (useful when nesting containers). */
  noPadding?: boolean;
}

/**
 * Container
 *
 * A centered, max-width wrapper with responsive horizontal padding.
 * Extracts the common layout pattern used by Header, Footer, and page layouts.
 *
 * @example
 * <Container>
 *   <Grid cols={2} colsLg={4}>
 *     {items.map(item => <Card key={item.id} />)}
 *   </Grid>
 * </Container>
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'xl', fluid = false, noPadding = false, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        'ds-container',
        size !== 'xl' && `ds-container--${size}`,
        fluid && 'ds-container--fluid',
        noPadding && 'ds-container--no-padding',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
});
Container.displayName = 'Container';
