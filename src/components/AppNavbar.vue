<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { GraduationCap, LogIn, LogOut, User, BookOpen, Palette } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store'
import { ROUTE_NAMES } from '../router'

const router = useRouter()
const store = useCoursesStore()
const { isAuthenticated, currentUser } = storeToRefs(store)

const themes = ['light', 'dark', 'corporate', 'emerald']
const activeTheme = ref('light')

const switchTheme = (theme: string) => {
  activeTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
}

const handleLogout = () => {
  store.logout()
  router.push({ name: ROUTE_NAMES.CATALOG })
}
</script>

<template>
  <header class="navbar bg-base-100 shadow-md sticky top-0 z-40 px-4 md:px-8">
    <div class="flex-1 gap-2">
      <RouterLink
        :to="{ name: ROUTE_NAMES.CATALOG }"
        class="btn btn-ghost text-lg font-bold gap-2"
      >
        <GraduationCap class="w-6 h-6 text-primary" />
        <span>EduBoard</span>
      </RouterLink>
    </div>

    <nav class="flex-none flex items-center gap-2">
      <RouterLink
        :to="{ name: ROUTE_NAMES.CATALOG }"
        class="btn btn-sm btn-ghost"
        active-class="btn-active btn-primary text-primary-content"
      >
        <BookOpen class="w-4 h-4" />
        <span class="hidden sm:inline">Каталог курсів</span>
      </RouterLink>

      <RouterLink
        :to="{ name: ROUTE_NAMES.STUDENT_COURSES }"
        class="btn btn-sm btn-ghost"
        active-class="btn-active btn-primary text-primary-content"
      >
        <User class="w-4 h-4" />
        <span class="hidden sm:inline">Кабінет студента</span>
      </RouterLink>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-sm btn-ghost gap-1">
          <Palette class="w-4 h-4" />
          <span class="hidden md:inline capitalize">{{ activeTheme }}</span>
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-50 w-36 p-2 shadow border border-base-300">
          <li v-for="t in themes" :key="t">
            <button
              type="button"
              class="capitalize"
              :class="{ active: activeTheme === t }"
              @click="switchTheme(t)"
            >
              {{ t }}
            </button>
          </li>
        </ul>
      </div>

      <template v-if="isAuthenticated">
        <span class="badge badge-outline hidden lg:inline-flex">{{ currentUser }}</span>
        <button class="btn btn-sm btn-outline btn-error gap-1" @click="handleLogout">
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Вийти</span>
        </button>
      </template>
      <template v-else>
        <RouterLink
          :to="{ name: ROUTE_NAMES.LOGIN }"
          class="btn btn-sm btn-primary gap-1"
          active-class="btn-active"
        >
          <LogIn class="w-4 h-4" />
          <span>Увійти</span>
        </RouterLink>
      </template>
    </nav>
  </header>
</template>