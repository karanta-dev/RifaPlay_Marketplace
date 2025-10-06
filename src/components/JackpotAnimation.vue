<template>
  <div 
    v-if="show" 
    class="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg z-[60] transition-all duration-500"
    @click.self="close"
  >
    <!-- Fondo de partículas -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="i in 30" 
        :key="i" 
        class="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
        :style="particleStyle(i)"
      ></div>
    </div>

    <!-- Contenedor principal del jackpot -->
    <div class="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 rounded-3xl shadow-2xl p-8 w-[95%] max-w-2xl relative border-2 border-yellow-400/50 overflow-hidden">
      
      <!-- Efectos de brillo -->
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-yellow-400/20 rounded-full blur-xl"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-xl"></div>
      
      <!-- Encabezado -->
      <div class="relative z-10 text-center mb-8">
        <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
          <span class="text-4xl">🎰</span>
        </div>
        <h2 class="text-4xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
          ¡JACKPOT!
        </h2>
        <p class="text-cyan-200 text-lg font-semibold">
          ¡Tickets agregados exitosamente!
        </p>
      </div>

      <!-- Información de la compra -->
      <div class="relative z-10 mb-6">
        <div class="bg-black/40 rounded-2xl p-4 border-2 border-green-400/30 backdrop-blur-sm">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-white/80 text-sm font-semibold mb-1">Tickets Previos</p>
              <div class="text-2xl font-black text-yellow-400">
                {{ formatNumber(initialTickets) }}
              </div>
            </div>
            <div class="flex items-center justify-center">
              <div class="text-3xl text-green-400 animate-bounce">+</div>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold mb-1">Nuevos Tickets</p>
              <div class="text-2xl font-black text-green-400">
                {{ purchasedTickets }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contador animado -->
      <div class="relative z-10 mb-8">
        <div class="bg-black/40 rounded-2xl p-6 border-2 border-yellow-400/30 backdrop-blur-sm">
          <div class="text-center mb-4">
            <p class="text-white/80 text-sm font-semibold mb-2">TOTAL DE TICKETS</p>
            <div class="text-5xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {{ formatNumber(animatedTotal) }}
            </div>
          </div>

          <!-- Barra de progreso animada -->
          <div class="mt-4">
            <div class="flex justify-between text-white/80 text-sm mb-2">
              <span>Incremento</span>
              <span>{{ Math.min(100, Math.round(animationProgress)) }}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                class="h-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
                :style="{ width: `${Math.min(100, animationProgress)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets asignados (si hay múltiples) -->
      <div v-if="showTicketsList" class="relative z-10 mb-6">
        <div class="bg-black/40 rounded-2xl p-4 border-2 border-blue-400/30 backdrop-blur-sm">
          <p class="text-white/80 text-sm font-semibold mb-2 text-center">Tickets Asignados</p>
          <div class="flex flex-wrap justify-center gap-2 max-h-20 overflow-y-auto">
            <div 
              v-for="(ticket, index) in ticketStore.lastAssignedTickets" 
              :key="index"
              class="px-3 py-1 bg-gradient-to-br from-white to-gray-100 rounded-lg border border-yellow-400/30"
            >
              <span class="text-sm font-bold text-blue-600">{{ ticket }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón continuar -->
      <button 
        @click="close" 
        class="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 w-full"
        :disabled="!animationComplete"
      >
        <span class="relative z-10 flex items-center justify-center gap-3 text-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ animationComplete ? '¡CONTINUAR!' : 'PROCESANDO...' }}
        </span>
        
        <!-- Efecto de brillo -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </button>

      <!-- Elementos decorativos -->
      <div class="absolute top-6 left-6 text-2xl opacity-40 animate-spin-slow">🎯</div>
      <div class="absolute top-6 right-6 text-2xl opacity-40 animate-bounce">⭐</div>
      <div class="absolute bottom-6 left-6 text-2xl opacity-40 animate-pulse">💰</div>
      <div class="absolute bottom-6 right-6 text-2xl opacity-40 animate-spin-slow">🎲</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

interface Props {
  show: boolean
  initialTickets: number
  purchasedTickets: number
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  initialTickets: 0,
  purchasedTickets: 0
})

const emit = defineEmits(['close'])

const ticketStore = useTicketStore()

const animatedTotal = ref(0)
const animationComplete = ref(false)
const animationProgress = ref(0)

const totalTickets = computed(() => props.initialTickets + props.purchasedTickets)
const showTicketsList = computed(() => ticketStore.lastAssignedTickets && ticketStore.lastAssignedTickets.length > 1)

// Formatear números con separadores de miles
const formatNumber = (num: number) => {
  return num.toLocaleString('es-ES')
}

// Estilos para partículas de fondo
const particleStyle = (index: number) => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const size = 2 + Math.random() * 4
  const duration = 3 + Math.random() * 4
  const delay = Math.random() * 2
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite`
  }
}

// Animación del contador
const startAnimation = () => {
  animatedTotal.value = props.initialTickets
  animationComplete.value = false
  animationProgress.value = 0
  
  const duration = 2000 // 2 segundos
  const steps = 60
  const increment = props.purchasedTickets / steps
  const stepTime = duration / steps
  
  let currentStep = 0
  
  const timer = setInterval(() => {
    currentStep++
    animatedTotal.value = props.initialTickets + Math.min(props.purchasedTickets, increment * currentStep)
    animationProgress.value = (currentStep / steps) * 100
    
    if (currentStep >= steps) {
      clearInterval(timer)
      animatedTotal.value = totalTickets.value
      animationProgress.value = 100
      animationComplete.value = true
    }
  }, stepTime)
}

const close = () => {
  if (animationComplete.value) {
    emit('close')
  }
}

// Iniciar animación cuando se muestra el modal
watch(() => props.show, (newVal) => {
  if (newVal) {
    startAnimation()
  }
})

// Iniciar inmediatamente si ya está visible
onMounted(() => {
  if (props.show) {
    startAnimation()
  }
})
</script>

<style scoped>
@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(1.1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-40px) translateX(-5px) scale(1.2);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-20px) translateX(-10px) scale(1.1);
    opacity: 0.6;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Animación de entrada para el modal */
.fixed {
  animation: jackpotEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes jackpotEnter {
  from {
    opacity: 0;
    transform: scale(0.7) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Efectos de texto brillante */
.text-glow {
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5),
               0 0 40px rgba(255, 215, 0, 0.3),
               0 0 60px rgba(255, 215, 0, 0.1);
}
</style>