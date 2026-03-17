import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CartLineItem } from './CartLineItem';

const defaultProps = {
  id: 'item-1',
  name: 'Canvas Tote Bag',
  price: 4800,
  quantity: 2,
  onQuantityChange: vi.fn(),
  onRemove: vi.fn(),
};

describe('CartLineItem', () => {
  it('renders without crashing', () => {
    render(<CartLineItem {...defaultProps} />);
    expect(screen.getByRole('group', { name: 'Canvas Tote Bag' })).toBeInTheDocument();
  });

  it('renders correct HTML element (div with role="group")', () => {
    render(<CartLineItem {...defaultProps} />);
    const el = screen.getByRole('group', { name: 'Canvas Tote Bag' });
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('ds-cart-line-item');
  });

  it('displays product name', () => {
    render(<CartLineItem {...defaultProps} />);
    expect(screen.getByText('Canvas Tote Bag')).toBeInTheDocument();
  });

  it('displays formatted line total (price x quantity)', () => {
    render(<CartLineItem {...defaultProps} price={4800} quantity={2} />);
    expect(screen.getByText('$96.00')).toBeInTheDocument();
  });

  it('displays options when provided', () => {
    render(
      <CartLineItem
        {...defaultProps}
        options={[
          { name: 'Size', value: 'XL' },
          { name: 'Color', value: 'Stone' },
        ]}
      />,
    );
    expect(screen.getByText('Size: XL')).toBeInTheDocument();
    expect(screen.getByText('Color: Stone')).toBeInTheDocument();
  });

  it('shows sale badge when compareAtPrice is provided', () => {
    render(<CartLineItem {...defaultProps} compareAtPrice={6500} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('renders product link when href is provided', () => {
    render(<CartLineItem {...defaultProps} href="/products/tote" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/tote');
  });

  it('renders placeholder when no image is provided', () => {
    const { container } = render(<CartLineItem {...defaultProps} />);
    expect(container.querySelector('.ds-cart-line-item__placeholder')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(<CartLineItem {...defaultProps} image="/tote.jpg" imageAlt="A canvas tote" />);
    const img = screen.getByAltText('A canvas tote');
    expect(img).toHaveAttribute('src', '/tote.jpg');
  });

  it('calls onQuantityChange when quantity is adjusted', async () => {
    const onQuantityChange = vi.fn();
    render(<CartLineItem {...defaultProps} onQuantityChange={onQuantityChange} />);
    await userEvent.click(screen.getByLabelText('Increase quantity'));
    expect(onQuantityChange).toHaveBeenCalledWith(3);
  });

  it('calls onRemove when remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(<CartLineItem {...defaultProps} onRemove={onRemove} />);
    await userEvent.click(screen.getByLabelText('Remove Canvas Tote Bag from cart'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('uses product name as default image alt', () => {
    render(<CartLineItem {...defaultProps} image="/tote.jpg" />);
    expect(screen.getByAltText('Canvas Tote Bag')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<CartLineItem {...defaultProps} ref={ref} />);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CartLineItem {...defaultProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
