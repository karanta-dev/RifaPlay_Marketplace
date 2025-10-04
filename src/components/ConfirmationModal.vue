<template>
  <div 
    v-if="props.open" 
    class="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 transition-all duration-300 p-4"
    @click.self="close"
  >
    <div class="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center relative border border-purple-400/30 overflow-hidden">
      <!-- Efectos de brillo -->
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-green-400/20 rounded-full blur-xl"></div>
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl"></div>
      
      <!-- Icono de éxito animado -->
      <div class="relative z-10 mb-6">
        <div class="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>

      <!-- Título principal -->
      <h2 class="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4 relative z-10">
        ¡Pago Exitoso!
      </h2>

      <!-- Mensaje de agradecimiento -->
      <div class="bg-black/30 rounded-xl p-4 mb-6 border border-white/10 relative z-10">
        <p class="text-lg text-white mb-2">
          Gracias por tu compra, 
          <span class="font-bold text-cyan-300">
            {{ ticketStore.formData?.nombre ?? 'Usuario' }}
          </span>
        </p>
        <p class="text-cyan-200 text-sm">
          Tu participación ha sido registrada exitosamente
        </p>
      </div>

      <!-- Sección de tickets -->
      <div class="relative z-10">
        <div class="sticky top-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-xl p-3 mb-2 z-20">
          <h3 class="text-lg font-bold text-white flex items-center justify-center gap-2">
            <span>🎟️</span>
            Tickets Asignados
            <span>🎟️</span>
          </h3>
        </div>
        
        <div class="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-b-xl p-6 mb-6 max-h-48 overflow-y-auto backdrop-blur-sm">
          <!-- Múltiples tickets -->
          <div v-if="ticketStore.lastAssignedTickets && ticketStore.lastAssignedTickets.length > 0" class="flex flex-wrap justify-center gap-3">
            <div 
              v-for="(num) in ticketStore.lastAssignedTickets" 
              :key="num" 
              class="relative group"
            >
              <div class="px-4 py-3 bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg border-2 border-yellow-400/30 transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                <p class="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {{ num }}
                </p>
              </div>
              <!-- Efecto de brillo en hover -->
            </div>
          </div>

          <!-- Ticket único -->
          <div v-else class="flex justify-center">
            <div class="relative group">
              <div class="px-8 py-6 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl border-2 border-yellow-400/30 transform group-hover:scale-105 transition-all duration-300">
                <p class="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {{ ticketStore.ticketNumber ?? '—' }}
                </p>
              </div>
              <!-- Efecto de brillo en hover -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje de suerte -->
      <div class="bg-black/40 rounded-xl p-4 mb-6 border border-green-500/30 relative z-10">
        <p class="text-xl font-bold text-white flex items-center justify-center gap-3">
          <span class="text-2xl">🍀</span>
          ¡Mucha Suerte!
          <span class="text-2xl">⭐</span>
        </p>
        <p class="text-cyan-200 text-sm mt-2">
          Te deseamos lo mejor en el sorteo
        </p>
      </div>

      <!-- Botón cerrar -->
      <button 
        @click="close" 
        class="relative overflow-hidden group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 w-full"
      >
        <span class="relative z-10 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Continuar
        </span>
        
        <!-- Efecto de brillo en hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>

      <!-- Elementos decorativos flotantes -->
      <div class="absolute top-4 left-4 text-2xl opacity-30">🎯</div>
      <div class="absolute top-4 right-4 text-2xl opacity-30">🏆</div>
      <div class="absolute bottom-4 left-4 text-2xl opacity-30">💫</div>
      <div class="absolute bottom-4 right-4 text-2xl opacity-30">🚀</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicketStore } from '@/stores/useTicketStore'

const ticketStore = useTicketStore()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const close = () => {
  ticketStore.reset()
  emit('close')
}
</script>

<style scoped>
/* Animación personalizada para el scroll */
.bg-gradient-to-br::-webkit-scrollbar {
  width: 6px;
}

.bg-gradient-to-br::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.bg-gradient-to-br::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #f59e0b, #f97316);
  border-radius: 10px;
}

.bg-gradient-to-br::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #eab308, #ea580c);
}

/* Animación de entrada para el modal */
.fixed {
  animation: modalSuccess 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSuccess {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Efecto de confeti virtual */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: float 2s ease-in-out infinite;
}
</style>