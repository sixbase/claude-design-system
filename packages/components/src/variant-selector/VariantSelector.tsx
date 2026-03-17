import { forwardRef, useCallback } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';
import { Heading } from '../typography';
import { ColorPicker } from '../color-picker';
import type { ColorOption } from '../color-picker';
import './VariantSelector.css';

// ─── Types ──────────────────────────────────────────────────

export interface VariantOptionValue {
  /** Display label — e.g. "Midnight Blue", "XL", "Leather" */
  label: string;
  /** Shopify variant value identifier */
  value: string;
  /** Hex color for type: 'color' options */
  colorHex?: string;
  /** Out of stock but still browsable (Shopify convention) */
  available?: boolean;
  /** Completely unavailable — not clickable */
  disabled?: boolean;
}

export interface VariantOption {
  /** Option name — e.g. "Color", "Size", "Material" */
  name: string;
  /** Rendering strategy: 'color' uses ColorPicker swatches, 'button' uses text buttons */
  type: 'color' | 'button';
  /** Available values for this option */
  values: VariantOptionValue[];
}

export interface VariantSelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Product option groups to render */
  options: VariantOption[];
  /** Currently selected value per option name — e.g. { Color: "midnight-blue", Size: "xl" } */
  selectedValues: Record<string, string>;
  /** Called when a value is selected */
  onValueChange: (optionName: string, value: string) => void;
  /** Size of controls */
  size?: 'sm' | 'md';
}

// ─── Component ──────────────────────────────────────────────

export const VariantSelector = forwardRef<HTMLDivElement, VariantSelectorProps>(
  function VariantSelector(
    { options, selectedValues, onValueChange, size = 'md', className, ...props },
    ref,
  ) {
    const classes = [
      'ds-variant-selector',
      `ds-variant-selector--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {options.map((option) => (
          <OptionGroup
            key={option.name}
            option={option}
            selectedValue={selectedValues[option.name]}
            onValueChange={onValueChange}
            size={size}
          />
        ))}
      </div>
    );
  },
);

VariantSelector.displayName = 'VariantSelector';

// ─── Option Group ───────────────────────────────────────────

interface OptionGroupProps {
  option: VariantOption;
  selectedValue?: string;
  onValueChange: (optionName: string, value: string) => void;
  size: 'sm' | 'md';
}

function OptionGroup({ option, selectedValue, onValueChange, size }: OptionGroupProps) {
  const selectedLabel = option.values.find((v) => v.value === selectedValue)?.label;

  const handleChange = useCallback(
    (value: string) => {
      onValueChange(option.name, value);
    },
    [onValueChange, option.name],
  );

  return (
    <div className="ds-variant-selector__group">
      <Heading as="h4" size="xl" className="ds-variant-selector__label">
        {option.name}
        {selectedLabel && (
          <span className="ds-variant-selector__selected-value">: {selectedLabel}</span>
        )}
      </Heading>

      {option.type === 'color' ? (
        <ColorOptionGroup
          option={option}
          selectedValue={selectedValue}
          onChange={handleChange}
          size={size}
        />
      ) : (
        <ButtonOptionGroup
          option={option}
          selectedValue={selectedValue}
          onChange={handleChange}
          size={size}
        />
      )}
    </div>
  );
}

// ─── Color Options (delegates to ColorPicker) ───────────────

interface ColorOptionGroupProps {
  option: VariantOption;
  selectedValue?: string;
  onChange: (value: string) => void;
  size: 'sm' | 'md';
}

function ColorOptionGroup({ option, selectedValue, onChange, size }: ColorOptionGroupProps) {
  const colorOptions: ColorOption[] = option.values
    .filter((v) => !v.disabled)
    .map((v) => ({
      color: v.colorHex ?? '#000000',
      label: v.available === false ? `${v.label} (out of stock)` : v.label,
      value: v.value,
    }));

  return (
    <ColorPicker
      options={colorOptions}
      value={selectedValue}
      onChange={onChange}
      size={size === 'sm' ? 'sm' : 'md'}
      aria-label={option.name}
    />
  );
}

// ─── Button Options ─────────────────────────────────────────

interface ButtonOptionGroupProps {
  option: VariantOption;
  selectedValue?: string;
  onChange: (value: string) => void;
  size: 'sm' | 'md';
}

function ButtonOptionGroup({ option, selectedValue, onChange, size: _size }: ButtonOptionGroupProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const enabledValues = option.values.filter((v) => !v.disabled);
      const currentIndex = enabledValues.findIndex((v) => v.value === selectedValue);

      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = currentIndex < enabledValues.length - 1 ? currentIndex + 1 : 0;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledValues.length - 1;
      }

      if (nextIndex !== null) {
        const nextValue = enabledValues[nextIndex];
        if (nextValue) onChange(nextValue.value);
        // Focus the next button
        const group = e.currentTarget;
        const buttons = group.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([disabled])');
        buttons[nextIndex]?.focus();
      }
    },
    [option.values, selectedValue, onChange],
  );

  return (
    <div
      className="ds-variant-selector__buttons"
      role="radiogroup"
      aria-label={option.name}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {option.values.map((optionValue) => {
        const isSelected = optionValue.value === selectedValue;
        const isUnavailable = optionValue.available === false;
        const isDisabled = optionValue.disabled === true;

        const buttonClasses = [
          'ds-variant-selector__option',
          isSelected && 'ds-variant-selector__option--selected',
          isUnavailable && 'ds-variant-selector__option--unavailable',
        ]
          .filter(Boolean)
          .join(' ');

        const ariaLabel = isUnavailable
          ? `${optionValue.label} (out of stock)`
          : optionValue.label;

        return (
          <button
            key={optionValue.value}
            type="button"
            className={buttonClasses}
            role="radio"
            aria-checked={isSelected}
            aria-label={ariaLabel}
            disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(optionValue.value)}
          >
            <span className="ds-variant-selector__option-label">{optionValue.label}</span>
          </button>
        );
      })}
    </div>
  );
}
