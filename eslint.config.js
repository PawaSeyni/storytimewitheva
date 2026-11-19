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
      // Provider files (language.tsx, toast.tsx), Pixel.tsx and a few components legitimately
      // export their hooks/helpers alongside the component. This only affects dev HMR
      // granularity, not correctness. The known exports are named below so the rule stays
      // useful: a NEW mixed export still warns. (2026-11-19, SW-028)
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        allowExportNames: [
          'useLanguage', 'useTranslation', 'LANGUAGE_LABELS', 'splitLangFromPath', 'localizePath', 'LOCALES', // lib/language.tsx
          'useToast', // lib/toast.tsx
          'usePixelEnabled', // components/Pixel.tsx
          'breadcrumbSchema', // components/Breadcrumbs.tsx (JSON-LD for the same crumbs)
          'hasLeadMagnetRequest', 'isKnownMagnet', 'magnetCopy', // components/EmailSignup.tsx (the magnet registry)
          'SHARED_RESOURCE_IDS', // components/ResourceStrip.tsx
        ],
      }],
    },
  },
])
