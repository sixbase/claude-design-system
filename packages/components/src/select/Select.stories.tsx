import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectGroup, SelectItem, SelectSeparator } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select' },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Size',
    placeholder: 'Choose a size',
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="xs">XS</SelectItem>
      <SelectItem value="sm">SM</SelectItem>
      <SelectItem value="md">MD</SelectItem>
      <SelectItem value="lg">LG</SelectItem>
      <SelectItem value="xl">XL</SelectItem>
    </Select>
  ),
};

export const WithHint: Story = {
  render: () => (
    <Select label="Country" hint="Used for shipping calculations" placeholder="Select country">
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
      <SelectItem value="gb">United Kingdom</SelectItem>
      <SelectItem value="au">Australia</SelectItem>
    </Select>
  ),
};

export const WithError: Story = {
  render: () => (
    <Select label="Size" error="Please select a size to continue" placeholder="Choose a size">
      <SelectItem value="sm">SM</SelectItem>
      <SelectItem value="md">MD</SelectItem>
      <SelectItem value="lg">LG</SelectItem>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select label="Size" disabled placeholder="Out of stock">
      <SelectItem value="sm">SM</SelectItem>
      <SelectItem value="md">MD</SelectItem>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select label="Category" placeholder="Browse categories">
      <SelectGroup label="Clothing">
        <SelectItem value="tops">Tops</SelectItem>
        <SelectItem value="bottoms">Bottoms</SelectItem>
        <SelectItem value="outerwear">Outerwear</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Accessories">
        <SelectItem value="bags">Bags</SelectItem>
        <SelectItem value="shoes">Shoes</SelectItem>
        <SelectItem value="jewelry">Jewelry</SelectItem>
      </SelectGroup>
    </Select>
  ),
};

export const SortOrder: Story = {
  render: () => (
    <Select label="Sort by" defaultValue="featured">
      <SelectItem value="featured">Featured</SelectItem>
      <SelectItem value="newest">Newest arrivals</SelectItem>
      <SelectItem value="price-asc">Price: low to high</SelectItem>
      <SelectItem value="price-desc">Price: high to low</SelectItem>
      <SelectItem value="rating">Top rated</SelectItem>
    </Select>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Select label="Shipping method" fullWidth placeholder="Choose shipping">
        <SelectItem value="standard">Standard (5–7 days)</SelectItem>
        <SelectItem value="express">Express (2–3 days)</SelectItem>
        <SelectItem value="overnight">Overnight</SelectItem>
      </Select>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px' }}>
      <Select size="sm" label="Small" placeholder="Small">
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </Select>
      <Select size="md" label="Medium" placeholder="Medium">
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </Select>
      <Select size="lg" label="Large" placeholder="Large">
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </Select>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Select label="Size" placeholder="Choose a size">
      <SelectItem value="xs">XS</SelectItem>
      <SelectItem value="sm">SM</SelectItem>
      <SelectItem value="md" disabled>MD (sold out)</SelectItem>
      <SelectItem value="lg">LG</SelectItem>
      <SelectItem value="xl" disabled>XL (sold out)</SelectItem>
    </Select>
  ),
};
