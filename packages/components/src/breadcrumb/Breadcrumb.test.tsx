import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Women', href: '/women' },
  { label: 'Dresses', href: '/women/dresses' },
  { label: 'Silk Wrap Dress' },
];

describe('Breadcrumb', () => {
  it('renders all items', () => {
    render(<Breadcrumb items={items} />);
    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('renders links for non-last items with href', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Women').closest('a')).toHaveAttribute('href', '/women');
  });

  it('marks last item as current page', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Silk Wrap Dress')).toHaveAttribute('aria-current', 'page');
  });

  it('last item is not a link', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Silk Wrap Dress').closest('a')).toBeNull();
  });

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll('.ds-breadcrumb__separator');
    expect(separators).toHaveLength(items.length - 1);
  });

  it('separators are hidden from screen readers', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll('.ds-breadcrumb__separator');
    separators.forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('supports custom separator', () => {
    render(<Breadcrumb items={items} separator="›" />);
    const { container } = render(<Breadcrumb items={items} separator="›" />);
    expect(container.querySelector('.ds-breadcrumb__separator')?.textContent).toBe('›');
  });

  it('renders nav landmark with aria-label', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Breadcrumb items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
