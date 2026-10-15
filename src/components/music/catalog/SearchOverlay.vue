<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div
        v-if="visible"
        class="bg-bg-overlay fixed inset-0 z-100 flex items-start justify-center pt-16 backdrop-blur-xs md:pt-24"
        @click.self="close"
      >
        <div
          ref="panelRef"
          class="from-surface-overlay to-surface-raised ring-border-default mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-linear-to-b shadow-2xl ring-1"
        >
          <!-- Search input -->
          <div class="border-border-default relative flex items-center border-b px-4">
            <Search aria-hidden="true" class="text-secondary text-sm" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search tracks, artists, albums, playlists..."
              aria-label="Search tracks, artists, albums, playlists"
              class="text-primary placeholder:text-muted focus-visible:ring-accent/50 flex-1 bg-transparent px-3 py-4 text-sm outline-hidden focus-visible:ring-2"
              @keydown="onKeydown"
              @input="onInput"
            />
            <button
              v-if="query"
              type="button"
              aria-label="Clear search"
              class="spring bg-surface-active text-secondary hover:bg-surface-hover mr-2 flex h-6 w-6 items-center justify-center rounded-full text-xs transition"
              @click="clearQuery"
            >
              <X aria-hidden="true" class="" />
            </button>
            <kbd
              class="border-border-default bg-surface-overlay text-muted hidden rounded-md border px-2 py-0.5 text-[11px] md:inline-block"
            >
              ESC
            </kbd>
          </div>

          <!-- Recent / Trending (empty query) -->
          <div v-if="!query && !searching" class="max-h-[60vh] space-y-4 overflow-y-auto p-4">
            <div v-if="recentSearches.length">
              <p
                class="text-secondary mb-2 flex items-center justify-between text-xs font-bold tracking-wider uppercase"
              >
                <span>Recent</span>
                <button
                  type="button"
                  class="text-accent text-[10px] hover:underline"
                  @click="clearRecent"
                >
                  Clear
                </button>
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="term in recentSearches"
                  :key="term"
                  type="button"
                  class="spring bg-surface-active text-primary hover:bg-surface-hover flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all hover:scale-105"
                  @click="query = term; doSearch()"
                >
                  <History aria-hidden="true" class="text-tertiary text-xs" />
                  {{ term }}
                </button>
              </div>
            </div>

            <div>
              <p class="text-secondary mb-2 text-xs font-bold tracking-wider uppercase">
                Suggestions
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="suggestion in suggestions"
                  :key="suggestion"
                  type="button"
                  class="spring bg-surface-overlay text-secondary hover:bg-surface-active hover:text-primary rounded-full px-4 py-2 text-sm transition-all hover:scale-105"
                  @click="query = suggestion; doSearch()"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <!-- Keyboard shortcut hint -->
            <div class="text-muted flex items-center gap-4 text-[11px]">
              <span
                ><kbd class="border-border-default rounded-sm border px-1.5 py-0.5 text-[10px]"
                  >↑↓</kbd
                >
                Navigate</span
              >
              <span
                ><kbd class="border-border-default rounded-sm border px-1.5 py-0.5 text-[10px]"
                  >↩</kbd
                >
                Select</span
              >
              <span
                ><kbd class="border-border-default rounded-sm border px-1.5 py-0.5 text-[10px]"
                  >Esc</kbd
                >
                Close</span
              >
            </div>
          </div>

          <!-- Searching indicator -->
          <div
            v-if="searching"
            class="text-secondary flex items-center justify-center gap-3 p-12 text-sm"
          >
            <Loader2 aria-hidden="true" />
            Searching...
          </div>

          <!-- Results -->
          <div
            v-if="query && !searching"
            class="max-h-[60vh] overflow-y-auto p-2"
            aria-live="polite"
          >
            <div v-if="noResults" class="flex flex-col items-center gap-4 p-12 text-center">
              <div
                class="bg-surface-overlay flex h-16 w-16 items-center justify-center rounded-2xl"
              >
                <Search class="text-muted text-3xl" aria-hidden="true" />
              </div>
              <p class="text-secondary text-sm">
                No results for "<span class="text-primary font-medium">{{ query }}</span
                >"
              </p>
              <p class="text-tertiary text-xs">Try a different search term</p>
            </div>

            <template v-else>
              <!-- Top Result (first track) -->
              <div v-if="results.tracks?.length" class="mb-4 px-2">
                <p class="text-secondary mb-2 text-xs font-bold tracking-wider uppercase">
                  Top Result
                </p>
                <button
                  type="button"
                  class="group spring bg-surface-hover/60 hover:bg-surface-active flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all"
                  @click="selectTrack(results.tracks[0]!)"
                >
                  <span
                    class="bg-surface-overlay block h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-lg"
                  >
                    <img
                      v-if="results.tracks[0]?.cover_url"
                      :src="results.tracks[0]?.cover_url"
                      :alt="results.tracks[0]?.title"
                      loading="lazy"
                      class="h-full w-full object-cover"
                      @error="onImgError"
                    />
                    <span v-else class="flex h-full items-center justify-center">
                      <Music class="text-tertiary text-lg" aria-hidden="true" />
                    </span>
                  </span>
                  <span class="block min-w-0 flex-1">
                    <p class="text-primary truncate text-base font-bold">
                      {{ results.tracks[0]?.title }}
                    </p>
                    <p class="text-secondary truncate text-sm">
                      {{ results.tracks[0]?.artist_name || 'Unknown' }}
                    </p>
                  </span>
                  <span
                    class="spring bg-accent/0 text-primary group-hover:bg-accent group-hover:text-accent-text flex h-12 w-12 items-center justify-center rounded-full opacity-0 transition-all group-hover:opacity-100"
                  >
                    <Play class="text-lg" aria-hidden="true" />
                  </span>
                </button>
              </div>

              <!-- Tracks -->
              <div v-if="results.tracks?.length" class="mb-3">
                <p class="text-secondary mb-2 px-2 text-xs font-bold tracking-wider uppercase">
                  Tracks
                </p>
                <button
                  v-for="(item, i) in results.tracks.slice(0, 5)"
                  :key="item.id"
                  :ref="(el) => setItemRef('track', i, el)"
                  type="button"
                  class="spring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                  :class="
                    highlightedIndex === `track-${i}`
                      ? 'bg-surface-active'
                      : 'hover:bg-surface-hover'
                  "
                  @click="selectTrack(item)"
                  @mouseenter="highlightedIndex = `track-${i}`"
                >
                  <span
                    class="bg-surface-overlay block h-10 w-10 shrink-0 overflow-hidden rounded-lg"
                  >
                    <img
                      v-if="item.cover_url"
                      :src="item.cover_url"
                      :alt="item.title"
                      loading="lazy"
                      class="h-full w-full object-cover"
                      @error="onImgError"
                    />
                    <span v-else class="flex h-full items-center justify-center">
                      <Music aria-hidden="true" class="text-tertiary text-xs" />
                    </span>
                  </span>
                  <span class="block min-w-0 flex-1">
                    <p class="text-primary truncate text-sm font-medium">{{ item.title }}</p>
                    <p class="text-secondary truncate text-xs">
                      {{ item.artist_name || 'Unknown' }}
                    </p>
                  </span>
                  <span v-if="item.duration_seconds" class="text-tertiary text-xs tabular-nums">{{
                    fmtDuration(item.duration_seconds)
                  }}</span>
                </button>
              </div>

              <!-- Artists -->
              <div v-if="results.artists?.length" class="mb-3">
                <p class="text-secondary mb-2 px-2 text-xs font-bold tracking-wider uppercase">
                  Artists
                </p>
                <div class="space-y-1">
                  <RouterLink
                    v-for="(item, i) in results.artists.slice(0, 3)"
                    :key="item.id"
                    :to="`/artist/${item.id}`"
                    :ref="(el) => setItemRef('artist', i, el)"
                    class="spring flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                    :class="
                      highlightedIndex === `artist-${i}`
                        ? 'bg-surface-active'
                        : 'hover:bg-surface-hover'
                    "
                    @click="close"
                    @mouseenter="highlightedIndex = `artist-${i}`"
                  >
                    <div
                      class="bg-surface-overlay ring-border-default h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2"
                    >
                      <img
                        v-if="item.cover_url"
                        :src="item.cover_url"
                        :alt="item.name"
                        loading="lazy"
                        class="h-full w-full object-cover"
                        @error="onImgError"
                      />
                      <div v-else class="flex h-full items-center justify-center">
                        <User aria-hidden="true" class="text-tertiary text-sm" />
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-primary truncate text-sm font-medium">{{ item.name }}</p>
                      <p class="text-secondary truncate text-xs">
                        {{ item.genre ? `Artist · ${item.genre}` : 'Artist' }}
                      </p>
                    </div>
                    <ChevronLeft aria-hidden="true" class="text-tertiary text-xs" />
                  </RouterLink>
                </div>
              </div>

              <!-- Albums -->
              <div v-if="results.albums?.length" class="mb-3">
                <p class="text-secondary mb-2 px-2 text-xs font-bold tracking-wider uppercase">
                  Albums
                </p>
                <div class="space-y-1">
                  <RouterLink
                    v-for="(item, i) in results.albums.slice(0, 3)"
                    :key="item.id"
                    :to="`/album/${item.id}`"
                    :ref="(el) => setItemRef('album', i, el)"
                    class="spring flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                    :class="
                      highlightedIndex === `album-${i}`
                        ? 'bg-surface-active'
                        : 'hover:bg-surface-hover'
                    "
                    @click="close"
                    @mouseenter="highlightedIndex = `album-${i}`"
                  >
                    <div class="bg-surface-overlay h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <img
                        v-if="item.cover_url"
                        :src="item.cover_url"
                        :alt="item.title"
                        loading="lazy"
                        class="h-full w-full object-cover"
                        @error="onImgError"
                      />
                      <div v-else class="flex h-full items-center justify-center">
                        <Disc3 aria-hidden="true" class="text-tertiary text-sm" />
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-primary truncate text-sm font-medium">{{ item.title }}</p>
                      <p class="text-secondary truncate text-xs">
                        {{ item.artist_name || 'Album' }}
                      </p>
                    </div>
                    <ChevronLeft aria-hidden="true" class="text-tertiary text-xs" />
                  </RouterLink>
                </div>
              </div>

              <!-- Playlists -->
              <div v-if="results.playlists?.length" class="mb-3">
                <p class="text-secondary mb-2 px-2 text-xs font-bold tracking-wider uppercase">
                  Playlists
                </p>
                <div class="space-y-1">
                  <RouterLink
                    v-for="(item, i) in results.playlists.slice(0, 3)"
                    :key="item.id"
                    :to="`/playlists/${item.id}`"
                    :ref="(el) => setItemRef('playlist', i, el)"
                    class="spring flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                    :class="
                      highlightedIndex === `playlist-${i}`
                        ? 'bg-surface-active'
                        : 'hover:bg-surface-hover'
                    "
                    @click="close"
                    @mouseenter="highlightedIndex = `playlist-${i}`"
                  >
                    <div
                      class="from-accent/20 to-accent/5 h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-linear-to-br"
                    >
                      <img
                        v-if="item.cover_url"
                        :src="item.cover_url"
                        :alt="item.name"
                        loading="lazy"
                        class="h-full w-full object-cover"
                        @error="onImgError"
                      />
                      <div v-else class="flex h-full items-center justify-center">
                        <List aria-hidden="true" class="text-accent text-sm" />
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-primary truncate text-sm font-medium">{{ item.name }}</p>
                      <p class="text-secondary truncate text-xs">
                        {{ item.description || 'Playlist' }}
                      </p>
                    </div>
                    <ChevronLeft aria-hidden="true" class="text-tertiary text-xs" />
                  </RouterLink>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ChevronLeft,
  Disc3,
  History,
  List,
  Loader2,
  Music,
  Play,
  Search,
  User,
  X,
} from 'lucide-vue-next'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchApi, type SearchResult } from '@/services/api/catalog/search'
import type { UseRequestConfig } from '@/plugins/client/types'
import { usePlayer } from '@/composables/player'
import { useAppToast } from '@/composables/useAppToast'
import { onImgError } from '@/utils/helpers'
import { buildPlaybackTrack } from '@/factories/playbackTrack'

