<template>
  <div class="space-y-5">
    <div>
      <p class="text-tertiary mb-2 text-[11px] font-semibold tracking-widest uppercase">Theme</p>
      <div class="bg-surface-overlay flex gap-1 rounded-xl p-1">
        <button
          v-for="t in themeOptions"
          :key="t.value"
          type="button"
          :aria-label="t.label"
          :class="[
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
            theme.state.mode === t.value
              ? 'bg-surface-active text-primary shadow-sm'
              : 'text-tertiary hover:text-secondary',
          ]"
          @click="theme.setMode(t.value)"
        >
          <span>{{ t.icon }}</span>
          <span>{{ t.label }}</span>
        </button>
      </div>
    </div>

    <div>
      <p class="text-tertiary mb-2 text-[11px] font-semibold tracking-widest uppercase">
        Primary Color
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="color in theme.availablePrimaries"
          :key="color"
          type="button"
          :aria-label="color"
          :title="color"
          :class="[
            'ring-border-default h-7 w-7 rounded-full ring-1 transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2',
            theme.state.primary === color ? 'ring-primary scale-110 ring-2' : '',
          ]"
          :style="{ backgroundColor: theme.primaryPalettes[color][500] }"
          @click="theme.setPrimary(color)"
        />
      </div>
    </div>

    <div>
      <p class="text-tertiary mb-2 text-[11px] font-semibold tracking-widest uppercase">Surface</p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="s in theme.availableSurfaces"
          :key="s"
          type="button"
          :class="[
            'flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200',
            theme.state.surface === s
              ? 'bg-surface-active text-primary ring-border-strong ring-1'
              : 'bg-surface-hover text-tertiary hover:bg-surface-active hover:text-secondary',
          ]"
          @click="theme.setSurface(s)"
        >
          <span
            class="ring-border-default h-4 w-4 rounded-full ring-1"
            :style="{ backgroundColor: theme.surfacePalettes[s][700] }"
          />
          <span class="capitalize">{{ s }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const theme = useTheme()

const themeOptions = [
  { value: 'dark' as const, label: 'Dark', icon: '🌙' },
  { value: 'light' as const, label: 'Light', icon: '☀' },
  { value: 'system' as const, label: 'System', icon: '🖥' },
]
</script>
