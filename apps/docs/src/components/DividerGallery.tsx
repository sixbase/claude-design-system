import { Divider } from '@ds/components';
import { Preview } from './Preview';

export function DividerDefault() {
  return (
    <Preview stack>
      <p>Content above the divider</p>
      <Divider />
      <p>Content below the divider</p>
    </Preview>
  );
}

export function DividerVariants() {
  return (
    <Preview stack>
      <p>Default variant</p>
      <Divider />
      <p>Subtle variant</p>
      <Divider variant="subtle" />
      <p>End</p>
    </Preview>
  );
}

export function DividerSpacings() {
  return (
    <Preview stack>
      <p>No spacing</p>
      <Divider spacing="none" />
      <p>Small spacing</p>
      <Divider spacing="sm" />
      <p>Medium spacing (default)</p>
      <Divider spacing="md" />
      <p>Large spacing</p>
      <Divider spacing="lg" />
      <p>End</p>
    </Preview>
  );
}

export function DividerVertical() {
  return (
    <Preview>
      <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
        <span>Left</span>
        <Divider orientation="vertical" />
        <span>Right</span>
      </div>
    </Preview>
  );
}
