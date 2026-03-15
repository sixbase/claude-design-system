import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Card, CardImage, CardBody } from '../card/Card';
import { Text } from '../typography/Typography';
import './ProductCard.css';

export interface ProductCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Product display name */
  name: string;
  /** Price in cents (e.g. 4200 = $42.00) */
  price: number;
  /** Product image URL */
  image: string;
  /** ISO 4217 currency code */
  currency?: string;
  /** Card size */
  size?: 'default' | 'lg';
}

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

/**
 * ProductCard
 *
 * A minimal product card composing Card, CardImage, and Typography.
 * Displays a 4:5 product image, name, and price.
 *
 * @example
 * <ProductCard
 *   name="Classic T-Shirt"
 *   price={3200}
 *   image="/products/tshirt.jpg"
 * />
 */
export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard(
  { name, price, image, currency = 'USD', size = 'default', className, ...props },
  ref,
) {
  return (
    <Card
      ref={ref}
      variant="ghost"
      interactive
      noPadding
      className={[
        'ds-product-card',
        size !== 'default' && `ds-product-card--${size}`,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      <CardImage src={image} alt={name} aspectRatio="4/5" />
      <CardBody>
        <Text size="sm" className="ds-product-card__name">{name}</Text>
        <Text size="sm" muted className="ds-product-card__price">{formatPrice(price, currency)}</Text>
      </CardBody>
    </Card>
  );
});
ProductCard.displayName = 'ProductCard';
