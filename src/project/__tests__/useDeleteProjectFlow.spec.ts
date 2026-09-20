import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDeleteProjectFlow } from '../composables/useDeleteProjectFlow'
import { useProjectStore } from '../project.store'
import { makeProject } from './factories'

describe('useDeleteProjectFlow', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('remove o projeto e fecha o fluxo quando a remoção funciona', async () => {
    const store = useProjectStore()
    const flow = useDeleteProjectFlow()
    const project = makeProject()
    flow.request(project)

    vi.spyOn(store, 'removeProject').mockResolvedValue()
    await flow.confirm()

    expect(flow.pendingProject.value).toBeNull()
    expect(flow.error.value).toBeNull()
  })

  it('mantém o modal aberto e expõe o erro quando a remoção falha', async () => {
    const store = useProjectStore()
    const flow = useDeleteProjectFlow()
    const project = makeProject()
    flow.request(project)

    vi.spyOn(store, 'removeProject').mockRejectedValue(new Error('Storage indisponível'))
    await flow.confirm()

    expect(flow.pendingProject.value).toEqual(project)
    expect(flow.error.value).toBe('Storage indisponível')
  })
})
