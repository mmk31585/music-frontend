<template>
  <nav
    aria-label="Main navigation"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-surface-2 shadow-lg lg:hidden"
    style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0.75rem))"
  >
    <div class="flex items-center justify-around px-2 pt-2">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[10px] font-medium transition-all duration-200"
        :class="
          isActive(tab.to)
            ? 'bg-accent/15 text-accent'
            : 'text-muted hover:text-secondary hover:bg-white/5'
        "
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200"
          :class="
            isActive(tab.to)
              ? 'bg-accent/20 text-accent ring-1 ring-accent/20'
              : ''
          "
        >
          <i aria-hidden="true" :class="tab.icon" class="text-lg" />
        </div>
        <span>{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { label: 'Home', icon: 'pi pi-home', to: '/' },
  { label: 'Search', icon: 'pi pi-search', to: '/search' },
  { label: 'Videos', icon: 'pi pi-video', to: '/videos' },
  { label: 'Library', icon: 'pi pi-bookmark', to: '/library' },
  { label: 'Profile', icon: 'pi pi-user', to: '/profile' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped></style>