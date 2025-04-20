module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  printWidth: 100,
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.tsx',
      options: {
        semi: false,
      },
    },
  ],
}
