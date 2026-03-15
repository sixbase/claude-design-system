import { base } from '@ds/eslint-config';

export default [
  ...base,
  { files: ['src/**/*.{ts,mts}', 'scripts/**/*.mjs'] },
  { ignores: ['dist/**'] },
];
