module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, semi: false }]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.json', '.sol']
      }
    }
  }
}
