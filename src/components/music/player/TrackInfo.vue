<template>
  <div class="flex w-[25%] min-w-0 items-center gap-3 pb-1" :dir="dir">
    <button
      type="button"
      aria-label="Open fullscreen player"
      class="relative shrink-0"
      @click="$emit('open-fullscreen')"
    >
      <div
        class="ring-border-default ease-out-expo overflow-hidden rounded-[18px] shadow-[0_16px_32px_rgba(0,0,0,0.5)] ring-1 transition-all duration-700"
        :class="[isPlaying ? 'scale-100' : 'scale-95 opacity-80']"
        :style="artworkStyle"
      >
        <img
          v-if="coverUrl"
          :src="coverUrl"
          :alt="title"
          class="h-14 w-14 object-cover md:h-16 md:w-16"
          loading="lazy"
        />
        <div
          v-else
          class="from-spotify/30 to-aurora-purple/30 flex h-14 w-14 items-center justify-center bg-linear-to-br md:h-16 md:w-16"
        >
          <Music class="text-tertiary h-8 w-8" aria-hidden="true" />
        </div>
        <!-- Dynamic glow from album color -->
        <div
          v-if="isPlaying && progressColor"
          class="absolute inset-0 rounded-[18px] opacity-0 transition-opacity duration-500"
          :style="{ boxShadow: `0 0 40px ${progressColor}80, 0 0 80px ${progressColor}40` }"
        />
      </div>
    </button>

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <p class="text-primary truncate text-sm leading-tight font-bold">{{ title }}</p>
        <!-- Multiple artists with individual links -->
        <div
          v-if="artists && artists.length > 1"
          class="text-primary/50 flex items-center gap-1 text-xs"
        >
          <template v-for="(artist, i) in artists" :key="artist.id || i">
            <button
              v-if="artist.id"
              type="button"
              class="hover:text-primary focus-visible:ring-spotify/60 flex items-center gap-0.5 rounded px-0.5 transition-colors hover:underline focus-visible:ring-1 focus-visible:outline-none"
              @click.stop="$emit('navigate-artist', artist.id)"
              :aria-label="`View ${artist.name}`"
            >
              {{ artist.name }}
              <span v-if="i < artists.length - 1" class="text-primary/30">•</span>
            </button>
            <span v-else class="flex items-center gap-0.5">
              {{ artist.name }}
              <span v-if="i < artists.length - 1" class="text-primary/30">•</span>
            </span>
          </template>
        </div>
        <button
          v-else-if="artistId"
          type="button"
          class="flex shrink-0 items-center justify-center transition-all hover:scale-110 active:scale-90"
          :class="liked ? 'text-aurora-pink' : 'text-primary/30 hover:text-primary/60'"
          :aria-label="liked ? 'Unlike' : 'Like'"
          @click.stop="$emit('toggle-like')"
        >
          <Heart
            :class="['text-xs', liked ? 'fill-current' : '']"
            :stroke-width="liked ? 0 : 2"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          class="text-primary/30 hover:text-primary/60 flex shrink-0 items-center justify-center transition-all hover:scale-110 active:scale-90"
          aria-label="Add to playlist"
          @click.stop="$emit('add-to-playlist')"
        >
          <Plus class="size-5" aria-hidden="true" />
        </button>
      </div>
      <p
        v-if="artistName && (!artists || artists.length <= 1)"
        class="text-primary/50 mt-0.5 truncate text-xs leading-tight"
      >
        {{ artistName }}
      </p>
      <p
        v-else-if="artists && artists.length > 1"
        class="text-primary/40 mt-0.5 truncate text-xs leading-tight"
      >
        {{
          artists
            .slice(1)
            .map((a) => a.name)
            .join(' • ')
        }}
      </p>
      <!-- Playing indicator - animated equalizer bars -->
      <div
        v-if="isPlaying"
        class="mt-1 flex items-center gap-1"
        role="status"
        aria-live="polite"
        aria-label="Now playing"
      >
        <span class="bg-surface-overlay animate-equalizer equalizer-bar-1 size-1 rounded-full" />
        <span
          class="bg-surface-overlay animate-equalizer equalizer-bar-2 size-1 rounded-full"
          style="animation-delay: 0.15s"
        />
        <span
          class="bg-surface-overlay animate-equalizer equalizer-bar-3 size-1 rounded-full"
          style="animation-delay: 0.3s"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Heart, Music, Plus } from 'lucide-vue-next'
import { useRTL } from '@/composables/useRTL'

interface Artist {
  id?: string
  name: string
}

const props = defineProps<{
  title: string
  artistName: string
  artistId?: string
  artists?: Artist[]
  coverUrl?: string
  isPlaying: boolean
  liked: boolean
  progressColor?: string
}>()

defineEmits<{
  'open-fullscreen': []
  'toggle-like': []
  'add-to-playlist': []
  'navigate-artist': [artistId: string]
}>()

const { dir } = useRTL()

const artworkStyle = computed(() => {
  if (!props.progressColor) return {}
  return {
    boxShadow: `
      0 16px 32px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.1),
      0 0 40px ${props.progressColor}40,
      0 0 80px ${props.progressColor}20
    `,
  }
})
</script>

<style scoped>
/* Equalizer bar animations */
.animate-equalizer {
  animation: eq-wave 600ms ease-in-out infinite alternate;
  transform-origin: bottom;
}

.equalizer-bar-1 {
  animation-delay: 0ms;
}

.equalizer-bar-2 {
  animation-delay: 150ms;
}

.equalizer-bar-3 {
  animation-delay: 300ms;
}

@keyframes eq-wave {
  0% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
</style>
