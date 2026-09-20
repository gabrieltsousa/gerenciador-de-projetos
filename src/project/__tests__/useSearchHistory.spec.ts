import { beforeEach, describe, expect, it } from 'vitest'

import { useSearchHistory } from '../composables/useSearchHistory'

describe('useSearchHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('ignora termos com menos de 3 caracteres', () => {
    const { history, addSearch } = useSearchHistory()
    addSearch('ab')
    expect(history.value).toEqual([])
  })

  it('adiciona o mais recente primeiro', () => {
    const { history, addSearch } = useSearchHistory()
    addSearch('projeto')
    addSearch('cliente')
    expect(history.value).toEqual(['cliente', 'projeto'])
  })

  it('não duplica termos (case-insensitive) — só reordena para o topo', () => {
    const { history, addSearch } = useSearchHistory()
    addSearch('projeto')
    addSearch('cliente')
    addSearch('Projeto')
    expect(history.value).toEqual(['Projeto', 'cliente'])
  })

  it('mantém no máximo 5 entradas', () => {
    const { history, addSearch } = useSearchHistory()
    ;['um', 'dois', 'tres', 'quatro', 'cinco', 'seis'].forEach(addSearch)
    expect(history.value).toHaveLength(5)
    expect(history.value).toEqual(['seis', 'cinco', 'quatro', 'tres', 'dois'])
  })

  it('persiste entre instâncias diferentes do composable', () => {
    const first = useSearchHistory()
    first.addSearch('projeto')

    const second = useSearchHistory()
    expect(second.history.value).toEqual(['projeto'])
  })

  it('remove uma entrada específica', () => {
    const { history, addSearch, removeSearch } = useSearchHistory()
    addSearch('projeto')
    addSearch('cliente')
    removeSearch('projeto')
    expect(history.value).toEqual(['cliente'])
  })
})
