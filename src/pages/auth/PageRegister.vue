<script setup lang="ts">
import AuthHeroPanel from '@/components/auth/AuthHeroPanel.vue'
import { RegisterForm } from '@/components/auth'
</script>

<template>
  <div class="bg-surface-base flex min-h-screen">
    <div class="hidden flex-1 lg:block">
      <AuthHeroPanel />
    </div>
    <div class="flex flex-1 items-center justify-center px-5 py-8">
      <div class="w-full max-w-105">
        <RegisterForm />
      </div>
    </div>
  </div>
</template>
