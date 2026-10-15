<template>
  <header
    class="border-border-default bg-surface-raised/70 sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-xs md:px-6"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Menu"
          class="bg-surface-active text-primary rounded-full p-2 lg:hidden"
        >
          <Menu aria-hidden="true" class="" />
        </button>
        <div>
          <p class="text-muted text-xs tracking-[0.3em] uppercase">Music App</p>
          <h2 class="text-primary text-lg font-semibold">Browse</h2>
        </div>
      </div>

      <InputText
        v-model="query"
        placeholder="Search tracks, artists, albums..."
        aria-label="Search"
        class="bg-surface-overlay text-secondary hover:bg-surface-active focus-visible:ring-accent/50 hidden rounded-full border-0! px-4 py-2 text-sm outline-hidden! transition focus-visible:ring-2 md:block"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { ref } from 'vue'

const query = ref('')
</script>
