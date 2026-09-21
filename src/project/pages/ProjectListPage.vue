<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/ui/AppIcon.vue'
import BaseButton from '@/ui/BaseButton.vue'
import AppHeader from '../components/AppHeader.vue'
import DeleteProjectModal from '../components/DeleteProjectModal.vue'
import EmptyState from '../components/EmptyState.vue'
import FavoritesToggle from '../components/FavoritesToggle.vue'
import ProjectCard from '../components/ProjectCard.vue'
import SearchBar from '../components/SearchBar.vue'
import SortSelect from '../components/SortSelect.vue'
import { useDeleteProjectFlow } from '../composables/useDeleteProjectFlow'
import { useProjectFilters } from '../composables/useProjectFilters'
import { useSearchHistory } from '../composables/useSearchHistory'
import { isSearchQueryActive } from '../project.search'
import { useProjectStore } from '../project.store'

const router = useRouter()
const store = useProjectStore()
const { projects } = storeToRefs(store)

const { favoritesOnly, sortOption, visibleProjects } = useProjectFilters(projects)
const deleteFlow = useDeleteProjectFlow()

const isSearchOpen = ref(false)
const searchQuery = ref('')
const { history, addSearch, removeSearch } = useSearchHistory()

onMounted(() => {
  store.loadProjects()
})

function goToCreate() {
  router.push({ name: 'project-create' })
}

function goToEdit(id: string) {
  router.push({ name: 'project-edit', params: { id } })
}

function closeSearch() {
  isSearchOpen.value = false
  searchQuery.value = ''
}

function submitSearch(query: string) {
  const trimmed = query.trim()
  if (!isSearchQueryActive(trimmed)) return

  addSearch(trimmed)
  isSearchOpen.value = false
  searchQuery.value = ''
  router.push({ name: 'search-results', query: { q: trimmed } })
}
</script>

<template>
  <div class="project-list-page">
    <AppHeader v-if="!isSearchOpen" show-search-trigger @open-search="isSearchOpen = true" />
    <SearchBar
      v-else
      v-model="searchQuery"
      :history="history"
      show-close-button
      @submit="submitSearch"
      @remove-history="removeSearch"
      @close="closeSearch"
    />

    <main class="project-list-page__content">
      <EmptyState
        v-if="projects.length === 0"
        title="Nenhum projeto"
        description="Clique no botão abaixo para criar o primeiro e gerenciá-lo."
      >
        <template #action>
          <BaseButton @click="goToCreate"><AppIcon name="plus-circle" /> Novo projeto</BaseButton>
        </template>
      </EmptyState>

      <template v-else>
        <div class="project-list-page__toolbar">
          <h1 class="project-list-page__title">
            Projetos <span class="project-list-page__count">({{ projects.length }})</span>
          </h1>

          <div class="project-list-page__controls">
            <FavoritesToggle v-model="favoritesOnly" />
            <SortSelect v-model="sortOption" />
            <BaseButton @click="goToCreate"><AppIcon name="plus-circle" /> Novo projeto</BaseButton>
          </div>
        </div>

        <EmptyState
          v-if="visibleProjects.length === 0"
          title="Nenhum favorito ainda"
          description="Marque projetos com a estrela para vê-los aqui."
        />

        <TransitionGroup
          v-else
          name="card-slide-up"
          tag="div"
          appear
          class="project-list-page__grid"
        >
          <ProjectCard
            v-for="(project, index) in visibleProjects"
            :key="project.id"
            :style="{ transitionDelay: `${Math.min(index, 10) * 30}ms` }"
            :project="project"
            @toggle-favorite="store.toggleFavorite"
            @edit="goToEdit"
            @remove="deleteFlow.request"
          />
        </TransitionGroup>
      </template>
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
.project-list-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.project-list-page__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: var(--space-6);
}

.project-list-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.project-list-page__title {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-heading);
}

.project-list-page__count {
  /* Visivelmente menor que "Projetos" (xl) — mesmo tamanho do corpo de
     texto (md), não um degrau intermediário próprio. */
  font-size: var(--font-size-md);
  color: var(--color-brand);
  font-weight: 400;
}

.project-list-page__controls {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.project-list-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--space-5);
  /* Âncora pro item saindo (.card-slide-up-leave-active) virar
     position:absolute sem pular pra fora do grid. z-index:0 cria um
     contexto de empilhamento local — sem isso, o z-index:-1 de um card em
     movimento (.card-slide-up-move) escapa pra trás do fundo da própria
     página em vez de só atrás dos cards vizinhos, e ele some da tela. */
  position: relative;
  z-index: 0;
}
</style>
