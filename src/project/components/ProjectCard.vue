<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import AppIcon from '@/ui/AppIcon.vue'
import fallbackCover from '@/assets/fallback-image.jpg'
import type { Project } from '../project.model'
import { formatDate } from '../project.dates'
import CardOptionsMenu from './CardOptionsMenu.vue'
import HighlightText from './HighlightText.vue'

const optionsMenuRef = useTemplateRef<InstanceType<typeof CardOptionsMenu>>('optionsMenuRef')

const props = withDefaults(
  defineProps<{
    project: Project
    searchQuery?: string
  }>(),
  { searchQuery: '' },
)

const emit = defineEmits<{
  'toggle-favorite': [id: string]
  edit: [id: string]
  remove: [project: Project]
}>()

// Mesmo fallback usado no card e na pré-visualização do form (CoverImageUpload
// não precisa dele — só mostra a capa quando existe, e o dropzone quando não).
const bannerStyle = computed(() => ({
  backgroundImage: `url(${props.project.coverImage ?? fallbackCover})`,
}))
</script>

<template>
  <article class="project-card" @mouseleave="optionsMenuRef?.close()">
    <div class="project-card__banner" :style="bannerStyle">
      <div class="project-card__banner-actions">
        <button
          type="button"
          class="project-card__favorite"
          :class="{ 'project-card__favorite--active': project.favorite }"
          :aria-pressed="project.favorite"
          :aria-label="
            project.favorite ? `Remover ${project.name} dos favoritos` : `Favoritar ${project.name}`
          "
          @click="emit('toggle-favorite', project.id)"
        >
          <AppIcon :name="project.favorite ? 'star' : 'star-outline'" />
        </button>

        <CardOptionsMenu
          ref="optionsMenuRef"
          :project-name="project.name"
          @edit="emit('edit', project.id)"
          @remove="emit('remove', project)"
        />
      </div>
    </div>

    <div class="project-card__body">
      <h3 class="project-card__name">
        <HighlightText :text="project.name" :query="searchQuery" />
      </h3>
      <p class="project-card__client"><strong>Cliente:</strong> {{ project.client }}</p>

      <dl class="project-card__dates">
        <div class="project-card__date-row">
          <AppIcon name="calendar" />
          <dt class="sr-only">Data de início</dt>
          <dd>{{ formatDate(project.startDate) }}</dd>
        </div>
        <div class="project-card__date-row">
          <AppIcon name="calendar-check" />
          <dt class="sr-only">Data de finalização</dt>
          <dd>{{ formatDate(project.endDate) }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

@media (hover: hover) {
  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(31, 18, 132, 0.16);
  }
}

.project-card__banner {
  position: relative;
  aspect-ratio: 4 / 3;
  background-color: var(--color-brand);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-card__banner-actions {
  position: absolute;
  bottom: var(--space-3);
  right: var(--space-3);
  display: flex;
  gap: var(--space-2);
}

/* Sem círculo de fundo — no Figma a estrela fica direto sobre o banner
   (só o menu "..." tem círculo branco). Um drop-shadow sutil mantém o
   contraste em cima de capas claras. */
.project-card__favorite {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: var(--color-surface);
  font-size: var(--font-size-md);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
}

.project-card__favorite--active {
  color: var(--color-accent);
  animation: star-pop 0.3s ease;
}

@keyframes star-pop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}

.project-card__body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-card__name {
  margin: 0;
  /* 20px — não cai em nenhum degrau da escala (md=16/lg=24), então é um
     valor próprio aqui, não var(--font-size-lg). */
  font-size: 1.25rem;
  color: var(--color-heading);
}

.project-card__client {
  margin: 0;
  color: var(--color-text-muted);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-page-bg);
}

.project-card__dates {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-card__date-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
}

.project-card__date-row dd {
  margin: 0;
}
</style>
