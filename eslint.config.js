// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/tests/**/*.ts'],
    plugins: { playwright },
    rules: { ...playwright.configs['flat/recommended'].rules },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'allure-report/**',
      'allure-results/**',
      'test-results/**',
      'eslint.config.js',
    ],
  },
);
