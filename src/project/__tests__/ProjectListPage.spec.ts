import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'

import ProjectListPage from '../pages/ProjectListPage.vue'
import { useProjectStore } from '../project.store'

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'project-list', component: ProjectListPage },
      { path: '/projetos/novo', name: 'project-create', component: { template: '<div />' } },
      { path: '/projetos/:id/editar', name: 'project-edit', component: { template: '<div />' } },
      { path: '/busca', name: 'search-results', component: { template: '<div />' } },
    ],
  })
}

async function renderPage() {
  const router = makeRouter()
  router.push('/')
  await router.isReady()
  return render(ProjectListPage, { global: { plugins: [router] } })
}

describe('ProjectListPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('exibe o estado vazio sem toolbar quando não há projetos', async () => {
    await renderPage()

    expect(await screen.findByText('Nenhum projeto')).toBeInTheDocument()
    expect(screen.queryByText('Apenas Favoritos')).not.toBeInTheDocument()
  })

  it('exibe o total de projetos e os cards quando existem projetos', async () => {
    const store = useProjectStore()
    await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    await renderPage()

    expect(await screen.findByText('Projetos')).toBeInTheDocument()
    expect(screen.getByText('(1)')).toBeInTheDocument()
    expect(screen.getByText('Website Institucional')).toBeInTheDocument()
  })

  it('favorita um projeto ao clicar na estrela', async () => {
    const store = useProjectStore()
    await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    const user = userEvent.setup()
    await renderPage()

    const favoriteButton = await screen.findByRole('button', { name: /Favoritar/ })
    await user.click(favoriteButton)

    expect(screen.getByRole('button', { name: /Remover .* dos favoritos/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('o filtro "Apenas Favoritos" esconde projetos não favoritados', async () => {
    const store = useProjectStore()
    const favorited = await store.createProject({
      name: 'Projeto Favorito',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })
    await store.createProject({
      name: 'Projeto Comum',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })
    await store.toggleFavorite(favorited.id)

    const user = userEvent.setup()
    await renderPage()

    await user.click(screen.getByRole('switch', { name: 'Apenas Favoritos' }))

    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('remove um projeto após confirmar no modal', async () => {
    const store = useProjectStore()
    await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    const user = userEvent.setup()
    await renderPage()

    await user.click(await screen.findByRole('button', { name: /Mais opções/ }))
    await user.click(screen.getByRole('button', { name: 'Remover' }))

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }))

    expect(screen.queryByText('Website Institucional')).not.toBeInTheDocument()
    expect(await screen.findByText('Nenhum projeto')).toBeInTheDocument()
  })

  it('jornada: criar reflete na lista e no contador, favoritar persiste após reload', async () => {
    const store = useProjectStore()
    const created = await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    const user = userEvent.setup()
    await renderPage()

    expect(screen.getByText('(1)')).toBeInTheDocument()
    expect(screen.getByText('Website Institucional')).toBeInTheDocument()

    const favoriteButton = await screen.findByRole('button', { name: /Favoritar/ })
    await user.click(favoriteButton)
    expect(screen.getByRole('button', { name: /Remover .* dos favoritos/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    // Simula um reload: nova store/Pinia lendo do mesmo localStorage, sem
    // reaproveitar nenhum estado em memória da primeira instância.
    setActivePinia(createPinia())
    const reloadedStore = useProjectStore()
    await reloadedStore.loadProjects()

    expect(reloadedStore.projects).toHaveLength(1)
    expect(reloadedStore.projects[0]?.id).toBe(created.id)
    expect(reloadedStore.projects[0]?.favorite).toBe(true)
  })
})
