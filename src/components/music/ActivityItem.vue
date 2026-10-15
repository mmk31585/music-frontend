<template>
  <div
    class="hover:bg-surface-hover focus-within:ring-accent flex items-start gap-3 rounded-xl p-3 transition focus-within:ring-2"
    role="article"
    :aria-label="`Activity: ${item.userName} ${item.action}`"
  >
    <!-- Avatar with link to profile -->
    <RouterLink
      :to="`/profile/${item.userId}`"
      class="ring-border-default focus-visible:outline-accent h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 focus-visible:outline-2"
    >
      <img
        v-if="item.avatarUrl"
        :src="item.avatarUrl"
        :alt="item.userName"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="bg-surface-active text-primary flex h-full w-full items-center justify-center text-[10px] font-bold"
      >
        {{ (item.userName || '?')[0] }}
      </div>
    </RouterLink>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <p class="text-secondary text-xs leading-relaxed">
        <RouterLink
          :to="`/profile/${item.userId}`"
          class="text-primary focus-visible:outline-accent font-semibold hover:underline focus-visible:outline-2"
        >
          {{ item.userName }}
        </RouterLink>
        {{ ' ' + item.action + ' ' }}
        <template v-if="item.targetName">
          <RouterLink
            v-if="item.targetUrl"
            :to="item.targetUrl"
            class="text-accent focus-visible:outline-accent font-medium hover:underline focus-visible:outline-2"
          >
            {{ item.targetName }}
          </RouterLink>
          <span v-else class="text-primary/80 font-medium">{{ item.targetName }}</span>
        </template>
      </p>
      <p class="text-muted mt-0.5 text-[10px]">{{ displayTimeAgo }}</p>
    </div>

    <!-- Contextual action button -->
    <button
      v-if="item.actionType === 'party'"
      aria-label="Join party"
      class="bg-accent-subtle text-accent hover:bg-accent-subtle focus-visible:outline-accent shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition focus-visible:outline-2"
      @click="$emit('action', item)"
    >
      Join
    </button>
    <button
      v-else-if="item.actionType === 'room'"
      aria-label="Listen live"
      class="bg-danger-subtle text-danger hover:bg-danger-subtle focus-visible:outline-danger shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition focus-visible:outline-2"
      @click="$emit('action', item)"
    >
      Listen
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ActivityItemData {
  id: string
  userId: string
  userName: string
  avatarUrl?: string | null
  action: string
  targetName?: string | null
  targetUrl?: string | null
  actionType?: string | null
  timeAgo?: string | null
  createdAt?: string | null
}

const props = defineProps<{
  item: ActivityItemData
}>()

defineEmits<{
  action: [item: ActivityItemData]
}>()

const displayTimeAgo = computed(() => {
  if (props.item.timeAgo) return props.item.timeAgo
  if (!props.item.createdAt) return ''
  const d = new Date(props.item.createdAt)
  const now = Date.now()
  const diff = now - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
})
</script>
