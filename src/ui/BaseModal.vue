<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'

const props = defineProps<{
  open: boolean
  labelledBy: string
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')

// <dialog> é controlado via método imperativo (showModal/close), não via
// atributo — por isso sincronizamos com a prop `open` num watch em vez de
// um `v-if`. `immediate` cobre o caso do modal já nascer aberto.
watch(
  () => props.open,
  (isOpen) => {
    const dialog = dialogRef.value
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  },
  { immediate: true },
)

// Disparado tanto pelo Escape (comportamento nativo do <dialog>) quanto
// por uma chamada programática a close() — os dois casos devem apenas
// avisar o pai, que é quem controla a prop `open`.
function handleClose() {
  emit('close')
}

// Clicar no backdrop do <dialog> ainda conta como clique NO elemento
// dialog (a área de conteúdo é um filho); um clique que chega até aqui
// sem ter sido interceptado pelo conteúdo veio de fora dele.
function handleBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    dialogRef.value?.close()
  }
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="base-modal"
    :aria-labelledby="labelledBy"
    @close="handleClose"
    @click="handleBackdropClick"
  >
    <div class="base-modal__content">
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.base-modal {
  overflow: visible;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: 0 20px 40px rgba(31, 18, 132, 0.2);
  /* Medido na referência: modal real tem 582px num frame de 1948px, não os
     480px (30rem) que eu tinha chutado. */
  max-width: 36rem;
  width: calc(100% - var(--space-8));

  /* Anima só a ABERTURA: com <dialog>, close() esconde o elemento na hora
     (não há um jeito simples de atrasar isso sem orquestrar via JS), então
     animar o fechamento exigiria escutar transitionend antes de fechar de
     verdade — complexidade que não compensa pra um modal de confirmação
     que já é dispensado rápido. Em navegadores sem @starting-style, o modal
     só aparece direto, sem quebrar nada (progressive enhancement). */
  opacity: 0;
  transform: translateY(8px) scale(0.98);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    overlay 0.18s ease allow-discrete,
    display 0.18s ease allow-discrete;
}

.base-modal[open] {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@starting-style {
  .base-modal[open] {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}

.base-modal::backdrop {
  background: rgba(29, 25, 48, 0.6);
  transition:
    background-color 0.18s ease,
    overlay 0.18s ease allow-discrete,
    display 0.18s ease allow-discrete;
}

@starting-style {
  .base-modal[open]::backdrop {
    background-color: rgba(29, 25, 48, 0);
  }
}

.base-modal__content {
  padding: var(--space-8) var(--space-6);
}
</style>
