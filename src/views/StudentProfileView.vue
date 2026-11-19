<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Save, CheckCircle } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store'

const store = useCoursesStore()
const { profile } = storeToRefs(store)

const form = reactive({
  name: profile.value.name,
  email: profile.value.email,
  avatarUrl: profile.value.avatarUrl
})

const savedMessage = ref(false)

const isDirty = computed(() => {
  return (
    form.name !== profile.value.name ||
    form.email !== profile.value.email ||
    form.avatarUrl !== profile.value.avatarUrl
  )
})

const saveProfile = () => {
  store.updateProfile({
    name: form.name,
    email: form.email,
    avatarUrl: form.avatarUrl
  })
  savedMessage.value = true
  setTimeout(() => {
    savedMessage.value = false
  }, 3000)
}

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return window.confirm('У вас є незбережені зміни у профілі. Ви дійсно бажаєте залишити сторінку?')
  }
  return true
})
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 max-w-xl">
    <div class="card-body">
      <h2 class="card-title text-xl mb-2">Редагування профілю студента</h2>

      <form class="space-y-4" @submit.prevent="saveProfile">
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Ім'я та прізвище</span></label>
          <input v-model="form.name" type="text" class="input input-bordered w-full" required />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Email</span></label>
          <input v-model="form.email" type="email" class="input input-bordered w-full" required />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">URL аватара</span></label>
          <input v-model="form.avatarUrl" type="url" class="input input-bordered w-full" required />
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button type="submit" class="btn btn-primary gap-2" :disabled="!isDirty">
            <Save class="w-4 h-4" />
            Зберегти зміни
          </button>

          <span v-if="savedMessage" class="text-success text-sm flex items-center gap-1 font-medium">
            <CheckCircle class="w-4 h-4" />
            Профіль оновлено
          </span>
        </div>
      </form>
    </div>
  </div>
</template>