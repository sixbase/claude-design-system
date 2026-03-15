import { Breadcrumb } from '@ds/components';
import { Preview } from './Preview';

export function BreadcrumbDefault() {
  return (
    <Preview>
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Women', href: '#' },
          { label: 'Dresses', href: '#' },
          { label: 'Midi Dresses' },
        ]}
      />
    </Preview>
  );
}

export function BreadcrumbCustomSeparator() {
  return (
    <Preview>
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Collections', href: '#' },
          { label: 'Summer 2025' },
        ]}
        separator="›"
      />
    </Preview>
  );
}

export function BreadcrumbShort() {
  return (
    <Preview>
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Cart' },
        ]}
      />
    </Preview>
  );
}