interface SearchItem {
  id: string | number
  title?: string
  name?: string
  cover_url?: string | null
  artist_name?: string | null
  album_title?: string | null
  artist_id?: string | number | null
  genre?: string | null
  duration_seconds?: number | null
  description?: string | null
}

interface SearchResults {
  tracks: SearchItem[]
  artists: SearchItem[]
  albums: SearchItem[]
  playlists: SearchItem[]
}

const router = useRouter()
const player = usePlayer()
const searchApi = useSearchApi()
const toast = useAppToast()

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const _visible = ref(false)
const query = ref('')
const searching = ref(false)
const highlightedIndex = ref<string | null>(null)
const results = ref<SearchResults>({ tracks: [], artists: [], albums: [], playlists: [] })
const recentSearches = ref<string[]>([])
const noResults = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const itemRefs: Record<string, HTMLElement> = {}

const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const suggestions = [
  'Popular',
  'New releases',
  'Classical',
  'Electronic',
  'Top 50',
  'Trending',
  'Chill',
  'Workout',
  'Focus',
]

watch(
  () => props.visible,
  (v) => {
    _visible.value = v
    if (v) {
      query.value = ''
      results.value = { tracks: [], artists: [], albums: [], playlists: [] }
      noResults.value = false
      highlightedIndex.value = null
      loadRecent()
      nextTick(() => inputRef.value?.focus())
      window.history.pushState(null, '')
    }
  },
)

