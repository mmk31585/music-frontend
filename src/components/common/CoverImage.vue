<template>
  <div
    :class="[
      'relative overflow-hidden',
      containerClass,
    ]"
    :style="containerStyle"
    :aria-label="alt"
    role="img"
  >
    <img
      v-if="src && !hasError"
      ref="imgRef"
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : undefined"
      class="h-full w-full object-cover"
      :class="imgClass"
      :width="width"
      :height="height"
      @error="onError"
      @load="onLoad"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center rounded-lg bg-surface-2 text-muted"
    >
      <i aria-hidden="true" :class="fallbackIcon" class="text-lg" :style="{ fontSize: iconSize }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  src?: string | null
  alt?: string
  lazy?: boolean
  fallbackIcon?: string
  containerClass?: string
  containerStyle?: string
  imgClass?: string
  iconSize?: string
  width?: number
  height?: number
}

withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  lazy: true,
  fallbackIcon: 'pi pi-music',
  containerClass: '',
  containerStyle: '',
  imgClass: '',
  iconSize: '1.5rem',
  width: 400,
  height: 400,
})

const emit = defineEmits<{
  load: []
  error: []
}>()

const hasError = ref(false)

function onError() {
  hasError.value = true
  emit('error')
}

function onLoad() {
  emit('load')
}
</script>
