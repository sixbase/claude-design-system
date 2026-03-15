import { ProductCard } from '@ds/components';
import { Preview } from './Preview';

const placeholder = '/products/placeholder.svg';

const products = [
  {
    name: 'Aramid Fiber iPhone 17 Pro Max Case',
    price: 8500,
    image: placeholder,
  },
  {
    name: 'Minimalist Watch',
    price: 28500,
    image: placeholder,
  },
  {
    name: 'Leather Crossbody Bag',
    price: 12800,
    image: placeholder,
  },
  {
    name: 'Polarized Sunglasses',
    price: 9500,
    image: placeholder,
  },
];

export function ProductCardSingle() {
  return (
    <Preview>
      <ProductCard
        name="Aramid Fiber iPhone 17 Pro Max Case"
        price={8500}
        image={placeholder}
      />
    </Preview>
  );
}

export function ProductCardLarge() {
  return (
    <Preview>
      <ProductCard
        name="Aramid Fiber iPhone 17 Pro Max Case"
        price={8500}
        image={placeholder}
        size="lg"
      />
    </Preview>
  );
}

export function ProductCardGrid() {
  return (
    <Preview>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--spacing-4)',
        width: '100%',
      }}>
        {products.map((p) => (
          <ProductCard key={p.name} {...p} style={{ width: '100%' }} />
        ))}
      </div>
    </Preview>
  );
}
