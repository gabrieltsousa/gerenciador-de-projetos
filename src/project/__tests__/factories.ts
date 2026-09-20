import type { Project } from '../project.model'

let sequence = 0

export function makeProject(overrides: Partial<Project> = {}): Project {
  sequence += 1
  return {
    id: `project-${sequence}`,
    name: `Projeto ${sequence}`,
    client: 'Acme',
    startDate: '2024-09-01',
    endDate: '2024-12-12',
    favorite: false,
    createdAt: '2024-09-01T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    ...overrides,
  }
}
