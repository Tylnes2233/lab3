import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Course, EnrolledCourse, StudentProfile } from '../types/course'

const AUTH_KEY = 'student_auth_name'
const ENROLLED_KEY = 'student_enrolled_courses'
const PROFILE_KEY = 'student_profile_data'

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Vue 3 та Composition API з нуля до профі',
    instructor: 'Ігор Різванов',
    instructorBio: 'Senior Frontend Engineer, архітектор веб-застосунків та викладач курсу Vue 3.',
    durationHours: 36,
    level: 'Середній',
    studentsCount: 412,
    tags: ['Vue 3', 'TypeScript', 'Pinia'],
    description: 'Повний практичний курс зі створення сучасних SPA на Vue 3 з використанням Composition API, Pinia та строгої типізації.',
    modules: [
      { id: 1, title: 'Основи реактивності: ref, reactive та computed', topics: ['Virtual DOM', 'Реактивні примітиви', 'Кешування обчислень'] },
      { id: 2, title: 'Компонентна архітектура та комунікація', topics: ['defineProps', 'defineEmits', 'Слоти та Fallthrough Attributes'] },
      { id: 3, title: 'Глобальний стан з Pinia та Composables', topics: ['Setup Stores', 'storeToRefs', 'Тришарова архітектура'] },
      { id: 4, title: 'Маршрутизація з Vue Router 4', topics: ['Динамічні маршрути', 'Navigation Guards', 'Lazy Loading'] }
    ]
  },
  {
    id: 2,
    title: 'Tailwind CSS v4 та DaisyUI: сучасна стилізація',
    instructor: 'Олена Коваленко',
    instructorBio: 'UI/UX дизайнер та фронтенд-розробниця з 7-річним досвідом побудови дизайн-систем.',
    durationHours: 18,
    level: 'Початковий',
    studentsCount: 685,
    tags: ['Tailwind CSS', 'DaisyUI', 'UI/UX'],
    description: 'Навчіться швидко верстати адаптивні інтерфейси без дублювання CSS із підтримкою мультитемовості.',
    modules: [
      { id: 1, title: 'Філософія Utility-First та налаштування Vite', topics: ['Атомарні класи', 'Tree-shaking', 'Адаптивні брейкпоінти'] },
      { id: 2, title: 'Семантичні компоненти DaisyUI', topics: ['Картки, кнопки та форми', 'Семантична палітра кольорів'] },
      { id: 3, title: 'Мультитемовість та кастомні теми', topics: ['data-theme', 'Налаштування власних кольорів'] }
    ]
  },
  {
    id: 3,
    title: 'Архітектура масштабованих TypeScript-застосунків',
    instructor: 'Максим Бондаренко',
    instructorBio: 'Tech Lead у продуктових IT-компаніях, спеціаліст із типізації та оптимізації продуктивності.',
    durationHours: 48,
    level: 'Просунутий',
    studentsCount: 230,
    tags: ['TypeScript', 'Architecture', 'Vue 3'],
    description: 'Глибоке занурення у систему типів TypeScript, утилітарні типи, патерни проєктування та оптимізацію бандлу.',
    modules: [
      { id: 1, title: 'Просунуті Generics та умовні типи', topics: ['infer', 'Mapped Types', 'Type Guards'] },
      { id: 2, title: 'Типізація API та шару сервісів', topics: ['DTO моделі', 'Обробка помилок', 'Інтерсептори'] },
      { id: 3, title: 'Оптимізація рендерингу та FLIP-анімації', topics: ['Vue DevTools', 'Code Splitting', 'TransitionGroup'] }
    ]
  },
  {
    id: 4,
    title: 'Основи сучасного JavaScript (ES2026) та DOM',
    instructor: 'Дмитро Савченко',
    instructorBio: 'Fullstack-розробник та автор освітніх інтенсивів із веб-технологій.',
    durationHours: 24,
    level: 'Початковий',
    studentsCount: 920,
    tags: ['JavaScript', 'Async', 'DOM'],
    description: 'Фундаментальний курс із сучасного стандарту ECMAScript, асинхронності, Event Loop та роботи з браузерним API.',
    modules: [
      { id: 1, title: 'Замикання, контекст та прототипи', topics: ['Lexical Environment', 'this', 'Класи'] },
      { id: 2, title: 'Асинхронний JavaScript та Event Loop', topics: ['Promises', 'async/await', 'Fetch API'] },
      { id: 3, title: 'Робота з браузерними сховищами', topics: ['localStorage', 'sessionStorage', 'History API'] }
    ]
  }
]

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>(mockCourses)

  const currentUser = ref<string | null>(sessionStorage.getItem(AUTH_KEY))

  const loadEnrolled = (): EnrolledCourse[] => {
    try {
      const raw = sessionStorage.getItem(ENROLLED_KEY)
      return raw ? JSON.parse(raw) : [{ courseId: 1, completedModuleIds: [1, 2] }]
    } catch {
      return []
    }
  }

  const enrolledCourses = ref<EnrolledCourse[]>(loadEnrolled())

  const loadProfile = (): StudentProfile => {
    try {
      const raw = sessionStorage.getItem(PROFILE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      sessionStorage.removeItem(PROFILE_KEY)
    }
    return {
      name: currentUser.value || 'Студент',
      email: 'student@op.edu.ua',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    }
  }

  const profile = ref<StudentProfile>(loadProfile())

  const isAuthenticated = computed(() => Boolean(currentUser.value))

  const allTags = computed(() => {
    const set = new Set<string>()
    courses.value.forEach((c) => c.tags.forEach((t) => set.add(t)))
    return Array.from(set)
  })

  function login(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    currentUser.value = trimmed
    sessionStorage.setItem(AUTH_KEY, trimmed)
    if (!sessionStorage.getItem(PROFILE_KEY)) {
      profile.value.name = trimmed
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile.value))
    }
  }

  function logout() {
    currentUser.value = null
    sessionStorage.removeItem(AUTH_KEY)
  }

  function getCourseById(id: number): Course | undefined {
    return courses.value.find((c) => c.id === id)
  }

  function isEnrolled(courseId: number): boolean {
    return enrolledCourses.value.some((e) => e.courseId === courseId)
  }

  function enrollInCourse(courseId: number) {
    if (isEnrolled(courseId)) return
    const target = courses.value.find((c) => c.id === courseId)
    if (!target) return

    target.studentsCount += 1
    enrolledCourses.value.push({
      courseId,
      completedModuleIds: []
    })
    sessionStorage.setItem(ENROLLED_KEY, JSON.stringify(enrolledCourses.value))
  }

  function toggleModuleCompletion(courseId: number, moduleId: number) {
    const record = enrolledCourses.value.find((e) => e.courseId === courseId)
    if (!record) return

    if (record.completedModuleIds.includes(moduleId)) {
      record.completedModuleIds = record.completedModuleIds.filter((id) => id !== moduleId)
    } else {
      record.completedModuleIds.push(moduleId)
    }
    sessionStorage.setItem(ENROLLED_KEY, JSON.stringify(enrolledCourses.value))
  }

  function getCourseProgress(courseId: number): number {
    const course = getCourseById(courseId)
    const record = enrolledCourses.value.find((e) => e.courseId === courseId)
    if (!course || !record || course.modules.length === 0) return 0
    return Math.round((record.completedModuleIds.length / course.modules.length) * 100)
  }

  function updateProfile(updated: StudentProfile) {
    profile.value = { ...updated }
    if (updated.name.trim()) {
      currentUser.value = updated.name.trim()
      sessionStorage.setItem(AUTH_KEY, currentUser.value)
    }
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile.value))
  }

  return {
    courses,
    currentUser,
    enrolledCourses,
    profile,
    isAuthenticated,
    allTags,
    login,
    logout,
    getCourseById,
    isEnrolled,
    enrollInCourse,
    toggleModuleCompletion,
    getCourseProgress,
    updateProfile
  }
})