import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './ColorPicker.css';

export interface ColorOption {
  /** CSS color value */
  color: string;
  /** Accessible label for this color (e.g. "Carbon Black") */
  label: string;
  /** Unique value identifier */
  value: string;
}

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Available color options */
  options: ColorOption[];
  /** Currently selected value */
  value?: string;
  /** Called when a color is selected */
  onChange?: (value: string) => void;
  /** Size of the swatches */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ColorPicker
 *
 * A group of selectable color swatches. Used for product option selection
 * such as choosing a case color on a PDP.
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    { options, value, onChange, size = 'md', className, ...props },
    ref,
  ) {
    const classes = [
      'ds-color-picker',
      `ds-color-picker--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        role="radiogroup"
        {...props}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={[
              'ds-color-picker__btn',
              value === option.value && 'ds-color-picker__btn--active',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ backgroundColor: option.color }}
            aria-label={option.label}
            aria-checked={value === option.value}
            role="radio"
            onClick={() => onChange?.(option.value)}
          />
        ))}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';
