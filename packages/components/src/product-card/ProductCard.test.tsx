import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard name="Classic T-Shirt" price={3200} image="/tshirt.jpg" />);
    expect(screen.getByText('Classic T-Shirt')).toBeInTheDocument();
  });

  it('formats price in dollars', () => {
    render(<ProductCard name="Watch" price={28500} image="/watch.jpg" />);
    expect(screen.getByText('$285.00')).toBeInTheDocument();
  });

  it('renders image with product name as alt text', () => {
    render(<ProductCard name="Sunglasses" price={9900} image="/sunglasses.jpg" />);
    expect(screen.getByAltText('Sunglasses')).toBeInTheDocument();
  });

  it('supports custom currency', () => {
    render(<ProductCard name="Bag" price={15000} image="/bag.jpg" currency="EUR" />);
    expect(screen.getByText('€150.00')).toBeInTheDocument();
  });

  it('applies product card class', () => {
    render(<ProductCard name="Hat" price={2500} image="/hat.jpg" data-testid="card" />);
    expect(screen.getByTestId('card')).toHaveClass('ds-product-card');
  });

  it('renders custom price via renderPrice', () => {
    render(
      <ProductCard
        name="Sale Item"
        price={2400}
        image="/sale.jpg"
        renderPrice={(price, currency) => <span data-testid="custom-price">${(price / 100).toFixed(2)}</span>}
      />,
    );
    expect(screen.getByTestId('custom-price')).toHaveTextContent('$24.00');
    // Default formatted price should not appear
    expect(screen.queryByText('$24.00')).toBeNull;
  });

  it('renders badge overlay', () => {
    render(
      <ProductCard
        name="New Item"
        price={5000}
        image="/new.jpg"
        badge={<span data-testid="badge">New</span>}
      />,
    );
    expect(screen.getByTestId('badge')).toHaveTextContent('New');
  });

  it('renders hover image with aria-hidden', () => {
    const { container } = render(
      <ProductCard
        name="Hover Item"
        price={3200}
        image="/main.jpg"
        hoverImage="/hover.jpg"
      />,
    );
    const hoverImg = container.querySelector('.ds-product-card__hover-image');
    expect(hoverImg).toBeInTheDocument();
    expect(hoverImg).toHaveAttribute('aria-hidden', 'true');
    expect(hoverImg).toHaveAttribute('src', '/hover.jpg');
  });

  it('applies has-hover-image modifier class', () => {
    render(
      <ProductCard
        name="Hover Item"
        price={3200}
        image="/main.jpg"
        hoverImage="/hover.jpg"
        data-testid="card"
      />,
    );
    expect(screen.getByTestId('card')).toHaveClass('ds-product-card--has-hover-image');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ProductCard name="Classic T-Shirt" price={3200} image="/tshirt.jpg" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations with badge and hover image', async () => {
    const { container } = render(
      <ProductCard
        name="Full Featured"
        price={3200}
        image="/main.jpg"
        hoverImage="/hover.jpg"
        badge={<span>Sale</span>}
        renderPrice={(p) => <span>${(p / 100).toFixed(2)}</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
