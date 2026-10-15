<template>
  <div
    class="bg-surface-overlay ring-border-default relative overflow-hidden rounded-2xl p-4 ring-1 backdrop-blur-sm transition-all duration-300"
    :class="musicStatus?.playing ? 'ring-spotify/20' : ''"
  >
    <!-- Ambient glow when playing -->
    <div
      v-if="musicStatus?.playing"
      class="bg-accent/5 pointer-events-none absolute -inset-4 blur-3xl motion-safe:animate-pulse"
      aria-hidden="true"
      style="animation-duration: 3s"
    />

    <div class="relative z-10 flex items-center gap-4">
      <!-- Vinyl cover art -->
      <div class="relative shrink-0">
        <div
          class="h-16 w-16 overflow-hidden rounded-full shadow-lg ring-2"
          :class="musicStatus?.playing ? 'ring-accent/40' : 'ring-border-default'"
        >
          <img
            v-if="currentTrackInfo?.coverUrl"
            :src="currentTrackInfo.coverUrl"
            alt=""
            class="motion-safe:animate-spin-slow h-full w-full object-cover"
            :class="{ 'animate-paused': !musicStatus?.playing }"
            loading="lazy"
          />
          <div v-else class="bg-surface-overlay flex h-full w-full items-center justify-center">
            <Music aria-hidden="true" class="text-muted text-lg" />
          </div>
        </div>
        <!-- Center dot -->
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div class="bg-primary h-2.5 w-2.5 rounded-full shadow" />
        </div>
      </div>

      <!-- Track info -->
      <div class="min-w-0 flex-1">
        <div v-if="musicStatus?.playing" class="mb-0.5 flex items-center gap-2">
          <span class="flex gap-0.5" aria-hidden="true">
            <span
              v-for="i in 4"
              :key="i"
              class="bg-spotify motion-safe:animate-equalizer h-3 w-0.5 rounded-full"
              :style="{ animationDelay: `${i * 80}ms` }"
            />
          </span>
          <span class="text-accent text-[10px] font-semibold tracking-wider uppercase"
            >Now Playing</span
          >
        </div>
        <div v-else class="mb-0.5 flex items-center gap-1.5">
          <PauseCircle aria-hidden="true" class="text-muted text-[10px]" />
          <span class="text-muted text-[10px]">Last played</span>
          <span v-if="lastPlayedLabel" class="text-muted text-[10px]"
            >&middot; {{ lastPlayedLabel }}</span
          >
        </div>

        <p class="text-primary truncate text-sm font-semibold">
          {{ currentTrackInfo?.title || 'No track' }}
        </p>
        <p class="text-tertiary truncate text-xs">{{ currentTrackInfo?.artist || '' }}</p>
      </div>

      <!-- Listen Along button -->
      <button
        v-if="musicStatus?.playing && !isOwnProfile"
        aria-label="Listen along"
        class="bg-accent hover:bg-accent-hover focus-visible:outline-primary shrink-0 rounded-full px-4 py-2 text-xs font-bold text-black transition-all duration-200 hover:scale-105 focus-visible:outline-2 active:scale-95"
        @click="$emit('listenAlong', currentTrackInfo!.id)"
      >
        Listen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music, PauseCircle } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  musicStatus?: {
    playing: boolean
    currentTrack?: {
      id: string
      title: string
      artist: string
      coverUrl: string
    } | null
    current_track_id?: string | null
    updated_at?: string | null
  } | null
  isOwnProfile?: boolean
  lastPlayedLabel?: string
}>()

defineEmits<{
  listenAlong: [trackId: string]
}>()

const currentTrackInfo = computed(() => props.musicStatus?.currentTrack || null)
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 4s linear infinite;
}
.animate-paused {
  animation-play-state: paused !important;
}

@keyframes equalizer {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(2.5);
  }
}
.animate-equalizer {
  animation: equalizer 0.6s ease-in-out infinite;
  transform-origin: bottom;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow {
    animation: none;
  }
  .animate-equalizer {
    animation: none;
  }
  .animate-paused {
    animation: none;
  }
  .motion-safe\:animate-pulse {
    animation: none;
  }
}
</style>
