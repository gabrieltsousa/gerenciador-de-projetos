import { z } from 'zod'

import { compareDates } from './project.dates'

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const parts = value.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const isoDateField = z.string().refine(isValidCalendarDate, 'Selecione uma data válida')

/**
 * Regras de "Nome do projeto" (mínimo 2 palavras) e "Cliente" (mínimo 1
 * palavra) vêm literalmente do estado de erro capturado no Figma
 * ("Validações Formulário do Projeto"), não são uma convenção genérica.
 *
 * Criar e editar usam exatamente os mesmos campos no design (mesmo
 * ProjectForm.vue reaproveitado) — por isso um único schema serve aos dois,
 * em vez de dois schemas quase idênticos que precisariam ficar em sincronia.
 */
export const projectInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .refine((value) => wordCount(value) >= 2, 'Por favor, digite ao menos duas palavras'),
    client: z
      .string()
      .trim()
      .refine((value) => wordCount(value) >= 1, 'Por favor, digite ao menos uma palavra'),
    startDate: isoDateField,
    endDate: isoDateField,
    coverImage: z
      .string()
      .regex(/^data:image\/(jpeg|png);base64,/, 'A capa deve ser uma imagem .jpg ou .png')
      .optional(),
  })
  .refine((data) => compareDates(data.endDate, data.startDate) >= 0, {
    message: 'A data final não pode ser anterior à data de início',
    path: ['endDate'],
  })

export type ProjectInput = z.infer<typeof projectInputSchema>
export type CreateProjectInput = ProjectInput
export type UpdateProjectInput = ProjectInput

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  client: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  // Mesma restrição do schema de escrita — sem isso, um localStorage editado
  // manualmente passaria por aqui sem a garantia de que coverImage é
  // sempre um data URL de imagem.
  coverImage: z
    .string()
    .regex(/^data:image\/(jpeg|png);base64,/)
    .optional(),
  favorite: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Project = z.infer<typeof projectSchema>
