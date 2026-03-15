import '@ds/tokens/css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail stories with any accessibility violations
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#030712' },
      ],
    },
  },
  // Apply dark class to the body when dark background is selected
  decorators: [
    (Story, context) => {
      if (context.globals['backgrounds']?.value === '#030712') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return Story();
    },
  ],
};

export default preview;
