import { describe, expect, it } from 'vitest'

import { projectInputSchema } from '../project.model'

function baseInput() {
  return {
    name: 'Projeto Iridium',
    client: 'Iridium',
    startDate: '2025-01-01',
    endDate: '2025-02-01',
  }
}

describe('projectInputSchema', () => {
  it('aceita um input válido', () => {
    const result = projectInputSchema.safeParse(baseInput())
    expect(result.success).toBe(true)
  })

  it('exige ao menos duas palavras no nome do projeto', () => {
    const result = projectInputSchema.safeParse({ ...baseInput(), name: 'Iridium' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Por favor, digite ao menos duas palavras')
  })

  it('exige ao menos uma palavra no cliente', () => {
    const result = projectInputSchema.safeParse({ ...baseInput(), client: '   ' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Por favor, digite ao menos uma palavra')
  })

  it('rejeita datas em formato ou calendário inválido', () => {
    const result = projectInputSchema.safeParse({ ...baseInput(), startDate: '2025-02-30' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Selecione uma data válida')
  })

  it('rejeita data final anterior à data de início', () => {
    const result = projectInputSchema.safeParse({
      ...baseInput(),
      startDate: '2025-06-01',
      endDate: '2025-01-01',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'A data final não pode ser anterior à data de início',
    )
  })
})
