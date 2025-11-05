<!-- src/components/ToastContainer.vue -->
<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="p-4 rounded-lg shadow-lg border-l-4 animate-fade-in"
      :class="getToastClasses(toast.type)"
      @click="removeToast(toast.id)"
    >
      <div class="flex items-center">
        <span class="text-lg mr-2">{{ getToastIcon(toast.type) }}</span>
        <p class="text-sm font-medium">{{ toast.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getToastClasses = (type: string) => {
  const classes = {
    success: 'bg-green-50 text-green-800 border-green-400',
    error: 'bg-red-50 text-red-800 border-red-400',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-400',
    info: 'bg-blue-50 text-blue-800 border-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getToastIcon = (type: string) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>