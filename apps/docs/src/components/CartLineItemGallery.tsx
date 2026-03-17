import { useState } from 'react';
import { CartLineItem } from '@ds/components';
import { Preview } from './Preview';

export function CartLineItemDefault() {
  const [quantity, setQuantity] = useState(1);
  return (
    <Preview>
      <div style={{ maxWidth: '720px', width: '100%' }}>
        <CartLineItem
          id="1"
          name="Canvas Tote Bag"
          price={4800}
          quantity={quantity}
          image="https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop"
          imageAlt="Canvas tote bag"
          onQuantityChange={setQuantity}
          onRemove={() => setQuantity(1)}
        />
      </div>
    </Preview>
  );
}

export function CartLineItemWithOptions() {
  const [quantity, setQuantity] = useState(2);
  return (
    <Preview>
      <div style={{ maxWidth: '720px', width: '100%' }}>
        <CartLineItem
          id="2"
          name="Linen Button-Down Shirt"
          price={8900}
          quantity={quantity}
          image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop"
          options={[
            { name: 'Size', value: 'XL' },
            { name: 'Color', value: 'Stone' },
          ]}
          onQuantityChange={setQuantity}
          onRemove={() => setQuantity(1)}
        />
      </div>
    </Preview>
  );
}

export function CartLineItemOnSale() {
  const [quantity, setQuantity] = useState(1);
  return (
    <Preview>
      <div style={{ maxWidth: '720px', width: '100%' }}>
        <CartLineItem
          id="3"
          name="Leather Weekender"
          price={12800}
          compareAtPrice={16500}
          quantity={quantity}
          image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop"
          onQuantityChange={setQuantity}
          onRemove={() => setQuantity(1)}
        />
      </div>
    </Preview>
  );
}

export function CartLineItemWithLink() {
  const [quantity, setQuantity] = useState(1);
  return (
    <Preview>
      <div style={{ maxWidth: '720px', width: '100%' }}>
        <CartLineItem
          id="4"
          name="Merino Wool Beanie"
          price={3200}
          quantity={quantity}
          href="/products/beanie"
          image="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=200&h=200&fit=crop"
          onQuantityChange={setQuantity}
          onRemove={() => setQuantity(1)}
        />
      </div>
    </Preview>
  );
}

export function CartLineItemNoImage() {
  const [quantity, setQuantity] = useState(1);
  return (
    <Preview>
      <div style={{ maxWidth: '720px', width: '100%' }}>
        <CartLineItem
          id="5"
          name="Gift Card"
          price={5000}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onRemove={() => setQuantity(1)}
        />
      </div>
    </Preview>
  );
}

export function CartLineItemMultiple() {
  const [items, setItems] = useState([
    { id: '1', name: 'Canvas Tote Bag', price: 4800, quantity: 1, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop' },
    { id: '2', name: 'Linen Shirt', price: 8900, quantity: 2, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop', options: [{ name: 'Size', value: 'M' }] as Array<{ name: string; value: string }> },
    { id: '3', name: 'Leather Wallet', price: 6500, quantity: 1, compareAtPrice: 8500, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop' },
  ]);

  return (
    <Preview>
      <div style={{ maxWidth: '720px', width: '100%' }}>
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
    </Preview>
  );
}
