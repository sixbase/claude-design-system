import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CartLineItem } from './CartLineItem';

const meta: Meta<typeof CartLineItem> = {
  title: 'Ecommerce/CartLineItem',
  component: CartLineItem,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof CartLineItem>;

function Controlled(props: Partial<React.ComponentProps<typeof CartLineItem>>) {
  const [quantity, setQuantity] = useState(props.quantity ?? 1);
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  return (
    <CartLineItem
      id="demo-1"
      name="Canvas Tote Bag"
      price={4800}
      onQuantityChange={setQuantity}
      onRemove={() => setRemoved(true)}
      {...props}
      quantity={quantity}
    />
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '720px' }}>
      <Controlled
        image="https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop"
        imageAlt="Canvas tote bag"
      />
    </div>
  ),
};

export const WithOptions: Story = {
  render: () => (
    <div style={{ maxWidth: '720px' }}>
      <Controlled
        name="Linen Button-Down Shirt"
        price={8900}
        image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop"
        options={[
          { name: 'Size', value: 'XL' },
          { name: 'Color', value: 'Stone' },
        ]}
      />
    </div>
  ),
};

export const OnSale: Story = {
  render: () => (
    <div style={{ maxWidth: '720px' }}>
      <Controlled
        name="Leather Weekender"
        price={12800}
        compareAtPrice={16500}
        image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop"
        quantity={1}
      />
    </div>
  ),
};

export const WithLink: Story = {
  render: () => (
    <div style={{ maxWidth: '720px' }}>
      <Controlled
        name="Merino Wool Beanie"
        price={3200}
        href="/products/beanie"
        image="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=200&h=200&fit=crop"
      />
    </div>
  ),
};

export const NoImage: Story = {
  render: () => (
    <div style={{ maxWidth: '720px' }}>
      <Controlled name="Gift Card" price={5000} />
    </div>
  ),
};

export const LongName: Story = {
  render: () => (
    <div style={{ maxWidth: '720px' }}>
      <Controlled
        name="Hand-Stitched Italian Leather Messenger Bag with Brass Hardware and Adjustable Shoulder Strap"
        price={24500}
        image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop"
        options={[
          { name: 'Color', value: 'Cognac' },
          { name: 'Size', value: 'Large' },
          { name: 'Monogram', value: 'A.T.' },
        ]}
      />
    </div>
  ),
};

export const MultipleItems: Story = {
  render: () => {
    function CartList() {
      const [items, setItems] = useState([
        { id: '1', name: 'Canvas Tote Bag', price: 4800, quantity: 1, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop' },
        { id: '2', name: 'Linen Shirt', price: 8900, quantity: 2, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop', options: [{ name: 'Size', value: 'M' }] },
        { id: '3', name: 'Leather Wallet', price: 6500, quantity: 1, compareAtPrice: 8500, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop' },
      ]);

      return (
        <div style={{ maxWidth: '720px' }}>
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              compareAtPrice={item.compareAtPrice}
              quantity={item.quantity}
              image={item.image}
              options={item.options}
              onQuantityChange={(q) =>
                setItems((prev) =>
                  prev.map((i) => (i.id === item.id ? { ...i, quantity: q } : i)),
                )
              }
              onRemove={() =>
                setItems((prev) => prev.filter((i) => i.id !== item.id))
              }
            />
          ))}
        </div>
      );
    }

    return <CartList />;
  },
};
