import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Navigation for multi-page content. SPA mode uses buttons with `onPageChange`. SSR/Shopify mode uses anchor tags with `baseUrl` for crawlable pagination.',
      },
    },
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    size: { control: 'select', options: ['sm', 'md'] },
    onPageChange: { table: { disable: true } },
    baseUrl: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ─── Interactive wrapper for SPA demos ─────────────────────

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

// ─── Default ──────────────────────────────────────────────

export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    siblingCount: 1,
    size: 'md',
  },
  render: (args) => (
    <InteractivePagination
      totalPages={args.totalPages!}
      siblingCount={args.siblingCount}
      size={args.size}
      initialPage={args.currentPage}
    />
  ),
};

// ─── Few pages (no ellipsis) ──────────────────────────────

export const FewPages: Story = {
  render: () => <InteractivePagination totalPages={5} />,
};

// ─── Many pages ──────────────────────────────────────────

export const ManyPages: Story = {
  render: () => <InteractivePagination totalPages={100} initialPage={50} />,
};

// ─── First page ──────────────────────────────────────────

export const FirstPage: Story = {
  render: () => <InteractivePagination totalPages={20} initialPage={1} />,
};

// ─── Last page ───────────────────────────────────────────

export const LastPage: Story = {
  render: () => <InteractivePagination totalPages={20} initialPage={20} />,
};

// ─── Sizes ───────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <InteractivePagination totalPages={10} size="sm" initialPage={5} />
      <InteractivePagination totalPages={10} size="md" initialPage={5} />
    </div>
  ),
};

// ─── SSR mode (links) ────────────────────────────────────

export const SSRMode: Story = {
  render: () => (
    <Pagination
      currentPage={3}
      totalPages={10}
      baseUrl="/collections/all"
      size="md"
    />
  ),
};

// ─── Two pages ───────────────────────────────────────────

export const TwoPages: Story = {
  render: () => <InteractivePagination totalPages={2} />,
};

// ─── Wider sibling count ─────────────────────────────────

export const WiderSiblingCount: Story = {
  render: () => (
    <InteractivePagination totalPages={20} siblingCount={2} initialPage={10} />
  ),
};
