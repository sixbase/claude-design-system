import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './StockIndicator.css';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface StockIndicatorProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Stock status. */
  status?: StockStatus;
  /** Custom label. Defaults to a label based on status. */
  label?: string;
}

const defaultLabels: Record<StockStatus, string> = {
  'in-stock': 'In stock and ready to ship',
  'low-stock': 'Low stock — order soon',
  'out-of-stock': 'Out of stock',
};

const statusColors: Record<StockStatus, string> = {
  'in-stock': '#22c55e',
  'low-stock': '#f59e0b',
  'out-of-stock': '#ef4444',
};

export const StockIndicator = forwardRef<HTMLParagraphElement, StockIndicatorProps>(
  function StockIndicator(
    { status = 'in-stock', label, className, ...props },
    ref,
  ) {
    const text = label ?? defaultLabels[status];
    const animate = status !== 'out-of-stock';

    return (
      <p
        ref={ref}
        className={[
          'ds-stock-indicator',
          `ds-stock-indicator--${status}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <span
          className={[
            'ds-stock-indicator__dot',
            animate && 'ds-stock-indicator__dot--pulse',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ backgroundColor: statusColors[status] }}
        />
        {text}
      </p>
    );
  },
);
StockIndicator.displayName = 'StockIndicator';
