<template>
  <div class="bg-surface-overlay ring-border-default rounded-2xl p-4 ring-1">
    <h3 class="text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">Genre DNA</h3>

    <!-- Segmented gradient bar -->
    <div
      v-if="items.length > 0"
      class="flex h-3 overflow-hidden rounded-full"
      role="img"
      :aria-label="ariaLabel"
    >
      <div
        v-for="(g) in items"
        :key="g.name"
        class="h-full transition-all duration-500 first:rounded-s-full last:rounded-e-full"
        :style="{ width: g.percent + '%', backgroundColor: g.color }"
      />
    </div>
    <div v-else class="bg-surface-overlay flex h-3 overflow-hidden rounded-full" />

    <!-- Legend chips -->
    <div v-if="items.length > 0" class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="g in items"
        :key="g.name"
        class="text-secondary ring-border-default inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ring-1"
      >
        <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: g.color }" />
        {{ g.name }}
        <span class="text-muted tabular-nums">{{ g.percent }}%</span>
      </span>
    </div>
    <p v-else class="text-muted mt-1 text-[11px]">Not enough data yet</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  genres: { name: string; percent: number; color?: string }[]
}>()

const GENRE_COLORS: Record<string, string> = {
  pop: '#f472b6',
  rap: '#f59e0b',
  rock: '#ef4444',
  electronic: '#8b5cf6',
  classical: '#60a5fa',
  jazz: '#34d399',
  'r&b': '#a855f7',
  country: '#f97316',
  metal: '#6b7280',
  indie: '#06b6d4',
  folk: '#84cc16',
  blues: '#3b82f6',
  'persian pop': '#1db954',
  'persian classical': '#22d3ee',
  'persian folk': '#f43f5e',
  traditional: '#d946ef',
  instrumental: '#94a3b8',
  ambient: '#818cf8',
  soul: '#fb923c',
  reggae: '#16a34a',
  latin: '#e11d48',
  dance: '#c084fc',
  hip_hop: '#fbbf24',
  alternative: '#06b6d4',
}

function getColor(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
  return (
    GENRE_COLORS[key] ||
    GENRE_COLORS[Object.keys(GENRE_COLORS)[name.length % Object.keys(GENRE_COLORS).length]!]!
  )
}

const items = computed(() =>
  props.genres.map((g) => ({
    ...g,
    color: g.color || getColor(g.name),
  })),
)

const ariaLabel = computed(() => {
  return items.value.map((g) => `${g.name} ${g.percent}%`).join(', ')
})
</script>
