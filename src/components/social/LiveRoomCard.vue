<template>
  <div
    class="group bg-surface-overlay/60 ring-border-default hover:bg-surface-active/80 hover:ring-border-strong focus-within:ring-spotify rounded-2xl p-5 ring-1 transition-all duration-300 focus-within:ring-2"
    role="article"
    :aria-label="`Live room: ${room.title}`"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-primary truncate text-sm font-bold">{{ room.title }}</h3>
          <span
            class="bg-danger-subtle text-danger inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase"
          >
            <span
              class="h-1.5 w-1.5 rounded-full bg-red-500 motion-safe:animate-pulse"
              aria-hidden="true"
            />
            Live
          </span>
        </div>
        <p
          v-if="room.description"
          class="text-primary/40 mt-1 line-clamp-2 text-xs leading-relaxed"
        >
          {{ room.description }}
        </p>
      </div>
    </div>

    <!-- Listener info -->
    <div class="mt-4 flex items-center gap-2">
      <div class="flex -space-x-1.5" :aria-label="`${room.listener_count || 0} listeners`">
        <div
          v-for="(avatar, i) in roomAvatars.slice(0, 4)"
          :key="i"
          class="border-surface-base group-hover:border-border-strong h-6 w-6 overflow-hidden rounded-full border-2 transition"
        >
          <img :src="avatar" alt="" class="h-full w-full object-cover" />
        </div>
        <div
          v-if="(room.listener_count || 0) > 4"
          class="border-surface-base bg-surface-active text-primary/50 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[8px] font-bold"
        >
          +{{ (room.listener_count || 0) - 4 }}
        </div>
      </div>
      <span class="text-primary/30 text-[10px] tabular-nums"
        >{{ room.listener_count || 0 }} listening</span
      >
    </div>

    <!-- Host info -->
    <div v-if="hostName" class="text-primary/30 mt-3 flex items-center gap-1.5 text-[10px]">
      <User aria-hidden="true" class="shrink-0 text-[10px]" />
      <span class="truncate">{{ hostName }}</span>
    </div>

    <!-- Now playing badge -->
    <div
      v-if="room.current_track_id"
      class="text-primary/25 mt-1 flex items-center gap-1.5 text-[10px]"
    >
      <Music aria-hidden="true" class="shrink-0 text-[10px]" />
      <span>Now playing</span>
    </div>

    <div class="mt-4 flex items-center gap-2">
      <button
        aria-label="Listen live"
        class="bg-danger-subtle text-danger hover:bg-danger-subtle flex-1 rounded-lg py-2.5 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-red-400 active:scale-[0.98]"
        @click="$emit('join', room.id)"
      >
        <span class="flex items-center justify-center gap-1.5">
          <Megaphone aria-hidden="true" class="text-[10px]" />
          Listen Live
        </span>
      </button>
      <button
        aria-label="Share room"
        class="text-primary/30 hover:bg-surface-overlay/60 hover:text-primary/60 focus-visible:outline-accent flex h-9 w-9 items-center justify-center rounded-lg transition focus-visible:outline-2"
        @click="$emit('share', room.id)"
      >
        <Share2 aria-hidden="true" class="text-sm" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Megaphone, Music, Share2, User } from 'lucide-vue-next'
import { computed } from 'vue'
import type { LiveRoom } from '@/services/api/social'

const props = defineProps<{
  room: LiveRoom
  hostName?: string
}>()

defineEmits<{
  join: [id: string]
  share: [id: string]
}>()

const roomAvatars = computed(() => {
  return (props.room as any).avatars || []
})
</script>
