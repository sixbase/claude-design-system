import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Divider.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'default' | 'subtle';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Visual style variant */
  variant?: DividerVariant;
  /** Spacing above/below (horizontal) or left/right (vertical) */
  spacing?: DividerSpacing;
}

/**
 * Divider
 *
 * A visual separator between content sections. Renders as `<hr>` for
 * horizontal orientation and `<div role="separator">` for vertical.
 *
 * @example
 * <Divider />
 * <Divider variant="subtle" spacing="lg" />
 * <Divider orientation="vertical" />
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  {
    orientation = 'horizontal',
    variant = 'default',
    spacing = 'md',
    className,
    ...props
  },
  ref,
) {
  const classes = [
    'ds-divider',
    `ds-divider--${orientation}`,
    `ds-divider--${variant}`,
    `ds-divider--spacing-${spacing}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (orientation === 'vertical') {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="separator"
        aria-orientation="vertical"
        className={classes}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      />
    );
  }

  return (
    <hr
      ref={ref}
      className={classes}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';
