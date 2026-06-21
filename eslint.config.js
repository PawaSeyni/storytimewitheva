import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Provider files (language.tsx, toast.tsx) and Pixel.tsx legitimately export
      // their hooks/constants alongside the component. This only affects dev HMR
      // granularity, not correctness, so keep it advisory rather than blocking.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
