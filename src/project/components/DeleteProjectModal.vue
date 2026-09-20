<script setup lang="ts">
import AppIcon from '@/ui/AppIcon.vue'
import BaseButton from '@/ui/BaseButton.vue'
import BaseModal from '@/ui/BaseModal.vue'
import type { Project } from '../project.model'

defineProps<{
  open: boolean
  project: Project | null
  error?: string | null
}>()

const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <BaseModal :open="open" labelled-by="delete-project-title" @close="emit('close')">
    <div class="delete-project-modal">
      <span class="delete-project-modal__icon" aria-hidden="true">
        <AppIcon name="trash" />
      </span>
      <h2 id="delete-project-title" class="delete-project-modal__title">Remover projeto</h2>
      <p class="delete-project-modal__text">Essa ação removerá definitivamente o projeto:</p>
      <p class="delete-project-modal__name">{{ project?.name }}</p>

      <p v-if="error" class="delete-project-modal__error" role="alert">{{ error }}</p>

      <div class="delete-project-modal__actions">
        <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
        <!--
          O Figma usa a mesma cor de marca (roxo) no ícone e no botão de
          confirmação em vez do vermelho de "perigo" convencional — segui
          fielmente o design em vez de impor a convenção genérica.
        -->
        <BaseButton variant="primary" @click="emit('confirm')">Confirmar</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.delete-project-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
}

/* Puxado pra cima com margin negativo pra "montar" na borda superior do
   card (a maior parte do círculo pra fora) — como no Figma, não recuado
   dentro do padding do conteúdo. */
.delete-project-modal__icon {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-full);
  background-color: var(--color-brand);
  color: var(--color-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  margin-top: -4rem;
  margin-bottom: var(--space-2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.delete-project-modal__title {
  margin: 0;
  color: var(--color-heading);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-page-bg);
  width: 100%;
  font-size: var(--font-size-lg);
}

.delete-project-modal__text {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-md);
}

.delete-project-modal__name {
  margin: 0;
  font-weight: 600;
  /* Medido: ~26px — maior que o próprio título do modal (20px), o nome do
     projeto é o texto de maior destaque visual ali. */
  font-size: var(--font-size-xl);
  color: var(--color-text-strong);
}

.delete-project-modal__error {
  margin: 0;
  color: var(--color-danger-text);
  font-size: var(--font-size-sm);
}

.delete-project-modal__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
  width: 100%;
}

.delete-project-modal__actions > * {
  flex: 1;
}
</style>
