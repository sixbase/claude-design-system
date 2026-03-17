import { useState } from 'react';
import { Alert } from '@ds/components';

export function AlertVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Alert variant="info" title="Free shipping">
        Orders over $100 qualify for free standard shipping.
      </Alert>
      <Alert variant="success" title="Back in stock">
        The Organic Cotton Tee in size M is available again.
      </Alert>
      <Alert variant="warning" title="Low stock">
        Only 2 left in this size. Order soon to secure yours.
      </Alert>
      <Alert variant="destructive" title="Payment failed">
        Your card was declined. Please update your payment method.
      </Alert>
    </div>
  );
}

export function AlertDescriptionOnly() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Alert variant="info">Free returns within 30 days of purchase.</Alert>
      <Alert variant="success">Item added to your cart.</Alert>
    </div>
  );
}

export function AlertDismissible() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-sm)' }}
      >
        Show alert again
      </button>
    );
  }

  return (
    <Alert
      variant="warning"
      title="Limited time offer"
      dismissible
      onDismiss={() => setVisible(false)}
    >
      Use code SAVE20 at checkout for 20% off your order.
    </Alert>
  );
}

export function AlertEcommerce() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Alert variant="success">Item added to your cart.</Alert>
      <Alert variant="warning" title="Low stock">Only 3 remaining at this price.</Alert>
      <Alert variant="destructive" title="Out of stock">
        This item is no longer available in the selected size.
      </Alert>
      <Alert variant="info" dismissible onDismiss={() => {}}>
        Free returns within 30 days of purchase.
      </Alert>
    </div>
  );
}
