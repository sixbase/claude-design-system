import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'destructive'],
    },
    dismissible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: 'info',
    title: 'New collection available',
    children: 'Our spring collection is now live. Browse the latest arrivals.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Free shipping',
    children: 'Orders over $100 qualify for free standard shipping.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Back in stock',
    children: 'The Organic Cotton Tee in size M is available again.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Low stock',
    children: 'Only 2 left in this size. Order soon to secure yours.',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Payment failed',
    children: 'Your card was declined. Please update your payment method.',
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: 'info',
    children: 'Free returns within 30 days of purchase.',
  },
};

export const AllVariants: Story = {
  render: () => (
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
  ),
};

export const Dismissible: Story = {
  render: () => {
    function DismissDemo() {
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
    return <DismissDemo />;
  },
};

export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Shipping update',
    children:
      'Due to increased demand during our seasonal sale, delivery times may be extended by 2-3 business days. We appreciate your patience and are working hard to get your orders to you as quickly as possible. Track your order status in your account dashboard.',
  },
};

export const EcommerceContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Alert variant="success">
        Item added to your cart.
      </Alert>
      <Alert variant="warning" title="Low stock">
        Only 3 remaining at this price.
      </Alert>
      <Alert variant="destructive" title="Out of stock">
        This item is no longer available in the selected size.
      </Alert>
      <Alert variant="info" dismissible onDismiss={() => {}}>
        Free returns within 30 days of purchase.
      </Alert>
    </div>
  ),
};
