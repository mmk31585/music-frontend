<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="bg-bg-overlay/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
        @click.self="emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-label="`Create ${entityType}`"
      >
        <div
          class="bg-surface-raised ring-border-default motion-safe:animate-modal-in mx-4 w-full max-w-md rounded-2xl p-6 shadow-2xl ring-1"
        >
          <!-- Step indicator -->
          <div class="mb-6 flex items-center gap-2">
            <div
              v-for="step in 3"
              :key="step"
              class="h-1 flex-1 rounded-full transition-colors duration-300"
              :class="step <= createStep ? 'bg-accent' : 'bg-surface-active'"
            />
          </div>

          <!-- Step 1: Name -->
          <template v-if="createStep === 1">
            <h2 class="text-primary text-lg font-bold">
              {{
                entityType === 'party'
                  ? 'Start a Party'
                  : entityType === 'room'
                    ? 'Go Live'
                    : 'Create Club'
              }}
            </h2>
            <p class="text-tertiary mt-1 text-sm">Choose a name for your {{ entityType }}</p>
            <input
              v-model="form.name"
              type="text"
              :placeholder="entityType === 'club' ? 'Club name' : 'Party name'"
              aria-label="Name"
              class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong focus:bg-surface-active/80 mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
              dir="auto"
            />
          </template>

          <!-- Step 2: Details -->
          <template v-if="createStep === 2">
            <h2 class="text-primary text-lg font-bold">Details</h2>
            <p class="text-tertiary mt-1 text-sm">Add a description and set privacy</p>
            <textarea
              v-model="form.description"
              placeholder="What's this about?"
              rows="3"
              aria-label="Description"
              class="border-border-default bg-surface-overlay text-primary placeholder:text-muted focus:border-border-strong focus:bg-surface-active/80 mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition"
              dir="auto"
            />
            <label
              class="bg-surface-overlay/60 hover:bg-surface-overlay mt-4 flex cursor-pointer items-center gap-3 rounded-xl p-3 transition"
            >
              <input
                v-model="form.isPublic"
                type="checkbox"
                class="border-border-default bg-surface-overlay accent-accent h-5 w-5 rounded"
              />
              <div>
                <span class="text-primary text-sm">Public</span>
                <p class="text-muted text-xs">Anyone can find and join</p>
              </div>
            </label>
          </template>

          <!-- Step 3: Review -->
          <template v-if="createStep === 3">
            <div class="flex flex-col items-center gap-4 py-4 text-center">
              <div class="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-full">
                <i aria-hidden="true" :class="entityIcon" class="text-accent text-2xl" />
              </div>
              <h2 class="text-primary text-lg font-bold">Almost there!</h2>
              <p class="text-tertiary text-sm">Review and launch your {{ entityType }}</p>
              <div class="bg-surface-overlay/60 w-full rounded-xl p-4 text-start">
                <p class="text-muted text-xs">Name</p>
                <p class="text-primary text-sm font-medium">{{ form.name }}</p>
                <p v-if="form.description" class="text-muted mt-3 text-xs">Description</p>
                <p v-if="form.description" class="text-secondary text-sm">{{ form.description }}</p>
                <p class="text-muted mt-3 text-xs">Visibility</p>
                <p class="text-secondary text-sm">
                  <component
                    :is="form.isPublic ? Globe : Lock"
                    aria-hidden="true"
                    class="me-1 text-xs"
                  />
                  {{ form.isPublic ? 'Public' : 'Private' }}
                </p>
              </div>
            </div>
          </template>

          <!-- Navigation buttons -->
          <div class="mt-6 flex gap-3">
            <!-- Back / Cancel -->
            <template v-if="createStep === 1">
              <button
                class="bg-surface-overlay text-secondary hover:bg-surface-active flex-1 rounded-xl py-3 text-sm font-medium transition"
                @click="emit('close')"
              >
                Cancel
              </button>
            </template>
            <template v-else>
              <button
                class="bg-surface-overlay text-secondary hover:bg-surface-active flex-1 rounded-xl py-3 text-sm font-medium transition"
                @click="createStep--"
              >
                Back
              </button>
            </template>

            <!-- Next / Create -->
            <template v-if="createStep < 3">
              <button
                :disabled="createStep === 1 && !form.name.trim()"
                class="bg-accent hover:bg-accent-hover flex-1 rounded-xl py-3 text-sm font-bold text-black transition focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"
                @click="createStep++"
              >
                Next
              </button>
            </template>
            <template v-else>
              <button
                :disabled="creating"
                class="bg-accent hover:bg-accent-hover flex-1 rounded-xl py-3 text-sm font-bold text-black transition focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40"
                @click="handleCreate"
              >
                <span v-if="creating" class="inline-flex items-center gap-2">
                  <span
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"
                  />
                  Creating...
                </span>
                <span v-else>
                  <Send aria-hidden="true" class="me-1.5 text-xs" />
                  Launch
                </span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Globe, Lock, Send } from 'lucide-vue-next'
import { ref, reactive, computed } from 'vue'
import { useSocialApi } from '@/services/api/social'

const props = defineProps<{
  visible: boolean
  entityType: 'party' | 'room' | 'club'
}>()

const emit = defineEmits<{
  close: []
  created: [id: string, type: string]
}>()

const api = useSocialApi()
export type WizardEntityType = 'party' | 'room' | 'club'

const createStep = ref(1)
const creating = ref(false)

const form = reactive({
  name: '',
  description: '',
  isPublic: true,
})

const entityIcon = computed(() => {
  switch (props.entityType) {
    case 'party':
      return 'pi pi-users'
    case 'room':
      return 'pi pi-megaphone'
    case 'club':
      return 'pi pi-building'
    default:
      return 'pi pi-plus'
  }
})

async function handleCreate() {
  if (!form.name.trim() || creating.value) return
  creating.value = true
  try {
    let result: { id?: string } | undefined

    if (props.entityType === 'party') {
      result = await api.createParty({
        title: form.name.trim(),
        description: form.description.trim() || undefined,
        is_public: form.isPublic,
      })
    } else if (props.entityType === 'room') {
      result = await api.createRoom({
        title: form.name.trim(),
        description: form.description.trim() || undefined,
        is_public: form.isPublic,
      })
    } else {
      const slug = form.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      result = await api.createClub({
        name: form.name.trim(),
        slug,
        description: form.description.trim() || undefined,
        is_public: form.isPublic,
      })
    }

    if (result?.id) {
      emit('created', result.id, props.entityType)
    }
    emit('close')
  } catch (err) {
    console.error('Failed to create:', err)
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-modal-in {
  animation: modal-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
