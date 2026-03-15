import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  render: () => (
    <ProductCard
      name="Classic Cotton T-Shirt"
      price={3200}
      image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
      style={{ width: 220 }}
    />
  ),
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 220px)', gap: 'var(--spacing-4)' }}>
      <ProductCard
        name="Classic Cotton T-Shirt"
        price={3200}
        image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
      />
      <ProductCard
        name="Minimalist Watch"
        price={28500}
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop"
      />
      <ProductCard
        name="Leather Crossbody Bag"
        price={12800}
        image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop"
      />
      <ProductCard
        name="Polarized Sunglasses"
        price={9500}
        image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop"
      />
    </div>
  ),
};
