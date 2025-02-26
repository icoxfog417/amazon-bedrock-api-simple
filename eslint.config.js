import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // First, ignore cdk.out completely
  {
    ignores: ['cdk.out/**', '**/cdk.out/**', 'cdk.out', '**/cdk.out', '**/*.d.ts']
  },
  // Then, configure rules for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        // Add Node.js globals
        process: 'readonly',
        console: 'readonly',
        // Add Jest globals
        describe: 'readonly',
        beforeEach: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        it: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
        beforeAll: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs['eslint-recommended'].rules,
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'warn' // Change from error to warning
    }
  }
];
