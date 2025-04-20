module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'eslint:recommended',
  ],
  rules: {
    'func-call-spacing': ['error', 'never'],
    semi: ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
  },
}
