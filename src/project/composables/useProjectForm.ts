import { computed, reactive } from 'vue'

import { projectInputSchema, type ProjectInput } from '../project.model'

type FieldErrors = Partial<Record<keyof ProjectInput, string>>
type FieldTouched = Partial<Record<keyof ProjectInput, boolean>>

/**
 * Validação totalmente derivada de `values` via computed — não existe um
 * passo imperativo "validate()" que pode ficar dessincronizado do estado
 * atual. Isso é o mesmo princípio de estado derivado usado no resto do
 * app (busca, ordenação), aplicado a formulário.
 */
export function useProjectForm(initialValues: ProjectInput) {
  const values = reactive<ProjectInput>({ ...initialValues })
  const touched = reactive<FieldTouched>({})

  const validation = computed(() => projectInputSchema.safeParse({ ...values }))
  const isValid = computed(() => validation.value.success)

  const errors = computed<FieldErrors>(() => {
    const result = validation.value
    if (result.success) return {}

    const fieldErrors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !(key in fieldErrors)) {
        fieldErrors[key as keyof ProjectInput] = issue.message
      }
    }
    return fieldErrors
  })

  // Sai do campo com valor inválido -> erro aparece na hora, sem precisar
  // clicar em "Salvar projeto" primeiro (o botão fica com aparência "fraca"
  // antes do form ser válido, o que por si só já desestimula esse clique).
  function touch(field: keyof ProjectInput) {
    touched[field] = true
  }

  return { values, isValid, errors, touched, touch }
}
