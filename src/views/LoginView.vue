<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn, User } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store'
import { ROUTE_NAMES } from '../router'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()

const studentName = ref('')

const handleSubmit = () => {
  if (!studentName.value.trim()) return
  store.login(studentName.value)

  const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : null
  if (redirectPath) {
    router.push(redirectPath)
  } else {
    router.push({ name: ROUTE_NAMES.STUDENT_LAYOUT })
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10">
    <div class="card bg-base-100 shadow-xl border border-base-300">
      <div class="card-body">
        <h1 class="card-title text-2xl justify-center mb-2">Вхід до кабінету студента</h1>
        <p class="text-sm text-center text-base-content/70 mb-4">
          Введіть ваше ім'я для доступу до записаних курсів та відстеження прогресу.
        </p>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Ім'я студента</span>
            </label>
            <label class="input input-bordered flex items-center gap-2 w-full">
              <User class="w-4 h-4 opacity-70" />
              <input
                v-model="studentName"
                type="text"
                class="grow"
                placeholder="Наприклад: Максим Зверянський"
                required
              />
            </label>
          </div>

          <button type="submit" class="btn btn-primary w-full gap-2">
            <LogIn class="w-4 h-4" />
            Увійти
          </button>
        </form>
      </div>
    </div>
  </div>
</template>