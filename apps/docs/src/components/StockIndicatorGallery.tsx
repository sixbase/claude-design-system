import { StockIndicator } from '@ds/components';
import { Preview } from './Preview';

export function StockIndicatorDefault() {
  return (
    <Preview>
      <StockIndicator />
    </Preview>
  );
}

export function StockIndicatorStatuses() {
  return (
    <Preview>
      <StockIndicator status="in-stock" />
      <StockIndicator status="low-stock" />
      <StockIndicator status="out-of-stock" />
    </Preview>
  );
}

export function StockIndicatorCustomLabel() {
  return (
    <Preview>
      <StockIndicator status="in-stock" label="Ships in 1–2 days" />
      <StockIndicator status="low-stock" label="Only 3 left" />
      <StockIndicator status="out-of-stock" label="Back in stock March 20" />
    </Preview>
  );
}
