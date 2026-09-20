import { describe, expect, it } from 'vitest'

import { sortProjects } from '../project.sorting'
import { makeProject } from './factories'

describe('sortProjects', () => {
  it('ordena alfabeticamente ignorando acentuação (localeCompare pt-BR)', () => {
    const projects = [makeProject({ name: 'Ábaco' }), makeProject({ name: 'Azul' })]
    const sorted = sortProjects(projects, 'alphabetical')
    expect(sorted.map((p) => p.name)).toEqual(['Ábaco', 'Azul'])
  })

  it('ordena por início mais recente primeiro', () => {
    const projects = [
      makeProject({ name: 'Antigo', startDate: '2023-01-01' }),
      makeProject({ name: 'Recente', startDate: '2024-06-01' }),
    ]
    const sorted = sortProjects(projects, 'recently-started')
    expect(sorted.map((p) => p.name)).toEqual(['Recente', 'Antigo'])
  })

  it('no prazo mais próximo, projetos ativos vêm antes de projetos encerrados', () => {
    // Monta a string ISO direto dos componentes de ano — nunca via
    // toISOString(), que converte para UTC e pode deslocar o dia (mesma
    // classe de bug que project.dates.ts existe para evitar).
    const currentYear = new Date().getFullYear()
    const future = `${currentYear + 1}-01-01`
    const past = `${currentYear - 1}-01-01`

    const projects = [
      makeProject({ name: 'Encerrado', endDate: past }),
      makeProject({ name: 'Ativo', endDate: future }),
    ]
    const sorted = sortProjects(projects, 'end-date-proximity')
    expect(sorted.map((p) => p.name)).toEqual(['Ativo', 'Encerrado'])
  })

  it('não muta o array original', () => {
    const projects = [makeProject({ name: 'B' }), makeProject({ name: 'A' })]
    const original = [...projects]
    sortProjects(projects, 'alphabetical')
    expect(projects).toEqual(original)
  })
})
