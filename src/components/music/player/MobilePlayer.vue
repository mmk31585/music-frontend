<template>
  <Transition name="bar-slide">
    <div
      v-if="currentTrack"
      key="mobile-bar"
      role="contentinfo"
      aria-label="Music player"
      class="fixed inset-x-0 z-45 select-none md:hidden"
      style="bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px))"
    >
      <button
        type="button"
        class="relative mx-3 flex w-[calc(100%-1.5rem)] items-center gap-3 overflow-hidden rounded-2xl text-left shadow-2xl transition-all duration-500 active:scale-[0.98]"
        :style="barBackgroundStyle"
        @click="$emit('open-fullscreen')"
      >
        <!-- Artwork background with blur -->
        <div
          v-if="coverUrl"
          class="absolute inset-0 scale-110 bg-cover bg-center opacity-[0.25] blur-2xl transition-all duration-700"
          :style="{ backgroundImage: `url(${coverUrl})` }"
          aria-hidden="true"
        />
        <div class="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/80" />

        <!-- Artwork -->
        <div class="relative shrink-0">
          <div class="ring-border-default h-12 w-12 overflow-hidden rounded-xl shadow-lg ring-1">
            <img
              v-if="coverUrl"
              :src="coverUrl"
              :alt="title"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="from-spotify/30 to-aurora-purple/30 flex h-full w-full items-center justify-center bg-linear-to-br"
            >
              <Music class="text-tertiary h-6 w-6" aria-hidden="true" />
            </div>
          </div>
        </div>

        <!-- Track info -->
        <div class="relative min-w-0 flex-1">
          <p class="text-primary truncate text-sm font-bold">{{ title }}</p>
          <p class="text-secondary truncate text-xs">{{ artistName }}</p>
        </div>

        <!-- Controls -->
        <div class="relative flex items-center gap-1 pr-1" @click.stop>
          <GuestPlayGate action="play" #default="{ proceed }">
            <button
              type="button"
              class="bg-surface-active flex h-10 w-10 items-center justify-center rounded-full text-black shadow-lg transition-transform active:scale-90 disabled:opacity-40"
              :disabled="!props.currentTrack || props.isLoadingTrack"
              :aria-label="playAriaLabel"
              @click="props.isPlaying ? props.togglePlayPause() : proceed()"
            >
              <Loader
                v-if="props.isLoadingTrack || props.isBuffering"
                class="animate-spin-slow h-5 w-5"
                aria-hidden="true"
              />
              <Pause v-else-if="props.isPlaying" class="h-5 w-5" aria-hidden="true" />
              <Play v-else class="ml-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          </GuestPlayGate>
          <button
            type="button"
            class="text-secondary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90"
            :disabled="!props.hasNext"
            aria-label="Next track"
            @click.stop="$emit('play-next')"
          >
            <SkipForward class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </button>

      <div
        v-if="playbackError"
        class="mx-3 mt-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-1.5 text-xs text-red-400"
      >
        <AlertCircle class="h-4 w-4" aria-hidden="true" />
        <span>{{ playbackError }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, Loader, Music, Pause, Play, SkipForward } from 'lucide-vue-next'
import GuestPlayGate from '@/components/common/GuestPlayGate.vue'

interface Props {
  currentTrack: any
  isPlaying: boolean
  isBuffering: boolean
  isLoadingTrack: boolean
  hasNext: boolean
  playbackError: string | null
  coverUrl: string | null
  title: string
  artistName: string
  togglePlayPause: () => void
}

const props = defineProps<Props>()

defineEmits<{
  'open-fullscreen': []
  'play-next': []
}>()

const playAriaLabel = computed(() => {
  if (props.isLoadingTrack || props.isBuffering) return 'Loading'
  return props.isPlaying ? 'Pause' : 'Play'
})

const barBackgroundStyle = computed(() => {
  const baseBlur = 'blur(24px)'
  const baseBackdrop = 'blur(24px)'
  if (props.coverUrl) {
    return {
      background: 'var(--glass-bg-strong)',
      backdropFilter: baseBackdrop,
      WebkitBackdropFilter: baseBlur,
    }
  }
  return {
    background: 'var(--glass-bg-strong)',
    backdropFilter: baseBackdrop,
    WebkitBackdropFilter: baseBlur,
  }
})
</script>

<style scoped>
.bar-slide-enter-active {
  transition: transform 400ms cubic-bezier(0.19, 1, 0.22, 1);
}
.bar-slide-leave-active {
  transition: transform 300ms ease-in;
}
.bar-slide-enter-from,
.bar-slide-leave-to {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .bar-slide-enter-active,
  .bar-slide-leave-active {
    transition: none;
  }
  .bar-slide-enter-from,
  .bar-slide-leave-to {
    transform: none;
  }
}
</style>
