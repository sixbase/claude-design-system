import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select' },
    size: { control: 'select' },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

/* ─── Inline SVG status icons (12×12, matches badge font size) ─── */

const CheckIcon = (
  <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const AlertIcon = (
  <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4v2.5M6 8.5h.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M5.13 1.87a1 1 0 0 1 1.74 0l3.87 6.74A1 1 0 0 1 9.87 10H2.13a1 1 0 0 1-.87-1.39l3.87-6.74Z" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

const XIcon = (
  <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

/* ─── Individual variants ──────────────────────────────────────── */

export const Default: Story = { args: { children: 'New' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Sale' } };
export const Success: Story = { args: { variant: 'success', icon: CheckIcon, children: 'In stock' } };
export const Warning: Story = { args: { variant: 'warning', icon: AlertIcon, children: 'Low stock' } };
export const Destructive: Story = { args: { variant: 'destructive', icon: XIcon, children: 'Out of stock' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Archive' } };
export const Small: Story = { args: { size: 'sm', children: 'New' } };

/* ─── Notification count ───────────────────────────────────────── */

export const NotificationCount: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
      <Badge count={3} />
      <Badge count={1} variant="destructive" />
      <Badge count={99} variant="secondary" />
    </div>
  ),
};

/* ─── All variants ─────────────────────────────────────────────── */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="default">New</Badge>
      <Badge variant="secondary">Sale</Badge>
      <Badge variant="success" icon={CheckIcon}>In stock</Badge>
      <Badge variant="warning" icon={AlertIcon}>Low stock</Badge>
      <Badge variant="destructive" icon={XIcon}>Out of stock</Badge>
      <Badge variant="outline">Archive</Badge>
    </div>
  ),
};

export const EcommerceContext: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="default" size="sm">New arrival</Badge>
      <Badge variant="secondary" size="sm">20% off</Badge>
      <Badge variant="success" size="sm" icon={CheckIcon}>Free shipping</Badge>
      <Badge variant="destructive" size="sm" icon={XIcon}>Final sale</Badge>
      <Badge variant="warning" size="sm" icon={AlertIcon}>2 left</Badge>
    </div>
  ),
};
