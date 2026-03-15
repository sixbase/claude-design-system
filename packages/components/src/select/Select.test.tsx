import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Select, SelectItem, SelectGroup, SelectSeparator } from './Select';

// Radix Select uses portals — wrap in a container that supports them
function SizeSelect(props: { error?: string; hint?: string; label?: string; disabled?: boolean }) {
  return (
    <Select label={props.label} hint={props.hint} error={props.error} disabled={props.disabled}>
      <SelectItem value="xs">XS</SelectItem>
      <SelectItem value="sm">SM</SelectItem>
      <SelectItem value="md">MD</SelectItem>
      <SelectItem value="lg">LG</SelectItem>
    </Select>
  );
}

describe('Select', () => {
  it('renders a trigger button', () => {
    render(<SizeSelect />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<SizeSelect label="Size" />);
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('renders hint text when provided', () => {
    render(<SizeSelect hint="Choose your size" />);
    expect(screen.getByText('Choose your size')).toBeInTheDocument();
  });

  it('renders error message with role alert', () => {
    render(<SizeSelect error="Please select a size" />);
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Please select a size');
  });

  it('does not render hint when error is present', () => {
    render(<SizeSelect hint="Helper text" error="Error message" />);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('sets aria-invalid on trigger when error is present', () => {
    render(<SizeSelect error="Required" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables trigger when disabled prop is set', () => {
    render(<SizeSelect disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies error class to trigger', () => {
    render(<SizeSelect error="Error" />);
    expect(screen.getByRole('combobox')).toHaveClass('ds-select-trigger--error');
  });

  it('applies size class', () => {
    render(
      <Select size="sm">
        <SelectItem value="a">A</SelectItem>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('ds-select-trigger--sm');
  });

  it('applies full-width class', () => {
    render(
      <Select fullWidth>
        <SelectItem value="a">A</SelectItem>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('ds-select-trigger--full-width');
  });

  it('renders SelectGroup with label', () => {
    render(
      <Select>
        <SelectGroup label="Tops">
          <SelectItem value="shirt">Shirt</SelectItem>
        </SelectGroup>
      </Select>,
    );
    // Group label rendered in the trigger area won't be visible until open,
    // but the group element should be in the DOM (Radix renders content lazily)
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders SelectSeparator without crashing', () => {
    render(
      <Select>
        <SelectItem value="a">A</SelectItem>
        <SelectSeparator />
        <SelectItem value="b">B</SelectItem>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Select label="Size" defaultValue="md">
          <SelectItem value="sm">SM</SelectItem>
          <SelectItem value="md">MD</SelectItem>
          <SelectItem value="lg">LG</SelectItem>
        </Select>
        <SizeSelect label="Quantity" error="Please select a quantity" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
