import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PredictiveSearch } from './PredictiveSearch';
import type { SearchResult } from './PredictiveSearch';

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

const MOCK_RESULTS: SearchResult[] = [
  { type: 'product', id: 'p1', title: 'Minimal Canvas Tote', url: '/products/tote', image: makePlaceholder('Tote'), price: 4800 },
  { type: 'product', id: 'p2', title: 'Relaxed Linen Shirt', url: '/products/shirt', image: makePlaceholder('Shirt'), price: 8900, compareAtPrice: 11200 },
  { type: 'product', id: 'p3', title: 'Vegetable-Tanned Wallet', url: '/products/wallet', image: makePlaceholder('Wallet'), price: 6500 },
  { type: 'collection', id: 'c1', title: 'Summer Essentials', url: '/collections/summer' },
  { type: 'collection', id: 'c2', title: 'New Arrivals', url: '/collections/new' },
  { type: 'page', id: 'pg1', title: 'About Our Materials', url: '/pages/materials' },
  { type: 'article', id: 'a1', title: 'How to Care for Leather', url: '/blogs/leather-care' },
];

const SALE_PRODUCTS: SearchResult[] = [
  { type: 'product', id: 'sp1', title: 'Organic Cotton Hoodie', url: '/products/hoodie', image: makePlaceholder('Hoodie'), price: 5600, compareAtPrice: 7800 },
  { type: 'product', id: 'sp2', title: 'Linen Blend Trousers', url: '/products/trousers', image: makePlaceholder('Trousers'), price: 6200, compareAtPrice: 8900 },
  { type: 'product', id: 'sp3', title: 'Merino Crew Neck', url: '/products/merino', image: makePlaceholder('Merino'), price: 4200, compareAtPrice: 5800 },
];

// ─── Meta ───────────────────────────────────────────────────

const meta: Meta<typeof PredictiveSearch> = {
  title: 'Components/PredictiveSearch',
  component: PredictiveSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Live search autocomplete with results grouped by type. Implements WAI-ARIA combobox pattern. Data fetching is the consumer\u2019s responsibility via onSearch callback.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', minHeight: '420px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PredictiveSearch>;

// ─── Stories ────────────────────────────────────────────────

export const Default: Story = {
  args: {
    onSearch: () => {},
    placeholder: 'Search products\u2026',
  },
};

export const WithResults: Story = {
  args: {
    onSearch: () => {},
    results: MOCK_RESULTS,
  },
  render: function WithResultsStory(args) {
    const [query, setQuery] = useState('tote');

    return (
      <PredictiveSearch
        {...args}
        onSearch={() => {}}
        results={query.length >= 2 ? MOCK_RESULTS : []}
      />
    );
  },
};

export const ProductsOnly: Story = {
  args: {
    onSearch: () => {},
    results: MOCK_RESULTS.filter((r) => r.type === 'product'),
    showTypes: ['product'],
  },
  render: function ProductsOnlyStory(args) {
    return <PredictiveSearch {...args} />;
  },
};

export const Loading: Story = {
  args: {
    onSearch: () => {},
    loading: true,
  },
};

export const NoResults: Story = {
  args: {
    onSearch: () => {},
    results: [],
  },
};

export const WithSaleProducts: Story = {
  args: {
    onSearch: () => {},
    results: SALE_PRODUCTS,
    showTypes: ['product'],
  },
};

export const Small: Story = {
  args: {
    onSearch: () => {},
    size: 'sm',
    placeholder: 'Search\u2026',
  },
};

export const Large: Story = {
  args: {
    onSearch: () => {},
    size: 'lg',
    placeholder: 'Search products\u2026',
  },
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback((query: string) => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const filtered = MOCK_RESULTS.filter((r) =>
          r.title.toLowerCase().includes(query.toLowerCase()),
        );
        setResults(filtered);
        setLoading(false);
      }, 400);
    }, []);

    const handleSelect = useCallback((result: SearchResult) => {
      // eslint-disable-next-line no-console
      console.log('Selected:', result);
    }, []);

    const handleViewAll = useCallback((query: string) => {
      // eslint-disable-next-line no-console
      console.log('View all:', query);
    }, []);

    return (
      <PredictiveSearch
        onSearch={handleSearch}
        results={results}
        loading={loading}
        onSelect={handleSelect}
        onViewAll={handleViewAll}
        debounce={300}
      />
    );
  },
};
