import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with text content', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText('Label').tagName).toBe('SPAN');
  });

  it('applies default variant class', () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText('Label')).toHaveClass('ds-badge--default');
  });

  it('applies variant class', () => {
    render(<Badge variant="success">In stock</Badge>);
    expect(screen.getByText('In stock')).toHaveClass('ds-badge--success');
  });

  it('applies size class', () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('ds-badge--sm');
  });

  it('merges custom className', () => {
    render(<Badge className="custom">Label</Badge>);
    expect(screen.getByText('Label')).toHaveClass('custom');
  });

  it('passes through html attributes', () => {
    render(<Badge data-testid="badge-el">Label</Badge>);
    expect(screen.getByTestId('badge-el')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Badge>New</Badge>
        <Badge variant="success">In stock</Badge>
        <Badge variant="destructive">Out of stock</Badge>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
