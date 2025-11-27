/* eslint-disable @typescript-eslint/no-require-imports */
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // Desabilita regras que podem ser muito restritivas durante desenvolvimento
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-require-imports': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error'
  },
  settings: {
    react: {
      version: '17.0'
    }
  }
};
