import { Badge } from '@ds/components';
import { Preview } from './Preview';

/* Inline SVG status icons — WCAG 1.4.1 secondary indicator */
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

export function BadgeVariants() {
  return (
    <Preview>
      <Badge variant="default">New</Badge>
      <Badge variant="secondary">Sale</Badge>
      <Badge variant="success" icon={CheckIcon}>In stock</Badge>
      <Badge variant="warning" icon={AlertIcon}>Low stock</Badge>
      <Badge variant="destructive" icon={XIcon}>Out of stock</Badge>
      <Badge variant="outline">Archive</Badge>
    </Preview>
  );
}

export function BadgeSizes() {
  return (
    <Preview>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </Preview>
  );
}

export function BadgeEcommerce() {
  return (
    <Preview>
      <Badge variant="default" size="sm">New arrival</Badge>
      <Badge variant="secondary" size="sm">20% off</Badge>
      <Badge variant="success" size="sm" icon={CheckIcon}>Free shipping</Badge>
      <Badge variant="destructive" size="sm" icon={XIcon}>Final sale</Badge>
      <Badge variant="warning" size="sm" icon={AlertIcon}>2 left</Badge>
    </Preview>
  );
}
