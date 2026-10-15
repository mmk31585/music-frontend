<template>
  <button
    type="button"
    class="group w-44 shrink-0 space-y-2 text-left"
    :style="{ transitionDelay: `${delay}ms` }"
    @click="$emit('play', item)"
    @contextmenu.prevent="openMenu"
  >
    <div
      class="bg-surface-overlay ring-border-default hover:ring-accent/40 relative aspect-square overflow-hidden rounded-xl ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      :style="{ borderRadius: radius + 'px' }"
    >
      <img
        v-if="item.cover_url || item.coverUrl || item.track_cover_url"
        :src="coverSrc"
        :alt="altText"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div v-else class="flex h-full items-center justify-center">
        <Music aria-hidden="true" class="text-muted text-2xl" />
      </div>
      <div
        class="bg-bg-overlay/40 absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
      >
        <div
          class="bg-accent flex h-10 w-10 items-center justify-center rounded-full text-black shadow-xl transition-transform group-hover:scale-110"
        >
          <Play aria-hidden="true" class="text-sm" />
        </div>
      </div>
      <div
        v-if="isPlaying"
        class="bg-bg-overlay/60 absolute right-2 bottom-2 flex h-5 items-end gap-0.5 rounded-full px-1.5 py-1"
      >
        <span class="equalizer-bar-small bg-accent h-2 w-0.5 rounded-full" />
        <span class="equalizer-bar-small animation-delay-150 bg-accent h-3 w-0.5 rounded-full" />
        <span class="equalizer-bar-small animation-delay-300 bg-accent h-2.5 w-0.5 rounded-full" />
      </div>
      <div
        v-if="badge"
        class="bg-accent/90 absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-black"
      >
        {{ badge }}
      </div>
      <div
        v-if="reason"
        class="bg-surface-active text-primary absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-xs"
      >
        {{ reason }}
      </div>
    </div>
    <div class="space-y-0.5 px-0.5">
      <p class="text-primary truncate text-sm font-semibold">
        {{ item.title || item.track_title || 'بدون عنوان' }}
      </p>
      <p class="text-secondary truncate text-xs">
        {{ artistName }}
      </p>
    </div>
  </button>

  <ContextMenu
    v-model:visible="menuVisible"
    :sections="sections"
    :header="header"
    :accent-color="accentColor"
    :position="menuPosition"
  />
</template>

<script setup lang="ts">
import { Music, Play } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useTrackContextMenu, type TrackContextItem } from '@/composables/useTrackContextMenu'
import ContextMenu from '@/components/common/ContextMenu.vue'

interface TrackCardItem extends TrackContextItem {
  [key: string]: unknown
  cover_url?: string | null
  coverUrl?: string | null
  track_cover_url?: string | null
  title?: string | null
  track_title?: string | null
  artist_name?: string | null
  artistName?: string | null
}

const props = withDefaults(
  defineProps<{
    item: TrackCardItem
    isPlaying?: boolean
    delay?: number
    radius?: number
    badge?: string
    reason?: string
  }>(),
  {
    radius: 12,
  },
)

defineEmits<{
  play: [item: TrackCardItem]
}>()

const artistName = computed(() => {
  return props.item.artist_name || props.item.artistName || ''
})

const coverSrc = computed(
  (): string | undefined =>
    (props.item.cover_url || props.item.coverUrl || props.item.track_cover_url) ?? undefined,
)

const altText = computed(() => {
  const title = props.item.title || props.item.track_title || ''
  const artist = artistName.value
  return artist ? `${title} - ${artist}` : title
})

// ── Context menu ──────────────────────────────────────────────────
const trackRef = computed(() => props.item)
const { sections, header, accentColor } = useTrackContextMenu(trackRef)

const menuVisible = ref(false)
const menuPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })

function openMenu(e: MouseEvent) {
  menuPosition.value = { x: e.clientX, y: e.clientY }
  menuVisible.value = true
}
</script>

<style scoped>
.equalizer-bar-small {
  animation: eqBeat 600ms ease-in-out infinite alternate;
  transform-origin: bottom;
}
.animation-delay-150 {
  animation-delay: 150ms;
}
.animation-delay-300 {
  animation-delay: 300ms;
}
@keyframes eqBeat {
  from {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}
</style>
