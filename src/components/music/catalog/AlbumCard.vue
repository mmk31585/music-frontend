<template>
  <RouterLink :to="`/album/${album.id}`" class="group block w-44 shrink-0 space-y-3">
    <div
      class="bg-surface-overlay ring-border-default group-hover:ring-accent/50 relative aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 transition"
    >
      <img
        v-if="album.cover_url"
        :src="album.cover_url"
        :alt="album.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        @error="onImgError"
      />
      <div v-else class="flex h-full items-center justify-center">
        <Disc3 aria-hidden="true" class="text-tertiary text-3xl" />
      </div>
      <div
        class="bg-bg-overlay/30 absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
      >
        <div
          class="bg-accent flex h-12 w-12 items-center justify-center rounded-full text-black shadow-xl"
        >
          <Play aria-hidden="true" class="text-lg" />
        </div>
      </div>
    </div>
    <div class="space-y-0.5 px-1">
      <p class="text-primary truncate text-sm font-bold">
        {{ album.title }}
      </p>
      <p v-if="album.artist_name" class="text-secondary truncate text-xs">
        {{ album.artist_name }}
      </p>
      <p class="text-tertiary text-xs">
        {{ album.release_date?.slice(0, 4) || ''
        }}{{ album.track_count ? ` • ${album.track_count} tracks` : '' }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Disc3, Play } from 'lucide-vue-next'
import { onImgError } from '@/utils/helpers'
import type { Album } from '@/services/api/catalog/albums'

defineProps<{
  album: Album
}>()
</script>
