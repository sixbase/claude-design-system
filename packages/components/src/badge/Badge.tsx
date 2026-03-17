import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
export type BadgeSize = 'sm' | 'md';

/** Variants that convey status and should receive role="status" by default. */
const STATUS_VARIANTS = new Set<BadgeVariant>(['success', 'warning', 'destructive']);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /**
   * Notification count displayed by this badge.
   * When set, the badge automatically renders with role="status"
   * and aria-label="N notifications".
   */
  count?: number;
}

/**
 * Badge
 *
 * A small label for status, categories, and product metadata.
 * Common uses: "New", "Sale", "Out of stock", "Free shipping", order status.
 *
 * Accessibility:
 * - Status variants (success, warning, destructive) auto-apply role="status"
 * - Use `count` for notification badges (auto aria-label)
 * - Focus ring provided for interactive usage (links, buttons, dismissible)
 *
 * @example
 * <Badge variant="success">In stock</Badge>
 * <Badge variant="destructive">Out of stock</Badge>
 * <Badge variant="secondary">Sale</Badge>
 * <Badge count={3} />
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', size = 'md', count, className, children, role, ...props },
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

  // Determine ARIA role: explicit prop takes precedence
  const resolvedRole =
    role ??
    (count != null || STATUS_VARIANTS.has(variant) ? 'status' : undefined);

  // Notification count badge: "3 notifications"
  const ariaLabel =
    props['aria-label'] ??
    (count != null ? `${count} notification${count !== 1 ? 's' : ''}` : undefined);

  const content = count != null ? count : children;

  return (
    <span
      ref={ref}
      className={classes}
      role={resolvedRole}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </span>
  );
});

Badge.displayName = 'Badge';
