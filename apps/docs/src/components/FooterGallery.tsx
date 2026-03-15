import { useState } from 'react';
import { Footer } from '@ds/components';

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

function FooterPreview({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);

  return (
    <div className={`ds-preview${dark ? ' dark' : ''}`}>
      <div className="ds-preview__toolbar">
        <button
          className="ds-preview__toggle"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
      <div className="ds-preview__canvas ds-preview__canvas--stack" style={{ padding: 0 }}>
        {children}
      </div>
    </div>
  );
}

export function FooterDefault({ basePath = '' }: { basePath?: string }) {
  return (
    <FooterPreview>
      <Footer
        logoSrc={`${basePath}/mason-supply-co-logo.svg`}
        logoAlt="Mason Supply Co."
        tagline="Thoughtfully designed accessories for everyday carry."
        columns={COLUMNS}
        copyright="© 2026 Mason Supply Co. All rights reserved."
        legalLinks={LEGAL_LINKS}
        style={{ marginTop: 0 }}
      />
    </FooterPreview>
  );
}

export function FooterMinimal({ basePath = '' }: { basePath?: string }) {
  return (
    <FooterPreview>
      <Footer
        logoSrc={`${basePath}/mason-supply-co-logo.svg`}
        logoAlt="Mason Supply Co."
        copyright="© 2026 Mason Supply Co. All rights reserved."
        style={{ marginTop: 0 }}
      />
    </FooterPreview>
  );
}
