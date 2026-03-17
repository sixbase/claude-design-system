import { useState } from 'react';
import { Pagination, Text } from '@ds/components';
import { Preview } from './Preview';

function InteractivePagination(props: {
  totalPages: number;
  siblingCount?: number;
  size?: 'sm' | 'md';
  initialPage?: number;
}) {
  const [page, setPage] = useState(props.initialPage ?? 1);
  return (
    <Pagination
      currentPage={page}
      totalPages={props.totalPages}
      onPageChange={setPage}
      siblingCount={props.siblingCount}
      size={props.size}
    />
  );
}

export function PaginationDefault() {
  return (
    <Preview>
      <InteractivePagination totalPages={20} initialPage={5} />
    </Preview>
  );
}

export function PaginationFewPages() {
  return (
    <Preview>
      <InteractivePagination totalPages={5} />
    </Preview>
  );
}

export function PaginationManyPages() {
  return (
    <Preview>
      <InteractivePagination totalPages={100} initialPage={50} />
    </Preview>
  );
}

export function PaginationSizes() {
  return (
    <Preview stack>
      <Text size="sm">Small</Text>
      <InteractivePagination totalPages={10} size="sm" initialPage={5} />
      <Text size="sm">Medium (default)</Text>
      <InteractivePagination totalPages={10} size="md" initialPage={5} />
    </Preview>
  );
}

export function PaginationSSR() {
  return (
    <Preview>
      <Pagination
        currentPage={3}
        totalPages={10}
        baseUrl="/collections/all"
      />
    </Preview>
  );
}

export function PaginationEdgeCases() {
  return (
    <Preview stack>
      <Text size="sm">First page (Previous disabled)</Text>
      <InteractivePagination totalPages={20} initialPage={1} />
      <Text size="sm">Last page (Next disabled)</Text>
      <InteractivePagination totalPages={20} initialPage={20} />
      <Text size="sm">Two pages only</Text>
      <InteractivePagination totalPages={2} />
    </Preview>
  );
}

export function PaginationWiderSiblings() {
  return (
    <Preview>
      <InteractivePagination totalPages={20} siblingCount={2} initialPage={10} />
    </Preview>
  );
}
