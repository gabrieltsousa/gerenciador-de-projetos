<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

import AppIcon from '@/ui/AppIcon.vue'
import { useClickOutside } from '@/ui/useClickOutside'

const props = defineProps<{ projectName: string }>()
const emit = defineEmits<{ edit: []; remove: [] }>()

const isOpen = ref(false)
const rootRef = useTemplateRef<HTMLElement>('rootRef')
const triggerRef = useTemplateRef<HTMLButtonElement>('triggerRef')

useClickOutside(rootRef, () => {
  isOpen.value = false
})

function handleEdit() {
  isOpen.value = false
  emit('edit')
}

function handleRemove() {
  // O item de menu clicado está prestes a sumir do DOM (o dropdown fecha).
  // Sem isso, quando o modal de exclusão fecha, a restauração de foco
  // nativa do <dialog> aponta pra um elemento que não existe mais e o foco
  // cai no <body> — devolver o foco pro botão "..." (que permanece no DOM)
  // ANTES de fechar o dropdown garante que showModal() capture o alvo certo.
  triggerRef.value?.focus()
  isOpen.value = false
  emit('remove')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    // Mesmo cuidado de handleRemove: se o foco estiver num item do menu,
    // ele some do DOM ao fechar e o foco cairia no <body> sem isso.
    triggerRef.value?.focus()
    isOpen.value = false
  }
}

// Chamado pelo ProjectCard quando o mouse sai do card inteiro — o menu não
// deveria continuar aberto "flutuando" depois que o usuário já foi embora.
defineExpose({
  close: () => {
    isOpen.value = false
  },
})
</script>

<template>
  <div ref="rootRef" class="card-options-menu" @keydown="handleKeydown">
    <button
      ref="triggerRef"
      type="button"
      class="card-options-menu__trigger"
      :aria-label="`Mais opções para ${props.projectName}`"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <AppIcon name="dots" />
    </button>

    <!--
      Sem role="menu"/"menuitem": esses roles implicam navegação por setas
      com roving tabindex (ARIA Authoring Practices), que não é o que
      acontece aqui — são 2 <button> reais navegáveis por Tab normal. Manter
      o role prometeria um modelo de interação que o componente não entrega.
    -->
    <Transition name="dropdown-pop">
      <ul v-if="isOpen" class="card-options-menu__list">
        <li>
          <button type="button" class="card-options-menu__item" @click="handleEdit">
            <AppIcon name="edit" />
            Editar
          </button>
        </li>
        <li>
          <button type="button" class="card-options-menu__item" @click="handleRemove">
            <AppIcon name="trash" />
            Remover
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.card-options-menu {
  position: relative;
}

.card-options-menu__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  color: var(--color-brand);
  border: none;
  font-size: var(--font-size-md);
}

.card-options-menu__list {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  z-index: 1;
  margin: 0;
  padding: var(--space-2);
  list-style: none;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 20px rgba(31, 18, 132, 0.18);
  min-width: 9rem;
}

/* Setinha de balão de diálogo apontando pro botão "..." que abriu o menu —
   um quadrado rotacionado 45°, com a mesma cor de fundo da lista. */
.card-options-menu__list::before {
  content: '';
  position: absolute;
  top: -5px;
  right: 10px;
  width: 10px;
  height: 10px;
  background-color: var(--color-surface);
  transform: rotate(45deg);
  border-radius: 2px;
}

.card-options-menu__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--color-heading);
  text-align: left;
  font-size: var(--font-size-sm);
}

.card-options-menu__item:hover {
  background-color: var(--color-page-bg);
}
</style>
