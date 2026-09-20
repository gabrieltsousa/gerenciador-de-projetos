<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

import AppIcon from '@/ui/AppIcon.vue'
import BaseButton from '@/ui/BaseButton.vue'

defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string | undefined] }>()

// localStorage tem quota limitada (5-10MB típico) compartilhada com todos os
// projetos — um cap alto no arquivo bruto (só pra não travar a aba
// decodificando algo absurdo) não protege a quota sozinho: o que conta pra
// ela é o tamanho DEPOIS de comprimido, então a imagem é redimensionada e
// reencodada no cliente antes de virar data URL.
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
const MAX_STORED_BYTES = 400 * 1024
const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.82
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

const error = ref<string | null>(null)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D não suportado neste navegador.')

    // Fundo branco antes de desenhar: toDataURL('image/jpeg') não suporta
    // transparência e preencheria PNGs transparentes de preto por padrão.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)

    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  } finally {
    bitmap.close()
  }
}

async function processFile(file: File) {
  error.value = null

  if (!ACCEPTED_TYPES.includes(file.type)) {
    error.value = 'Escolha uma imagem .jpg ou .png.'
    return
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    error.value = 'Escolha uma imagem de até 8MB.'
    return
  }

  try {
    const compressed = await compressImage(file)
    if (compressed.length > MAX_STORED_BYTES) {
      error.value = 'Não foi possível comprimir essa imagem o suficiente. Tente outra.'
      return
    }
    emit('update:modelValue', compressed)
  } catch {
    error.value = 'Não foi possível processar essa imagem.'
  }
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) processFile(file)
}

function removeCover() {
  emit('update:modelValue', undefined)
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div class="cover-image-upload">
    <div v-if="modelValue" class="cover-image-upload__preview">
      <img :src="modelValue" alt="" class="cover-image-upload__image" />
      <button
        type="button"
        class="cover-image-upload__remove"
        aria-label="Remover capa do projeto"
        @click="removeCover"
      >
        <AppIcon name="trash" />
      </button>
    </div>

    <div v-else class="cover-image-upload__dropzone" @dragover.prevent @drop="handleDrop">
      <AppIcon name="upload" class="cover-image-upload__icon" />
      <p class="cover-image-upload__hint">Escolha uma imagem .jpg ou .png no seu dispositivo</p>
      <BaseButton variant="secondary" size="sm" @click="inputRef?.click()">Selecionar</BaseButton>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png"
      class="sr-only"
      aria-label="Selecionar capa do projeto"
      @change="handleFileChange"
    />

    <p v-if="error" class="cover-image-upload__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.cover-image-upload__dropzone {
  border: 1px dashed var(--color-text-subtle);
  border-radius: var(--radius-sm);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
  color: var(--color-text-muted);
}

.cover-image-upload__icon {
  font-size: 1.5rem;
}

.cover-image-upload__hint {
  margin: 0;
  /* Medido: ~17px, mais perto de --font-size-md que dos 14px herdados. */
  font-size: var(--font-size-md);
}

.cover-image-upload__preview {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.cover-image-upload__image {
  width: 100%;
  max-height: 16rem;
  object-fit: cover;
}

.cover-image-upload__remove {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  color: var(--color-brand);
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cover-image-upload__error {
  color: var(--color-danger-text);
  margin: var(--space-2) 0 0;
}
</style>