watch(_visible, (v) => {
  emit('update:visible', v)
})

function close() {
  _visible.value = false
}
function clearQuery() {
  query.value = ''
  results.value = { tracks: [], artists: [], albums: [], playlists: [] }
  noResults.value = false
  highlightedIndex.value = null
  nextTick(() => inputRef.value?.focus())
}

function loadRecent() {
  try {
    const raw = localStorage.getItem('music_recent_searches')
    recentSearches.value = raw ? JSON.parse(raw) : []
  } catch (err: unknown) {
    toast.apiError(err, 'Failed to load recent searches')
    recentSearches.value = []
  }
}

function saveRecent(term: string) {
  try {
    let list: string[] = JSON.parse(localStorage.getItem('music_recent_searches') || '[]')
    list = [term, ...list.filter((t) => t !== term)].slice(0, 8)
    localStorage.setItem('music_recent_searches', JSON.stringify(list))
    recentSearches.value = list
  } catch (err: unknown) {
    toast.apiError(err, 'Failed to save recent searches')
  }
}

function clearRecent() {
  localStorage.removeItem('music_recent_searches')
  recentSearches.value = []
}

function setItemRef(group: string, index: number, el: unknown) {
  if (el instanceof HTMLElement) itemRefs[`${group}-${index}`] = el
}

