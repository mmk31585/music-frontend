<template>
  <div
    ref="menuRef"
    class="border-border-default bg-surface-popover absolute top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl"
    :class="[isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right']"
    @click.stop
  >
    <div class="border-border-default border-b px-4 py-4">
      <div class="flex items-center gap-3">
        <div
          class="bg-accent text-accent-text flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        >
          <img
            v-if="user?.avatarUrl"
            :src="user.avatarUrl"
            :alt="displayName"
            class="h-full w-full rounded-full object-cover"
            @error="onAvatarError"
          />
          <span v-else>{{ initials }}</span>
        </div>
        <div class="min-w-0">
          <p class="text-primary truncate text-sm font-bold">{{ displayName }}</p>
          <p class="text-muted truncate text-xs">{{ user?.email || '' }}</p>
        </div>
        <button
          type="button"
          aria-label="Close menu"
          class="text-tertiary hover:bg-surface-active hover:text-secondary ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition"
          @click="$emit('close')"
        >
          <X aria-hidden="true" class="text-xs" />
        </button>
      </div>
      <div v-if="user?.role" class="mt-2 flex items-center gap-1.5">
        <span
          class="bg-accent-subtle text-accent rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase"
        >
          {{ user.role }}
        </span>
      </div>
    </div>

    <div class="py-1.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="text-secondary hover:bg-surface-hover hover:text-primary flex items-center gap-3 px-4 py-2.5 text-sm transition"
        @click="$emit('close')"
      >
        <span class="flex h-7 w-7 items-center justify-center rounded-lg" :class="item.iconBg">
          <i aria-hidden="true" :class="item.icon" class="text-xs" />
        </span>
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="bg-accent-subtle text-accent ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold"
        >
          {{ item.badge }}
        </span>
      </RouterLink>
    </div>

    <div class="border-border-default border-t px-4 py-3">
      <AppearancePanel />
    </div>

    <div class="border-border-default border-t py-1.5">
      <button
        type="button"
        class="text-danger/70 hover:bg-danger-subtle hover:text-danger flex w-full items-center gap-3 px-4 py-2.5 text-sm transition"
        @click="handleLogout"
      >
        <span class="bg-danger-subtle flex h-7 w-7 items-center justify-center rounded-lg">
          <LogOut aria-hidden="true" class="text-xs" />
        </span>
        <span>Sign out</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogOut, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAuthStore, usePlayerStore } from '@/stores'
import { wsClient } from '@/services/socket/client'
import { useRTL } from '@/composables'
import AppearancePanel from './AppearancePanel.vue'

const { isRTL } = useRTL()

defineEmits<{
  close: []
}>()

defineProps<{
  user: { avatarUrl?: string | null; email?: string | null; role?: string | null } | null
  displayName: string
  initials: string
}>()

const router = useRouter()
const store = useUserAuthStore()

const navItems = computed(() => {
  const items: Array<{ label: string; icon: string; iconBg: string; to: string; badge?: string }> =
    [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        iconBg: 'bg-surface-active text-secondary',
        to: '/profile',
      },
      {
        label: 'Library',
        icon: 'pi pi-bookmark',
        iconBg: 'bg-surface-active text-secondary',
        to: '/library',
      },
      {
        label: 'Favorites',
        icon: 'pi pi-heart',
        iconBg: 'bg-surface-active text-secondary',
        to: '/liked-tracks',
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        iconBg: 'bg-surface-active text-secondary',
        to: '/settings',
      },
    ]
  if (store.isAdmin) {
    items.push({
      label: 'Admin Panel',
      icon: 'pi pi-shield',
      iconBg: 'bg-warning-subtle text-warning',
      to: '/admin',
      badge: 'Admin',
    })
  }
  return items
})

function onAvatarError(e: Event) {
  const img = e.currentTarget as HTMLImageElement
  img.style.display = 'none'
}

function handleLogout() {
  store.logout()
  wsClient.disconnect()
  usePlayerStore().$reset()
  router.push('/')
}
</script>
