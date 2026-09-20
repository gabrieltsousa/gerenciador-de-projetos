import { z } from 'zod'

import type { CreateProjectInput, Project, UpdateProjectInput } from './project.model'
import { projectInputSchema, projectSchema } from './project.model'

const STORAGE_KEY = 'gerenciador-de-projetos:projects'

const projectListSchema = z.array(projectSchema)

/**
 * Erro controlado da camada de persistência — cobre tanto falha de escrita
 * (quota do localStorage excedida, storage indisponível em modo privado)
 * quanto operações num projeto que não existe mais. Não criamos uma
 * hierarquia de erros por tipo porque a UI trata os dois casos da mesma
 * forma: mostra uma mensagem e não derruba a aplicação.
 */
export class ProjectRepositoryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ProjectRepositoryError'
  }
}

/**
 * Único ponto de contato com a fonte de dados. Interface async por
 * contrato — mesmo o localStorage sendo síncrono por baixo, uma fonte real
 * (API HTTP) seria assíncrona, e queremos que trocar a implementação não
 * exija tocar em nenhum componente ou store.
 */
export interface ProjectRepository {
  findAll(): Promise<Project[]>
  create(input: CreateProjectInput): Promise<Project>
  update(id: string, input: UpdateProjectInput): Promise<Project>
  remove(id: string): Promise<void>
  toggleFavorite(id: string): Promise<Project>
}

export class LocalStorageProjectRepository implements ProjectRepository {
  constructor(private readonly storage: Storage = window.localStorage) {}

  async findAll(): Promise<Project[]> {
    return this.readAll()
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const data = projectInputSchema.parse(input)
    const now = new Date().toISOString()
    const project: Project = {
      ...data,
      id: crypto.randomUUID(),
      favorite: false,
      createdAt: now,
      updatedAt: now,
    }

    this.writeAll([...this.readAll(), project])
    return project
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const data = projectInputSchema.parse(input)
    const projects = this.readAll()
    const existing = projects.find((project) => project.id === id)
    if (!existing) {
      throw new ProjectRepositoryError(`Projeto ${id} não encontrado.`)
    }

    const updated: Project = { ...existing, ...data, updatedAt: new Date().toISOString() }
    this.writeAll(projects.map((project) => (project.id === id ? updated : project)))
    return updated
  }

  async remove(id: string): Promise<void> {
    this.writeAll(this.readAll().filter((project) => project.id !== id))
  }

  async toggleFavorite(id: string): Promise<Project> {
    const projects = this.readAll()
    const existing = projects.find((project) => project.id === id)
    if (!existing) {
      throw new ProjectRepositoryError(`Projeto ${id} não encontrado.`)
    }

    const updated: Project = {
      ...existing,
      favorite: !existing.favorite,
      updatedAt: new Date().toISOString(),
    }
    this.writeAll(projects.map((project) => (project.id === id ? updated : project)))
    return updated
  }

  private readAll(): Project[] {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (!raw) return []

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch (error) {
      console.error('Dados de projetos corrompidos no localStorage — ignorando.', error)
      return []
    }

    const result = projectListSchema.safeParse(parsed)
    if (!result.success) {
      console.error(
        'Dados de projetos com formato inesperado no localStorage — ignorando.',
        result.error,
      )
      return []
    }
    return result.data
  }

  private writeAll(projects: Project[]): void {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch (error) {
      throw new ProjectRepositoryError(
        'Não foi possível salvar os projetos. O armazenamento local pode estar cheio ou indisponível.',
        { cause: error },
      )
    }
  }
}
