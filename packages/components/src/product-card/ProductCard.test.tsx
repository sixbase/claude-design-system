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

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ProductCard name="Classic T-Shirt" price={3200} image="/tshirt.jpg" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
