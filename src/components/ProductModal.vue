<template>
  <div
    v-if="isOpen && product"
    class="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm transition-all duration-300"
    @click.self="closeModal"
  >
    <div class="bg-gradient-to-br from-blue-900 to-orange-800 rounded-2xl shadow-2xl p-8 text-center w-[90%] max-w-md relative overflow-hidden border border-purple-400/30">

              <!-- Botón cerrar -->
      <button
        class="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-sm"
        @click="closeModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Efecto de brillo -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-xl"></div>
      
      <!-- Icono de celebración -->
      <div class="relative z-10">
        <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-2xl">🎉</span>
        </div>
        
        <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-6">
          ¡Producto Seleccionado!
        </h2>
        
        <!-- Imagen del producto -->
        <div class="relative mx-auto w-44 h-44 mb-6">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl blur-md opacity-50"></div>
          <img 
            :src="product.images?.[0]" 
            :alt="product.title"
            class="w-full h-full object-cover rounded-xl relative z-10 border-2 border-white/20 shadow-lg"
          />
        </div>
        
        <!-- Información del producto -->
        <div class="space-y-3 mb-6 text-white">
          <h3 class="text-xl font-bold">{{ product.title }}</h3>
          <p class="text-gray-300 text-sm leading-relaxed">{{ product.description }}</p>
          
          <!-- Badge de precio -->
          <div class="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-yellow-500/30">
            <span class="text-yellow-400 font-bold">${{ product.ticketPrice }}</span>
            <span class="text-white/80 text-sm">por ticket</span>
          </div>
        </div>

        <!-- Botón participar -->
        <button
          @click="participar"
          class="relative overflow-hidden group bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-full"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            PARTICIPAR AHORA
          </span>
          
          <!-- Efecto de brillo en hover -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
        
        <!-- Texto pequeño -->
        <p class="text-white text-xs mt-4">
          ¡No pierdas esta oportunidad única!
        </p>
      </div>
    </div>

    <!-- Confetti -->
    <canvas ref="confettiCanvas" class="absolute inset-0 pointer-events-none"></canvas>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useTicketStore } from "@/stores/useTicketStore"
import confetti from "canvas-confetti"

const props = defineProps({
  isOpen: Boolean,
  category: String
})
const emits = defineEmits(["close", "participar"])

const store = useTicketStore()
const product = ref(null)
const confettiCanvas = ref(null)

watch(() => props.isOpen, (open) => {
  if (open && props.category) {
    const products = store.productsByCategory(props.category)
    product.value = products[Math.floor(Math.random() * products.length)]
    launchConfetti()
  }
})

function participar() {
  emits("participar", product.value)
}

function closeModal() {
  emits("close")
}


function launchConfetti() {
  const end = Date.now() + 2000
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
  
  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: colors
    })
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: colors
    })
    
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
</script>

<style scoped>
/* Animaciones suaves */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Transición de entrada para el modal */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>