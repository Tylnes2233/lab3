<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from './router'
import AppNavbar from './components/AppNavbar.vue'

const route = useRoute()
const isNotFound = computed(() => route.name === ROUTE_NAMES.NOT_FOUND)
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content flex flex-col">
    <AppNavbar v-if="!isNotFound" />

    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
      <RouterView v-slot="{ Component }">
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-150"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-150"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="footer footer-center p-4 bg-base-100 text-base-content/60 border-t border-base-300 text-xs">
      <aside>
        <p>EduBoard SPA • Лабораторна робота №3 (Vue Router + Tailwind CSS + DaisyUI)</p>
      </aside>
    </footer>
  </div>
</template>