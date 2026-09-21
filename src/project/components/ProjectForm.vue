<script setup lang="ts">
import { ref } from 'vue'

import AppIcon from '@/ui/AppIcon.vue'
import BaseButton from '@/ui/BaseButton.vue'
import type { ProjectInput } from '../project.model'
import { useProjectForm } from '../composables/useProjectForm'
import CoverImageUpload from './CoverImageUpload.vue'

const props = defineProps<{ initialValues: ProjectInput }>()
const emit = defineEmits<{ submit: [values: ProjectInput] }>()

const { values, isValid, errors, touched, touch } = useProjectForm(props.initialValues)

// Complementa `touched` (ver useProjectForm): cobre o caso de o usuário
// clicar direto em "Salvar" sem passar por nenhum campo primeiro.
const hasAttemptedSubmit = ref(false)

function handleSubmit() {
  hasAttemptedSubmit.value = true
  if (!isValid.value) return
  emit('submit', { ...values })
}
</script>

<template>
  <form class="project-form" novalidate @submit.prevent="handleSubmit">
    <div class="project-form__field">
      <label for="project-name"
        >Nome do projeto <span class="project-form__required">(Obrigatório)</span></label
      >
      <input
        id="project-name"
        v-model="values.name"
        type="text"
        :aria-invalid="(hasAttemptedSubmit || touched.name) && !!errors.name"
        :aria-describedby="
          (hasAttemptedSubmit || touched.name) && errors.name ? 'project-name-error' : undefined
        "
        @blur="touch('name')"
      />
      <p
        v-if="(hasAttemptedSubmit || touched.name) && errors.name"
        id="project-name-error"
        class="project-form__error"
        role="alert"
      >
        {{ errors.name }}
      </p>
    </div>

    <div class="project-form__field">
      <label for="project-client"
        >Cliente <span class="project-form__required">(Obrigatório)</span></label
      >
      <input
        id="project-client"
        v-model="values.client"
        type="text"
        :aria-invalid="(hasAttemptedSubmit || touched.client) && !!errors.client"
        :aria-describedby="
          (hasAttemptedSubmit || touched.client) && errors.client
            ? 'project-client-error'
            : undefined
        "
        @blur="touch('client')"
      />
      <p
        v-if="(hasAttemptedSubmit || touched.client) && errors.client"
        id="project-client-error"
        class="project-form__error"
        role="alert"
      >
        {{ errors.client }}
      </p>
    </div>

    <div class="project-form__row">
      <div class="project-form__field">
        <label for="project-start-date"
          >Data de Início <span class="project-form__required">(Obrigatório)</span></label
        >
        <div class="project-form__date-input">
          <input
            id="project-start-date"
            v-model="values.startDate"
            type="date"
            :aria-invalid="(hasAttemptedSubmit || touched.startDate) && !!errors.startDate"
            :aria-describedby="
              (hasAttemptedSubmit || touched.startDate) && errors.startDate
                ? 'project-start-date-error'
                : undefined
            "
            @blur="touch('startDate')"
          />
          <AppIcon name="calendar" class="project-form__date-icon" />
        </div>
        <p
          v-if="(hasAttemptedSubmit || touched.startDate) && errors.startDate"
          id="project-start-date-error"
          class="project-form__error"
          role="alert"
        >
          {{ errors.startDate }}
        </p>
      </div>

      <div class="project-form__field">
        <label for="project-end-date"
          >Data Final <span class="project-form__required">(Obrigatório)</span></label
        >
        <div class="project-form__date-input">
          <input
            id="project-end-date"
            v-model="values.endDate"
            type="date"
            :aria-invalid="(hasAttemptedSubmit || touched.endDate) && !!errors.endDate"
            :aria-describedby="
              (hasAttemptedSubmit || touched.endDate) && errors.endDate
                ? 'project-end-date-error'
                : undefined
            "
            @blur="touch('endDate')"
          />
          <AppIcon name="calendar-check" class="project-form__date-icon" />
        </div>
        <p
          v-if="(hasAttemptedSubmit || touched.endDate) && errors.endDate"
          id="project-end-date-error"
          class="project-form__error"
          role="alert"
        >
          {{ errors.endDate }}
        </p>
      </div>
    </div>

    <div class="project-form__field">
      <span class="project-form__label">Capa do projeto</span>
      <CoverImageUpload v-model="values.coverImage" />
    </div>

    <BaseButton type="submit" :class="{ 'project-form__submit--muted': !isValid }">
      Salvar projeto
    </BaseButton>
  </form>
</template>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 40rem;
  margin: 0 auto;
}

.project-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

/* Em telas estreitas, "Data de Início (Obrigatório)" quebra em duas linhas
   e "Data Final" não — os dois inputs abaixo ficam desalinhados, e a coluna
   da direita chega a estourar a largura do card. Empilhar em 1 coluna
   evita o problema na raiz, em vez de tentar encaixar o texto. */
@media (max-width: 32rem) {
  .project-form__row {
    grid-template-columns: 1fr;
  }
}

.project-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-form__field label,
.project-form__label {
  color: var(--color-heading);
  font-weight: 500;
  /* Medido: rótulos de campo ficam em ~16-18px, não os 14px herdados do
     corpo do texto. */
  font-size: var(--font-size-md);
}

.project-form__required {
  color: var(--color-text-muted);
  font-weight: 400;
  font-size: var(--font-size-xs);
}

.project-form__field input {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-text-subtle);
}

.project-form__field input[aria-invalid='true'] {
  border-color: var(--color-danger);
}

/*
  O Figma usa dois ícones diferentes pros dois campos de data (calendar e
  calendar-check, os mesmos do AppIcon usados nos cards) — o ícone nativo do
  navegador é genérico e igual nos dois. Escondemos só o glifo nativo
  (opacity, não display/visibility — ele continua no layout e clicável) e
  sobrepomos o ícone certo por cima, sem tocar no <input> nativo, no popup
  ou em navegação por teclado.

  Só ::-webkit-calendar-picker-indicator (Chrome/Edge/Safari); Firefox não
  expõe esse pseudo-elemento, então lá o ícone nativo continua visível sob
  o nosso — sobreposição só nesse navegador, sem quebrar a função.
*/
.project-form__date-input {
  position: relative;
  display: flex;
}

.project-form__date-input input {
  flex: 1;
  min-width: 0;
}

.project-form__date-input input[type='date']::-webkit-calendar-picker-indicator {
  opacity: 0;
}

.project-form__date-icon {
  position: absolute;
  top: 50%;
  right: var(--space-4);
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.project-form__error {
  margin: 0;
  color: var(--color-danger-text);
  /* Medido: ~15px, mais perto de --font-size-sm que de -xs. */
  font-size: var(--font-size-sm);
}

.project-form__submit--muted {
  /* Texto branco sobre --color-brand-disabled só dá 2.11:1 de contraste —
     falha o mínimo de 4.5:1 pra texto. Trocado pro roxo escuro do heading,
     que passa com folga (6.72:1). */
  background-color: var(--color-brand-disabled);
  color: var(--color-heading);
}
</style>
