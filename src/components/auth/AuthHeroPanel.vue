<template>
  <div
    class="bg-surface-900 text-primary relative hidden min-h-screen overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between"
  >
    <!-- Aurora orbs -->
    <div
      class="aurora-orb bg-accent absolute -top-32 -right-20 h-96 w-96 rounded-full opacity-20 blur-[100px]"
    />
    <div
      class="aurora-orb bg-accent absolute top-1/2 -left-16 h-72 w-72 rounded-full opacity-15 blur-[80px]"
      style="animation-delay: 2.5s"
    />
    <div
      class="aurora-orb bg-accent absolute right-1/3 -bottom-20 h-80 w-80 rounded-full opacity-15 blur-[90px]"
      style="animation-delay: 5s"
    />

    <!-- Equalizer bars -->
    <div class="absolute top-1/3 right-12 z-10 flex items-end gap-0.75 opacity-40">
      <div v-for="i in 24" :key="i" class="equalizer-bar bg-accent w-0.75 rounded-full" />
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex h-full flex-col justify-between">
      <!-- Brand -->
      <div class="flex items-center gap-3">
        <div
          class="bg-accent text-accent-text flex h-11 w-11 items-center justify-center rounded-xl text-lg font-extrabold shadow-lg"
          :style="{ boxShadow: '0 8px 32px var(--accent-glow)' }"
        >
          M
        </div>
        <h1 class="text-xl font-bold tracking-tight">{{ $t('app.name') }}</h1>
      </div>

      <!-- Hero text -->
      <div class="pb-20">
        <h2 class="font-display max-w-md text-5xl leading-[1.1] font-extrabold tracking-tight">
          <span class="text-gradient">Feel every beat</span>
        </h2>
        <p class="text-secondary mt-4 max-w-sm text-base leading-relaxed">
          Discover tracks, artists, albums, and genres in a smooth streaming experience.
        </p>
        <p class="text-tertiary mt-2 text-sm">هر نت یک داستان، هر آهنگ یک خاطره</p>
      </div>

      <!-- Footer -->
      <div class="text-tertiary flex items-center gap-2 text-xs">
        <span class="bg-accent inline-block h-1 w-1 rounded-full" />
        <span>© 2026 Musicify — Music streaming reimagined</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, var(--accent) 0%, var(--info) 50%, var(--accent-hover) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.aurora-orb {
  animation: aurora-pulse 6s ease-in-out infinite alternate;
}

@keyframes aurora-pulse {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
}

.equalizer-bar {
  animation: eq-bounce 0.8s ease-in-out infinite alternate;
  animation-delay: calc(var(--i, 0) * 0.05s);
  height: calc(8px + (var(--bar-height, 20) * 1px));
}

.equalizer-bar:nth-child(1) {
  --bar-height: 12;
  --i: 0;
}
.equalizer-bar:nth-child(2) {
  --bar-height: 28;
  --i: 1;
}
.equalizer-bar:nth-child(3) {
  --bar-height: 8;
  --i: 2;
}
.equalizer-bar:nth-child(4) {
  --bar-height: 36;
  --i: 3;
}
.equalizer-bar:nth-child(5) {
  --bar-height: 18;
  --i: 4;
}
.equalizer-bar:nth-child(6) {
  --bar-height: 42;
  --i: 5;
}
.equalizer-bar:nth-child(7) {
  --bar-height: 14;
  --i: 6;
}
.equalizer-bar:nth-child(8) {
  --bar-height: 32;
  --i: 7;
}
.equalizer-bar:nth-child(9) {
  --bar-height: 24;
  --i: 8;
}
.equalizer-bar:nth-child(10) {
  --bar-height: 38;
  --i: 9;
}
.equalizer-bar:nth-child(11) {
  --bar-height: 10;
  --i: 10;
}
.equalizer-bar:nth-child(12) {
  --bar-height: 30;
  --i: 11;
}
.equalizer-bar:nth-child(13) {
  --bar-height: 22;
  --i: 12;
}
.equalizer-bar:nth-child(14) {
  --bar-height: 40;
  --i: 13;
}
.equalizer-bar:nth-child(15) {
  --bar-height: 16;
  --i: 14;
}
.equalizer-bar:nth-child(16) {
  --bar-height: 34;
  --i: 15;
}
.equalizer-bar:nth-child(17) {
  --bar-height: 26;
  --i: 16;
}
.equalizer-bar:nth-child(18) {
  --bar-height: 44;
  --i: 17;
}
.equalizer-bar:nth-child(19) {
  --bar-height: 10;
  --i: 18;
}
.equalizer-bar:nth-child(20) {
  --bar-height: 28;
  --i: 19;
}
.equalizer-bar:nth-child(21) {
  --bar-height: 38;
  --i: 20;
}
.equalizer-bar:nth-child(22) {
  --bar-height: 14;
  --i: 21;
}
.equalizer-bar:nth-child(23) {
  --bar-height: 32;
  --i: 22;
}
.equalizer-bar:nth-child(24) {
  --bar-height: 20;
  --i: 23;
}

@keyframes eq-bounce {
  0% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
</style>
