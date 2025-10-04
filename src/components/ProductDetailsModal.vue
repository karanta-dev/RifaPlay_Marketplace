<template>
  <div
    v-if="open && product"
    class="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm transition-all duration-300 p-4"
    @click.self="close"
  >
    <div class="bg-gradient-to-br from-blue-900 to-black rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative border border-purple-400/30">
      <!-- Efectos de brillo -->
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/10 rounded-full blur-xl"></div>
      
      <!-- Botón cerrar -->
      <button
        class="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-sm"
        @click="emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Galería de imágenes -->
      <div class="relative p-6 pb-4">
        <div class="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/30 pb-4">
          <div
            v-for="(img, i) in product.images"
            :key="i"
            class="relative flex-shrink-0"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-50"></div>
            <img
              :src="img"
              class="h-52 w-auto rounded-lg shadow-lg relative z-10 border-2 border-white/20"
            />
          </div>
        </div>
      </div>

      <!-- Detalles del producto -->
      <div class="p-6 pt-0 relative z-10">
        <!-- Título -->
        <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-3">
          {{ product.title }}
        </h2>

        <!-- Información del rifero -->
        <div
          class="flex items-center space-x-3 cursor-pointer group mb-4 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-300 border border-white/10"
          @click="goToRiferoProfile"
        >
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm opacity-60"></div>
            <img
              v-if="riferoUser?.avatar"
              :src="riferoUser.avatar"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover relative z-10 border-2 border-white/20"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold relative z-10 border-2 border-white/20"
            >
              {{ product.rifero.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="flex-1">
            <span class="text-sm text-cyan-300 group-hover:text-cyan-200 transition-colors font-medium">
              Organizado por: {{ product.rifero }}
            </span>
            <p class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              Ver perfil del rifero
            </p>
          </div>
          <svg class="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>

        <!-- Descripción -->
        <p class="text-gray-300 mb-6 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/10">
          {{ product.description }}
        </p>

        <!-- Información de tickets -->
        <div class="space-y-4 mb-6">
          <!-- Precio del ticket -->
          <div class="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-yellow-500/30">
            <span class="text-white/80 font-medium">Precio por ticket:</span>
            <span class="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ${{ product.ticketPrice.toFixed(2) }}
            </span>
          </div>

          <!-- Progreso de ventas -->
          <div class="bg-black/30 p-4 rounded-xl border border-white/10">
            <div class="flex justify-between text-sm text-white/80 mb-2">
              <span>Progreso de ventas</span>
              <span class="font-semibold text-cyan-300">{{ progress }}% completado</span>
            </div>
            
            <!-- Barra de progreso -->
            <div class="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div
                class="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000 ease-out shadow-lg"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            
            <div class="flex justify-between text-xs text-gray-400">
              <span>{{ product.ticketsVendidos.toLocaleString() }} vendidos</span>
              <span>{{ product.ticketsMax.toLocaleString() }} total</span>
            </div>
          </div>
        </div>

        <!-- Botón comprar -->
        <button
          class="relative overflow-hidden group bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] w-full"
          @click="handleBuy"
        >
          <span class="relative z-10 flex items-center justify-center gap-3 text-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            COMPRAR TICKET
          </span>
          
          <!-- Efecto de brillo en hover -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>

        <!-- Texto informativo -->
        <p class="text-center text-gray-400 text-xs mt-4">
          ¡No pierdas esta oportunidad única de ganar!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'

const props = defineProps<{ open: boolean; product: any | null }>()
const emit = defineEmits(['close', 'buy'])

const ticketStore = useTicketStore()
const userStore = useUserStore()
const router = useRouter()

// 🧑‍💻 Buscar el usuario (rifero) por nombre
const riferoUser = computed(() =>
  props.product ? userStore.getUserByName(props.product.rifero) : null
)

const progress = computed(() =>
  props.product ? ticketStore.productProgress(props.product) : 0
)

const close = () => {
  emit('close')
}

function handleBuy() {
  emit('buy', props.product)
}

function goToRiferoProfile() {
  if (riferoUser.value) {
    router.push({ name: 'user-profile', params: { id: riferoUser.value.id } })
  }
}
</script>

<style scoped>
/* Scrollbar personalizado */
.scrollbar-thumb-purple-500::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a855f7, #ec4899);
  border-radius: 10px;
}

.scrollbar-track-purple-900\/30::-webkit-scrollbar-track {
  background: rgba(76, 29, 149, 0.3);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

/* Animación de entrada */
.fixed {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>