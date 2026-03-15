import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export function createVitestConfig(options?: { include?: string[] }) {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: options?.include ?? ['src/**/*.test.{ts,tsx}'],
      coverage: {
        reporter: ['text', 'lcov'],
        exclude: ['**/index.ts', '**/*.stories.tsx', '**/vitest.setup.ts'],
      },
    },
  });
}
