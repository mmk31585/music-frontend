<template>
  <Transition name="fade">
    <button
      v-if="modelValue"
      type="button"
      class="bg-bg-overlay fixed inset-0 z-50 backdrop-blur-xs lg:hidden"
      aria-label="Close navigation menu"
      @click="emit('update:modelValue', false)"
    >
      <div class="bg-surface-raised flex h-full w-80 max-w-[85vw] flex-col p-4" @click.stop>
        <div class="mb-4 flex items-center justify-between">
          <RouterLink
            to="/"
            class="flex items-center gap-3"
            @click="emit('update:modelValue', false)"
          >
            <div
              class="bg-accent text-accent-text flex h-10 w-10 items-center justify-center rounded-2xl"
            >
              <Volume2 aria-hidden="true" class="" />
            </div>
            <span class="text-primary font-black">Music App</span>
          </RouterLink>

          <button
            type="button"
            aria-label="Close navigation menu"
            class="bg-surface-active text-primary flex h-10 w-10 items-center justify-center rounded-full"
            @click="emit('update:modelValue', false)"
          >
            <X aria-hidden="true" class="" />
          </button>
        </div>

        <nav
          role="navigation"
          aria-label="Mobile navigation"
          class="flex-1 space-y-1 overflow-y-auto"
        >
          <p class="text-muted px-4 pt-4 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            Browse
          </p>
          <RouterLink
            v-for="item in browseItems"
            :key="item.to"
            :to="item.to"
            class="text-secondary hover:bg-surface-active hover:text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeNavBase === item.to ? 'bg-surface-active text-primary' : ''"
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <p class="text-muted px-4 pt-4 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            Library
          </p>
          <RouterLink
            v-for="item in libraryItems"
            :key="item.to"
            :to="item.to"
            class="text-secondary hover:bg-surface-active hover:text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeNavBase === item.to ? 'bg-surface-active text-primary' : ''"
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <p class="text-muted px-4 pt-4 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            Social
          </p>
          <RouterLink
            v-for="item in socialItems"
            :key="item.to"
            :to="item.to"
            class="text-secondary hover:bg-surface-active hover:text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeNavBase === item.to ? 'bg-surface-active text-primary' : ''"
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <p class="text-muted px-4 pt-4 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            More
          </p>
          <RouterLink
            v-for="item in moreItems"
            :key="item.to"
            :to="item.to"
            class="text-secondary hover:bg-surface-active hover:text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition"
            :class="activeNavBase === item.to ? 'bg-surface-active text-primary' : ''"
            @click="emit('update:modelValue', false)"
          >
            <i aria-hidden="true" :class="item.icon" class="text-lg" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="border-border-default mt-auto space-y-2 border-t pt-4">
          <template v-if="store.isAuthenticated">
            <div class="flex items-center gap-3 rounded-xl px-4 py-2">
              <div
                class="bg-accent-subtle text-accent flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
              >
                {{ initials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-primary truncate text-sm font-bold">{{ displayName }}</p>
                <p class="text-muted text-xs">{{ isAdmin ? 'Admin' : 'Listener' }}</p>
              </div>
            </div>

            <button
              type="button"
              class="text-secondary hover:bg-surface-active hover:text-danger flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition"
              @click="handleLogout"
            >
              <LogOut aria-hidden="true" class="text-lg" />
              <span>Log out</span>
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/auth/login"
              class="bg-accent text-accent-text hover:bg-accent-hover flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition"
              @click="emit('update:modelValue', false)"
            >
              <LogIn aria-hidden="true" class="" />
              <span>Log in</span>
            </RouterLink>

            <RouterLink
              to="/auth/register"
              class="border-border-strong text-primary hover:bg-surface-overlay flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition"
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
