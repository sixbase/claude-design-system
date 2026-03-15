import { Caption, Code, Heading, Text } from '@ds/components';
import { Preview } from './Preview';

export function HeadingGallery() {
  return (
    <Preview stack>
      <Heading as="h1">Heading 1 — Page title</Heading>
      <Heading as="h2">Heading 2 — Section title</Heading>
      <Heading as="h3">Heading 3 — Subsection</Heading>
      <Heading as="h4">Heading 4 — Card title</Heading>
      <Heading as="h2" muted>
        Heading 2 — Muted
      </Heading>
    </Preview>
  );
}

export function TextGallery() {
  return (
    <Preview stack>
      <Text size="lg">Large — lead paragraph copy</Text>
      <Text size="base">Base — default body copy for most content</Text>
      <Text size="sm">Small — secondary or supporting text</Text>
      <Text weight="semibold">Semibold weight for emphasis</Text>
      <Text muted>Muted text for subdued content</Text>
    </Preview>
  );
}

export function InlineGallery() {
  return (
    <Preview stack>
      <Caption>Caption — Last updated March 14, 2026</Caption>
      <Text>
        Use the <Code>variant</Code> prop to change the button style.
      </Text>
    </Preview>
  );
}
