<script setup lang="ts">
export type IconName =
  | 'star'
  | 'star-outline'
  | 'calendar'
  | 'calendar-check'
  | 'dots'
  | 'edit'
  | 'trash'
  | 'search'
  | 'plus-circle'
  | 'arrow-left'
  | 'upload'
  | 'close'
  | 'history'

defineProps<{ name: IconName }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- Contorno branco mesmo preenchida — dá contraste ao ícone dourado
         sobre o banner roxo, sem precisar escurecer a cor da marca. -->
    <path
      v-if="name === 'star'"
      fill="currentColor"
      stroke="var(--color-surface)"
      stroke-width="1.25"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
    />
    <path
      v-else-if="name === 'star-outline'"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
    />

    <template v-else-if="name === 'calendar'">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </template>

    <template v-else-if="name === 'calendar-check'">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="8 15 11 18 16 12.5" />
    </template>

    <template v-else-if="name === 'dots'">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </template>

    <path v-else-if="name === 'edit'" d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />

    <template v-else-if="name === 'trash'">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </template>

    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </template>

    <template v-else-if="name === 'plus-circle'">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </template>

    <template v-else-if="name === 'arrow-left'">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </template>

    <template v-else-if="name === 'upload'">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </template>

    <template v-else-if="name === 'close'">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </template>

    <template v-else-if="name === 'history'">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </template>
  </svg>
</template>
