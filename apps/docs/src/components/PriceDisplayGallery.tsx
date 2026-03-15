import { PriceDisplay } from '@ds/components';
import { Preview } from './Preview';

export function PriceDisplayDefault() {
  return (
    <Preview>
      <PriceDisplay price="$48.00" />
    </Preview>
  );
}

export function PriceDisplayWithCompare() {
  return (
    <Preview>
      <PriceDisplay price="$89.00" comparePrice="$112.00" />
    </Preview>
  );
}

export function PriceDisplaySizes() {
  return (
    <Preview direction="column">
      <PriceDisplay price="$48.00" comparePrice="$65.00" size="sm" />
      <PriceDisplay price="$48.00" comparePrice="$65.00" size="md" />
      <PriceDisplay price="$48.00" comparePrice="$65.00" size="lg" />
    </Preview>
  );
}
