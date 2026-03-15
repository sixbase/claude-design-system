import { forwardRef, useCallback } from 'react';
import type { HTMLAttributes } from 'react';
import './QuantitySelector.css';

export interface QuantitySelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (controlled) */
  value: number;
  /** Called when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
}

export const QuantitySelector = forwardRef<HTMLDivElement, QuantitySelectorProps>(
  function QuantitySelector(
    {
      value,
      onChange,
      min = 1,
      max = 99,
      step = 1,
      size = 'md',
      disabled = false,
      className,
      'aria-label': ariaLabel = 'Quantity',
      ...props
    },
    ref,
  ) {
    const decrement = useCallback(() => {
      const next = Math.max(min, value - step);
      if (next !== value) onChange(next);
    }, [value, min, step, onChange]);

    const increment = useCallback(() => {
      const next = Math.min(max, value + step);
      if (next !== value) onChange(next);
    }, [value, max, step, onChange]);

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={[
          'ds-quantity-selector',
          `ds-quantity-selector--${size}`,
          disabled && 'ds-quantity-selector--disabled',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <button
          type="button"
          className="ds-quantity-selector__btn"
          aria-label="Decrease quantity"
          onClick={decrement}
          disabled={disabled || value <= min}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <output className="ds-quantity-selector__value">{value}</output>
        <button
          type="button"
          className="ds-quantity-selector__btn"
          aria-label="Increase quantity"
          onClick={increment}
          disabled={disabled || value >= max}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  },
);
QuantitySelector.displayName = 'QuantitySelector';
