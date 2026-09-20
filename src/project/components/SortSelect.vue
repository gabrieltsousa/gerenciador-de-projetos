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
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-text-subtle);
  background-color: var(--color-surface);
  color: var(--color-text-muted);
}
</style>
