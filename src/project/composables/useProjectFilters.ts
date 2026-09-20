import { computed, ref, type Ref } from 'vue'

import type { Project } from '../project.model'
import { sortProjects, type SortOption } from '../project.sorting'

/**
 * Deriva a lista visível a partir da coleção completa — nunca mantém uma
 * segunda cópia "filteredProjects" como estado independente. Favoritar um
 * projeto já reflete aqui automaticamente porque `favorite` é lido direto
 * do objeto original.
 */
export function useProjectFilters(projects: Ref<Project[]>) {
  const favoritesOnly = ref(false)
  const sortOption = ref<SortOption>('alphabetical')

  const visibleProjects = computed(() => {
    const filtered = favoritesOnly.value
      ? projects.value.filter((project) => project.favorite)
      : projects.value
    return sortProjects(filtered, sortOption.value)
  })

  return { favoritesOnly, sortOption, visibleProjects }
}
