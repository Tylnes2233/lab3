<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Clock, Users, UserCheck, Tag, Filter, RotateCcw } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store.ts'
import { useCourseFilter } from '../composables/useCourseFilter.ts'
import { ROUTE_NAMES } from '../router/index.ts'
import BaseCard from '../components/BaseCard.vue'
import type { CourseLevel } from '../types/course.ts'

const store = useCoursesStore()
const { courses, allTags } = storeToRefs(store)

const {
  selectedLevel,
  selectedTag,
  levels,
  filteredCourses,
  resetFilters
} = useCourseFilter(courses)

const levelBadgeClass = (level: CourseLevel) => {
  if (level === 'Початковий') return 'badge-success'
  if (level === 'Середній') return 'badge-warning'
  return 'badge-error'
}
</script>

<template>
  <section class="space-y-6">
    <div class="hero bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="text-3xl font-bold">Дошка онлайн-курсів</h1>
          <p class="py-3 text-base-content/75">
            Обирайте сучасні практичні курси з фронтенд-розробки, відстежуйте прогрес навчання та опановуйте актуальні технології.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold flex items-center gap-1 mr-1">
          <Filter class="w-4 h-4 text-primary" />
          Рівень:
        </span>
        <button
          v-for="lvl in levels"
          :key="lvl"
          class="btn btn-xs sm:btn-sm"
          :class="selectedLevel === lvl ? 'btn-primary' : 'btn-ghost'"
          @click="selectedLevel = lvl"
        >
          {{ lvl === 'All' ? 'Усі рівні' : lvl }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold flex items-center gap-1 mr-1">
          <Tag class="w-4 h-4 text-secondary" />
          Технологія:
        </span>
        <select v-model="selectedTag" class="select select-bordered select-sm">
          <option value="All">Усі теги</option>
          <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>

        <button
          v-if="selectedLevel !== 'All' || selectedTag !== 'All'"
          class="btn btn-sm btn-ghost text-error"
          @click="resetFilters"
        >
          <RotateCcw class="w-4 h-4" />
          Скинути
        </button>
      </div>
    </div>

    <div v-if="filteredCourses.length === 0" class="alert alert-info">
      <span>За обраними критеріями курсів не знайдено. Спробуйте змінити фільтри.</span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard v-for="course in filteredCourses" :key="course.id">
        <template #header>
          <div class="flex justify-between items-start gap-2">
            <h2 class="card-title text-lg">{{ course.title }}</h2>
            <span class="badge shrink-0" :class="levelBadgeClass(course.level)">
              {{ course.level }}
            </span>
          </div>
        </template>

        <p class="text-sm text-base-content/80 line-clamp-2">{{ course.description }}</p>

        <div class="flex flex-wrap gap-3 text-xs text-base-content/70 mt-3">
          <span class="flex items-center gap-1">
            <UserCheck class="w-4 h-4 text-primary" />
            {{ course.instructor }}
          </span>
          <span class="flex items-center gap-1">
            <Clock class="w-4 h-4 text-secondary" />
            {{ course.durationHours }} год.
          </span>
          <span class="flex items-center gap-1">
            <Users class="w-4 h-4 text-accent" />
            {{ course.studentsCount }} студентів
          </span>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-3">
          <span v-for="tag in course.tags" :key="tag" class="badge badge-outline badge-sm">
            #{{ tag }}
          </span>
        </div>

        <template #footer>
          <RouterLink
            :to="{ name: ROUTE_NAMES.COURSE_DETAILS, params: { id: course.id } }"
            class="btn btn-primary btn-sm"
          >
            Детальніше про курс
          </RouterLink>
        </template>
      </BaseCard>
    </div>
  </section>
</template>