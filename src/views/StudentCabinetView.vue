<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BookOpen, UserCog } from 'lucide-vue-next'
import { useCoursesStore } from '../stores/courses.store'
import { ROUTE_NAMES } from '../router'

const store = useCoursesStore()
const { profile } = storeToRefs(store)
</script>

<template>
  <div class="space-y-6">
    <div class="card bg-base-100 shadow-sm border border-base-300">
      <div class="card-body flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="avatar">
            <div class="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img :src="profile.avatarUrl" :alt="profile.name" />
            </div>
          </div>
          <div>
            <h1 class="text-xl font-bold">{{ profile.name }}</h1>
            <p class="text-sm text-base-content/70">{{ profile.email }}</p>
          </div>
        </div>

        <div class="tabs tabs-boxed">
          <RouterLink
            :to="{ name: ROUTE_NAMES.STUDENT_COURSES }"
            class="tab gap-2"
            active-class="tab-active"
          >
            <BookOpen class="w-4 h-4" />
            Мої курси
          </RouterLink>
          <RouterLink
            :to="{ name: ROUTE_NAMES.STUDENT_PROFILE }"
            class="tab gap-2"
            active-class="tab-active"
          >
            <UserCog class="w-4 h-4" />
            Профіль
          </RouterLink>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>