import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { FeatureFlags, FeatureFlagKey } from '@/services/api/feature-flags'

export const useFeatureFlagsStore = defineStore('useFeatureFlags', () => {
  const flags = ref<FeatureFlags | null>(null)
  const loading = ref(false)
  const fetched = ref(false)

  const isLoaded = computed(() => fetched.value && flags.value !== null)

  function isEnabled(key: FeatureFlagKey): boolean {
    // Defaults to `true` until flags are loaded so the UI stays usable
    // before the first (mocked or real) API response.
    if (flags.value === null) return true
    return flags.value?.[key] ?? true
  }

  function setFlags(data: FeatureFlags) {
    flags.value = data
    fetched.value = true
  }

  function $reset() {
    flags.value = null
    loading.value = false
    fetched.value = false
  }

  return {
    flags,
    loading,
    fetched,
    isLoaded,
    isEnabled,
    setFlags,
    $reset,
  }
})
