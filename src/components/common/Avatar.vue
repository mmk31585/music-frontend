<template>
  <div
    :class="[
      'inline-flex items-center justify-center rounded-full',
      sizeClass,
      'bg-surface-3 text-primary border border-white/10',
    ]"
    :aria-label="alt"
    role="img"
  >
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover rounded-full"
      @error="onError"
    />
    <span
      v-else
      class="flex items-center justify-center text-sm font-medium text-white"
    >
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string | null
  name?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
  src: '',
  name: '',
  alt: '',
  size: 'md',
})

const initials = computed(() => {
  if (!name) return '?'
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

const sizeClass = computed(() => {
  switch (size) {
    case 'sm': return 'h-6 w-6'
    case 'md': return 'h-8 w-8'
    case 'lg': return 'h-10 w-10'
    case 'xl': return 'h-12 w-12'
    default: return 'h-8 w-8'
  }
})

const hasError = ref(false)

function onError() {
  hasError.value = true
}
</script>

<style scoped></style>
