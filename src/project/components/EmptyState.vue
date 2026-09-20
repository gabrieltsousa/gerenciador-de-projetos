<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <h2 class="empty-state__title">{{ title }}</h2>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<style scoped>
.empty-state {
  /* flex: 1 estica o card pra preencher a altura disponível do container pai
     (medi no print de referência: o card ocupa ~880px de 1080px de frame,
     não uma caixa de altura fixa pequena) — min-height é só o piso quando o
     pai não é um contâiner flex. */
  flex: 1;
  min-height: 20rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-4);
}

.empty-state__title {
  margin: 0;
  color: var(--color-heading);
  font-size: var(--font-size-lg);
}

.empty-state__description {
  margin: 0;
  color: var(--color-text-muted);
}
</style>
