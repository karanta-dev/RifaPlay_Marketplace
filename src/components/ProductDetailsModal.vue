<template>
  <div
    v-if="open && product"
    class="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm transition-all duration-300 p-4"
    @click.self="close"
  >
    <div class="bg-gradient-to-br from-blue-900 to-black rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-purple-400/30 max-h-[90vh] overflow-y-auto">
      <!-- Efectos de brillo -->
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/10 rounded-full blur-xl"></div>
      
      <!-- Botón cerrar -->
      <button
        class="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-sm"
        @click="close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Contenido del modal -->
      <div class="p-6 relative z-10">
        <!-- Galería de imágenes -->
        <div class="mb-6">
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
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold relative z-10 border-2 border-white/20"
            >
              {{ riferoInitial }}
            </div>
          </div>
          <div class="flex-1">
            <span class="text-sm text-cyan-300 group-hover:text-cyan-200 transition-colors font-medium">
              Organizado por: {{ riferoName }}
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

        <!-- SECCIÓN DE PREMIOS -->
        <div class="mb-6" v-if="prizes.length > 0">
          <h3 class="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <i class="fas fa-trophy"></i>
            Premios del Sorteo
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(prize) in prizes"
              :key="prize.uuid"
              class="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-4 rounded-xl border border-purple-400/30 backdrop-blur-sm"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {{ prize.prize_order }}
                  </div>
                  <h4 class="text-white font-semibold text-lg">{{ prize.name }}</h4>
                </div>
                <div class="text-yellow-400 font-bold text-lg">
                  ${{ prize.prize_amount.toLocaleString() }}
                </div>
              </div>
              
              <p class="text-gray-300 text-sm mb-2" v-if="prize.description">
                {{ prize.description }}
              </p>
              
              <p class="text-gray-400 text-xs" v-if="prize.specifications">
                {{ prize.specifications }}
              </p>
            </div>
          </div>
        </div>

        <!-- Información de tickets -->
        <div class="space-y-4 mb-6">
          <!-- Precio del ticket -->
          <div class="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-yellow-500/30">
            <span class="text-white/80 font-medium">Precio por ticket:</span>
            <span class="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ${{ (product.ticketPrice || 0).toFixed(2) }}
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
              <span>{{ (product.ticketsVendidos || 0).toLocaleString() }} vendidos</span>
              <span>{{ (product.ticketsMax || 0).toLocaleString() }} total</span>
            </div>
          </div>
        </div>

        <!-- Botón comprar -->
        <button
          class="relative overflow-hidden group bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] w-full"
          @click="handleBuy"
          :disabled="loadingPrizes"
        >
          <span class="relative z-10 flex items-center justify-center gap-3 text-lg">
            <i class="fas fa-ticket-alt" v-if="!loadingPrizes"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ loadingPrizes ? 'CARGANDO...' : 'COMPRAR TICKET' }}
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
import { computed, ref, watch } from 'vue'
// import { useTicketStore } from '@/stores/useTicketStore'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'
import { PrizeService, type Prize } from '@/services/RaffleService'

const props = defineProps<{ open: boolean; product: any | null }>()
const emit = defineEmits(['close', 'buy'])

// const ticketStore = useTicketStore()
const userStore = useUserStore()
const router = useRouter()

// Estado para los premios
const prizes = ref<Prize[]>([])
const loadingPrizes = ref(false)

// 🎯 Estado para el ID del creador (lo obtenemos de los premios)
const riferoId = ref<string | null>(null)

// 🎯 Computed para el nombre del rifero
const riferoName = computed(() => {
  return props.product?.rifero || 'Rifero'
})

// 🎯 Computed para la inicial del rifero
const riferoInitial = computed(() => {
  return riferoName.value.charAt(0).toUpperCase()
})

const progress = computed(() => {
  if (!props.product) return 0
  
  const vendidos = props.product.ticketsVendidos || 0
  const max = props.product.ticketsMax || 1
  
  if (max === 0) return 0
  
  return Math.round((vendidos / max) * 100)
})

// Función para cargar los premios del sorteo Y obtener el created_by_id
const loadPrizes = async () => {
  if (!props.product?.uuid) return
  
  loadingPrizes.value = true
  try {
    console.log('🎯 Cargando premios para el sorteo:', props.product.uuid)
    prizes.value = await PrizeService.getRafflePrizes(props.product.uuid)
    console.log('✅ Premios cargados:', prizes.value)
    
    // 🎯 OBTENER EL created_by_id DEL PRIMER PREMIO (con optional chaining)
    if (prizes.value.length > 0 && prizes.value[0]?.created_by_id) {
      riferoId.value = prizes.value[0].created_by_id
      console.log('🎯 ID del rifero encontrado:', riferoId.value)
    } else {
      console.warn('⚠️ No se encontró created_by_id en los premios')
      // Fallback: buscar por nombre en el store (solo para datos mock)
      const userFromStore = userStore.getUserByName(props.product.rifero)
      riferoId.value = userFromStore?.id || null
    }
  } catch (error) {
    console.error('❌ Error al cargar premios:', error)
    prizes.value = []
  } finally {
    loadingPrizes.value = false
  }
}
// Watch para cargar premios cuando el modal se abre
watch(() => props.open, (isOpen) => {
  if (isOpen && props.product) {
    loadPrizes()
  } else {
    // Resetear premios y ID cuando se cierra el modal
    prizes.value = []
    riferoId.value = null
  }
})

const close = () => {
  emit('close')
}

function handleBuy() {
  emit('buy', props.product)
}

function goToRiferoProfile() {
  if (riferoId.value) {
    console.log('🎯 Navegando al perfil del rifero:', riferoId.value)
    router.push({ 
      name: 'user-profile', 
      params: { id: riferoId.value } 
    })
    close()
  } else {
    console.error('❌ No se pudo encontrar el ID del rifero')
    console.log('🔍 Información disponible:', {
      product: props.product,
      prizes: prizes.value,
      riferoId: riferoId.value
    })
    // Opcional: mostrar mensaje al usuario
    alert('No se puede acceder al perfil del rifero en este momento.')
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

/* Estilos para el scroll del modal */
.max-h-\[90vh\] {
  max-height: 90vh;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>