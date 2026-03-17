import { useState, useMemo, useCallback } from 'react';
import { Heading, Text, Button, CartLineItem } from '@ds/components';
import { PRODUCTS, formatPrice } from '../data/products';
import type { Product } from '../data/products';
import './CartDemo.css';

// ─── Types ────────────────────────────────────────────────

interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Initial cart (pre-populated for demo) ────────────────

const INITIAL_CART: CartItem[] = [
  { product: PRODUCTS[0], quantity: 1 }, // Canvas Tote
  { product: PRODUCTS[2], quantity: 2 }, // Linen Shirt
  { product: PRODUCTS[5], quantity: 1 }, // Leather Wallet
];

const FREE_SHIPPING_THRESHOLD = 5000; // $50.00
const SHIPPING_COST = 800; // $8.00

// ─── Component ────────────────────────────────────────────

export function CartDemo({ basePath = '' }: { basePath?: string }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // ─── Empty state ──────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="ds-cart ds-layout ds-layout--full">
        <div className="ds-cart__empty">
          <Heading level={3} size="xl">
            Your Cart Is Empty
          </Heading>
          <Text size="sm" muted>
            Looks like you haven't added anything yet.
          </Text>
          <Button variant="secondary" size="md" asChild>
            <a href={`${basePath}/examples/collection`}>Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  // ─── Cart with items ──────────────────────────────────

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="ds-cart__header ds-section">
        <Heading level={1} size="2xl">
          Your Cart
        </Heading>
        <Text size="sm" muted>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      </div>

      {/* ── Items + Summary in golden split ─────────────────── */}
      <div className="ds-layout ds-layout--golden">
      <div className="ds-cart__items">
        {items.map((item) => (
          <CartLineItem
            key={item.product.id}
            id={item.product.id}
            name={item.product.name}
            image={item.product.image}
            price={item.product.price}
            compareAtPrice={item.product.compareAtPrice}
            quantity={item.quantity}
            maxQuantity={10}
            onQuantityChange={(val) => updateQuantity(item.product.id, val)}
            onRemove={() => removeItem(item.product.id)}
          />
        ))}
      </div>

      {/* ── Summary ──────────────────────────────────────── */}
      <div className="ds-cart__summary ds-layout__sticky">
        <Heading level={2} size="lg">
          Order Summary
        </Heading>

        <div className="ds-cart__summary-row">
          <Text size="sm" muted>Subtotal</Text>
          <Text size="sm">{formatPrice(subtotal)}</Text>
        </div>
        <div className="ds-cart__summary-row">
          <Text size="sm" muted>Shipping</Text>
          <Text size="sm">{shipping === 0 ? 'Free' : formatPrice(shipping)}</Text>
        </div>

        <hr className="ds-cart__summary-divider" />

        <div className="ds-cart__summary-row">
          <Text size="base" weight="semibold">Total</Text>
          <Text size="base" weight="semibold">{formatPrice(total)}</Text>
        </div>

        {shipping > 0 && (
          <Text size="xs" muted>
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </Text>
        )}

        <Button variant="primary" size="lg" fullWidth>
          Checkout
        </Button>

        <Button variant="secondary" size="md" fullWidth asChild>
          <a href={`${basePath}/examples/collection`}>Continue Shopping</a>
        </Button>
      </div>
      </div>
    </div>
  );
}
