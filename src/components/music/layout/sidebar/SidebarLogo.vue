<template>
  <RouterLink to="/" class="flex items-center gap-3 px-1 py-2">
    <div
      class="bg-accent text-accent-text flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
    >
      <Music :size="20" />
    </div>
    <div class="flex flex-col">
      <div class="text-primary text-base leading-tight font-extrabold tracking-tight">Muse</div>
      <div class="text-muted text-[10px] font-medium tracking-wider uppercase">Music</div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Music } from 'lucide-vue-next'
</script>
