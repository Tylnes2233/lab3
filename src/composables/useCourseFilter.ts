import { ref, computed, type Ref } from 'vue'
import type { Course, CourseLevel } from '../types/course.ts'

export function useCourseFilter(courses: Ref<Course[]>) {
  const selectedLevel = ref<'All' | CourseLevel>('All')
  const selectedTag = ref<string>('All')

  const levels: ('All' | CourseLevel)[] = ['All', 'Початковий', 'Середній', 'Просунутий']

  const filteredCourses = computed<Course[]>(() => {
    return courses.value.filter((course) => {
      const matchesLevel =
        selectedLevel.value === 'All' || course.level === selectedLevel.value
      const matchesTag =
        selectedTag.value === 'All' || course.tags.includes(selectedTag.value)
      return matchesLevel && matchesTag
    })
  })

  function resetFilters() {
    selectedLevel.value = 'All'
    selectedTag.value = 'All'
  }

  return {
    selectedLevel,
    selectedTag,
    levels,
    filteredCourses,
    resetFilters
  }
}