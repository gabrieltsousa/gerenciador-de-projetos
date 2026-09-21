<script setup lang="ts">
import { SORT_OPTIONS, type SortOption } from '../project.sorting'

defineProps<{ modelValue: SortOption }>()
const emit = defineEmits<{ 'update:modelValue': [value: SortOption] }>()

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value as SortOption)
}
</script>

<template>
  <label class="sort-select">
    <span class="sr-only">Ordenar por</span>
    <select class="sort-select__control" :value="modelValue" @change="handleChange">
      <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.sort-select__control {
  padding: var(--space-3) var(--space-4);
  padding-right: var(--space-8);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-text-subtle);
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  /* appearance:auto cola a seta nativa na borda direita sem respeitar
     padding. appearance:none + seta própria via background-image dá
     controle da posição — o <select> continua 100% nativo por baixo
     (clique/teclado abrem a lista normalmente, só o indicador é outro). */
  appearance: none;
  /* Cor fixa (não var(--color-text-muted)) porque custom properties não
     são confiáveis dentro de um data URI de SVG entre navegadores. */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236d6d6d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-4) center;
  background-size: 1rem;
}
</style>
