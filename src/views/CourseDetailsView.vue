<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeft, CheckCircle2, User, Clock, Users, Hash, BookMarked } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store'
import { ROUTE_NAMES } from '../router'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const { isAuthenticated } = storeToRefs(store)

const courseId = computed(() => Number(route.params.id))
const course = computed(() => store.getCourseById(courseId.value))

watch(
  course,
  (found) => {
    if (!found) {
      router.replace({
        name: ROUTE_NAMES.NOT_FOUND,
        params: { pathMatch: route.path.substring(1).split('/') }
      })
    }
  },
  { immediate: true }
)

const activeModuleId = computed<number | null>(() => {
  const hash = route.hash
  if (!hash || !hash.startsWith('#module-')) return null
  const num = Number(hash.replace('#module-', ''))
  return Number.isNaN(num) ? null : num
})

const alreadyEnrolled = computed(() => {
  if (!course.value) return false
  return store.isEnrolled(course.value.id)
})

const selectModuleHash = (moduleId: number) => {
  router.replace({
    name: ROUTE_NAMES.COURSE_DETAILS,
    params: { id: courseId.value },
    hash: `#module-${moduleId}`
  })
}

const handleEnroll = () => {
  if (!course.value) return
  if (!isAuthenticated.value) {
    router.push({
      name: ROUTE_NAMES.LOGIN,
      query: { redirect: route.fullPath }
    })
    return
  }
  store.enrollInCourse(course.value.id)
}
</script>

<template>
  <div v-if="course" class="space-y-6">
    <div>
      <RouterLink :to="{ name: ROUTE_NAMES.CATALOG }" class="btn btn-ghost btn-sm gap-1">
        <ArrowLeft class="w-4 h-4" />
        Назад до каталогу
      </RouterLink>
    </div>

    <div class="card bg-base-100 shadow-md border border-base-300">
      <div class="card-body">
        <div class="flex flex-col md:flex-row justify-between gap-4 items-start">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="badge badge-primary">{{ course.level }}</span>
              <span v-for="tag in course.tags" :key="tag" class="badge badge-outline">
                {{ tag }}
              </span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold">{{ course.title }}</h1>
            <p class="text-base-content/80">{{ course.description }}</p>
          </div>

          <div class="shrink-0 w-full md:w-auto">
            <button
              v-if="!alreadyEnrolled"
              class="btn btn-primary w-full md:w-auto gap-2"
              @click="handleEnroll"
            >
              <BookMarked class="w-4 h-4" />
              Записатись на курс
            </button>
            <div v-else class="alert alert-success py-2 px-4 text-sm flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5" />
              <span>Ви записані на цей курс</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
            <User class="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div class="font-bold">Викладач: {{ course.instructor }}</div>
              <div class="text-xs text-base-content/70 mt-1">{{ course.instructorBio }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <Clock class="w-5 h-5 text-secondary shrink-0" />
            <div>
              <div class="font-bold">Тривалість навчання</div>
              <div class="text-xs text-base-content/70">{{ course.durationHours }} академічних годин</div>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <Users class="w-5 h-5 text-accent shrink-0" />
            <div>
              <div class="font-bold">Активні слухачі</div>
              <div class="text-xs text-base-content/70">{{ course.studentsCount }} студентів на курсі</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex flex-wrap justify-between items-center gap-2">
        <h2 class="text-xl font-bold">Програма курсу (модулі)</h2>
        <span v-if="activeModuleId" class="badge badge-accent gap-1">
          <Hash class="w-3 h-3" />
          Активний модуль: #module-{{ activeModuleId }}
        </span>
      </div>

      <div class="space-y-3">
        <div
          v-for="mod in course.modules"
          :id="`module-${mod.id}`"
          :key="mod.id"
          class="card bg-base-100 border transition-all cursor-pointer"
          :class="
            activeModuleId === mod.id
              ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
              : 'border-base-300 hover:border-primary/50'
          "
          @click="selectModuleHash(mod.id)"
        >
          <div class="card-body p-4">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-base">
                Модуль {{ mod.id }}. {{ mod.title }}
              </h3>
              <a
                :href="`#module-${mod.id}`"
                class="badge badge-ghost gap-1"
                @click.prevent="selectModuleHash(mod.id)"
              >
                <Hash class="w-3 h-3" />
                module-{{ mod.id }}
              </a>
            </div>
            <ul class="list-disc list-inside text-sm text-base-content/75 mt-2 space-y-1">
              <li v-for="topic in mod.topics" :key="topic">{{ topic }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>