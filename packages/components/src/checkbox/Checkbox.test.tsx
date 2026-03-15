import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox button', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<Checkbox label="Remember me" />);
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('associates label with checkbox', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Checkbox label="Newsletter" hint="We send at most one email per week" />);
    expect(screen.getByText('We send at most one email per week')).toBeInTheDocument();
  });

  it('renders error with role alert', () => {
    render(<Checkbox label="Terms" error="You must accept the terms" />);
    expect(screen.getByRole('alert')).toHaveTextContent('You must accept the terms');
  });

  it('hides hint when error is present', () => {
    render(<Checkbox label="Terms" hint="Required" error="Must accept" />);
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Checkbox label="Terms" error="Required" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is unchecked by default', () => {
    render(<Checkbox label="Option" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('can be checked by clicking the label', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Option" />);
    await user.click(screen.getByText('Option'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('fires onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Option" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox label="Option" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not fire onCheckedChange when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Option" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('applies size class', () => {
    render(<Checkbox size="sm" label="Small" />);
    expect(document.querySelector('.ds-checkbox-box--sm')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Remember me" />
        <Checkbox label="Newsletter" hint="Weekly digest" />
        <Checkbox label="Terms" error="You must accept the terms" />
        <Checkbox label="Disabled" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
