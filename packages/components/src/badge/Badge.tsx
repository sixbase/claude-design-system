import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
}

/**
 * Badge
 *
 * A small label for status, categories, and product metadata.
 * Common uses: "New", "Sale", "Out of stock", "Free shipping", order status.
 *
 * @example
 * <Badge variant="success">In stock</Badge>
 * <Badge variant="destructive">Out of stock</Badge>
 * <Badge variant="secondary">Sale</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', size = 'md', className, children, ...props },
  ref,
) {
  const classes = [
    'ds-badge',
    `ds-badge--${variant}`,
    `ds-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
