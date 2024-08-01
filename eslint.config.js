import stylistic from '@stylistic/eslint-plugin'
import reactRefresh from 'eslint-plugin-react-refresh'

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  stylistic.configs.customize({
    // the following options are the default values
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
  }),
  {
    languageOptions: {
      globals: { browser: true, es2020: true },
    },
    ignores: ['dist', '.eslintrc.cjs'],
    plugins: {
      '@stylistic': stylistic,
      'react-refresh': reactRefresh,
    },
    rules: {
      '@stylistic/max-len': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
)
