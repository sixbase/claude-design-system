import { Header } from '@ds/components';
import { Preview } from './Preview';

const NAV_ITEMS = [
  { label: 'Shop', href: '#' },
  { label: 'Collections', href: '#' },
  { label: 'About', href: '#' },
];

export function HeaderDefault({ basePath = '' }: { basePath?: string }) {
  return (
    <Preview stack>
      <Header
        logoSrc={`${basePath}/mason-supply-co-logo.svg`}
        logoAlt="Mason Supply Co."
        navItems={NAV_ITEMS}
        cartHref="#"
        cartCount={3}
      />
    </Preview>
  );
}

export function HeaderMinimal({ basePath = '' }: { basePath?: string }) {
  return (
    <Preview stack>
      <Header
        logoSrc={`${basePath}/mason-supply-co-logo.svg`}
        logoAlt="Mason Supply Co."
        showThemeToggle={false}
      />
    </Preview>
  );
}
