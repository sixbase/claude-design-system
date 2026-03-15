import { Footer } from '@ds/components';
import { Preview } from './Preview';

const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Phone Cases', href: '#' },
      { label: 'Wallets', href: '#' },
      { label: 'Bags', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Journal', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Warranty', href: '#' },
    ],
  },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export function FooterDefault({ basePath = '' }: { basePath?: string }) {
  return (
    <Preview stack>
      <Footer
        logoSrc={`${basePath}/mason-supply-co-logo.svg`}
        logoAlt="Mason Supply Co."
        tagline="Thoughtfully designed accessories for everyday carry."
        columns={COLUMNS}
        copyright="© 2026 Mason Supply Co. All rights reserved."
        legalLinks={LEGAL_LINKS}
      />
    </Preview>
  );
}

export function FooterMinimal({ basePath = '' }: { basePath?: string }) {
  return (
    <Preview stack>
      <Footer
        logoSrc={`${basePath}/mason-supply-co-logo.svg`}
        logoAlt="Mason Supply Co."
        copyright="© 2026 Mason Supply Co. All rights reserved."
      />
    </Preview>
  );
}
