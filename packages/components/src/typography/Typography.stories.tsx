import type { Meta, StoryObj } from '@storybook/react';
import { Caption, Code, Heading, Text } from './Typography';

const meta: Meta = {
  title: 'Components/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const HeadingScale: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Heading as="h1">Heading 1 — Page title</Heading>
      <Heading as="h2">Heading 2 — Section title</Heading>
      <Heading as="h3">Heading 3 — Subsection</Heading>
      <Heading as="h4">Heading 4 — Card title</Heading>
    </div>
  ),
};

export const BodyScale: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <Text size="lg">Large body — for lead paragraphs and introductory text.</Text>
      <Text size="base">Base body — the default size for most content.</Text>
      <Text size="sm">Small body — for secondary content, form hints, and labels.</Text>
    </div>
  ),
};

export const Weights: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <Text weight="normal">Normal weight (400)</Text>
      <Text weight="medium">Medium weight (500)</Text>
      <Text weight="semibold">Semibold weight (600)</Text>
      <Text weight="bold">Bold weight (700)</Text>
    </div>
  ),
};

export const Muted: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <Heading as="h3">Normal heading</Heading>
      <Heading as="h3" muted>Muted heading</Heading>
      <Text>Normal text</Text>
      <Text muted>Muted text</Text>
    </div>
  ),
};

export const CaptionAndCode: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <Caption>Last modified March 14, 2026 · 2 min read</Caption>
      <Text>
        Use the <Code>Button</Code> component with <Code>variant="primary"</Code> for primary
        actions.
      </Text>
    </div>
  ),
};

export const Truncate: StoryObj = {
  render: () => (
    <div style={{ width: '200px' }}>
      <Text truncate>This is a very long line of text that should be truncated with an ellipsis</Text>
    </div>
  ),
};
