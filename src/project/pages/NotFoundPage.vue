<script setup lang="ts">
import { useRouter } from 'vue-router'

import BaseButton from '@/ui/BaseButton.vue'
import AppHeader from '../components/AppHeader.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <AppHeader />

    <main class="not-found-page__content">
      <EmptyState
        title="Página não encontrada"
        description="O endereço que você tentou acessar não existe ou foi movido."
      >
        <template #action>
          <BaseButton @click="goHome">Voltar para o início</BaseButton>
        </template>
      </EmptyState>
    </main>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.not-found-page__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: var(--space-6);
}
</style>
