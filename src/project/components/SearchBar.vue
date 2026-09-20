<script setup lang="ts">
import { ref } from 'vue'

import AppIcon from '@/ui/AppIcon.vue'

withDefaults(
  defineProps<{
    modelValue: string
    history?: string[]
    showHistory?: boolean
    showCloseButton?: boolean
  }>(),
  { history: () => [], showHistory: true, showCloseButton: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [value: string]
  'remove-history': [value: string]
  close: []
}>()

const isFocused = ref(false)

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function selectHistory(term: string) {
  emit('update:modelValue', term)
  emit('submit', term)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <div class="search-bar">
    <form class="search-bar__form" role="search" @submit.prevent="emit('submit', modelValue)">
      <AppIcon name="search" class="search-bar__icon" />
      <input
        type="search"
        class="search-bar__input"
        placeholder="Digite o nome do projeto..."
        :value="modelValue"
        aria-label="Buscar projetos pelo nome"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="handleKeydown"
      />
      <button
        v-if="showCloseButton"
        type="button"
        class="search-bar__close"
        aria-label="Fechar busca"
        @mousedown.prevent="emit('close')"
      >
        <AppIcon name="close" />
      </button>
    </form>

    <Transition name="dropdown-pop">
      <ul
        v-if="showHistory && isFocused && history.length > 0"
        class="search-bar__history"
        aria-label="Buscas recentes"
      >
        <li v-for="term in history" :key="term" class="search-bar__history-item">
          <!--
            mousedown (não click) e com preventDefault: um clique comum primeiro
            tira o foco do input (dispara blur, que fecha esta lista) antes do
            evento click chegar ao botão — o clique nunca seria processado.
            Prevenir o mousedown mantém o foco no input e evita a corrida.
          -->
          <button
            type="button"
            class="search-bar__history-term"
            @mousedown.prevent="selectHistory(term)"
          >
            <AppIcon name="history" />
            {{ term }}
          </button>
          <button
            type="button"
            class="search-bar__history-remove"
            :aria-label="`Remover '${term}' do histórico`"
            @mousedown.prevent="emit('remove-history', term)"
          >
            <AppIcon name="close" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.search-bar {
  background-color: var(--color-surface);
  position: relative;
  border-bottom: 1px solid var(--color-page-bg);
}

.search-bar__form {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
}

.search-bar__icon {
  color: var(--color-brand);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--color-heading);
}

/* outline:none incondicional aqui sobrescrevia o anel de foco global (regra
   local tem mais especificidade que a global de base.css) — deixando o
   campo sem nenhum indicador visível de foco por teclado. */
.search-bar__input:focus {
  outline: none;
}

.search-bar__input:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: -2px;
}

.search-bar__input::placeholder {
  color: var(--color-text-subtle);
}

.search-bar__close {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  display: inline-flex;
  padding: var(--space-2);
  flex-shrink: 0;
}

.search-bar__history {
  margin: 0;
  padding: var(--space-2) 0;
  list-style: none;
  border-top: 1px solid var(--color-page-bg);
}

.search-bar__history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-6);
}

.search-bar__history-term {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: none;
  background: transparent;
  color: var(--color-heading);
  flex: 1;
  text-align: left;
  padding: var(--space-1) 0;
  /* Medido: ~17px, mais perto de --font-size-md que dos 14px herdados. */
  font-size: var(--font-size-md);
}

.search-bar__history-remove {
  border: none;
  background: transparent;
  color: var(--color-text-subtle);
  display: inline-flex;
  padding: var(--space-1);
}
</style>
