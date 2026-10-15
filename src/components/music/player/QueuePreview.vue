<template>
  <div class="relative">
    <button
      ref="queueBtnRef"
      type="button"
      class="focus-visible:ring-spotify/60 focus-visible:ring-offset-surface-base relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      :class="
        upcomingCount > 0
          ? 'text-primary hover:bg-surface-active active:scale-95'
          : 'text-tertiary hover:text-primary hover:bg-surface-active active:scale-95'
      "
      :disabled="!currentTrack"
      :aria-label="`Queue — ${upcomingCount} upcoming`"
      @click="showQueuePreview = !showQueuePreview"
      @keydown.escape="showQueuePreview = false"
    >
      <ListMusic class="h-4 w-4" aria-hidden="true" />
      <span
        v-if="upcomingCount > 0"
        class="bg-accent absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-black"
      >
        {{ upcomingCount > 9 ? '9+' : upcomingCount }}
      </span>
    </button>

    <!-- Up Next mini-preview popup -->
    <Transition name="fade-scale">
      <div
        v-if="showQueuePreview"
        class="border-border-default shadow-floating glass-strong absolute right-0 bottom-full z-99 mb-2 w-72 origin-bottom-right rounded-2xl border p-2"
      >
        <!-- Now Playing -->
        <div class="mb-2 px-2 pt-1">
          <p class="text-muted text-[10px] font-semibold tracking-wider uppercase">
            {{ $t('player.now_playing') }}
          </p>
          <div class="mt-1.5 flex items-center gap-2.5">
            <div
              class="bg-surface-active ring-border-subtle h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1"
            >
              <img
                v-if="currentTrack?.coverUrl"
                :src="currentTrack.coverUrl"
                :alt="currentTrack.title"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex h-full items-center justify-center">
                <Music class="text-muted h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-primary truncate text-sm font-bold">{{ currentTrack?.title }}</p>
              <p class="text-tertiary truncate text-xs">{{ currentTrack?.artistName }}</p>
            </div>
            <div v-if="isPlaying" class="flex items-center gap-1">
              <span class="bg-accent animate-equalizer equalizer-bar-1 size-1 rounded-full" />
              <span
                class="bg-accent animate-equalizer equalizer-bar-2 size-1 rounded-full"
                style="animation-delay: 0.15s"
              />
              <span
                class="bg-accent animate-equalizer equalizer-bar-3 size-1 rounded-full"
                style="animation-delay: 0.3s"
              />
            </div>
          </div>
        </div>

        <div class="border-border-subtle mx-2 my-1.5 border-t" />

        <!-- Next Up -->
        <div v-if="nextTrack" class="px-2 pb-2">
          <div
            class="text-muted mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase"
          >
            <ChevronDown class="h-3 w-3" aria-hidden="true" />
            {{ $t('player.up_next') }}
            <span
              v-if="upcomingCount > 1"
              class="bg-surface-active/80 text-tertiary flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold"
              >{{ upcomingCount }}</span
            >
            <Shuffle
              v-if="shuffleMode !== 'off'"
              class="text-aurora-purple ml-auto h-3 w-3"
              aria-hidden="true"
              title="Shuffle is on — next track from shuffle order"
            />
          </div>
          <div
            class="group ring-border-subtle bg-surface-overlay hover:bg-surface-active flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 ring-1 transition-all duration-200"
            @click="playNextTrack"
          >
            <div
              class="bg-surface-active ring-border-subtle relative h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1"
            >
              <img
                v-if="nextTrack.coverUrl"
                :src="nextTrack.coverUrl"
                :alt="nextTrack.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div v-else class="flex h-full items-center justify-center">
                <Music class="text-muted h-4 w-4" aria-hidden="true" />
              </div>
              <div
                class="bg-bg-overlay/0 group-hover:bg-bg-overlay/30 absolute inset-0 flex items-center justify-center transition-all duration-200"
              >
                <Play
                  class="text-primary h-5 w-5 opacity-0 drop-shadow-lg transition-all duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="text-primary group-hover:text-primary truncate text-sm font-medium transition-colors"
              >
                {{ nextTrack.title }}
              </p>
              <p class="text-tertiary truncate text-xs">{{ nextTrack.artistName }}</p>
            </div>
            <span
              class="text-muted group-hover:text-primary/50 shrink-0 font-mono text-[10px] tabular-nums transition-colors"
            >
              {{ formatTime(nextTrack.durationSeconds ?? 0) }}
            </span>
          </div>
        </div>

        <!-- Shuffle catalog/similar: can't predict next track -->
        <div v-else-if="shuffleMode === 'catalog' || shuffleMode === 'similar'" class="px-2 pb-2">
          <div
            class="text-muted mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase"
          >
            <Shuffle class="text-aurora-purple h-3 w-3" aria-hidden="true" />
            {{ $t('player.up_next') }}
            <span class="text-aurora-purple/60 text-[8px] font-normal">— random track</span>
          </div>
          <div
            class="ring-border-subtle bg-surface-overlay hover:bg-surface-active group flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 ring-1 transition-all duration-200"
            @click="playNextTrack"
          >
            <div
              class="bg-aurora-purple/10 ring-aurora-purple/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1"
            >
              <Shuffle class="text-aurora-purple h-4 w-4" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="text-secondary group-hover:text-primary text-sm font-medium transition-colors"
              >
                Skip to random track
              </p>
              <p class="text-muted text-xs">
                Next track selected from
                {{ shuffleMode === 'catalog' ? 'full catalog' : 'similar tracks' }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-1.5 px-2 pt-2 pb-3 text-center">
          <ListMusic class="text-muted h-6 w-6" aria-hidden="true" />
          <p class="text-muted text-xs">{{ $t('player.queue_empty') }}</p>
        </div>

        <!-- View full queue -->
        <button
          type="button"
          class="text-tertiary hover:bg-surface-overlay hover:text-secondary flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all"
          @click="openFullQueue"
        >
          {{ $t('player.view_full_queue') }}
          <ChevronRight class="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronDown, ChevronRight, ListMusic, Music, Play, Shuffle } from 'lucide-vue-next'
import type { PlaybackTrack } from '@/services/api/player'

interface Props {
  currentTrack: PlaybackTrack | null
  nextTrack: PlaybackTrack | null
  upcomingCount: number
  shuffleMode: 'off' | 'queue' | 'catalog' | 'similar'
  isPlaying: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>()

const emit = defineEmits<{
  'play-next': []
  'open-queue': []
}>()

const showQueuePreview = ref(false)
const queueBtnRef = ref<HTMLElement | null>(null)

watch(showQueuePreview, async (v) => {
  if (v) await nextTick()
})

function playNextTrack() {
  emit('play-next')
  showQueuePreview.value = false
}

function openFullQueue() {
  showQueuePreview.value = false
  emit('open-queue')
}

// Close on outside click
onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
function handleOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (showQueuePreview.value && queueBtnRef.value && !queueBtnRef.value.contains(target)) {
    showQueuePreview.value = false
  }
}

function formatTime(s: number) {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.fade-scale-enter-active {
  transition:
    opacity 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-leave-active {
  transition:
    opacity 100ms ease,
    transform 100ms ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (prefers-reduced-motion: reduce) {
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: none;
  }
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 1;
    transform: none;
  }
}

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
