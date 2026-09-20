/**
 * Datas de projeto trafegam como string ISO 'YYYY-MM-DD' (o formato nativo
 * de <input type="date">) do formulário até o localStorage. Nunca viram um
 * objeto Date até o exato momento de exibição — porque `new Date('2024-09-01')`
 * é interpretado como meia-noite UTC, e em fusos atrás de UTC (ex.: America/Sao_Paulo)
 * isso formata como o dia ANTERIOR. Construir o Date a partir dos componentes
 * (ano, mês, dia) locais evita esse deslocamento.
 */
function parseIsoDate(value: string): Date {
  const parts = value.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])
  return new Date(year, month - 1, day)
}

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

export function formatDate(value: string): string {
  return longDateFormatter.format(parseIsoDate(value))
}

/**
 * Strings no formato 'YYYY-MM-DD' são comparáveis lexicograficamente na
 * mesma ordem que cronologicamente — não precisa de Date aqui.
 */
export function compareDates(a: string, b: string): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export function isBeforeToday(value: string, today: Date = new Date()): boolean {
  const reference = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return parseIsoDate(value) < reference
}
