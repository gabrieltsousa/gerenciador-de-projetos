<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label class="favorites-toggle">
    <input
      type="checkbox"
      role="switch"
      class="favorites-toggle__input"
      :checked="modelValue"
      @change="handleChange"
    />
    <span class="favorites-toggle__track" aria-hidden="true">
      <span class="favorites-toggle__thumb" />
    </span>
    <span>Apenas Favoritos</span>
  </label>
</template>

<style scoped>
.favorites-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-heading);
}

.favorites-toggle__input {
  position: absolute;
  opacity: 0;
  width: 2.5rem;
  height: 1.5rem;
  margin: 0;
}

.favorites-toggle__track {
  position: relative;
  width: 2.5rem;
  height: 1.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-toggle-off);
  transition: background-color 0.15s ease;
}

.favorites-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: var(--color-surface);
  transition: transform 0.15s ease;
}

.favorites-toggle__input:checked + .favorites-toggle__track {
  background-color: var(--color-accent);
}

.favorites-toggle__input:checked + .favorites-toggle__track .favorites-toggle__thumb {
  transform: translateX(1rem);
}

.favorites-toggle__input:focus-visible + .favorites-toggle__track {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}
</style>
