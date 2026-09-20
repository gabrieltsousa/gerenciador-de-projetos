export const MIN_SEARCH_LENGTH = 3

// Bloco Unicode "Combining Diacritical Marks" (U+0300–U+036F): o que sobra
// de um caractere acentuado depois de normalizar para NFD (ex.: "é" -> "e" + acento).
// Construído via charCode em vez de um literal \uXXXX na regex para não
// depender de nenhum caractere combinante de fato estar salvo neste arquivo.
const COMBINING_MARKS_PATTERN = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  'g',
)

/** Remove acentuação e normaliza caixa — "café" e "cafe" devem casar. */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(COMBINING_MARKS_PATTERN, '').toLowerCase().trim()
}

export function isSearchQueryActive(query: string): boolean {
  return query.trim().length >= MIN_SEARCH_LENGTH
}

export function matchesSearch(text: string, query: string): boolean {
  return normalizeText(text).includes(normalizeText(query))
}

export interface TextSegment {
  text: string
  matched: boolean
}

/**
 * Divide `text` em partes ao redor da primeira ocorrência de `query`, pra
 * renderização segura em spans (sem v-html). Usa comparação simples de
 * caixa — não a normalização de acentos de `matchesSearch` — porque
 * remover acentos muda o comprimento da string e quebraria o mapeamento
 * de índice de volta pro texto original.
 */
export function getHighlightSegments(text: string, query: string): TextSegment[] {
  const trimmedQuery = query.trim()
  if (trimmedQuery.length < MIN_SEARCH_LENGTH) {
    return [{ text, matched: false }]
  }

  const matchIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase())
  if (matchIndex === -1) {
    return [{ text, matched: false }]
  }

  const segments: TextSegment[] = [
    { text: text.slice(0, matchIndex), matched: false },
    { text: text.slice(matchIndex, matchIndex + trimmedQuery.length), matched: true },
    { text: text.slice(matchIndex + trimmedQuery.length), matched: false },
  ]
  return segments.filter((segment) => segment.text.length > 0)
}
