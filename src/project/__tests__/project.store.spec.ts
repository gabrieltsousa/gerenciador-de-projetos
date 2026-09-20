import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useProjectStore } from '../project.store'

function validInput() {
  return {
    name: 'Projeto Iridium',
    client: 'Acme',
    startDate: '2025-01-01',
    endDate: '2025-02-01',
  }
}

describe('useProjectStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('começa vazia antes de carregar', () => {
    const store = useProjectStore()
    expect(store.projects).toEqual([])
  })

  it('cria um projeto e reflete no estado', async () => {
    const store = useProjectStore()
    const project = await store.createProject(validInput())

    expect(store.projects).toHaveLength(1)
    expect(store.projects[0]?.id).toBe(project.id)
    expect(project.favorite).toBe(false)
  })

  it('persiste entre instâncias diferentes da store (simulando reload)', async () => {
    const store = useProjectStore()
    await store.createProject(validInput())

    setActivePinia(createPinia())
    const reloaded = useProjectStore()
    await reloaded.loadProjects()

    expect(reloaded.projects).toHaveLength(1)
  })

  it('edita um projeto existente', async () => {
    const store = useProjectStore()
    const project = await store.createProject(validInput())

    await store.updateProject(project.id, { ...validInput(), name: 'Projeto Renomeado' })

    expect(store.projects[0]?.name).toBe('Projeto Renomeado')
  })

  it('remove um projeto e atualiza o total', async () => {
    const store = useProjectStore()
    const project = await store.createProject(validInput())

    await store.removeProject(project.id)

    expect(store.projects).toHaveLength(0)
  })

  it('favorita e desfavorita sem duplicar coleção', async () => {
    const store = useProjectStore()
    const project = await store.createProject(validInput())

    await store.toggleFavorite(project.id)
    expect(store.projects[0]?.favorite).toBe(true)

    await store.toggleFavorite(project.id)
    expect(store.projects[0]?.favorite).toBe(false)
  })
})
