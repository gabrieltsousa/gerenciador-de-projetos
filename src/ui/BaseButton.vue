<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    size?: 'md' | 'sm'
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-full);
  font-weight: 500;
  border: 1.5px solid transparent;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;
}

/* Medido na referência: botão principal ("Novo projeto") é 184×40px —
   padding (space-3 space-6) dava 204×51px, uns 25% maior que deveria. */
.base-button--md {
  padding: var(--space-2) var(--space-4);
  /* 16px em line-height 1.5 = 24px de caixa de texto + 8px de padding em
     cima/embaixo = 40px, batendo exatamente com a altura medida do botão. */
  font-size: var(--font-size-md);
}

/* Medido: o botão "Selecionar" (dentro do dropzone de capa) é bem menor
   que os botões principais — ~14px de texto, não os 20px do padrão. */
.base-button--sm {
  padding: var(--space-1) var(--space-4);
  font-size: var(--font-size-sm);
}

.base-button--primary {
  background-color: var(--color-brand);
  color: var(--color-surface);
}

.base-button--primary:disabled {
  background-color: var(--color-brand-disabled);
  cursor: not-allowed;
}

.base-button--secondary {
  background-color: var(--color-surface);
  color: var(--color-brand);
  border-color: var(--color-brand);
}
</style>
