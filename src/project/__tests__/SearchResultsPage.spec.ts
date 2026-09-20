import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'

import SearchResultsPage from '../pages/SearchResultsPage.vue'
import { useProjectStore } from '../project.store'

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'project-list', component: { template: '<div />' } },
      { path: '/projetos/:id/editar', name: 'project-edit', component: { template: '<div />' } },
      { path: '/busca', name: 'search-results', component: SearchResultsPage },
    ],
  })
}

async function renderPage(query: string) {
  const router = makeRouter()
  router.push({ path: '/busca', query: { q: query } })
  await router.isReady()
  return render(SearchResultsPage, { global: { plugins: [router] } })
}

describe('SearchResultsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('filtra por nome quando a busca tem 3 caracteres ou mais', async () => {
    const store = useProjectStore()
    await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })
    await store.createProject({
      name: 'App Mobile',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    await renderPage('web')

    // article.textContent (não getByText): o termo buscado vem destacado em
    // <mark>, então "Website Institucional" nunca é um único nó de texto —
    // textContent concatena os nós sem essa ambiguidade.
    const article = await screen.findByRole('article')
    expect(article.textContent).toContain('Website Institucional')
    expect(screen.queryByText('App Mobile')).not.toBeInTheDocument()
  })

  // Regressão: results() filtrava com matchesSearch sem checar o mínimo de 3
  // caracteres, então editar a busca de volta pra 1-2 letras já na página de
  // resultados aplicava um match parcial em vez de mostrar tudo.
  it('mostra todos os projetos quando a busca tem menos de 3 caracteres', async () => {
    const store = useProjectStore()
    await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })
    await store.createProject({
      name: 'App Mobile',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    await renderPage('we')

    expect(await screen.findByText('Website Institucional')).toBeInTheDocument()
    expect(screen.getByText('App Mobile')).toBeInTheDocument()
  })

  it('exibe o estado vazio quando nenhum projeto corresponde à busca', async () => {
    const store = useProjectStore()
    await store.createProject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-01',
      endDate: '2025-02-01',
    })

    await renderPage('xyz')

    expect(await screen.findByText('Nenhum projeto encontrado')).toBeInTheDocument()
  })
})
