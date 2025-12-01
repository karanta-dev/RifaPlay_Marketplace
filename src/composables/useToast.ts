// src/composables/useToast.ts
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
  const showToast = (message: string, type: Toast['type'] = 'info', duration: number = 4000) => {
    const id = idCounter++
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}