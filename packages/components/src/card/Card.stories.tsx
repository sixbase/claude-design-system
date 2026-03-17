import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Text } from '../typography/Typography';
import { Card, CardBody, CardFooter, CardImage } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select' },
    interactive: { control: 'boolean' },
    noPadding: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Elevated: Story = {
  render: () => (
    <Card style={{ width: 280 }}>
      <CardBody>
        <Text weight="semibold">Card Title</Text>
        <Text muted size="sm">Supporting text that describes the content of this card.</Text>
      </CardBody>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" style={{ width: 280 }}>
      <CardBody>
        <Text weight="semibold">Outlined card</Text>
        <Text muted size="sm">Border but no shadow.</Text>
      </CardBody>
    </Card>
  ),
};

export const Ghost: Story = {
  render: () => (
    <Card variant="ghost" style={{ width: 280 }}>
      <CardBody>
        <Text weight="semibold">Ghost card</Text>
        <Text muted size="sm">Subtle background, no border or shadow.</Text>
      </CardBody>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card interactive noPadding style={{ width: 260 }}>
      <CardImage src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" alt="Premium watch" />
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text weight="semibold" size="sm">Premium Watch</Text>
          <Badge variant="default" size="sm">New</Badge>
        </div>
        <Text muted size="sm">Classic timepiece with leather strap</Text>
        <Text weight="semibold">$285.00</Text>
      </CardBody>
      <CardFooter>
        <Button fullWidth size="sm">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
      {(['elevated', 'outlined', 'ghost'] as const).map((variant) => (
        <Card key={variant} variant={variant} style={{ width: 200 }}>
          <CardBody>
            <Text weight="semibold" size="sm" style={{ textTransform: 'capitalize' }}>{variant}</Text>
            <Text muted size="sm">Card content here</Text>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};