let abortController: AbortController | null = null
async function doSearch() {
  const term = query.value.trim()
  if (!term) {
    results.value = { tracks: [], artists: [], albums: [], playlists: [] }
    noResults.value = false
    searching.value = false
    return
  }

  abortController?.abort()
  abortController = new AbortController()

  searching.value = true
  noResults.value = false

  try {
    const res = await searchApi.searchCatalog({ query: term, limit: 20 }, {
      signal: abortController.signal,
    } as UseRequestConfig<SearchResult>)
    results.value = {
      tracks: res.tracks ?? [],
      artists: res.artists ?? [],
      albums: res.albums ?? [],
      playlists: [],
    }
    noResults.value = !(
      results.value.tracks.length ||
      results.value.artists.length ||
      results.value.albums.length ||
      results.value.playlists.length
    )
    saveRecent(term)
  } catch (err: unknown) {
    const abortErr = err as { name?: string; code?: string }
    if (abortErr?.name === 'AbortError' || abortErr?.code === 'ERR_CANCELED') return
    toast.apiError(err, 'Failed to search catalog')
    results.value = { tracks: [], artists: [], albums: [], playlists: [] }
    noResults.value = true
  } finally {
    searching.value = false
  }
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  highlightedIndex.value = null
  debounceTimer = setTimeout(doSearch, 250)
}

