import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
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
   * Icon element rendered before the text label.
   *
   * WCAG 1.4.1 — Status badges must not rely on color alone.
   * Pass an icon (or pair with a descriptive text label) so that
   * the badge remains meaningful without color perception.
   *
   * @example
   * <Badge variant="success" icon={<CheckIcon />}>In stock</Badge>
   */
  icon?: ReactNode;
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
 * - Use `icon` prop to satisfy WCAG 1.4.1 (no color-alone reliance)
 * - Use `count` for notification badges (auto aria-label)
 * - Focus ring provided for interactive usage (links, buttons, dismissible)
 *
 * @example
 * <Badge variant="success" icon={<CheckIcon />}>In stock</Badge>
 * <Badge variant="destructive" icon={<XIcon />}>Out of stock</Badge>
 * <Badge variant="secondary">Sale</Badge>
 * <Badge count={3} />
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', size = 'md', icon, count, className, children, role, ...props },
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
      {icon && <span className="ds-badge__icon" aria-hidden="true">{icon}</span>}
      {content}
    </span>
  );
});

Badge.displayName = 'Badge';
