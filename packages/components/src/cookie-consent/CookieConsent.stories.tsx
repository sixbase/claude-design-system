import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import { CookieConsent } from './CookieConsent';
import type { CookieCategory } from './CookieConsent';

const categories: CookieCategory[] = [
  {
    id: 'essential',
    label: 'Strictly Necessary Cookies',
    description: 'These cookies are essential for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you.',
    required: true,
  },
  {
    id: 'functional',
    label: 'Functional Cookies',
    description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers.',
  },
  {
    id: 'performance',
    label: 'Performance Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
  },
  {
    id: 'targeting',
    label: 'Targeting Cookies',
    description: 'These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.',
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
