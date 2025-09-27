<template>
  <div class="p-3 border border-gray-300 rounded-xl bg-gray-50 max-w-full shadow-lg">
    <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center">
      <!-- Icono de ticket -->
      <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
      Selecciona tus tickets
      <span class="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-300">
        {{ selectedTickets.length }} elegidos
      </span>
    </h3>
    
    <p v-if="availableTickets.length === 0" class="text-center text-red-600 font-extrabold p-5 bg-red-100 border border-red-300 rounded-lg">
      <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.39 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      ¡Vaya! Todos los tickets disponibles en esta rifa se han **agotado**.
    </p>

    <div v-if="availableTickets.length > 0" class="flex flex-col sm:flex-row justify-between items-center mb-3 p-2 bg-white rounded-lg border border-gray-100 shadow-inner">
      <!-- Información de Paginación más clara -->
      <div class="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
        Página <span class="font-bold text-blue-600">{{ currentPage }}</span> de <span class="font-bold text-blue-600">{{ totalPages }}</span>
        ({{ availableTickets.length }} tickets disponibles)
      </div>
      
      <!-- Botones de Paginación más pequeños y funcionales -->
      <div class="flex items-center space-x-2">
        <button 
          @click="prevPage"
          type="button" 
          :disabled="currentPage === 1" 
          class="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md flex items-center"
          title="Página anterior"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          @click="nextPage"
          type="button"
          :disabled="currentPage === totalPages" 
          class="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md flex items-center"
          title="Página siguiente"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>

    <!-- Grilla de Tickets: max-h-[180px] para un scroll compacto -->
    <div 
      v-if="availableTickets.length > 0"
      class="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-15 lg:grid-cols-20 gap-1 p-2 border-2 border-blue-400 rounded-xl bg-white max-h-[180px] overflow-y-auto shadow-inner"
    >
      <div 
        v-for="ticket in paginatedTickets" 
        :key="ticket" 
        @click="toggleTicket(ticket)"
        class="text-xs font-mono p-1 rounded-md text-center cursor-pointer transition-all duration-150 border select-none leading-none"
        :class="{
          'bg-green-600 text-white border-green-800 font-semibold transform scale-105 shadow-md': isSelected(ticket),
          'bg-white text-gray-700 hover:bg-blue-100 border-gray-200': !isSelected(ticket),
          // Se aplica opacidad si se alcanzó el máximo y el ticket NO está seleccionado
          'opacity-50 cursor-not-allowed pointer-events-none': !isSelected(ticket) && selectedTickets.length >= maxTickets
        }"
        :title="`Ticket #${ticket}`"
      >
        {{ ticket }}
      </div>
    </div>
    
    <p v-if="selectedTickets.length === maxTickets && maxTickets > 0" class="text-sm text-center text-red-600 font-semibold mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-300">
      <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Has alcanzado el límite de tickets que puedes comprar (**{{ maxTickets }}**).
    </p>

    <p v-else-if="maxTickets > 0" class="text-xs text-center text-gray-500 mt-2">
      Puedes seleccionar hasta **{{ maxTickets - selectedTickets.length }}** tickets adicionales.
    </p>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, defineProps } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore' // Importamos el store

// Definición de Props
const props = defineProps<{
  product: { title: string } | null // El producto seleccionado (asumo que tiene al menos 'title')
  maxTickets: number // Máximo de tickets que el usuario puede comprar
}>()

// Definición de Emits
const emit = defineEmits(['update:selected'])

// Inicialización del Store
const ticketStore = useTicketStore()

// 1. Obtener todos los tickets DISPONIBLES para el producto
const availableTickets = computed<number[]>(() => {
  if (!props.product || !props.product.title) return []
  // Usamos el getter del store para obtener los números de ticket que NO están vendidos
  return ticketStore.availableTicketsForProduct(props.product.title)
})

// 2. Lógica de Paginación
const TICKETS_PER_PAGE = 100 // Aumento la densidad de la página (más tickets por página)
const currentPage = ref(1)

// Cálculo del número total de páginas
const totalPages = computed(() => {
    const total = availableTickets.value.length
    if (total === 0) return 1
    return Math.ceil(total / TICKETS_PER_PAGE)
})

// Tickets a mostrar en la página actual
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * TICKETS_PER_PAGE
  const end = start + TICKETS_PER_PAGE
  // Solo se pagina sobre los tickets disponibles (availableTickets)
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
      // (aunque la clase CSS ya lo maneja visualmente, esto es para la lógica)
      return
    }
  }

  // Notificar al componente padre de los tickets seleccionados
  emit('update:selected', selectedTickets.value)
}

// 4. Resetear la selección y la página cuando el producto cambia o la disponibilidad cambia
watch(availableTickets, (newAvailable) => {
    // 1. Resetear selección: Si un ticket seleccionado ya no está en la lista de disponibles (ej. fue vendido por otro usuario), deseleccionarlo.
    selectedTickets.value = selectedTickets.value.filter(ticket => newAvailable.includes(ticket));
    
    // 2. Ajustar la paginación
    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(1, totalPages.value)
    }
    
    // 3. Si el producto cambia (o la lista es drásticamente diferente), volver a la página 1
    // (Esto se maneja implícitamente porque availableTickets cambia al cambiar props.product)
    if (currentPage.value !== 1 && totalPages.value > 1) {
        currentPage.value = 1
    }

    emit('update:selected', selectedTickets.value)
}, { immediate: true })

// 5. Ajustar la página actual si la lista paginada se vuelve vacía
watch(paginatedTickets, (newVal) => {
    // Si la lista de tickets en la página actual está vacía y no es la primera página, retrocede
    if (newVal.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
})
</script>
