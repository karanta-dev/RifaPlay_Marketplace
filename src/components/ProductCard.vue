<template>
  <div
    class="bg-white rounded-2xl shadow-lg p-3 sm:p-6 flex flex-col items-center border border-gray-200 transition-transform relative cursor-pointer"
    :class="{
      'bg-gray-300 pointer-events-none': isSoldOut,
      'hover:shadow-2xl hover:scale-105': !isSoldOut
    }"
    @click="$emit('view-details')"
  >
    <span
      v-if="isHot"
      class="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase z-10 animate-bounce"
    >
      ¡Caliente!
    </span>

    <img :src="image" alt="Premio" class="w-full h-32 sm:h-56 object-cover mb-2 rounded-xl border" />
    <h3 class="font-bold text-sm sm:text-lg text-gray-800 mb-1 text-center">{{ title }}</h3>
    <p class="text-gray-600 text-xs sm:text-sm mb-1 text-center">{{ description }}</p>

    <div class="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
      <p v-if="timeLeft.total > 0">
        ⏱️ Termina en: {{ timeLeft.days }}d {{ timeLeft.hours }}h {{ timeLeft.minutes }}m {{ timeLeft.seconds }}s
      </p>
      <p v-else class="text-red-500 font-bold">🎉 ¡Sorteado!</p>
    </div>

    <div class="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-1">
      <div class="bg-blue-800 h-2 sm:h-3 rounded-full" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="text-xs text-gray-500 mb-2 text-center">{{ progress }}% vendido</p>

    <button
      class="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full w-full font-bold text-xs sm:text-base shadow border-4 mt-2"
      :class="{
        'bg-green-600 text-white': isSoldOut,
        'bg-blue-800 text-white hover:bg-blue-500': !isSoldOut
      }"
      @click.stop="$emit('participar')"
      :disabled="isSoldOut"
    >
      {{ isSoldOut ? '¡VENDIDO!' : 'PARTICIPAR' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  image: String,
  title: String,
  description: String,
  progress: Number,
  drawDate: String // Nueva propiedad
})

// Lógica de "Hot"
const isHot = computed(() => props.progress! > 75 && props.progress! < 100)
// Lógica de "Vendido"
const isSoldOut = computed(() => props.progress! === 100)

const now = ref(Date.now())
let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const timeLeft = computed(() => {
  const diff = new Date(props.drawDate!).getTime() - now.value
  if (diff < 0) return { total: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { total: diff, days, hours, minutes, seconds }
})
</script>

<style scoped>
/* Agrega esta animación en el <style> de ProductCard.vue */
@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%) scale(1.1);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>