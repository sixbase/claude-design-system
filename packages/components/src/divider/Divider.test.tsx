import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders as an hr element by default', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')?.tagName).toBe('HR');
  });

  it('renders as a div with role="separator" when vertical', () => {
    render(<Divider orientation="vertical" />);
    const el = screen.getByRole('separator');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies default classes', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).toHaveClass('ds-divider');
    expect(hr).toHaveClass('ds-divider--horizontal');
    expect(hr).toHaveClass('ds-divider--default');
    expect(hr).toHaveClass('ds-divider--spacing-md');
  });

  it('applies variant class', () => {
    const { container } = render(<Divider variant="subtle" />);
    expect(container.querySelector('hr')).toHaveClass('ds-divider--subtle');
  });

  it('applies orientation class', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveClass('ds-divider--vertical');
  });

  it('applies spacing class', () => {
    const { container } = render(<Divider spacing="lg" />);
    expect(container.querySelector('hr')).toHaveClass('ds-divider--spacing-lg');
  });

  it('merges custom className', () => {
    const { container } = render(<Divider className="custom" />);
    expect(container.querySelector('hr')).toHaveClass('ds-divider', 'custom');
  });

  it('passes through HTML attributes', () => {
    const { container } = render(<Divider data-testid="my-divider" />);
    expect(container.querySelector('[data-testid="my-divider"]')).toBeInTheDocument();
  });

  /* ─── Accessibility ──────────────────────────────────────── */

  it('has no accessibility violations (horizontal)', async () => {
    const { container } = render(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (vertical)', async () => {
    const { container } = render(
      <div style={{ display: 'flex', height: '100px' }}>
        <span>Left</span>
        <Divider orientation="vertical" />
        <span>Right</span>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
