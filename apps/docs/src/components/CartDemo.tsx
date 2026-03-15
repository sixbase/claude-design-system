import { useState, useMemo, useCallback } from 'react';
import { Heading, Text } from '@ds/components';
import { Button } from '@ds/components';
import { QuantitySelector } from '@ds/components';
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

export function CartDemo() {
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
      <div className="ds-cart">
        <div className="ds-cart__empty">
          <Heading level={3} size="xl">
            Your cart is empty
          </Heading>
          <Text size="sm" muted>
            Looks like you haven't added anything yet.
          </Text>
          <Button variant="secondary" size="md" asChild>
            <a href="/examples/collection">Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  // ─── Cart with items ──────────────────────────────────

  return (
    <div className="ds-cart">
      <div className="ds-cart__header">
        <Heading level={1} size="2xl">
          Your Cart
        </Heading>
        <Text size="sm" muted>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      </div>

      {/* ── Line Items ───────────────────────────────────── */}
      <div className="ds-cart__items">
        {items.map((item) => (
          <div key={item.product.id} className="ds-cart__line-item">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="ds-cart__item-image"
            />
            <div className="ds-cart__item-details">
              <Text size="sm" weight="semibold">
                {item.product.name}
              </Text>
              <Text size="sm" muted>
                {formatPrice(item.product.price)}
              </Text>
              <QuantitySelector
                size="sm"
                value={item.quantity}
                min={1}
                max={10}
                onChange={(val) => updateQuantity(item.product.id, val)}
              />
            </div>
            <div className="ds-cart__item-actions">
              <Text size="sm" weight="semibold">
                {formatPrice(item.product.price * item.quantity)}
              </Text>
              <button
                type="button"
                className="ds-cart__remove-btn"
                onClick={() => removeItem(item.product.id)}
                aria-label={`Remove ${item.product.name}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Summary ──────────────────────────────────────── */}
      <div className="ds-cart__summary">
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
          <a href="/examples/collection">Continue Shopping</a>
        </Button>
      </div>
    </div>
  );
}
