import { describe, expect, it } from 'vitest'

import { getHighlightSegments, isSearchQueryActive, matchesSearch } from '../project.search'

describe('isSearchQueryActive', () => {
  it('não ativa a busca com menos de 3 caracteres', () => {
    expect(isSearchQueryActive('')).toBe(false)
    expect(isSearchQueryActive('a')).toBe(false)
    expect(isSearchQueryActive('ab')).toBe(false)
  })

  it('ativa a busca a partir de 3 caracteres', () => {
    expect(isSearchQueryActive('abc')).toBe(true)
  })
})

describe('matchesSearch', () => {
  it('é case-insensitive', () => {
    expect(matchesSearch('Projeto 01', 'projeto')).toBe(true)
  })

  it('ignora acentuação', () => {
    expect(matchesSearch('Café com leite', 'cafe')).toBe(true)
  })

  it('retorna falso quando não há correspondência', () => {
    expect(matchesSearch('Projeto 01', 'xyz')).toBe(false)
  })
})

describe('getHighlightSegments', () => {
  it('divide o texto em partes ao redor do termo buscado', () => {
    expect(getHighlightSegments('Projeto 01', 'Projet')).toEqual([
      { text: 'Projet', matched: true },
      { text: 'o 01', matched: false },
    ])
  })

  it('não destaca nada com menos de 3 caracteres de busca', () => {
    expect(getHighlightSegments('Projeto 01', 'pr')).toEqual([
      { text: 'Projeto 01', matched: false },
    ])
  })

  it('devolve o texto integral quando não há correspondência', () => {
    expect(getHighlightSegments('Projeto 01', 'xyz')).toEqual([
      { text: 'Projeto 01', matched: false },
    ])
  })
})
