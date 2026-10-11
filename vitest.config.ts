import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/index.ts',
        'src/**/*.d.ts',
        'src/**/*.types.ts',
        'src/core/types/**',
        'src/core/state/app-state.ts',
        'src/core/services/models/**',
        'src/assets/**',
        'src/core/firebase/firebase.ts',
        'src/main.ts',
      ],
    },
  },
});
