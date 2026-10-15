<template>
  <div
    class="flex scrollbar-none gap-1 overflow-x-auto rounded-2xl bg-white/4 p-1"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      role="tab"
      :aria-selected="activeTab === tab.key"
      :aria-controls="`tabpanel-${tab.key}`"
      :id="`tab-${tab.key}`"
      class="focus-visible:outline-primary flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm whitespace-nowrap transition-all focus-visible:outline-2"
      :class="
        activeTab === tab.key
          ? 'bg-white/10 font-semibold text-white shadow shadow-black/20'
          : 'text-white/40 hover:text-white/70'
      "
      @click="$emit('update:activeTab', tab.key)"
    >
      <i v-if="tab.icon" aria-hidden="true" :class="tab.icon" class="text-xs" />
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { key: string; label: string; icon?: string }[]
  activeTab: string
  ariaLabel?: string
}>()

defineEmits<{
  'update:activeTab': [key: string]
}>()
</script>
