import { describe, expect, it } from 'vitest'

import { compareDates, formatDate, isBeforeToday } from '../project.dates'

describe('formatDate', () => {
  it('formata sem deslocar o dia por fuso horário', () => {
    // Regressão do bug real: new Date('2024-09-01') é meia-noite UTC, que em
    // fusos atrás de UTC (ex.: America/Sao_Paulo) formata como 31/08.
    expect(formatDate('2024-09-01')).toBe('01 de setembro de 2024')
  })
})

describe('compareDates', () => {
  it('ordena strings ISO cronologicamente', () => {
    expect(compareDates('2024-01-01', '2024-12-31')).toBeLessThan(0)
    expect(compareDates('2024-12-31', '2024-01-01')).toBeGreaterThan(0)
    expect(compareDates('2024-01-01', '2024-01-01')).toBe(0)
  })
})

describe('isBeforeToday', () => {
  const today = new Date(2025, 5, 15) // 15/06/2025

  it('considera uma data passada como vencida', () => {
    expect(isBeforeToday('2025-06-14', today)).toBe(true)
  })

  it('não considera o próprio dia de hoje como vencido', () => {
    expect(isBeforeToday('2025-06-15', today)).toBe(false)
  })

  it('não considera uma data futura como vencida', () => {
    expect(isBeforeToday('2025-06-16', today)).toBe(false)
  })
})
