import { useState, useMemo } from 'react';
import { Breadcrumb } from '@ds/components';
import { Heading, Text } from '@ds/components';
import { Select, SelectItem } from '@ds/components';
import { ProductCard } from '@ds/components';
import { PRODUCTS, formatPrice } from '../data/products';
import type { Product } from '../data/products';
import './CollectionDemo.css';

// ─── Sort helpers ─────────────────────────────────────────

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'best-selling';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
];

function sortProducts(products: Product[], key: SortKey): Product[] {
  const sorted = [...products];
  switch (key) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'best-selling':
      // Simulate: items with badges rank higher
      return sorted.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    case 'newest':
    default:
      return sorted;
  }
}

// ─── Component ────────────────────────────────────────────

export function CollectionDemo() {
  const [sortValue, setSortValue] = useState<SortKey>('newest');

  const sorted = useMemo(() => sortProducts(PRODUCTS, sortValue), [sortValue]);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/examples/homepage' },
          { label: 'Collections', href: '/examples/collection' },
          { label: 'All Products' },
        ]}
      />

      <div className="ds-collection__header">
        <div className="ds-collection__header-row">
          <div>
            <Heading level={1} size="2xl">
              All Products
            </Heading>
            <Text size="sm" muted>
              {PRODUCTS.length} products
            </Text>
          </div>
          <div className="ds-collection__sort">
            <Select
              size="sm"
              value={sortValue}
              onValueChange={(v) => setSortValue(v as SortKey)}
              placeholder="Sort by"
            >
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="ds-collection__grid">
        {sorted.map((product) => (
          <a
            key={product.id}
            href="/examples/product-detail"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ProductCard
              name={product.name}
              price={product.price}
              image={product.image}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
