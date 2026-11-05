<template>
  <Transition name="slide-fade" appear>
    <button
      v-if="modelValue"
      type="button"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl sm:backdrop-blur-lg lg:hidden"
      aria-label="Close navigation menu"
      @click="emit('update:modelValue', false)"
    >
      <!-- Safe-area respecting panel -->
      <div
        class="fixed inset-y-0 right-0 z-50 w-80 max-w-[90vw] bg-surface-2 border-l border-border-default shadow-2xl flex flex-col"
        style="padding-top: max(0.75rem, env(safe-area-inset-top, 0.75rem)); padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0.75rem))"
        @click.stop
      >
        <div class="flex h-12 items-center justify-between px-4">
          <RouterLink
            to="/"
            class="flex items-center gap-2.5"
            @click="emit('update:modelValue', false)"
          >
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-text">
              <Volume2 aria-hidden="true" class="h-5 w-5" />
            </div>
            <span class="font-black text-primary tracking-tight">Music App</span>
          </RouterLink>

          <button
            type="button"
            aria-label="Close navigation menu"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-active text-primary"
            @click="emit('update:modelValue', false)"
          >
            <X aria-hidden="true" class="h-5 w-5" />
          </button>
        </div>

        <nav
          role="navigation"
          aria-label="Mobile navigation"
          class="flex-1 space-y-0.5 overflow-y-auto px-2 py-2"
          style="scrollbar-width: none"
        >
          <!-- Browse -->
          <p class="px-4 pb-1 pt-2 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            Browse
          </p>
          <RouterLink
            v-for="item in browseItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            :class="
              activeNavBase === item.to
                ? 'bg-accent/10 text-primary border-r-2 border-accent'
                : 'text-secondary hover:bg-surface-active hover:text-primary'
            "
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <!-- Library -->
          <p class="px-4 pb-1 pt-3 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            Library
          </p>
          <RouterLink
            v-for="item in libraryItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            :class="
              activeNavBase === item.to
                ? 'bg-accent/10 text-primary border-r-2 border-accent'
                : 'text-secondary hover:bg-surface-active hover:text-primary'
            "
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <!-- Social -->
          <p class="px-4 pb-1 pt-3 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            Social
          </p>
          <RouterLink
            v-for="item in socialItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            :class="
              activeNavBase === item.to
                ? 'bg-accent/10 text-primary border-r-2 border-accent'
                : 'text-secondary hover:bg-surface-active hover:text-primary'
            "
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <!-- More -->
          <p class="px-4 pb-1 pt-3 text-[10px] font-bold tracking-[0.15em] text-muted uppercase">
            More
          </p>
          <RouterLink
            v-for="item in moreItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            :class="
              activeNavBase === item.to
                ? 'bg-accent/10 text-primary border-r-2 border-accent'
                : 'text-secondary hover:bg-surface-active hover:text-primary'
            "
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="mt-auto space-y-2 pt-4 px-4">
          <template v-if="store.isAuthenticated">
            <!-- User profile card -->
            <div class="flex items-center gap-3 rounded-xl px-3 py-2 bg-surface-active border border-white/5">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                {{ initials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold text-primary">{{ displayName }}</p>
                <p class="text-[10px] text-muted">{{ isAdmin ? 'Admin' : 'Listener' }}</p>
              </div>
            </div>

            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-surface-active hover:text-danger"
              @click="handleLogout"
            >
              <LogOut aria-hidden="true" class="h-5 w-5" />
              <span>Log out</span>
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/auth/login"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-text transition-colors hover:bg-accent-hover"
              @click="emit('update:modelValue', false)"
            >
              <LogIn aria-hidden="true" class="h-5 w-5" />
              <span>Log in</span>
            </RouterLink>

            <RouterLink
              to="/auth/register"
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-white/5"
              @click="emit('update:modelValue', false)"
            >
              <span>Sign up</span>
            </RouterLink>
          </template>
        </div>
      </div>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { LogIn, LogOut, Volume2, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserAuthStore } from '@/stores'
import { useAuth } from '@/composables/auth/useAuth'
import { usePageMeta } from '@/composables/usePageMeta'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const route = useRoute()
const store = useUserAuthStore()
const { logout } = useAuth()
const { activeNavBase, browseItems, libraryItems, socialItems, moreItems } = usePageMeta(route)

const isAdmin = computed(() => store.isAdmin)
const displayName = computed(
  () => store.user?.displayName || store.user?.username || store.user?.name || 'User',
)
const initials = computed(() => {
  const name = displayName.value || '?'
  const words = name.split(/\s+/).filter(Boolean)
  return words.length >= 2
    ? (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase()
    : name.slice(0, 2).toUpperCase()
})

function handleLogout() {
  emit('update:modelValue', false)
  void logout()
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from {
  opacity: 0;
}
.slide-fade-enter-from .w-80 {
  transform: translateX(100%);
}
.slide-fade-leave-to {
  opacity: 0;
}
.slide-fade-leave-to .w-80 {
  transform: translateX(100%);
}
</style>