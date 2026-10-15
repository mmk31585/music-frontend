<template>
  <div
    v-if="musicStatus?.playing"
    class="glass-strong flex items-center gap-2 rounded-full px-3 py-1.5"
  >
    <template v-if="musicStatus.currentTrack">
      <img
        v-if="musicStatus.currentTrack.coverUrl"
        :src="musicStatus.currentTrack.coverUrl"
        alt=""
        class="h-8 w-8 shrink-0 rounded-lg object-cover"
        loading="lazy"
      />
      <div v-else class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8">
        <Music aria-hidden="true" class="text-xs text-white/40" />
      </div>
      <div class="flex min-w-0 items-center gap-2">
        <span class="flex h-4 items-end gap-0.5" aria-hidden="true">
          <span class="eq-bar eq-bar-1 bg-primary w-0.5 rounded-full" />
          <span class="eq-bar eq-bar-2 bg-primary w-0.5 rounded-full" />
          <span class="eq-bar eq-bar-3 bg-primary w-0.5 rounded-full" />
        </span>
        <span class="max-w-[200px] truncate text-[11px] text-white/70">
          <span class="font-semibold text-white/90">NOW PLAYING</span>
          &middot; {{ musicStatus.currentTrack.title }} &middot;
          {{ musicStatus.currentTrack.artist }}
        </span>
      </div>
      <button
        v-if="showListenAlong"
        aria-label="Listen along"
        class="bg-primary hover:bg-primary-hover rounded-full px-3 py-1 text-[11px] font-bold text-black transition active:scale-95"
        @click="$emit('listen-along', musicStatus.currentTrack!.id)"
      >
        گوش بده
      </button>
    </template>
    <template v-else>
      <span class="flex h-4 items-end gap-0.5" aria-hidden="true">
        <span class="eq-bar eq-bar-1 bg-primary w-0.5 rounded-full" />
        <span class="eq-bar eq-bar-2 bg-primary w-0.5 rounded-full" />
        <span class="eq-bar eq-bar-3 bg-primary w-0.5 rounded-full" />
      </span>
      <span class="text-[11px] text-white/70">در حال گوش دادن...</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Music } from 'lucide-vue-next'
defineProps<{
  musicStatus?: {
    playing: boolean
    currentTrack?: {
      id: string
      title: string
      artist: string
      coverUrl: string
    } | null
  } | null
  showListenAlong?: boolean
}>()

defineEmits<{
  'listen-along': [trackId: string]
}>()
</script>

<style scoped>
.glass-strong {
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(28px);
}

@keyframes eq-bar {
  0%,
  100% {
    height: 4px;
  }
  50% {
    height: 16px;
  }
}
.eq-bar-1 {
  animation: eq-bar 0.8s ease-in-out infinite;
}
.eq-bar-2 {
  animation: eq-bar 0.8s ease-in-out infinite 0.15s;
}
.eq-bar-3 {
  animation: eq-bar 0.8s ease-in-out infinite 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  .eq-bar-1,
  .eq-bar-2,
  .eq-bar-3 {
    animation: none;
    height: 8px;
  }
}
</style>
