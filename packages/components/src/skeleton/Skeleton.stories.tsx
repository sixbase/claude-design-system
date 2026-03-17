import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select' },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: 'number' },
    animate: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

/* ─── Individual variants ──────────────────────────────────────── */

export const Rectangular: Story = {
  args: { variant: 'rectangular', width: 300, height: 200 },
};

export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
};

export const Text: Story = {
  args: { variant: 'text' },
};

export const TextMultipleLines: Story = {
  args: { variant: 'text', lines: 4 },
};

export const Static: Story = {
  args: { variant: 'rectangular', width: 300, height: 100, animate: false },
};

/* ─── Composition: Product card skeleton ──────────────────────── */

export const ProductCardSkeleton: Story = {
  render: () => (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <Skeleton variant="rectangular" height={280} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  ),
};

/* ─── Composition: Avatar + text ──────────────────────────────── */

export const AvatarWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  ),
};

/* ─── Composition: Grid of cards ──────────────────────────────── */

export const ProductGridSkeleton: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)' }}>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </div>
      ))}
    </div>
  ),
};

/* ─── All variants ─────────────────────────────────────────────── */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '400px' }}>
      <div>
        <div style={{ marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-foreground-muted)' }}>Rectangular</div>
        <Skeleton variant="rectangular" height={100} />
      </div>
      <div>
        <div style={{ marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-foreground-muted)' }}>Circular</div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <div>
        <div style={{ marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-foreground-muted)' }}>Text (single line)</div>
        <Skeleton variant="text" />
      </div>
      <div>
        <div style={{ marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-foreground-muted)' }}>Text (3 lines)</div>
        <Skeleton variant="text" lines={3} />
      </div>
    </div>
  ),
};
