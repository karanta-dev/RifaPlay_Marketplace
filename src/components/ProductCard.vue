<template>
  <div
    class="relative bg-gradient-to-r from-[#1a1f35] via-[#0f172a] to-[#1a1f35] rounded-2xl p-5 border border-gray-700/50 shadow-lg hover:shadow-yellow-500/10 transition transform hover:scale-105 overflow-hidden group cursor-pointer"
    :class="{ 'opacity-60 pointer-events-none': isSoldOut }"
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
    <img
      :src="image"
      alt="Premio"
      class="w-full h-40 sm:h-56 object-cover rounded-xl border border-gray-600 shadow-md mb-4 relative z-5"
    />

    <!-- Título y descripción -->
    <h3 class="font-bold text-lg text-white drop-shadow text-center mb-1 line-clamp-2">
      {{ title }}
    </h3>
    <p class="text-gray-400 text-sm text-center mb-3 line-clamp-2">
      {{ description }}
    </p>

    <!-- Tiempo restante -->
    <div class="text-center text-sm font-semibold text-gray-300 mb-3">
      <p v-if="timeLeft.total > 0">
        ⏱️ Termina en:
        <span class="font-mono text-yellow-300 drop-shadow">
          {{ timeLeft.days }}d {{ timeLeft.hours }}h {{ timeLeft.minutes }}m {{ timeLeft.seconds }}s
        </span>
      </p>
      <p v-else class="text-red-400 font-bold drop-shadow">🎉 ¡Sorteado!</p>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 mb-2 overflow-hidden">
      <div
        class="bg-yellow-400 h-2 sm:h-3 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.6)] transition-all duration-500"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <p class="text-xs text-gray-400 text-center mb-4">{{ progress }}% vendido</p>

    <!-- Botón participar -->
    <button
      class="px-4 sm:px-6 py-2 rounded-full w-full font-bold text-sm sm:text-base shadow-md transition-colors relative z-10"
      :class="{
        'bg-green-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]': isSoldOut,
        'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.6)]': !isSoldOut
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
const isHot = computed(() => props.progress! > 70 && props.progress! < 100)
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