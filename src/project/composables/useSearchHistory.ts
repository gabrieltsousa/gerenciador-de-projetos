import { ref } from 'vue'

import { isSearchQueryActive } from '../project.search'

const STORAGE_KEY = 'gerenciador-de-projetos:search-history'
const MAX_ENTRIES = 5

/**
 * Histórico de busca é um array plano de strings, sem id/timestamp/CRUD —
 * dar a ele a mesma cerimônia do ProjectRepository (interface + classe)
 * seria simetria por si só, não desacoplamento real. Uma leitura/escrita
 * direta de uma chave do localStorage já resolve o problema por completo.
 */
function readHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

export function useSearchHistory() {
  const history = ref<string[]>(readHistory())

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
    } catch {
      // Histórico é um "nice to have" — se o storage estiver indisponível,
      // a busca em si continua funcionando, só sem persistir o histórico.
    }
  }

  function addSearch(term: string) {
    const trimmed = term.trim()
    if (!isSearchQueryActive(trimmed)) return

    const withoutDuplicate = history.value.filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    )
    history.value = [trimmed, ...withoutDuplicate].slice(0, MAX_ENTRIES)
    persist()
  }

  function removeSearch(term: string) {
    history.value = history.value.filter((item) => item !== term)
    persist()
  }

  return { history, addSearch, removeSearch }
}
