<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/ui/AppIcon.vue'
import AppHeader from '../components/AppHeader.vue'
import ProjectForm from '../components/ProjectForm.vue'
import type { ProjectInput } from '../project.model'
import { useProjectStore } from '../project.store'

const props = defineProps<{ id?: string }>()

const router = useRouter()
const store = useProjectStore()
const { projects } = storeToRefs(store)

const existingProject = computed(() => projects.value.find((project) => project.id === props.id))
const isEditMode = computed(() => !!props.id)

const initialValues = computed<ProjectInput>(() => ({
  name: existingProject.value?.name ?? '',
  client: existingProject.value?.client ?? '',
  startDate: existingProject.value?.startDate ?? '',
  endDate: existingProject.value?.endDate ?? '',
  coverImage: existingProject.value?.coverImage,
}))

onMounted(() => {
  if (projects.value.length === 0) {
    store.loadProjects()
  }
})

const submitError = ref<string | null>(null)

async function handleSubmit(values: ProjectInput) {
  submitError.value = null
  try {
    if (isEditMode.value && props.id) {
      await store.updateProject(props.id, values)
    } else {
      await store.createProject(values)
    }
    router.push({ name: 'project-list' })
  } catch (cause) {
    // Falha de persistência (ex.: localStorage cheio) fica visível e o
    // usuário continua na página com os dados preenchidos — nada se perde.
    submitError.value =
      cause instanceof Error ? cause.message : 'Não foi possível salvar o projeto.'
  }
}
</script>

<template>
  <div class="project-form-page">
    <AppHeader />

    <main class="project-form-page__content">
      <RouterLink to="/" class="project-form-page__back">
        <AppIcon name="arrow-left" />
        Voltar
      </RouterLink>
      <h1 class="project-form-page__title">{{ isEditMode ? 'Editar projeto' : 'Novo projeto' }}</h1>

      <p v-if="submitError" class="project-form-page__error" role="alert">{{ submitError }}</p>

      <div class="project-form-page__card">
        <!--
          :key força remontar o formulário quando o projeto carregado muda de
          identidade (ex.: dados chegam do localStorage depois do primeiro
          render) — useProjectForm só copia initialValues UMA vez ao montar,
          então sem isso o form ficaria vazio mesmo com o projeto já carregado.
        -->
        <ProjectForm
          :key="existingProject?.id ?? 'new'"
          :initial-values="initialValues"
          @submit="handleSubmit"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.project-form-page__content {
  /* Mesma largura de container da listagem — no Figma, "Voltar" e o título
     ficam grudados na borda esquerda da tela, não centralizados numa coluna
     estreita. É o card por dentro que tem uma coluna de formulário mais
     estreita e centralizada, não a página inteira. */
  max-width: 90rem;
  margin: 0 auto;
  padding: var(--space-6);
}

.project-form-page__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-brand);
  text-decoration: none;
  margin-bottom: var(--space-2);
}

.project-form-page__title {
  color: var(--color-heading);
  margin: 0 0 var(--space-6);
  font-size: var(--font-size-xl);
}

.project-form-page__error {
  color: var(--color-danger-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  margin: 0 0 var(--space-4);
}

.project-form-page__card {
  background-color: var(--color-page-bg);
  border: 1px solid var(--color-text-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-8);
}
</style>
