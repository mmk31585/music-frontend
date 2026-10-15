<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="bg-bg-overlay/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <div class="glass-strong mx-4 w-full max-w-md rounded-2xl p-8">
        <h2 class="text-primary mb-6 text-xl font-bold">ساخت کلاب جدید</h2>

        <div class="space-y-4">
          <input
            v-model="name"
            type="text"
            placeholder="اسم کلاب"
            aria-label="اسم کلاب"
            autofocus
            class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
            dir="rtl"
          />

          <textarea
            v-model="description"
            placeholder="توضیحات (اختیاری)"
            rows="3"
            aria-label="توضیحات"
            class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
            dir="rtl"
          />

          <select
            v-model="genre"
            class="border-border-default bg-surface-overlay text-primary focus:border-border-strong w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
            aria-label="دسته‌بندی"
            dir="rtl"
          >
            <option value="" disabled selected>دسته‌بندی</option>
            <option v-for="g in genres" :key="g.value" :value="g.value">
              {{ g.label }}
            </option>
          </select>

          <input
            v-model="coverUrl"
            type="text"
            placeholder="لینک تصویر (اختیاری)"
            aria-label="لینک تصویر"
            class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
            dir="rtl"
          />
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="bg-surface-overlay text-secondary hover:bg-surface-active flex-1 rounded-xl py-3 text-sm font-medium transition"
            @click="emit('close')"
          >
            انصراف
          </button>
          <button
            class="bg-accent hover:bg-accent/90 flex-1 rounded-xl py-3 text-sm font-bold text-black transition disabled:opacity-40"
            :disabled="!name.trim() || creating"
            @click="handleCreate"
          >
            {{ creating ? '...' : 'ساختن' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSocialApi } from '@/services/api/social'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  close: []
  created: [clubId: string]
}>()

const api = useSocialApi()

const name = ref('')
const description = ref('')
const genre = ref('')
const coverUrl = ref('')
const creating = ref(false)

const genres = [
  { value: 'pop', label: 'پاپ' },
  { value: 'rap', label: 'رپ' },
  { value: 'traditional', label: 'سنتی' },
  { value: 'rock', label: 'راک' },
  { value: 'electronic', label: 'الکترونیک' },
  { value: 'jazz', label: 'جز' },
  { value: 'classical', label: 'کلاسیک' },
  { value: 'folk', label: 'فولک' },
  { value: 'metal', label: 'متال' },
  { value: 'rnb', label: 'R&B' },
  { value: 'other', label: 'سایر' },
]

async function handleCreate() {
  if (!name.value.trim() || creating.value) return
  creating.value = true
  try {
    const slug = name.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const club = await api.createClub({
      name: name.value.trim(),
      slug,
      description: description.value.trim() || undefined,
      genre: genre.value || undefined,
      cover_url: coverUrl.value.trim() || undefined,
      is_public: true,
    })

    if (club?.id) {
      emit('created', club.id)
    }
  } catch (err) {
    console.error('Failed to create club:', err)
  } finally {
    creating.value = false
  }
}
</script>
