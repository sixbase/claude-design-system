import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { QuantitySelector } from './QuantitySelector';

describe('QuantitySelector', () => {
  it('renders current value', () => {
    render(<QuantitySelector value={3} onChange={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('increments value on plus click', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements value on minus click', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Decrease quantity'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables decrement at min', () => {
    render(<QuantitySelector value={1} onChange={() => {}} min={1} />);
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
  });

  it('disables increment at max', () => {
    render(<QuantitySelector value={10} onChange={() => {}} max={10} />);
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
  });

  it('respects step', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={2} onChange={onChange} step={5} max={99} />);
    await userEvent.click(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('clamps to max when step overshoots', async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={8} onChange={onChange} step={5} max={10} />);
    await userEvent.click(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('disables both buttons when disabled', () => {
    render(<QuantitySelector value={5} onChange={() => {}} disabled />);
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
  });

  it('renders group with aria-label', () => {
    render(<QuantitySelector value={1} onChange={() => {}} aria-label="Item quantity" />);
    expect(screen.getByRole('group', { name: 'Item quantity' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuantitySelector value={1} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
