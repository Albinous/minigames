import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';

export default defineConfig(
  {
    ignores: ['dist', 'node_modules'],
    linterOptions: {
      noInlineConfig: true,
    },
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: {
      unicorn,
    },

    rules: {
      ...unicorn.configs.recommended.rules,

      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
