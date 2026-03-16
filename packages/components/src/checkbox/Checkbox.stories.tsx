import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select' },
    checked: { control: 'select', options: [true, false, 'indeterminate'] },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'Remember me' },
};

export const Checked: Story = {
  args: { label: 'Accepted', defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { label: 'Select all items', checked: 'indeterminate' },
};

export const WithHint: Story = {
  args: {
    label: 'Subscribe to newsletter',
    hint: 'We send at most one email per week',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    error: 'You must accept the terms to continue',
  },
};

export const Disabled: Story = {
  args: { label: 'Out of stock', disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Included', disabled: true, defaultChecked: true },
};

export const Small: Story = {
  args: { label: 'Small checkbox', size: 'sm' },
};

export const FilterPanel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', width: '240px' }}>
      <p style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wider)', color: 'var(--color-foreground-muted)', margin: 0 }}>
        Size
      </p>
      <Checkbox size="sm" label="XS" defaultChecked />
      <Checkbox size="sm" label="S" defaultChecked />
      <Checkbox size="sm" label="M" />
      <Checkbox size="sm" label="L" />
      <Checkbox size="sm" label="XL" disabled />
    </div>
  ),
};

export const CheckoutForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '320px' }}>
      <Checkbox
        label="Save this card for future purchases"
        hint="Your card is encrypted and stored securely"
      />
      <Checkbox
        label="Sign me up for email updates"
        hint="Get early access to sales and new arrivals"
      />
      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        error="You must agree to continue"
      />
    </div>
  ),
};
