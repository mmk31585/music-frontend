<template>
  <RouterLink :to="`/artist/${artist.id}`" class="group block w-40 shrink-0 space-y-3">
    <div
      class="bg-surface-overlay ring-border-default group-hover:ring-accent/50 mx-auto h-36 w-36 overflow-hidden rounded-full ring-1 transition"
    >
      <img
        v-if="artist.image_url"
        :src="artist.image_url"
        :alt="artist.name"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        @error="onImgError"
      />
      <div v-else class="flex h-full items-center justify-center">
        <User aria-hidden="true" class="text-tertiary text-3xl" />
      </div>
    </div>
    <div class="space-y-0.5 text-center">
      <p class="text-primary truncate text-sm font-bold">
        {{ artist.name }}
      </p>
      <p class="text-tertiary text-xs">Artist</p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { onImgError } from '@/utils/helpers'
import type { Artist } from '@/services/api/catalog/artists'

defineProps<{
  artist: Artist
}>()
</script>
