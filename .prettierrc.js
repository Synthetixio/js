module.exports = {
  useTabs: true,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  overrides: [
    {
      files: '*.md',
      options: {
        useTabs: false,
      },
    },
  ],
}
