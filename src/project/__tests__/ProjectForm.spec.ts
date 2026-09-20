import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ProjectForm from '../components/ProjectForm.vue'
import type { ProjectInput } from '../project.model'

function emptyValues(): ProjectInput {
  return { name: '', client: '', startDate: '', endDate: '', coverImage: undefined }
}

describe('ProjectForm', () => {
  it('não mostra erros antes da primeira tentativa de envio', () => {
    render(ProjectForm, { props: { initialValues: emptyValues() } })
    expect(screen.queryByText('Por favor, digite ao menos duas palavras')).not.toBeInTheDocument()
  })

  it('mostra o erro de um campo ao sair dele, mesmo antes do submit', async () => {
    const user = userEvent.setup()
    render(ProjectForm, { props: { initialValues: emptyValues() } })

    await user.type(screen.getByLabelText(/Nome do projeto/), 'Só')
    await user.tab()

    expect(
      await screen.findByText('Por favor, digite ao menos duas palavras'),
    ).toBeInTheDocument()
  })

  it('mostra os erros de validação ao tentar enviar um formulário vazio', async () => {
    const user = userEvent.setup()
    render(ProjectForm, { props: { initialValues: emptyValues() } })

    await user.click(screen.getByRole('button', { name: 'Salvar projeto' }))

    expect(await screen.findByText('Por favor, digite ao menos duas palavras')).toBeInTheDocument()
    expect(screen.getByText('Por favor, digite ao menos uma palavra')).toBeInTheDocument()
  })

  it('envia os dados quando o formulário é válido', async () => {
    const user = userEvent.setup()
    const { emitted } = render(ProjectForm, { props: { initialValues: emptyValues() } })

    await user.type(screen.getByLabelText(/Nome do projeto/), 'Website Institucional')
    await user.type(screen.getByLabelText(/^Cliente/), 'Acme')
    await user.type(screen.getByLabelText(/Data de Início/), '2025-01-10')
    await user.type(screen.getByLabelText(/Data Final/), '2025-03-20')
    await user.click(screen.getByRole('button', { name: 'Salvar projeto' }))

    const submitEvents = emitted().submit
    expect(submitEvents).toHaveLength(1)
    expect(submitEvents?.[0]?.[0]).toMatchObject({
      name: 'Website Institucional',
      client: 'Acme',
      startDate: '2025-01-10',
      endDate: '2025-03-20',
    })
  })

  it('pré-preenche os campos ao editar um projeto existente', () => {
    render(ProjectForm, {
      props: {
        initialValues: {
          name: 'Projeto Existente',
          client: 'Iridium',
          startDate: '2025-01-01',
          endDate: '2025-02-01',
          coverImage: undefined,
        },
      },
    })

    expect(screen.getByLabelText(/Nome do projeto/)).toHaveValue('Projeto Existente')
    expect(screen.getByLabelText(/^Cliente/)).toHaveValue('Iridium')
  })

  it('rejeita data final anterior à data de início', async () => {
    const user = userEvent.setup()
    render(ProjectForm, {
      props: {
        initialValues: {
          name: 'Projeto Válido',
          client: 'Acme',
          startDate: '2025-06-01',
          endDate: '2025-01-01',
          coverImage: undefined,
        },
      },
    })

    await user.click(screen.getByRole('button', { name: 'Salvar projeto' }))

    expect(
      await screen.findByText('A data final não pode ser anterior à data de início'),
    ).toBeInTheDocument()
  })
})
