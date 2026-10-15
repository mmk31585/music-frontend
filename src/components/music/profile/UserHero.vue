<template>
  <div class="relative h-80 w-full overflow-hidden">
    <!-- Background aurora gradient -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true" :style="auroraStyle" />
    <!-- Noise texture overlay -->
    <div
      class="noise-overlay pointer-events-none absolute inset-0 opacity-[0.03]"
      aria-hidden="true"
    />
    <!-- Bottom fade -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/60 to-transparent"
      aria-hidden="true"
    />

    <!-- Content -->
    <div class="absolute inset-0 flex flex-col justify-end px-6 pb-6">
      <div class="flex items-end gap-6">
        <!-- Avatar block -->
        <div class="relative shrink-0">
          <div
            class="relative h-[120px] w-[120px] overflow-hidden rounded-full ring-4"
            :class="musicStatus?.playing ? 'ring-primary/60' : 'ring-border-default'"
          >
            <!-- Pulsing ring when playing -->
            <div
              v-if="musicStatus?.playing"
              class="ring-primary/60 motion-safe:animate-pulse-ring absolute -inset-2 rounded-full ring-2"
              aria-hidden="true"
            />
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="h-full w-full object-cover"
              loading="lazy"
              @error="onImgError"
            />
            <div
              v-else
              class="from-primary/30 to-accent/30 flex h-full w-full items-center justify-center bg-gradient-to-br"
            >
              <span class="text-hero text-primary font-black">{{
                displayName.charAt(0).toUpperCase()
              }}</span>
            </div>
          </div>
          <!-- Creator badge -->
          <div
            v-if="isCreator"
            class="bg-primary absolute -right-0.5 -bottom-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-black ring-2 ring-[var(--bg-base)]"
            aria-label="Creator"
          >
            &#x2B50;
          </div>
        </div>

        <!-- Info block -->
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <!-- Name + handle -->
          <div>
            <h1 class="text-hero text-primary leading-none font-black">{{ displayName }}</h1>
            <p v-if="handle" class="text-caption text-tertiary mt-1">@{{ handle }}</p>
          </div>

          <!-- Bio (2-line clamp) -->
          <p v-if="bio" class="text-body text-secondary line-clamp-2 max-w-lg">{{ bio }}</p>

          <!-- Now Playing Badge -->
          <NowPlayingBadge
            :music-status="musicStatus"
            :show-listen-along="!isOwnProfile"
            @listen-along="$emit('listen-along', $event)"
          />

          <!-- Stats row -->
          <div class="flex items-center gap-3 text-sm">
            <button class="inline-flex items-center gap-1" @click="$emit('show-followers')">
              <span class="text-primary font-bold tabular-nums">{{
                formatNumber(followerCount)
              }}</span>
              <span class="text-caption text-tertiary">دنبال‌کننده</span>
            </button>
            <span class="text-muted">&middot;</span>
            <button class="inline-flex items-center gap-1" @click="$emit('show-following')">
              <span class="text-primary font-bold tabular-nums">{{
                formatNumber(followingCount)
              }}</span>
              <span class="text-caption text-tertiary">دنبال‌شونده</span>
            </button>
            <span v-if="joinDate" class="text-muted">&middot;</span>
            <span v-if="joinDate" class="text-caption text-muted"> از {{ formatJoinDate }} </span>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center gap-2">
            <!-- Own profile: Edit + Share -->
            <template v-if="isOwnProfile">
              <button
                class="bg-surface-active text-primary hover:bg-surface-active/80 rounded-full px-5 py-2 text-sm font-medium transition"
                @click="$emit('edit-profile')"
              >
                ویرایش پروفایل
              </button>
              <button
                class="bg-surface-overlay border-border-default text-secondary hover:text-primary rounded-full border px-4 py-2 text-sm transition"
                @click="$emit('share')"
              >
                اشتراک‌گذاری
              </button>
            </template>

            <!-- Other profile: Follow + Listen Along + Share -->
            <template v-else>
              <button
                :class="[
                  'rounded-full px-5 py-2 text-sm font-bold transition',
                  isFollowing
                    ? 'border-border-strong text-secondary hover:border-danger/40 hover:text-danger border'
                    : 'bg-primary hover:bg-primary-hover text-black',
                ]"
                @click="$emit('toggle-follow')"
              >
                {{ isFollowing ? 'دنبال می‌کنی' : 'دنبال کردن' }}
              </button>
              <button
                v-if="musicStatus?.playing && musicStatus?.currentTrack"
                class="bg-surface-active/80 border-border-default text-secondary hover:bg-surface-active rounded-full border px-4 py-2 text-sm transition"
                @click="$emit('listen-along', musicStatus.currentTrack!.id)"
              >
                گوش بده
              </button>
              <button
                class="bg-surface-overlay border-border-default text-secondary hover:text-primary rounded-full border px-4 py-2 text-sm transition"
                @click="$emit('share')"
              >
                اشتراک‌گذاری
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onImgError } from '@/utils/helpers'
import NowPlayingBadge from './NowPlayingBadge.vue'

const props = defineProps<{
  displayName: string
  handle?: string | null
  bio?: string | null
  avatarUrl?: string | null
  followerCount: number
  followingCount: number
  isOwnProfile: boolean
  isFollowing: boolean
  isCreator?: boolean
  joinDate?: string | null
  musicStatus?: {
    playing: boolean
    currentTrack?: {
      id: string
      title: string
      artist: string
      coverUrl: string
    } | null
    current_track_id?: string | null
  } | null
}>()

defineEmits<{
  'toggle-follow': []
  'show-followers': []
  'show-following': []
  share: []
  'edit-profile': []
  'listen-along': [trackId: string]
}>()

const auroraStyle = computed(() => ({
  background: `
    radial-gradient(ellipse 80% 100% at 20% 0%, ${topGenreColor}22, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 100%, #b646ff18, transparent 60%),
    #0a0a0a
  `,
}))

const topGenreColor = 'var(--accent)'

const formatJoinDate = computed(() => {
  if (!props.joinDate) return ''
  const d = new Date(props.joinDate)
  try {
    return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' })
  } catch {
    return d.toLocaleDateString()
  }
})

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
</script>

<style scoped>
.text-hero {
  font-size: clamp(2rem, 5vw, 3.5rem);
}
.text-caption {
  font-size: 0.75rem;
}
.text-body {
  font-size: 0.875rem;
}

@keyframes pulse-ring {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.motion-safe\:animate-pulse-ring {
  animation: pulse-ring 2s ease-in-out infinite;
}

.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}

@media (prefers-reduced-motion: reduce) {
  .motion-safe\:animate-pulse-ring {
    animation: none;
  }
}
</style>