function getFlatItems(): { group: string; index: number; el?: HTMLElement }[] {
  const flat: { group: string; index: number; el?: HTMLElement }[] = []
  for (const group of ['track', 'artist', 'album', 'playlist'] as const) {
    const key = group === 'playlist' ? 'playlists' : (`${group}s` as keyof SearchResults)
    const items = results.value[key] ?? []
    items.forEach((_: unknown, i: number) =>
      flat.push({ group, index: i, el: itemRefs[`${group}-${i}`] }),
    )
  }
  return flat
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveHighlight(1)
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveHighlight(-1)
    return
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    activateHighlight()
    return
  }
}

function moveHighlight(dir: number) {
  const flat = getFlatItems()
  if (!flat.length) return
  const currentIdx = flat.findIndex(
    (f) => f.group && f.index && highlightedIndex.value === `${f.group}-${f.index}`,
  )
  let next = currentIdx === -1 ? (dir > 0 ? 0 : flat.length - 1) : currentIdx + dir
  if (next < 0) next = flat.length - 1
  if (next >= flat.length) next = 0
  const target = flat[next]
  if (!target) return
  highlightedIndex.value = `${target.group}-${target.index}`
  target.el?.scrollIntoView?.({ block: 'nearest' })
}

function activateHighlight() {
  if (!highlightedIndex.value) return
  const [group, indexStr] = highlightedIndex.value.split('-')
  const i = Number(indexStr)
  const key =
    group === 'track'
      ? 'tracks'
      : group === 'playlist'
        ? 'playlists'
        : (`${group}s` as keyof SearchResults)
  const items = results.value[key] ?? []
  const item = items[i]
  if (!item) return
  if (group === 'track') selectTrack(item)
  else if (group === 'artist') {
    router.push(`/artist/${item.id}`)
    close()
  } else if (group === 'album') {
    router.push(`/album/${item.id}`)
    close()
  } else if (group === 'playlist') {
    router.push(`/playlists/${item.id}`)
    close()
  }
}

function selectTrack(track: SearchItem) {
  player.playTrack(
    buildPlaybackTrack({
      id: String(track.id),
      title: track.title ?? '',
      artist_name: track.artist_name || 'Unknown',
      album_title: track.album_title || null,
      cover_url: track.cover_url || null,
      duration_seconds: track.duration_seconds ?? null,
    }),
  )
  if (track.artist_name) saveRecent(`${track.artist_name} - ${track.title}`)
  else saveRecent(track.title ?? '')
  close()
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function onKeybind(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    _visible.value = !_visible.value
    if (_visible.value) nextTick(() => inputRef.value?.focus())
    return
  }
  if (
    e.key === '/' &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName || '')
  ) {
    if (!_visible.value) {
      e.preventDefault()
      _visible.value = true
      nextTick(() => inputRef.value?.focus())
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeybind)
  window.addEventListener('popstate', close)
  loadRecent()
})

onUnmounted(() => {
  abortController?.abort()
  document.removeEventListener('keydown', onKeybind)
  window.removeEventListener('popstate', close)
})
</script>

<style scoped>
.search-fade-enter-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.search-fade-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}
.search-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
.search-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
.spring {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
