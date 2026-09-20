import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/custom-rules',
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Sempre por último: desliga regras de formatação que o Prettier já resolve,
  // evitando o ESLint e o Prettier discordarem sobre a mesma linha.
  skipFormatting,
)
