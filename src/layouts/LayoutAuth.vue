<template>
  <div class="min-h-screen bg-surface-raised" :dir="dir">
    <!-- Skip link for keyboard users -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Offline banner -->
    <div
      v-if="!isOnline"
      role="alert"
      class="fixed top-0 left-0 right-0 z-9999 flex items-center justify-center gap-2 bg-red-600/90 px-4 py-2 text-sm font-medium text-white"
      style="padding-top: max(0.5rem, env(safe-area-inset-top, 0.5rem))"
    >
      <Wifi class="text-xs" aria-hidden="true"  />
      <span>You are offline. Some features may be unavailable.</span>
    </div>

    <main id="main-content">
      <ErrorBoundary>
        <router-view />
      </ErrorBoundary>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Wifi } from 'lucide-vue-next'
import { useRTL, useOnlineStatus } from '@/composables'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
const { dir } = useRTL()
const { isOnline } = useOnlineStatus()
</script>
