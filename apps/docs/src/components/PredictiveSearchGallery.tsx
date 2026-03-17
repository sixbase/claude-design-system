import { useCallback, useState } from 'react';
import { PredictiveSearch, Text } from '@ds/components';
import type { SearchResult } from '@ds/components';

// ─── Mock data ──────────────────────────────────────────────

function makePlaceholder(label: string): string {
  const encoded = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<rect width="96" height="96" fill="#c8bfae"/>` +
      `<text x="48" y="48" text-anchor="middle" dominant-baseline="central" ` +
      `font-family="system-ui,sans-serif" font-size="10" fill="#7a7262">${label}</text>` +
      `</svg>`,
  );
  return `data:image/svg+xml,${encoded}`;
}

const ALL_RESULTS: SearchResult[] = [
  { type: 'product', id: 'p1', title: 'Minimal Canvas Tote', url: '/products/tote', image: makePlaceholder('Tote'), price: 4800 },
  { type: 'product', id: 'p2', title: 'Relaxed Linen Shirt', url: '/products/shirt', image: makePlaceholder('Shirt'), price: 8900, compareAtPrice: 11200 },
  { type: 'product', id: 'p3', title: 'Vegetable-Tanned Wallet', url: '/products/wallet', image: makePlaceholder('Wallet'), price: 6500 },
  { type: 'product', id: 'p4', title: 'Organic Cotton Hoodie', url: '/products/hoodie', image: makePlaceholder('Hoodie'), price: 5600 },
  { type: 'collection', id: 'c1', title: 'Summer Essentials', url: '/collections/summer' },
  { type: 'collection', id: 'c2', title: 'New Arrivals', url: '/collections/new' },
  { type: 'page', id: 'pg1', title: 'About Our Materials', url: '/pages/materials' },
  { type: 'article', id: 'a1', title: 'How to Care for Leather', url: '/blogs/leather-care' },
];

// ─── Interactive demo ───────────────────────────────────────

export function PredictiveSearchInteractive() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = ALL_RESULTS.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
      setLoading(false);
    }, 400);
  }, []);

  const handleSelect = useCallback((result: SearchResult) => {
    // eslint-disable-next-line no-alert
    alert(`Selected: ${result.title}\nURL: ${result.url}`);
  }, []);

  return (
    <div className="ds-gallery-row" style={{ maxWidth: '400px' }}>
      <PredictiveSearch
        onSearch={handleSearch}
        results={results}
        loading={loading}
        onSelect={handleSelect}
        onViewAll={(q) => alert(`View all results for: ${q}`)}
      />
    </div>
  );
}

// ─── Products only ──────────────────────────────────────────

export function PredictiveSearchProducts() {
  const products = ALL_RESULTS.filter((r) => r.type === 'product');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = products.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
      setLoading(false);
    }, 300);
  }, []);

  return (
    <div className="ds-gallery-row" style={{ maxWidth: '400px' }}>
      <PredictiveSearch
        onSearch={handleSearch}
        results={results}
        loading={loading}
        showTypes={['product']}
        onSelect={(r) => alert(`Navigate to: ${r.url}`)}
      />
    </div>
  );
}

// ─── Sizes ──────────────────────────────────────────────────

export function PredictiveSearchSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: '400px' }}>
      <div>
        <Text size="sm" muted>Small</Text>
        <PredictiveSearch onSearch={() => {}} size="sm" placeholder="Search…" />
      </div>
      <div>
        <Text size="sm" muted>Medium (default)</Text>
        <PredictiveSearch onSearch={() => {}} size="md" />
      </div>
      <div>
        <Text size="sm" muted>Large</Text>
        <PredictiveSearch onSearch={() => {}} size="lg" />
      </div>
    </div>
  );
}
