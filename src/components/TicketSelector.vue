<template>
  <div class="p-3 border border-gray-300 rounded-xl bg-gray-50 max-w-full shadow-lg">
    <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center">
      <!-- Icono de ticket -->
      <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      Selecciona tus tickets
      <span
        class="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-300">
        {{ selectedTickets.length }} elegidos
      </span>
    </h3>

    <!-- 🔍 Barra de búsqueda -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar ticket por número..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>

    <p v-if="allTickets.length === 0" class="text-center text-red-600 font-extrabold p-5 bg-red-100 border border-red-300 rounded-lg">
      ¡Vaya! Todos los tickets disponibles en esta rifa se han <b>agotado</b>.
    </p>

    <div v-if="filteredTickets.length > 0" class="flex flex-col sm:flex-row justify-between items-center mb-3 p-2 bg-white rounded-lg border border-gray-100 shadow-inner">
      <!-- Información de Paginación más clara -->
      <div class="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
        Página <span class="font-bold text-blue-600">{{ currentPage }}</span> de <span class="font-bold text-blue-600">{{ totalPages }}</span>
        ({{ filteredTickets.length }} tickets encontrados)
      </div>
      
      <!-- Botones de Paginación -->
      <div class="flex items-center space-x-2">
        <button @click="prevPage" type="button" :disabled="currentPage === 1"
          class="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md flex items-center"
          title="Página anterior">
          ⬅
        </button>
        <button @click="nextPage" type="button" :disabled="currentPage === totalPages"
          class="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md flex items-center"
          title="Página siguiente">
          ➡
        </button>
      </div>
    </div>

    <!-- Grilla de Tickets -->
    <div v-if="filteredTickets.length > 0"
      class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 
             gap-1 p-1 border-2 border-blue-400 rounded-xl bg-white shadow-inner">
      <div v-for="ticket in paginatedTickets" :key="ticket.number"
        @click="!ticket.isSold && toggleTicket(ticket.number)"
        class="text-xs font-mono p-1 rounded-md text-center transition-all duration-150 border select-none leading-none"
        :class="{
          'bg-green-600 text-white border-green-800 font-semibold transform scale-105 shadow-md': isSelected(ticket.number),
          'bg-white text-gray-700 hover:bg-blue-100 border-gray-200': !ticket.isSold && !isSelected(ticket.number),
          'bg-red-600 text-white border-gray-600 cursor-not-allowed opacity-70': ticket.isSold
        }"
        :title="ticket.isSold ? `Ticket #${ticket.number} (Vendido)` : `Ticket #${ticket.number}`">
        {{ ticket.number }}
      </div>
    </div>

    <p v-if="selectedTickets.length === maxTickets && maxTickets > 0"
      class="text-sm text-center text-red-600 font-semibold mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-300">
      Has alcanzado tu límite: {{ selectedTickets.length }}/{{ maxTickets }} tickets.
    </p>

    <p v-else-if="maxTickets > 0" class="text-xs text-center text-gray-500 mt-2">
      Puedes seleccionar hasta <b>{{ maxTickets - selectedTickets.length }}</b> tickets adicionales.
    </p>
  </div>

  <p class="font-semibold mt-3 text-white">Vendido: 🔴 Pendiente: 🔘 Seleccionados por ti: 🟢</p>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, defineProps } from 'vue'
import { useTicketStore, type TicketStatus } from '@/stores/useTicketStore'

// Props
const props = defineProps<{
  product: { title: string } | null
  maxTickets: number
}>()

// Emits
const emit = defineEmits(['update:selected'])

// Store
const ticketStore = useTicketStore()

// Tickets disponibles
const allTickets = computed<TicketStatus[]>(() => {
  if (!props.product || !props.product.title) return []
  return ticketStore.allTicketsForProduct(props.product.title)
})

// 🔍 Búsqueda
const searchQuery = ref("")
const filteredTickets = computed(() => {
  if (!searchQuery.value) return allTickets.value
  return allTickets.value.filter(ticket =>
    ticket.number.toString().includes(searchQuery.value)
  )
})

// Paginación
const TICKETS_PER_PAGE = 50
const currentPage = ref(1)

const totalPages = computed(() => {
  const total = filteredTickets.value.length
  return total === 0 ? 1 : Math.ceil(total / TICKETS_PER_PAGE)
})

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * TICKETS_PER_PAGE
  const end = start + TICKETS_PER_PAGE
  return filteredTickets.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Selección
const selectedTickets = ref<number[]>([])
const isSelected = (ticket: number) => selectedTickets.value.includes(ticket)

const toggleTicket = (ticket: number) => {
  const index = selectedTickets.value.indexOf(ticket)
  if (index > -1) {
    selectedTickets.value.splice(index, 1)
  } else {
    if (selectedTickets.value.length < props.maxTickets) {
      selectedTickets.value.push(ticket)
      ticketStore.reserveTicket(props.product?.title ?? "", [ticket], 1)
    }
  }
  emit('update:selected', selectedTickets.value)
}

// Watches
watch(allTickets, (newAvailable) => {
  const availableNumbers = newAvailable.map(t => t.number)
  selectedTickets.value = selectedTickets.value.filter(ticket =>
    availableNumbers.includes(ticket)
  )
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
  if (currentPage.value !== 1 && totalPages.value > 1) {
    currentPage.value = 1
  }
  emit('update:selected', selectedTickets.value)
}, { immediate: true })

watch(paginatedTickets, (newVal) => {
  if (newVal.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
})
</script>
