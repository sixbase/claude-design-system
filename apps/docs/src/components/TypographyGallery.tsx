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
      <div className="ds-demo-prose">
        <Text size="lg">
          Every piece in the collection is designed to age with you — not against
          you. We source full-grain leathers and woven textiles that develop
          character over time.
        </Text>
      </div>
      <div className="ds-demo-prose">
        <Text size="base">
          Our phone cases are made from aramid fiber, the same material used in
          aerospace and body armor. At 0.65mm thin, they add virtually no bulk
          while protecting against drops up to 6 feet. Each case is precision-cut
          for your exact device model with openings for every port and button.
        </Text>
      </div>
      <div className="ds-demo-prose">
        <Text size="sm">
          Free standard shipping on all orders over $50. Express and overnight
          options are available at checkout. We ship to all 50 US states and
          select international destinations.
        </Text>
      </div>
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
