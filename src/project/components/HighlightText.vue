<script setup lang="ts">
import { computed } from 'vue'

import { getHighlightSegments } from '../project.search'

const props = defineProps<{
  text: string
  query: string
}>()

// Segmentos de texto puro renderizados em spans — v-html nunca entra em
// contato com o texto do usuário, então não existe superfície de XSS aqui.
const segments = computed(() => getHighlightSegments(props.text, props.query))
</script>

<template>
  <span>
    <template v-for="(segment, index) in segments" :key="index">
      <mark v-if="segment.matched" class="highlight-text__match">{{ segment.text }}</mark>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>

<style scoped>
.highlight-text__match {
  background-color: var(--color-accent);
  color: var(--color-heading);
  border-radius: 0.2em;
  padding: 0 0.1em;
}
</style>
