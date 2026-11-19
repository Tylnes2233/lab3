<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { CheckSquare, Square, ExternalLink } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store'
import { ROUTE_NAMES } from '../router'

const store = useCoursesStore()
const { enrolledCourses } = storeToRefs(store)

const detailedEnrolled = computed(() => {
  return enrolledCourses.value
    .map((item) => {
      const course = store.getCourseById(item.courseId)
      if (!course) return null
      return {
        course,
        completedModuleIds: item.completedModuleIds,
        progress: store.getCourseProgress(item.courseId)
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Мої записані курси ({{ detailedEnrolled.length }})</h2>

    <div v-if="detailedEnrolled.length === 0" class="alert">
      <span>Ви ще не записалися на жоден курс. Перейдіть до каталогу, щоб обрати навчання.</span>
      <RouterLink :to="{ name: ROUTE_NAMES.CATALOG }" class="btn btn-sm btn-primary">
        До каталогу
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="entry in detailedEnrolled"
        :key="entry.course.id"
        class="card bg-base-100 shadow-sm border border-base-300"
      >
        <div class="card-body">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 class="card-title text-lg">{{ entry.course.title }}</h3>
              <p class="text-xs text-base-content/70">Викладач: {{ entry.course.instructor }}</p>
            </div>
            <RouterLink
              :to="{ name: ROUTE_NAMES.COURSE_DETAILS, params: { id: entry.course.id } }"
              class="btn btn-xs btn-outline gap-1"
            >
              Сторінка курсу
              <ExternalLink class="w-3 h-3" />
            </RouterLink>
          </div>

          <div class="my-3">
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span>Прогрес проходження</span>
              <span>{{ entry.progress }}%</span>
            </div>
            <progress
              class="progress progress-primary w-full"
              :value="entry.progress"
              max="100"
            ></progress>
          </div>

          <div class="space-y-1.5">
            <div class="text-xs font-semibold text-base-content/70">
              Відмітьте пройдені модулі:
            </div>
            <button
              v-for="mod in entry.course.modules"
              :key="mod.id"
              type="button"
              class="w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm hover:bg-base-200 transition-colors"
              @click="store.toggleModuleCompletion(entry.course.id, mod.id)"
            >
              <CheckSquare
                v-if="entry.completedModuleIds.includes(mod.id)"
                class="w-4 h-4 text-success shrink-0"
              />
              <Square v-else class="w-4 h-4 opacity-50 shrink-0" />
              <span :class="{ 'line-through opacity-60': entry.completedModuleIds.includes(mod.id) }">
                Модуль {{ mod.id }}. {{ mod.title }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>