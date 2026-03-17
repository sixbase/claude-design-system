import { Badge, Grid, PriceDisplay, ProductCard } from '@ds/components';
import { Preview } from './Preview';
import { makePlaceholder } from '../lib/placeholder';

const placeholder = makePlaceholder('', '#D6D0C7', '#D6D0C7', { width: 400, height: 500 });
const placeholderAlt = makePlaceholder('', '#C8C1B6', '#C8C1B6', { width: 400, height: 500 });

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

export function ProductCardWithBadge() {
  return (
    <Preview>
      <ProductCard
        name="Aramid Fiber iPhone 17 Pro Max Case"
        price={8500}
        image={placeholder}
        badge={<Badge variant="destructive" size="sm">Sale</Badge>}
      />
    </Preview>
  );
}

export function ProductCardWithRenderPrice() {
  return (
    <Preview>
      <ProductCard
        name="Aramid Fiber iPhone 17 Pro Max Case"
        price={6800}
        image={placeholder}
        badge={<Badge variant="destructive" size="sm">20% Off</Badge>}
        renderPrice={(price, currency) => (
          <PriceDisplay
            price={`$${(price / 100).toFixed(2)}`}
            comparePrice="$85.00"
            size="sm"
          />
        )}
      />
    </Preview>
  );
}

export function ProductCardWithHoverImage() {
  return (
    <Preview>
      <ProductCard
        name="Aramid Fiber iPhone 17 Pro Max Case"
        price={8500}
        image={placeholder}
        hoverImage={placeholderAlt}
      />
    </Preview>
  );
}

export function ProductCardGrid() {
  return (
    <Preview>
      <Grid cols={4}>
        {products.map((p) => (
          <ProductCard key={p.name} {...p} fluid />
        ))}
      </Grid>
    </Preview>
  );
}
