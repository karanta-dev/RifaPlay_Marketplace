// src/composables/useBookingTimer.ts - VERSIÓN CORREGIDA
import { ref, computed, onUnmounted } from 'vue'

export function useBookingTimer(totalMinutes: number = 10, showToast?: (message: string, type: string, duration?: number) => void) {
  const timeLeft = ref(totalMinutes * 60)
  const isExpired = ref(false)
  const timer = ref<number | null>(null)
  const warningShown = ref(false)

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const startTimer = () => {
    resetTimer()
    isExpired.value = false
    warningShown.value = false
    
    timer.value = window.setInterval(() => {
      timeLeft.value--
      
      // Mostrar advertencia a 2 minutos (solo si showToast está disponible)
      if (timeLeft.value === 120 && !warningShown.value && showToast) {
        showToast('⚠️ Tienes 2 minutos para completar tu compra', 'warning', 5000);
        warningShown.value = true;
      }
      
      // Mostrar advertencia urgente a 30 segundos
      if (timeLeft.value === 30 && showToast) {
        showToast('🚨 ¡Solo 30 segundos! Completa tu compra ahora', 'error', 5000);
      }
      
      if (timeLeft.value <= 0) {
        clearTimer()
        isExpired.value = true
      }
    }, 1000)
  }

  const clearTimer = () => {
    if (timer.value !== null) {
      window.clearInterval(timer.value)
      timer.value = null
    }
  }

  const resetTimer = () => {
    clearTimer()
    timeLeft.value = totalMinutes * 60
    isExpired.value = false
    warningShown.value = false
  }

  onUnmounted(() => {
    clearTimer()
  })

  return {
    timeLeft,
    formattedTime,
    isExpired,
    startTimer,
    clearTimer,
    resetTimer
  }
}