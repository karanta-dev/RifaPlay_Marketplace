<template>
<div
  class="relative bg-gradient-to-r from-[#1a1f35] via-[#0f172a] to-[#1a1f35] rounded-2xl p-1.5 border border-gray-700/50 shadow-lg hover:shadow-yellow-500/10 transition transform hover:scale-105 overflow-hidden group cursor-pointer
         flex flex-col justify-between h-full"
  :class="{ 'opacity-60 pointer-events-none': isSoldOut || isTimeUp }"
  @click="$emit('view-details')"
>
    <!-- Glow decorativo -->
    <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3),transparent)]"></div>

    <!-- HOT badge -->
    <span
      v-if="isHot"
      class="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase z-10 animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.7)]"
    >
      🔥 ¡Caliente!
    </span>

    <!-- Imagen -->
    <div class="flex-1 flex flex-col justify-start">
  <img
    :src="image"
    alt="Premio"
    class="w-full h-40 sm:h-56 object-cover rounded-xl border border-gray-600 shadow-md mb-4 relative z-5"
  />

  <h3 class="font-bold text-lg text-white drop-shadow text-center mb-1 line-clamp-2">
    {{ title }}
  </h3>
  <p class="text-gray-400 text-sm text-center mb-3 line-clamp-2">
    {{ description }}
  </p>

  <!-- Barra de progreso con texto al final -->
  <div class="w-full bg-gray-700/50 rounded-full h-6 sm:h-7 mb-2 overflow-hidden relative">
    <div
      class="bg-gradient-to-br from-yellow-400 to-red-500 h-6 sm:h-7 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.6)] transition-all duration-500 relative"
      :style="{ width: progress + '%' }" 
    >
      <!-- Texto al final de la barra de progreso -->
      <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
        <span class="text-xs font-bold text-white drop-shadow-md whitespace-nowrap">
          {{ progress }}%
        </span>
      </div>
    </div>
    
    <!-- Texto fuera de la barra (en el área gris) cuando el progreso es bajo -->
    <div v-if="progress < 15" class="absolute right-2 top-1/2 transform -translate-y-1/2">
      <span class="text-xs font-bold text-gray-300 drop-shadow-md whitespace-nowrap">
        {{ progress }}%
      </span>
    </div>
  </div>
</div>

<!-- Contador actualizado y centrado -->
<div class="text-center mb-2">
  <div v-if="!isTimeUp" class="flex flex-col items-center bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-600/50 w-full max-w-xs mx-auto">
    <span class="text-xs text-gray-300 mb-1">Tiempo restante:</span>
    <div class="flex items-center justify-center gap-0 sm:gap-1 w-30">
      <!-- Días -->
      <div class="flex flex-col items-center flex-1">
        <span class="bg-gray-900 text-yellow-300 font-mono text-xs sm:text-sm px-1 py-0.5 rounded w-8 text-center">{{ timeLeft.days }}</span>
        <span class="text-[10px] sm:text-xs text-gray-400 mt-0.5">Días</span>
      </div>
      
      <span class="text-yellow-300 font-bold text-sm -mt-3">:</span>
      
      <!-- Horas -->
      <div class="flex flex-col items-center flex-1">
        <span class="bg-gray-900 text-yellow-300 font-mono text-xs sm:text-sm px-1 py-0.5 rounded w-8 text-center">{{ timeLeft.hours }}</span>
        <span class="text-[10px] sm:text-xs text-gray-400 mt-0.5">Horas</span>
      </div>
      
      <span class="text-yellow-300 font-bold text-sm -mt-3">:</span>
      
      <!-- Minutos -->
      <div class="flex flex-col items-center flex-1">
        <span class="bg-gray-900 text-yellow-300 font-mono text-xs sm:text-sm px-1 py-0.5 rounded w-8 text-center">{{ timeLeft.minutes }}</span>
        <span class="text-[10px] sm:text-xs text-gray-400 mt-0.5">Min</span>
      </div>
      
      <span class="text-yellow-300 font-bold text-sm -mt-3">:</span>
      
      <!-- Segundos -->
      <div class="flex flex-col items-center flex-1">
        <span class="bg-gray-900 text-yellow-300 font-mono text-xs sm:text-sm px-1 py-0.5 rounded w-8 text-center">{{ timeLeft.seconds }}</span>
        <span class="text-[10px] sm:text-xs text-gray-400 mt-0.5">Seg</span>
      </div>
    </div>
  </div>
  
  <div v-else class="flex flex-col items-center bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-600/50 w-full max-w-xs mx-auto">
    <span class="text-xs text-gray-300 mb-1">Estado:</span>
    <div class="flex items-center justify-center">
      <span class="text-green-400 font-bold text-sm drop-shadow">🎉 ¡SORTEADO!</span>
    </div>
  </div>
</div>

    <!-- Botón participar -->
    <button
      class="px-4 sm:px-6 py-2 rounded-full w-full font-bold text-sm sm:text-base shadow-md transition-colors relative z-10"
      :class="{
        'bg-green-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]': isSoldOut || isTimeUp,
        'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.6)]': !isSoldOut && !isTimeUp
      }"
      @click.stop="$emit('participar')"
      :disabled="isSoldOut || isTimeUp"
    >
      {{ isTimeUp ? '¡SORTEADO!' : (isSoldOut ? '¡VENDIDO!' : 'PARTICIPAR') }}
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
const isHot = computed(() => props.progress! > 70 && props.progress! < 100)
// Lógica de "Vendido"
const isSoldOut = computed(() => props.progress! === 100)
// Lógica de "Tiempo Agotado"
const isTimeUp = computed(() => timeLeft.value.total <= 0)

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
  if (diff < 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { 
    total: diff, 
    days: days.toString().padStart(2, '0'), 
    hours: hours.toString().padStart(2, '0'), 
    minutes: minutes.toString().padStart(2, '0'), 
    seconds: seconds.toString().padStart(2, '0') 
  }
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

.bg-green-600 {
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}
.bg-yellow-500 {
  box-shadow: 0 0 8px rgba(234, 179, 8, 0.6);
}
.bg-red-600 {
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
}
</style>