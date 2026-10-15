<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="bg-bg-overlay/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <div class="glass-strong mx-4 w-full max-w-lg rounded-2xl p-8">
        <h2 class="text-primary mb-6 text-xl font-bold">بحث جدید</h2>

        <div class="space-y-4">
          <input
            v-model="title"
            type="text"
            placeholder="عنوان بحث"
            aria-label="عنوان بحث"
            autofocus
            class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
            dir="rtl"
          />
          <textarea
            v-model="body"
            placeholder="متن بحث..."
            rows="5"
            aria-label="متن بحث"
            class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
            dir="rtl"
          />
          <div
            v-if="errorMessage"
            class="bg-danger-subtle text-danger rounded-lg px-4 py-2.5 text-xs"
          >
            {{ errorMessage }}
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="bg-surface-overlay text-primary/50 hover:bg-surface-active flex-1 rounded-xl py-3 text-sm font-medium transition"
            @click="emit('close')"
          >
            انصراف
          </button>
          <button
            class="bg-accent hover:bg-accent/90 flex-1 rounded-xl py-3 text-sm font-bold text-black transition disabled:opacity-40"
            :disabled="!title.trim() || !body.trim() || creating"
            @click="handleCreate"
          >
            {{ creating ? '...' : 'انتشار بحث' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSocialApi } from '@/services/api/social'
import { useAppToast } from '@/composables/useAppToast'

const props = defineProps<{
  visible: boolean
  clubId: string
}>()
const emit = defineEmits<{
  close: []
  created: [discussionId: string]
}>()

const socialApi = useSocialApi()
const toast = useAppToast()

const title = ref('')
const body = ref('')
const creating = ref(false)
const errorMessage = ref('')

async function handleCreate() {
  if (!title.value.trim() || !body.value.trim() || creating.value) return
  creating.value = true
  errorMessage.value = ''
  try {
    const d = await socialApi.createClubDiscussion(props.clubId, {
      title: title.value.trim(),
      body: body.value.trim(),
    })
    if (d?.id) {
      toast.success('Discussion created!')
      emit('created', d.id)
    }
  } catch (err: any) {
    const msg = err?.response?.data?.message || err.message || 'Failed to create discussion'
    errorMessage.value = msg
    toast.apiError(err, 'Failed to create discussion')
  } finally {
    creating.value = false
  }
}
</script>
