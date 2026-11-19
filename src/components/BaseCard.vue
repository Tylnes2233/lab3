<template>
  <div class="card bg-base-100 shadow-md border border-base-300 hover:shadow-xl transition-shadow">
    <div class="card-body">
      <div v-if="$slots.header" class="mb-2">
        <slot name="header"></slot>
      </div>

      <slot></slot>

      <div v-if="$slots.footer" class="card-actions justify-end mt-4 pt-3 border-t border-base-200">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>