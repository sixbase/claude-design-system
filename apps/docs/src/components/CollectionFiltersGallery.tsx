import { useState, useCallback } from 'react';
import { CollectionFilters, Heading, Text } from '@ds/components';
import type { Filter } from '@ds/components';

// ─── Shared state hook ─────────────────────────────────────

function useFilterState(initialFilters: Filter[]) {
  const [filters, setFilters] = useState(initialFilters);

  const activeCount = filters.reduce((count, f) => {
    if (f.type === 'list' || f.type === 'boolean') {
      return count + (f.values?.filter((v) => v.active).length ?? 0);
    }
    if (f.type === 'price_range' && (f.activeMin != null || f.activeMax != null)) {
      return count + 1;
    }
    return count;
  }, 0);

  const onFilterChange = useCallback(
    (filterId: string, value: string | [number, number], active: boolean) => {
      setFilters((prev) =>
        prev.map((f) => {
          if (f.id !== filterId) return f;
          if (f.type === 'price_range' && Array.isArray(value)) {
            return { ...f, activeMin: value[0], activeMax: value[1] };
          }
          if ((f.type === 'list' || f.type === 'boolean') && typeof value === 'string') {
            return {
              ...f,
              values: f.values?.map((v) =>
                v.value === value ? { ...v, active } : v,
              ),
            };
          }
          return f;
        }),
      );
    },
    [],
  );

  const onClearAll = useCallback(() => {
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        values: f.values?.map((v) => ({ ...v, active: false })),
        activeMin: undefined,
        activeMax: undefined,
      })),
    );
  }, []);

  return { filters, activeCount, onFilterChange, onClearAll };
}

// ─── Fixtures ──────────────────────────────────────────────

const sampleFilters: Filter[] = [
  {
    id: 'color',
    label: 'Color',
    type: 'list',
    values: [
      { label: 'Black', value: 'black', count: 42, active: false },
      { label: 'White', value: 'white', count: 28, active: false },
      { label: 'Navy', value: 'navy', count: 15, active: false },
      { label: 'Stone', value: 'stone', count: 8, active: false },
    ],
  },
  {
    id: 'size',
    label: 'Size',
    type: 'list',
    values: [
      { label: 'XS', value: 'xs', count: 5, active: false },
      { label: 'S', value: 's', count: 12, active: false },
      { label: 'M', value: 'm', count: 18, active: false },
      { label: 'L', value: 'l', count: 14, active: false },
      { label: 'XL', value: 'xl', count: 9, active: false },
      { label: 'XXL', value: 'xxl', count: 3, active: false },
    ],
  },
  {
    id: 'price',
    label: 'Price',
    type: 'price_range',
    min: 0,
    max: 50000,
  },
  {
    id: 'availability',
    label: 'Availability',
    type: 'boolean',
    values: [{ label: 'In stock only', value: 'in_stock', count: 48, active: false }],
  },
];

const filtersWithActive: Filter[] = [
  {
    ...sampleFilters[0],
    values: sampleFilters[0].values?.map((v) =>
      v.value === 'black' || v.value === 'navy' ? { ...v, active: true } : v,
    ),
  },
  sampleFilters[1],
  {
    ...sampleFilters[2],
    activeMin: 2000,
    activeMax: 15000,
  },
  sampleFilters[3],
];

// ─── Gallery Components ────────────────────────────────────

export function CollectionFiltersDefault() {
  const state = useFilterState(sampleFilters);
  return (
    <div style={{ maxWidth: '280px' }}>
      <CollectionFilters {...state} resultsCount={64} />
    </div>
  );
}

export function CollectionFiltersActive() {
  const state = useFilterState(filtersWithActive);
  return (
    <div style={{ maxWidth: '280px' }}>
      <CollectionFilters {...state} resultsCount={12} />
    </div>
  );
}

export function CollectionFiltersWithHeader() {
  const state = useFilterState(sampleFilters);
  return (
    <div style={{ maxWidth: '280px' }}>
      <CollectionFilters
        {...state}
        header={<Heading level={3} size="sm">Filter by</Heading>}
        resultsCount={64}
      />
    </div>
  );
}

export function CollectionFiltersManyValues() {
  const manyColorFilter: Filter = {
    id: 'color',
    label: 'Color',
    type: 'list',
    values: [
      'Black', 'White', 'Navy', 'Stone', 'Sage', 'Amber',
      'Burgundy', 'Charcoal', 'Ivory', 'Slate', 'Olive', 'Rust',
    ].map((name, i) => ({
      label: name,
      value: name.toLowerCase(),
      count: 20 - i,
      active: false,
    })),
  };

  const state = useFilterState([manyColorFilter]);
  return (
    <div style={{ maxWidth: '280px' }}>
      <CollectionFilters {...state} showMoreThreshold={5} resultsCount={96} />
    </div>
  );
}

export function CollectionFiltersMobile() {
  const state = useFilterState(sampleFilters);
  return (
    <div>
      <Text size="sm" muted>
        Resize your browser below 768px to see the mobile drawer, or click the button below.
      </Text>
      <div style={{ marginTop: 'var(--spacing-3)' }}>
        <CollectionFilters {...state} resultsCount={64} />
      </div>
    </div>
  );
}
