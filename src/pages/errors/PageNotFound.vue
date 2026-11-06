<script setup lang="ts">
import { AlertCircle, ArrowLeft, Home } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="bg-surface-dark relative z-10 min-h-screen py-30">
    <!-- Aurora background -->
    <div class="aurora-bg pointer-events-none fixed inset-0" aria-hidden="true">
      <div class="aurora-spot-1 bg-spotify/10 -start-40 -top-40" />
      <div class="aurora-spot-2 bg-aurora-blue/8 -end-40 -top-60" />
      <div
        class="aurora-spot-1 bg-electric-purple/8 start-1/3 top-20"
        style="animation-delay: -8s; width: 350px; height: 350px"
      />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-100 px-4 text-center">
      <div class="mb-6 flex justify-center">
        <div
          class="flex h-24 w-24 items-center justify-center rounded-full bg-white/4 ring-1 ring-white/6"
        >
          <AlertCircle aria-hidden="true" class="text-4xl text-slate-500" />
        </div>
      </div>

      <h2 class="mb-2 text-[80px] leading-none font-black text-white md:text-[100px]">
        {{ $t('error.page_not_found_title') }}
      </h2>

      <h4 class="mb-3 text-[22px] font-bold text-white">
        {{ $t('error.not_found') }}
      </h4>

      <p class="mb-8 text-sm text-slate-400">
        {{ $t('error.page_not_found_desc') }}
      </p>

      <div class="flex items-center justify-center gap-3">
        <router-link
          to="/"
          class="bg-spotify hover:bg-spotify-hover inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-black transition hover:scale-105"
        >
          <Home aria-hidden="true" class="" />
          {{ $t('error.go_home') }}
        </router-link>

        <button
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/4 px-8 py-3 text-sm font-bold text-white/80 transition hover:border-white/30 hover:bg-white/8 hover:text-white"
          @click="router.go(-1)"
        >
          <ArrowLeft aria-hidden="true" class="" />
          {{ $t('error.go_back') }}
        </button>
      </div>
    </div>
  </section>
</template>
