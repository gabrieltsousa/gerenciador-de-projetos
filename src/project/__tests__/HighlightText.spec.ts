import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import HighlightText from '../components/HighlightText.vue'

describe('HighlightText', () => {
  it('renderiza o texto completo sem espaços indevidos entre os trechos', () => {
    const { container } = render(HighlightText, { props: { text: 'Projeto 01', query: 'Projet' } })
    expect(container.textContent?.trim()).toBe('Projeto 01')
  })

  it('marca apenas o trecho correspondente com <mark>, sem v-html', () => {
    const { container } = render(HighlightText, { props: { text: 'Projeto 01', query: 'Projet' } })
    const mark = container.querySelector('mark')
    expect(mark).not.toBeNull()
    expect(mark?.textContent).toBe('Projet')
  })

  it('não marca nada quando a busca tem menos de 3 caracteres', () => {
    const { container } = render(HighlightText, { props: { text: 'Projeto 01', query: 'pr' } })
    expect(container.querySelector('mark')).toBeNull()
  })
})
