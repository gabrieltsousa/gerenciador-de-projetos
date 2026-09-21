<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

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
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

// SearchBar só existe no DOM quando a busca está aberta (v-else no lugar
// do AppHeader) — o clique que abriu passou por um botão que já não existe
// mais, então o foco cairia no <body> sem isso, e o usuário precisaria
// clicar de novo pra poder digitar.
onMounted(() => {
  inputRef.value?.focus()
})

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
  <div class="search-bar" :class="{ 'search-bar--dropdown-open': showHistory && isFocused && history.length > 0 }">
    <form class="search-bar__form" role="search" @submit.prevent="emit('submit', modelValue)">
      <AppIcon name="search" class="search-bar__icon" />
      <input
        ref="inputRef"
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

/* A referência "Resultado da busca" (sem histórico) mostra a barra achatada,
   sem borda nem sombra — só a barra "Busca + Histórico Aberto" (com a lista
   de sugestões visível) mostra uma borda roxa envolvendo tudo (ícone + campo
   + histórico) como um cartão único. Por isso é condicional ao dropdown
   estar de fato aberto, não um estado permanente da barra. */
.search-bar--dropdown-open {
  border: 1.5px solid var(--color-brand);
  border-radius: var(--radius-md);
  /* Sombra confirmada na referência (falloff visível na página logo abaixo
     da caixa) — mesma cor-base usada em todas as outras sombras do app
     (modal, card, menu de opções), só o peso muda por contexto. */
  box-shadow: 0 4px 12px rgba(31, 18, 132, 0.18);
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
  /* Sem isso, o item flex não encolhe abaixo do seu min-content (o mínimo
     "automático" de um <input> é baseado no conteúdo, não é 0) — em telas
     estreitas isso empurra o botão de fechar pra fora da viewport e a
     página inteira ganha scroll horizontal. */
  min-width: 0;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--color-heading);
  /* input[type=search] tem chrome nativo próprio em alguns navegadores
     (Safari/iOS em especial) — sem isso, o anel de foco padrão do sistema
     aparece por cima do nosso outline customizado, azul e fora do design. */
  appearance: none;
  -webkit-appearance: none;
}

/* appearance:none no input não basta pro "x" nativo de limpar do Chrome —
   é um pseudo-elemento à parte, cinza-arroxeado e fora do design (nem
   aparece na referência do Figma). Sempre escondido — o "x" cinza próprio
   (.search-bar__close) é a única forma de limpar, em toda tela. */
.search-bar__input::-webkit-search-cancel-button {
  display: none;
}

/* Sem outline próprio: a borda do .search-bar já demarca a barra inteira
   como "em uso" assim que abre (o campo recebe foco automaticamente), e o
   cursor piscando no input já indica onde a digitação vai. Os outros
   elementos focáveis aqui dentro (botão de fechar, itens do histórico)
   continuam com o anel de foco padrão global. */
.search-bar__input:focus {
  outline: none;
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
  border-bottom: 1px solid var(--color-page-bg);
}

.search-bar__history-item:last-child {
  border-bottom: none;
}

.search-bar__history-term {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: none;
  background: transparent;
  /* Amostrado na referência: cinza neutro (~#6d6d6d), não o roxo-escuro do
     heading — o histórico é secundário, não tem o mesmo peso visual do
     nome de um projeto. */
  color: var(--color-text-muted);
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
