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
      reactHooks.configs.flat['recommended-latest'], // v7: flat configs live under .flat
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
      // eslint-plugin-react-hooks 7 ships the React Compiler readiness rules as errors. They
      // report 23 places (2026-09-10: 9 set-state-in-effect, 7 static-components, 3
      // immutability, 2 use-memo, 1 refs, 1 purity) that work today but would block the
      // compiler. Advisory until the punch-list item RC-01 works through them; the two
      // correctness rules (rules-of-hooks, exhaustive-deps) keep their recommended level.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
])
