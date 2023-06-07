module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Empty functions are fine, noops are useful and not hurtful
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
}
