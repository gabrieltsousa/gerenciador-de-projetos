<script setup lang="ts">
import AppIcon from '@/ui/AppIcon.vue'
import logo from '@/assets/logo.png'

withDefaults(defineProps<{ showSearchTrigger?: boolean }>(), { showSearchTrigger: false })
defineEmits<{ 'open-search': [] }>()
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="app-header__brand">
      <img :src="logo" alt="Gerenciador de Projetos" class="app-header__logo-image" />
    </RouterLink>

    <button
      v-if="showSearchTrigger"
      type="button"
      class="app-header__search-trigger"
      aria-label="Buscar projetos"
      @click="$emit('open-search')"
    >
      <AppIcon name="search" />
      <span class="app-header__search-hint">O que você procura?</span>
    </button>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-header-bg);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-surface);
  text-decoration: none;
}

/* Medido na referência: a marca ocupa ~62px de um header de ~83px de
   altura — 2.5rem (40px) ficava pequeno demais proporcionalmente. */
.app-header__logo-image {
  height: 3.25rem;
  width: auto;
}

.app-header__search-trigger {
  position: absolute;
  right: var(--space-6);
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-surface);
  font-size: var(--font-size-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-full);
  transition:
    background-color 0.2s ease,
    padding-inline 0.2s ease;
}

/* Escondida por padrão (max-width: 0), revelada ao passar o mouse ou focar
   via teclado — cresce num pill com uma dica antes de clicar abrir a barra
   de busca completa. max-width em vez de width: transições suaves não
   funcionam com "auto", e max-width com folga simula o mesmo efeito. */
.app-header__search-hint {
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--font-size-sm);
  font-weight: 400;
  opacity: 0;
  transition:
    max-width 0.25s ease,
    opacity 0.2s ease;
}

.app-header__search-trigger:focus-visible .app-header__search-hint {
  max-width: 13rem;
  opacity: 1;
}

@media (hover: hover) {
  .app-header__search-trigger:hover {
    background-color: rgba(255, 255, 255, 0.12);
    padding-inline: var(--space-4) var(--space-3);
  }

  .app-header__search-trigger:hover .app-header__search-hint {
    max-width: 13rem;
    opacity: 1;
  }
}
</style>
