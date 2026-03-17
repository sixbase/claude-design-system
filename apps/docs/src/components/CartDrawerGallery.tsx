import { useState, useCallback } from 'react';
import { Button, CartDrawer, Text } from '@ds/components';
import type { CartDrawerItemData } from '@ds/components';

// ─── Shared data ──────────────────────────────────────────

function makePlaceholder(label: string): string {
  const encoded = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
      `<rect width="400" height="400" fill="#c8bfae"/>` +
      `<text x="200" y="200" text-anchor="middle" dominant-baseline="central" ` +
      `font-family="system-ui,sans-serif" font-size="18" fill="#7a7262">${label}</text>` +
      `</svg>`,
  );
  return `data:image/svg+xml,${encoded}`;
}

const SAMPLE_ITEMS: CartDrawerItemData[] = [
  {
    id: 'tote-1',
    name: 'Minimal Canvas Tote',
    price: 4800,
    quantity: 1,
    image: makePlaceholder('Canvas Tote'),
  },
  {
    id: 'shirt-1',
    name: 'Relaxed Linen Shirt',
    price: 8900,
    quantity: 2,
    image: makePlaceholder('Linen Shirt'),
    compareAtPrice: 11200,
    options: [
      { name: 'Size', value: 'M' },
      { name: 'Color', value: 'Oat' },
    ],
  },
  {
    id: 'wallet-1',
    name: 'Vegetable-Tanned Wallet',
    price: 6500,
    quantity: 1,
    image: makePlaceholder('Wallet'),
  },
];

function computeSubtotal(items: CartDrawerItemData[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ─── Default (3 items) ────────────────────────────────────

export function CartDrawerDefault() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const subtotal = computeSubtotal(items);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open Cart (3 items)</Button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        subtotal={subtotal}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────

export function CartDrawerEmpty() {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open Empty Cart</Button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={[]}
        subtotal={0}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </div>
  );
}

// ─── Many items (scrollable) ──────────────────────────────

export function CartDrawerManyItems() {
  const manyItems: CartDrawerItemData[] = Array.from({ length: 8 }, (_, i) => ({
    id: `item-${i}`,
    name: `Product ${i + 1}`,
    price: 2500 + i * 500,
    quantity: 1 + (i % 3),
    image: makePlaceholder(`Product ${i + 1}`),
  }));

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(manyItems);
  const subtotal = computeSubtotal(items);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open Cart (8 items)</Button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        subtotal={subtotal}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

// ─── With footer content ──────────────────────────────────

export function CartDrawerWithFooter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(SAMPLE_ITEMS.slice(0, 1));
  const subtotal = computeSubtotal(items);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="ds-gallery-row">
      <Button onClick={() => setOpen(true)}>Open Cart with Shipping Note</Button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        subtotal={subtotal}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      >
        <Text size="xs" muted>
          Free shipping on orders over $50
        </Text>
      </CartDrawer>
    </div>
  );
}
