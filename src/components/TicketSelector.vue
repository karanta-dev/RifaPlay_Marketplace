<template>
  <div class="p-3 border border-gray-300 rounded-xl bg-gray-50 max-w-full">
    <h3 class="text-lg font-semibold mb-3 text-gray-800">
      Selecciona tus tickets ({{ selectedTickets.length }} elegidos)
    </h3>
    
    <p v-if="availableTickets.length === 0" class="text-center text-red-500 font-bold p-4">
      ¡Vaya! Todos los tickets disponibles en esta rifa se han agotado.
    </p>

    <div v-if="availableTickets.length > 0" class="flex justify-between items-center mb-3">
      <!-- Información de Paginación más clara -->
      <div class="text-sm font-medium text-gray-700">
        Página **{{ currentPage }}** de **{{ totalPages }}** ({{ availableTickets.length }} tickets totales)
      </div>
      
      <!-- Botones de Paginación más pequeños y funcionales -->
      <div class="flex items-center space-x-1">
        <button 
          @click="prevPage"
          type="button" 
          :disabled="currentPage === 1" 
          class="p-1.5 bg-blue-600 text-white rounded-full disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md"
          title="Página anterior"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          @click="nextPage"
          type="button"
          :disabled="currentPage === totalPages" 
          class="p-1.5 bg-blue-600 text-white rounded-full disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md"
          title="Página siguiente"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>

    <!-- Grilla de Tickets más densa y con menor altura (max-h-[180px]) -->
    <div 
      v-if="availableTickets.length > 0"
      class="grid grid-cols-6 sm:grid-cols-12 gap-1 p-2 border-2 border-blue-200 rounded-xl bg-white max-h-[180px] overflow-y-auto"
    >
      <div 
        v-for="ticket in paginatedTickets" 
        :key="ticket" 
        @click="toggleTicket(ticket)"
        class="text-xs font-mono p-1 rounded-lg text-center cursor-pointer transition-all duration-150 border select-none"
        :class="{
          'bg-green-500 text-white border-green-700 font-bold transform scale-105': isSelected(ticket),
          'bg-white text-gray-700 hover:bg-blue-100 border-gray-200': !isSelected(ticket),
          // Se aplica opacidad si se alcanzó el máximo y el ticket NO está seleccionado
          'opacity-50 cursor-not-allowed': !isSelected(ticket) && selectedTickets.length >= maxTickets
        }"
        :title="`Ticket #${ticket}`"
      >
        {{ ticket }}
      </div>
    </div>
    
    <p v-if="selectedTickets.length === maxTickets && maxTickets > 0" class="text-xs text-center text-red-500 font-semibold mt-2">
      Has alcanzado el límite de tickets disponibles a la venta (**{{ maxTickets }}**).
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

const props = defineProps<{
  product: any | null // El producto seleccionado
  maxTickets: number // Máximo de tickets que el usuario puede comprar (Disponibles en la rifa)
}>()

const emit = defineEmits(['update:selected'])

const ticketStore = useTicketStore()

// 1. Obtener todos los tickets disponibles para el producto
const availableTickets = computed<number[]>(() => {
  if (!props.product) return []
  // Utilizamos el nuevo getter del store
  return ticketStore.availableTicketsForProduct(props.product.title)
})

// 2. Lógica de Paginación
// Mantengo 50 por página, pero con la grilla más densa, se verán más compactos.
const TICKETS_PER_PAGE = 50
const currentPage = ref(1)

// Cálculo del número total de páginas
const totalPages = computed(() => {
    const total = availableTickets.value.length
    if (total === 0) return 1 // Evitar 0 páginas si no hay tickets
    return Math.ceil(total / TICKETS_PER_PAGE)
})

// Tickets a mostrar en la página actual
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * TICKETS_PER_PAGE
  const end = start + TICKETS_PER_PAGE
  return availableTickets.value.slice(start, end)
})

// Función para ir a la página anterior
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Función para ir a la página siguiente
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 3. Lógica de Selección
const selectedTickets = ref<number[]>([])

const isSelected = (ticket: number) => selectedTickets.value.includes(ticket)

const toggleTicket = (ticket: number) => {
  const index = selectedTickets.value.indexOf(ticket)
  
  if (index > -1) {
    // Deseleccionar
    selectedTickets.value.splice(index, 1)
  } else {
    // Seleccionar, si no excede el máximo permitido
    if (selectedTickets.value.length < props.maxTickets) {
      selectedTickets.value.push(ticket)
    } else {
      // Bloquear la selección si ya se compró la cantidad máxima disponible
      return
    }
  }

  // Notificar al componente padre de los cambios
  emit('update:selected', selectedTickets.value)
}

// 4. Resetear la selección y la página cuando el producto cambia o la disponibilidad cambia
watch(availableTickets, () => {
    // Asegura que la página actual no exceda el nuevo total de páginas
    if (currentPage.value > totalPages.value) {
      // Usar Math.max para evitar números negativos si totalPages es 0
      currentPage.value = Math.max(1, totalPages.value)
    }
    // Si la lista de tickets cambia (ej. al cambiar de producto), reseteamos
    currentPage.value = 1
    selectedTickets.value = []
    emit('update:selected', selectedTickets.value)
}, { immediate: true })

// 5. Ajustar la página actual si la lista paginada se vuelve vacía (ej. si se venden todos los tickets en la página)
watch(paginatedTickets, (newVal) => {
    // Si la lista de tickets en la página actual está vacía y no es la primera página, retrocede
    if (newVal.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
})
</script>
