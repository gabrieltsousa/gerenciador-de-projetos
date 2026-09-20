import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CreateProjectInput, Project, UpdateProjectInput } from './project.model'
import { LocalStorageProjectRepository } from './project.repository'

/**
 * Só estado de domínio aqui: a lista de projetos e as operações que a
 * alteram. Busca, ordenação e filtro de favoritos são derivados na tela
 * que os usa (ver useProjectFilters) — não duplicamos essas listas aqui.
 *
 * Sem isLoading/error: loadProjects() lê do localStorage, que é síncrono
 * (não há "carregando" perceptível), e erros de uma ação específica
 * (criar, remover) são contextuais à tela que a disparou — cada chamador
 * decide como reagir a uma Promise rejeitada, em vez de um estado de erro
 * genérico compartilhado por toda a store.
 */
export const useProjectStore = defineStore('projects', () => {
  const repository = new LocalStorageProjectRepository()

  const projects = ref<Project[]>([])

  async function loadProjects(): Promise<void> {
    projects.value = await repository.findAll()
  }

  async function createProject(input: CreateProjectInput): Promise<Project> {
    const project = await repository.create(input)
    projects.value = [...projects.value, project]
    return project
  }

  async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    const updated = await repository.update(id, input)
    projects.value = projects.value.map((project) => (project.id === id ? updated : project))
    return updated
  }

  async function removeProject(id: string): Promise<void> {
    await repository.remove(id)
    projects.value = projects.value.filter((project) => project.id !== id)
  }

  async function toggleFavorite(id: string): Promise<void> {
    const updated = await repository.toggleFavorite(id)
    projects.value = projects.value.map((project) => (project.id === id ? updated : project))
  }

  return { projects, loadProjects, createProject, updateProject, removeProject, toggleFavorite }
})
