<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppIcon from '@/ui/AppIcon.vue'
import DeleteProjectModal from '../components/DeleteProjectModal.vue'
import EmptyState from '../components/EmptyState.vue'
import ProjectCard from '../components/ProjectCard.vue'
import SearchBar from '../components/SearchBar.vue'
import { useDeleteProjectFlow } from '../composables/useDeleteProjectFlow'
import { isSearchQueryActive, matchesSearch } from '../project.search'
import { useProjectStore } from '../project.store'

const route = useRoute()
const router = useRouter()
const store = useProjectStore()
const { projects } = storeToRefs(store)
const deleteFlow = useDeleteProjectFlow()

const query = ref(typeof route.query.q === 'string' ? route.query.q : '')

onMounted(() => {
  if (projects.value.length === 0) {
    store.loadProjects()
  }
})

// Mesma regra de "busca ativa" usada no resto do app (mínimo 3 caracteres) —
// sem isso, editar a caixa de busca de volta pra 1-2 caracteres já nesta
// página fazia um match parcial sem o mínimo, contradizendo a regra.
const results = computed(() => {
  if (!isSearchQueryActive(query.value)) return projects.value
  return projects.value.filter((project) => matchesSearch(project.name, query.value))
})

function goToEdit(id: string) {
  router.push({ name: 'project-edit', params: { id } })
}
</script>

<template>
  <div class="search-results-page">
    <SearchBar v-model="query" :show-history="false" @submit="(value) => (query = value)" />

    <main class="search-results-page__content">
      <RouterLink to="/" class="search-results-page__back">
        <AppIcon name="arrow-left" />
        Voltar
      </RouterLink>
      <h1 class="search-results-page__title">Resultado da busca</h1>

      <EmptyState
        v-if="results.length === 0"
        title="Nenhum projeto encontrado"
        description="Tente buscar por outro termo."
      />

      <div v-else class="search-results-page__grid">
        <ProjectCard
          v-for="project in results"
          :key="project.id"
          :project="project"
          :search-query="query"
          @toggle-favorite="store.toggleFavorite"
          @edit="goToEdit"
          @remove="deleteFlow.request"
        />
      </div>
    </main>

    <DeleteProjectModal
      :open="deleteFlow.isOpen.value"
      :project="deleteFlow.pendingProject.value"
      :error="deleteFlow.error.value"
      @close="deleteFlow.cancel"
      @confirm="deleteFlow.confirm"
    />
  </div>
</template>

<style scoped>
.search-results-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.search-results-page__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: var(--space-6);
}

.search-results-page__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-brand);
  text-decoration: none;
  margin-bottom: var(--space-2);
}

.search-results-page__title {
  color: var(--color-heading);
  margin: 0 0 var(--space-6);
  font-size: var(--font-size-xl);
}

.search-results-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--space-5);
}
</style>
