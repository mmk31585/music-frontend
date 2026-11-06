<template>
  <nav
    aria-label="Main navigation"
    class="fixed inset-x-0 bottom-0 z-40 border-t border-border-default surface-card shadow-lg lg:hidden"
    style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0.75rem))"
  >
    <div class="flex items-center justify-around px-2 pt-2">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-[10px] font-medium transition-colors duration-200"
        :class="
          isActive(tab.to)
            ? 'bg-accent/15 text-accent ring-1 ring-accent/20'
            : 'text-muted hover:bg-surface-hover hover:text-secondary'
        "
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200">
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
  { label: 'خانه', icon: 'pi pi-home', to: '/' },
  { label: 'جستجو', icon: 'pi pi-search', to: '/search' },
  { label: 'ویدیوها', icon: 'pi pi-video', to: '/videos' },
  { label: 'کتابخانه', icon: 'pi pi-bookmark', to: '/library' },
  { label: 'پروفایل', icon: 'pi pi-user', to: '/profile' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped></style>