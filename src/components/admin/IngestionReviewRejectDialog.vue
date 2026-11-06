<template>
  <Dialog v-model:visible="localVisible" header="Reject Draft" :modal="true" class="w-full max-w-md">
    <div class="space-y-4">
      <p class="text-sm text-slate-400">Provide a reason for rejecting this draft (optional).</p>
      <Textarea
        v-model="reason"
        dir="auto"
        :auto-resize="true"
        class="w-full"
        rows="3"
        placeholder="Reason..."
      />
    </div>
    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="localVisible = false" />
      <Button
        label="Confirm Reject"
        severity="danger"
        :loading="rejecting"
        @click="$emit('confirm', reason)"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  rejecting: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [reason: string]
}>()

const reason = ref('')

const localVisible = ref(false)

watch(
  () => props.visible,
  (v) => {
    localVisible.value = v
    if (v) reason.value = ''
  },
)

watch(localVisible, (v) => {
  emit('update:visible', v)
})
</script>
