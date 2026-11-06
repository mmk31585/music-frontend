<template>
  <div v-if="hasData" class="bg-surface-overlay/50 ring-border-subtle rounded-2xl p-5 ring-1">
    <h3 class="text-muted mb-4 text-xs tracking-widest uppercase">سلیقه موسیقی</h3>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Top Genres -->
      <div v-if="topGenres && topGenres.length > 0">
        <h4 class="text-muted mb-3 text-[10px] tracking-wider uppercase">ژانرهای برتر</h4>
        <div class="space-y-2.5">
          <div v-for="g in topGenres" :key="g.name" class="flex items-center gap-3">
            <span class="text-secondary w-20 shrink-0 truncate text-xs">{{ g.name }}</span>
            <div class="bg-surface-active/80 h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                class="h-full rounded-full transition-all duration-700"
                :style="{ width: g.percent + '%', background: g.color }"
              />
            </div>
            <span class="text-muted w-8 shrink-0 text-right text-[10px] tabular-nums"
              >{{ g.percent }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Top Artists -->
      <div v-if="topArtists && topArtists.length > 0">
        <h4 class="text-muted mb-3 text-[10px] tracking-wider uppercase">هنرمندان برتر</h4>
        <div class="space-y-2">
          <div
            v-for="a in topArtists.slice(0, 5)"
            :key="a.id"
            class="group flex cursor-pointer items-center gap-3"
            @click="navigateToArtist(a.id)"
          >
            <div class="ring-border-default h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2">
              <img
                v-if="a.avatarUrl"
                :src="a.avatarUrl"
                :alt="a.name"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="bg-surface-active/80 text-tertiary flex h-full w-full items-center justify-center text-xs font-bold"
              >
                {{ a.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span class="text-secondary group-hover:text-primary truncate text-sm transition">{{
              a.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Streak badge -->
    <div v-if="listeningStreak && listeningStreak >= 3" class="mt-4">
      <span
        class="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/15 px-3 py-1 text-xs text-orange-300"
      >
        {{ listeningStreak }} روز پشت سر هم
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  topGenres?: Array<{ name: string; percent: number; color: string }>
  topArtists?: Array<{ id: string; name: string; avatarUrl?: string }>
  listeningStreak?: number
  recentMood?: string
}>()

const hasData = computed(
  () =>
    (props.topGenres && props.topGenres.length > 0) ||
    (props.topArtists && props.topArtists.length > 0),
)

const router = useRouter()

function navigateToArtist(id: string) {
  router.push(`/artists/${id}`)
}
</script>
