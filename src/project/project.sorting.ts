import type { Project } from './project.model'
import { compareDates, isBeforeToday } from './project.dates'

export type SortOption = 'alphabetical' | 'recently-started' | 'end-date-proximity'

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'alphabetical', label: 'Ordem alfabética' },
  { value: 'recently-started', label: 'Iniciados mais recentes' },
  { value: 'end-date-proximity', label: 'Prazo mais próximo' },
]

function byName(a: Project, b: Project): number {
  return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
}

function byStartDateDesc(a: Project, b: Project): number {
  return compareDates(b.startDate, a.startDate)
}

/** Projetos ainda ativos (prazo não vencido) aparecem antes dos já encerrados;
 * dentro de cada grupo, o prazo mais próximo vem primeiro. */
function byEndDateProximity(a: Project, b: Project): number {
  const aEnded = isBeforeToday(a.endDate)
  const bEnded = isBeforeToday(b.endDate)
  if (aEnded !== bEnded) return aEnded ? 1 : -1
  return compareDates(a.endDate, b.endDate)
}

const comparators: Record<SortOption, (a: Project, b: Project) => number> = {
  alphabetical: byName,
  'recently-started': byStartDateDesc,
  'end-date-proximity': byEndDateProximity,
}

export function sortProjects(projects: Project[], sortOption: SortOption): Project[] {
  return [...projects].sort(comparators[sortOption])
}
