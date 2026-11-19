<script setup lang="ts">
import { Home, AlertTriangle } from 'lucide-vue-next'
import { ROUTE_NAMES } from '../router'
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <AlertTriangle class="w-16 h-16 text-warning mb-4" />
    <h1 class="text-6xl font-extrabold text-primary">404</h1>
    <h2 class="text-2xl font-bold mt-2">Сторінку не знайдено</h2>
    <p class="text-base-content/70 max-w-md mt-2 mb-6">
      Можливо, посилання застаріло, курс було видалено або ви ввели неправильну адресу сторінки.
    </p>
    <RouterLink :to="{ name: ROUTE_NAMES.CATALOG }" class="btn btn-primary gap-2">
      <Home class="w-4 h-4" />
      Повернутися до каталогу курсів
    </RouterLink>
  </div>
</template>