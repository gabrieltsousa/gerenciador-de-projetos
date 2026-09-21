import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { describe, expect, it } from 'vitest'

import NotFoundPage from '../pages/NotFoundPage.vue'

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'project-list', component: { template: '<div>Lista</div>' } },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
    ],
  })
}

async function renderPage(path: string) {
  const router = makeRouter()
  router.push(path)
  await router.isReady()
  const view = render(NotFoundPage, { global: { plugins: [router] } })
  return { ...view, router }
}

describe('NotFoundPage', () => {
  it('exibe mensagem de página não encontrada para uma rota desconhecida', async () => {
    await renderPage('/isso-nao-existe')

    expect(await screen.findByText('Página não encontrada')).toBeInTheDocument()
  })

  it('navega pra listagem ao clicar em "Voltar para o início"', async () => {
    const user = userEvent.setup()
    const { router } = await renderPage('/isso-nao-existe')

    await user.click(await screen.findByRole('button', { name: 'Voltar para o início' }))

    expect(router.currentRoute.value.path).toBe('/')
  })
})
