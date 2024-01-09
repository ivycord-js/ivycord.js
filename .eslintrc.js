module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['.eslintrc.js', 'dist/**/*', 'examples/**/*'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-case-declarations': 'off',
    'no-inner-declarations': 'off',
    'arrow-parens': 'warn',
    semi: 'warn',
    quotes: ['warn', 'single'],
    'prefer-const': 'warn',
    eqeqeq: 'warn',
    'no-var': 'error',
    'require-await': 'error'
  }
};
