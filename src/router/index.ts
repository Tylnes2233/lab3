import { createRouter, createWebHistory } from 'vue-router'
import { useCoursesStore } from '../stores/courses.store'

export const ROUTE_NAMES = {
  CATALOG: 'catalog',
  COURSE_DETAILS: 'course-details',
  LOGIN: 'login',
  STUDENT_LAYOUT: 'student-layout',
  STUDENT_COURSES: 'student-my-courses',
  STUDENT_PROFILE: 'student-profile',
  NOT_FOUND: 'not-found'
} as const

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.CATALOG,
      component: () => import('../views/CoursesCatalogView.vue')
    },
    {
      path: '/courses/:id',
      name: ROUTE_NAMES.COURSE_DETAILS,
      component: () => import('../views/CourseDetailsView.vue')
    },
    {
      path: '/login',
      name: ROUTE_NAMES.LOGIN,
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/student',
      name: ROUTE_NAMES.STUDENT_LAYOUT,
      component: () => import('../views/StudentCabinetView.vue'),
      meta: { requiresAuth: true },
      redirect: { name: ROUTE_NAMES.STUDENT_COURSES },
      children: [
        {
          path: 'my-courses',
          name: ROUTE_NAMES.STUDENT_COURSES,
          component: () => import('../views/StudentCoursesView.vue')
        },
        {
          path: 'profile',
          name: ROUTE_NAMES.STUDENT_PROFILE,
          component: () => import('../views/StudentProfileView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.NOT_FOUND,
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to) => {
  const store = useCoursesStore()

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return {
      name: ROUTE_NAMES.LOGIN,
      query: { redirect: to.fullPath }
    }
  }

  if (to.name === ROUTE_NAMES.LOGIN && store.isAuthenticated) {
    return { name: ROUTE_NAMES.STUDENT_COURSES }
  }

  return true
})

export default router