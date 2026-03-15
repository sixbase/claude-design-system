import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import { CookieConsent } from './CookieConsent';
import type { CookieCategory } from './CookieConsent';

const categories: CookieCategory[] = [
  {
    id: 'essential',
    label: 'Strictly Necessary Cookies',
    description: 'These keep the site running — things like staying logged in, keeping your cart, and processing secure payments. They can\'t be turned off.',
    required: true,
    defaultChecked: true,
    learnMoreHref: '#',
  },
  {
    id: 'functional',
    label: 'Functional Cookies',
    description: 'These remember your preferences — like your language, region, or how you\'ve customized the site. Some are set by us, others by third-party services we use to enhance your experience. If you turn these off, some of those features may not work as expected.',
    defaultChecked: true,
    learnMoreHref: '#',
  },
  {
    id: 'performance',
    label: 'Performance Cookies',
    description: 'These help us understand how the site is performing and how people are using it — things like which pages get the most visits, where traffic is coming from, and where things could be smoother. This data helps us improve the experience. None of it is tied to you personally.',
    defaultChecked: true,
    learnMoreHref: '#',
  },
  {
    id: 'targeting',
    label: 'Targeting Cookies',
    description: 'These may be placed by our advertising partners to build a profile of your interests based on your browsing activity. They\'re used to show you more relevant ads on other sites. They don\'t store personal information directly, but work by identifying your browser and device. If you turn these off, you\'ll see less targeted advertising.',
    learnMoreHref: '#',
  },
];

const meta: Meta<typeof CookieConsent> = {
  title: 'Components/CookieConsent',
  component: CookieConsent,
  tags: ['autodocs'],
  decorators: [
    // Contain the fixed-position banner within the Storybook canvas
    (Story) => (
      <div style={{ transform: 'translateZ(0)', position: 'relative', minHeight: 500, overflow: 'hidden' }}>
        <div style={{ padding: 24 }}>
          <p style={{ color: 'var(--color-foreground-subtle)', fontFamily: 'var(--font-family-sans)', fontSize: 'var(--font-size-sm)' }}>
            Page content behind the banner. Scroll down to see the cookie consent dialog.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CookieConsent>;

export const Default: Story = {
  args: {
    onAccept: (ids: string[]) => console.log('Accepted:', ids),
    onReject: () => console.log('Rejected'),
  },
};

export const WithCategories: Story = {
  args: {
    categories,
    onAccept: (ids: string[]) => console.log('Accepted:', ids),
    onReject: () => console.log('Rejected'),
  },
};

export const CustomLabels: Story = {
  args: {
    categories,
    heading: 'Cookie Settings',
    description: 'This website uses cookies to ensure you get the best experience.',
    acceptLabel: 'Allow All Cookies',
    rejectLabel: 'Deny All',
    preferencesLabel: 'Manage Cookies',
    saveLabel: 'Confirm My Choices',
    closeLabel: 'Dismiss',
    onAccept: (ids: string[]) => console.log('Accepted:', ids),
    onReject: () => console.log('Rejected'),
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <div style={{ padding: 24 }}>
          <Button onClick={() => setOpen(true)}>Show Cookie Banner</Button>
          <p style={{ marginTop: 12, color: 'var(--color-foreground-subtle)', fontFamily: 'var(--font-family-sans)', fontSize: 'var(--font-size-sm)' }}>
            Banner is {open ? 'visible' : 'hidden'}
          </p>
        </div>
        <CookieConsent
          open={open}
          onOpenChange={setOpen}
          categories={categories}
          onAccept={(ids) => {
            console.log('Accepted:', ids);
            setOpen(false);
          }}
          onReject={() => {
            console.log('Rejected');
            setOpen(false);
          }}
        />
      </>
    );
  },
};
