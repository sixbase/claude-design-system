import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders without crashing', () => {
    const { container } = render(<EmptyState heading="No items" />);
    expect(container.querySelector('.ds-empty-state')).toBeInTheDocument();
  });

  it('renders as a div element', () => {
    render(<EmptyState heading="No items" data-testid="empty" />);
    const el = screen.getByTestId('empty');
    expect(el.tagName).toBe('DIV');
  });

  it('renders heading text', () => {
    render(<EmptyState heading="Your bag is empty" />);
    expect(screen.getByText('Your bag is empty')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState
        heading="No items"
        description="Looks like you haven't added anything yet"
      />,
    );
    expect(
      screen.getByText("Looks like you haven't added anything yet"),
    ).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    const { container } = render(<EmptyState heading="No items" />);
    expect(
      container.querySelector('.ds-empty-state__description'),
    ).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState
        heading="No items"
        icon={<span data-testid="custom-icon">icon</span>}
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('does not render icon area when icon is omitted', () => {
    const { container } = render(<EmptyState heading="No items" />);
    expect(
      container.querySelector('.ds-empty-state__icon'),
    ).not.toBeInTheDocument();
  });

  it('renders primary action as a link', () => {
    render(
      <EmptyState
        heading="No items"
        action={{ label: 'Browse collection', href: '/collections' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Browse collection' });
    expect(link).toHaveAttribute('href', '/collections');
  });

  it('renders secondary action as a link', () => {
    render(
      <EmptyState
        heading="No items"
        action={{ label: 'Shop now', href: '/shop' }}
        secondaryAction={{ label: 'Go home', href: '/' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('does not render actions area when no actions provided', () => {
    const { container } = render(<EmptyState heading="No items" />);
    expect(
      container.querySelector('.ds-empty-state__actions'),
    ).not.toBeInTheDocument();
  });

  it('applies compact variant class', () => {
    const { container } = render(<EmptyState heading="No items" compact />);
    expect(
      container.querySelector('.ds-empty-state--compact'),
    ).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<EmptyState ref={ref} heading="No items" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional props to the root element', () => {
    render(<EmptyState heading="No items" data-testid="my-empty" />);
    expect(screen.getByTestId('my-empty')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(
      <EmptyState heading="No items" className="custom-class" />,
    );
    const el = container.querySelector('.ds-empty-state');
    expect(el).toHaveClass('custom-class');
  });

  it('has no accessibility violations (minimal)', async () => {
    const { container } = render(<EmptyState heading="Your bag is empty" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (full)', async () => {
    const { container } = render(
      <EmptyState
        heading="Your bag is empty"
        description="Looks like you haven't added anything yet."
        icon={<svg aria-hidden="true"><circle cx="24" cy="24" r="20" /></svg>}
        action={{ label: 'Browse collection', href: '/collections' }}
        secondaryAction={{ label: 'Go home', href: '/' }}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
