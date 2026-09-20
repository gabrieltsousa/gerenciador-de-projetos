import { computed, ref } from 'vue'

import type { Project } from '../project.model'
import { useProjectStore } from '../project.store'

export function useDeleteProjectFlow() {
  const store = useProjectStore()
  const pendingProject = ref<Project | null>(null)
  const error = ref<string | null>(null)
  const isOpen = computed(() => pendingProject.value !== null)

  function request(project: Project) {
    error.value = null
    pendingProject.value = project
  }

  function cancel() {
    pendingProject.value = null
    error.value = null
  }

  async function confirm() {
    if (!pendingProject.value) return
    try {
      await store.removeProject(pendingProject.value.id)
      pendingProject.value = null
      error.value = null
    } catch (cause) {
      // Modal fica aberto mostrando o erro — falha de persistência não deve
      // fechar silenciosamente como se a remoção tivesse funcionado.
      error.value = cause instanceof Error ? cause.message : 'Não foi possível remover o projeto.'
    }
  }

  return { pendingProject, isOpen, error, request, cancel, confirm }
}
