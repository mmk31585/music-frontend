<template>
  <Transition name="fade-slide">
    <div
      v-if="isOpen"
      ref="floatingRef"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-border-default rounded-full px-3 py-2 transition-all duration-200 hover:bg-accent hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify/60 focus-visible:ring-offset-2"
      aria-label="Navigate"
      @click="toggleNav"
    >
      <Home class="h-5 w-5 text-primary" aria-hidden="true" />

      <span class="text-xs text-primary/80 hidden sm:block">Navigate</span>

      <!-- Indicator for active section -->
      <div
        v-if="activeIndex >= 0 && activeIndex < itemCount"
        class="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-accent shadow-md animate-pulse"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Home, Search, Bell, User, Bookmark, Settings } from 'lucide-vue-next'

// Default items for the floating nav
const items = [
  { id: 0, icon: Home, label: 'Home' },
  { id: 1, icon: Search, label: 'Search' },
  { id: 2, icon: Bell, label: 'Alerts' },
  { id: 3, icon: User, label: 'Profile' },
  { id: 4, icon: Bookmark, label: 'Saved' },
  { id: 5, icon: Settings, label: 'Settings' },
]

// State
const isOpen = ref(false)
const activeIndex = ref(0)
const containerRef = ref<HTMLElement | null>(null)

// Item count (exclude the last duplicate Profile from React version)
const itemCount = items.length

// Toggle nav open/close
function toggleNav() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Position indicator based on first item
    activeIndex.value = 0
  }
}

// Close on outside click
onMounted(() => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const shouldClose =
      !target.closest('[ref="floatingRef"]') &&
      target !== containerRef.value

    if (shouldClose) {
      isOpen.value = false
    }
  }

  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick)
})

// Close on esc
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      isOpen.value = false
    }
  }
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Fade + slide transition for accessibility */
.fade-slide-enter-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.fade-slide-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Pulse animation for active indicator */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* When nav is expanded - show full menu */
.expanded {
  width: 320px;
  padding: 12px;
  border-radius: var(--radius-lg, 14px);
  box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.12));
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
    opacity: 1;
  }
}
</style>