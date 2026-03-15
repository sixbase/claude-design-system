import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Text } from '../typography/Typography';
import './StockIndicator.css';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface StockIndicatorProps extends HTMLAttributes<HTMLElement> {
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

export const StockIndicator = forwardRef<HTMLElement, StockIndicatorProps>(
  function StockIndicator(
    { status = 'in-stock', label, className, ...props },
    ref,
  ) {
    const text = label ?? defaultLabels[status];
    const animate = status !== 'out-of-stock';

    return (
      <Text
        ref={ref}
        size="sm"
        muted
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
        />
        {text}
      </Text>
    );
  },
);
StockIndicator.displayName = 'StockIndicator';
