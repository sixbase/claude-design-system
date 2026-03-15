import { ColorSwatch } from '@ds/components';
import { Preview } from './Preview';

export function ColorSwatchDefault() {
  return (
    <Preview>
      <ColorSwatch color="var(--color-foreground)" name="foreground" value="#1a1a1a" />
    </Preview>
  );
}

export function ColorSwatchPalette() {
  return (
    <Preview>
      <ColorSwatch color="var(--color-foreground)" name="foreground" value="#1a1a1a" />
      <ColorSwatch color="var(--color-foreground-subtle)" name="foreground-subtle" value="#6b6b6b" />
      <ColorSwatch color="var(--color-border)" name="border" value="#e5e5e5" />
      <ColorSwatch color="var(--color-background-surface)" name="background-surface" value="#fafafa" />
    </Preview>
  );
}

export function ColorSwatchWithoutValue() {
  return (
    <Preview>
      <ColorSwatch color="#22c55e" name="success" />
      <ColorSwatch color="#ef4444" name="destructive" />
      <ColorSwatch color="#f59e0b" name="warning" />
    </Preview>
  );
}
