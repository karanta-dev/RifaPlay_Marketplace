<template>
  <div class="p-3 border border-gray-300 rounded-xl bg-gray-50 max-w-full shadow-lg mx-auto">
    <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 flex items-center justify-center sm:justify-start">
      <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      Selecciona tus tickets
      <span
        class="ml-2 px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full border border-blue-300">
        {{ selectedTickets.length }} elegidos
      </span>
      
      <!-- NUEVO: Indicador de reservas en tiempo real -->
      <span v-if="realTimeReservedCount > 0" 
            class="ml-2 px-2 py-1 sm:px-3 sm:py-1 bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-semibold rounded-full border border-yellow-300 flex items-center gap-1">
        <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        {{ realTimeReservedCount }} reservando
      </span>
    </h3>

    <!-- 🔍 Barra de búsqueda -->
    <div class="mb-3 sm:mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar ticket por número..."
        class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>

    <!-- Indicador de carga -->
    <div v-if="loadingTicketsLocal" class="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-center gap-2 text-yellow-700">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xs sm:text-sm font-medium">Cargando información de tickets...</span>
      </div>
    </div>

    <!-- Mensaje de agotado -->
    <p v-if="allTickets.length === 0" class="text-center text-red-600 font-bold p-3 sm:p-4 bg-red-100 border border-red-300 rounded-lg text-sm sm:text-base">
      ¡Todos los tickets están agotados!
    </p>

    <!-- Información de tickets -->
    <div v-if="soldTicketsLocal.length > 0 && !loadingTicketsLocal" class="mb-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0 text-xs sm:text-sm">
        <span class="text-blue-700 font-medium">
          🎫 Vendidos: <span class="font-bold">{{ soldTicketsLocal.length }}</span>
        </span>
        <span class="text-green-700 font-medium">
          ✅ Disponibles: <span class="font-bold">{{ availableTicketsCount }}</span>
        </span>
        <!-- NUEVO: Reservas en tiempo real -->
        <span v-if="realTimeReservedCount > 0" class="text-yellow-700 font-medium">
          ⏳ Reservando: <span class="font-bold">{{ realTimeReservedCount }}</span>
        </span>
      </div>
    </div>

    <!-- Controles de paginación -->
    <div v-if="filteredTickets.length > 0" class="flex flex-col sm:flex-row justify-between items-center gap-2 mb-3 p-2 bg-white rounded-lg border border-gray-100 shadow-inner">
      <div class="text-xs sm:text-sm font-medium text-gray-700 text-center sm:text-left">
        Página <span class="font-bold text-blue-600">{{ currentPage }}</span> de <span class="font-bold text-blue-600">{{ totalPages }}</span>
      </div>

      <div class="flex items-center gap-1 sm:gap-2">
        <button @click="prevPage" type="button" :disabled="currentPage === 1"
          class="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md text-xs sm:text-sm min-w-10"
          title="Página anterior">
          ⬅
        </button>
        <button @click="nextPage" type="button" :disabled="currentPage === totalPages"
          class="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition shadow-md text-xs sm:text-sm min-w-10"
          title="Página siguiente">
          ➡
        </button>
      </div>
    </div>

    <!-- Grilla de Tickets Mejorada con WebSockets -->
    <div v-if="paginatedTickets.length > 0"
      class="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 
             gap-1 p-2 border-2 border-blue-400 rounded-xl bg-white shadow-inner max-h-64 sm:max-h-80 overflow-y-auto">
      <div 
        v-for="ticket in paginatedTickets" 
        :key="ticket.number"
        @click="onTicketClick(ticket)"
        class="aspect-square flex items-center justify-center text-xs font-mono rounded-md transition-all duration-150 border select-none ticket-hover min-h-8 relative"
        :class="getTicketClasses(ticket)"
        :title="getTicketTooltip(ticket)"
        :disabled="ticket.isSold || isTicketReservedByOthers(ticket.number)">
        {{ ticket.number.toString().padStart(4, '0') }}
        
        <!-- NUEVO: Indicador de reserva en tiempo real -->
        <div v-if="isTicketReservedByOthers(ticket.number) && !isSelected(ticket.number)" 
             class="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full animate-pulse ring-1 ring-yellow-200">
        </div>
      </div>
    </div>

    <!-- Límite de tickets -->
    <p v-if="selectedTickets.length === maxTickets && maxTickets > 0"
      class="text-xs sm:text-sm text-center text-red-600 font-semibold mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-300">
      Límite alcanzado: {{ selectedTickets.length }}/{{ maxTickets }} tickets.
    </p>

    <p v-else-if="maxTickets > 0" class="text-xs text-center text-gray-500 mt-2">
      Disponibles: <b>{{ Math.max(0, maxTickets - selectedTickets.length) }}</b> tickets
    </p>

    <!-- Leyenda responsiva MEJORADA -->
    <div class="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs justify-center">
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-3 h-3 bg-white border border-gray-300 rounded"></div>
        <span class="text-gray-700">Disponible</span>
      </div>
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-3 h-3 bg-green-600 rounded"></div>
        <span class="text-gray-700">Seleccionado</span>
      </div>
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-3 h-3 bg-red-600 rounded"></div>
        <span class="text-gray-700">Vendido</span>
      </div>
      <!-- NUEVO: Leyenda para reservas en tiempo real -->
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-3 h-3 bg-yellow-500 rounded relative">
          <div class="absolute inset-0 bg-yellow-500 rounded animate-pulse"></div>
        </div>
        <span class="text-gray-700">Reservando</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTicketStore, type TicketStatus } from '../stores/useTicketStore'
import { useGridStore } from '@/stores/useGridStore' // NUEVO: Importar store de grid
import { RaffleService } from '@/services/RaffleService';

// Props actualizadas
const props = defineProps<{
  product: { title: string; uuid?: string } | null
  maxTickets: number
  soldTickets?: number[] // tickets vendidos proveniente del backend (opcional)
  loadingTickets?: boolean // estado de carga proveniente del padre (opcional)
}>()

// Emits
const emit = defineEmits(['update:selected'])

// Store
const ticketStore = useTicketStore()
const gridStore = useGridStore() // NUEVO: Store para WebSockets

// Local reactive copies (sincronizadas con props)
const soldTicketsLocal = ref<number[]>(props.soldTickets ? [...props.soldTickets] : [])
const loadingTicketsLocal = ref<boolean>(props.loadingTickets ?? false)

// NUEVO: Computed para contar reservas en tiempo real
const realTimeReservedCount = computed(() => {
  if (!props.product?.uuid) return 0;
  
  return allTickets.value.filter(ticket => 
    isTicketReservedByOthers(ticket.number) && 
    !isSelected(ticket.number)
  ).length;
});

// Sincronizar props.soldTickets -> soldTicketsLocal
watch(() => props.soldTickets, (newVal) => {
  soldTicketsLocal.value = newVal ? [...newVal] : []
}, { immediate: true })

// Sincronizar props.loadingTickets -> loadingTicketsLocal
watch(() => props.loadingTickets, (nv) => {
  loadingTicketsLocal.value = !!nv
}, { immediate: true })

// ✅ NUEVO: Tickets disponibles combinando datos locales, backend y WebSockets
const allTickets = computed<TicketStatus[]>(() => {
  if (!props.product || !props.product.title) return []

  // Obtener tickets del store local
  const localTickets = ticketStore.allTicketsForProduct(props.product.title)

  // Si tenemos datos del backend, actualizar el estado "isSold"
  let updatedTickets = localTickets;
  if (soldTicketsLocal.value && soldTicketsLocal.value.length > 0) {
    const soldSet = new Set(soldTicketsLocal.value)
    updatedTickets = localTickets.map(ticket => ({
      ...ticket,
      isSold: soldSet.has(ticket.number) || ticket.isSold
    }))
  }

  return updatedTickets;
})

// ✅ NUEVO: Contador de tickets disponibles real
const availableTicketsCount = computed(() => {
  return allTickets.value.filter(ticket => 
    !ticket.isSold && !isTicketReservedByOthers(ticket.number)
  ).length;
})

// ✅ NUEVO: Función para verificar si un ticket está reservado por otros
function isTicketReservedByOthers(ticketNumber: number): boolean {
  if (!props.product?.uuid) return false;
  
  const formattedNumber = String(ticketNumber).padStart(4, '0');
  return gridStore.isTicketReserved(formattedNumber) && 
         !isSelected(ticketNumber);
}

// ✅ NUEVO: Tooltip mejorado con información WebSocket
const getTicketTooltip = (ticket: TicketStatus) => {
  const ticketNumber = ticket.number;
  
  if (ticket.isSold) return `Ticket #${ticketNumber} - VENDIDO 🔴`;
  if (isSelected(ticketNumber)) return `Ticket #${ticketNumber} - SELECCIONADO 🟢`;
  if (isTicketReservedByOthers(ticketNumber)) return `Ticket #${ticketNumber} - SIENDO RESERVADO 🟡`;
  return `Ticket #${ticketNumber} - DISPONIBLE`;
}

// ✅ NUEVO: Clases de tickets mejoradas con WebSockets
const getTicketClasses = (ticket: TicketStatus) => {
  const ticketNumber = ticket.number;
  
  // Si está seleccionado por el usuario
  if (isSelected(ticketNumber)) {
    return 'bg-green-600 text-white border-green-800 font-semibold transform scale-105 shadow-md';
  }
  
  // Si está reservado por otros en tiempo real
  if (isTicketReservedByOthers(ticketNumber)) {
    return 'bg-yellow-500 text-white border-yellow-600 cursor-not-allowed opacity-80';
  }
  
  // Estados normales
  if (ticket.isSold) {
    return 'bg-red-600 text-white border-gray-600 cursor-not-allowed opacity-70';
  }
  
  return 'bg-white text-gray-700 hover:bg-blue-100 border-gray-200';
}

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

// Manejar clic en ticket (actualizado con WebSockets)
const onTicketClick = async (ticket: TicketStatus) => {
  // Si está vendido o reservado por otros, nada que hacer
  if (ticket.isSold || isTicketReservedByOthers(ticket.number)) {
    console.log(`Ticket ${ticket.number} no disponible: vendido=${ticket.isSold}, reservado=${isTicketReservedByOthers(ticket.number)}`);
    return;
  }

  const ticketNumber = ticket.number

  // Si estaba seleccionado, deseleccionarlo
  const idx = selectedTickets.value.indexOf(ticketNumber)
  if (idx >= 0) {
    selectedTickets.value.splice(idx, 1)
    // NUEVO: Liberar ticket del servidor
    try {
      // const user = {}; // Aquí deberías obtener el usuario de tu auth store
      // await RaffleService.unbookTickets(props.product?.uuid, "V", user.document_number, [ticket.number]);
      gridStore.clearReservedTickets([ticket.number.toString()]);
    } catch (err) {
      console.error('Error liberando ticket:', err);
    }
    return;
  }

  // Validar límite
  if (props.maxTickets > 0 && selectedTickets.value.length >= props.maxTickets) {
    console.warn(`[TicketSelector] Límite alcanzado (${props.maxTickets})`)
    return
  }

  // Verificar en backend si el ticket fue vendido en el intertanto
  try {
    const raffleUuid = props.product?.uuid
    if (!raffleUuid) {
      // agregar directamente
      selectedTickets.value.push(ticketNumber)
      return
    }

    // marcar loading mientras consultamos
    const prevLoading = loadingTicketsLocal.value
    loadingTicketsLocal.value = true

    const sold = await RaffleService.searchSoldTickets(raffleUuid, [ticketNumber])
    // sold contiene los números ya vendidos (en formato number)
    if (sold.includes(ticketNumber)) {
      // actualizar sold local y notificar
      if (!soldTicketsLocal.value.includes(ticketNumber)) {
        soldTicketsLocal.value.push(ticketNumber)
      }
      console.warn(`[TicketSelector] El ticket ${ticketNumber} fue vendido recientemente.`)
    } else {
      // puedo seleccionar
      selectedTickets.value.push(ticketNumber)
      
      // NUEVO: Reservar ticket en el servidor
      try {
        // const user = {}; // Obtener del auth store
        // await RaffleService.bookTickets(raffleUuid, "V", user.document_number, [ticket.number.toString().padStart(4, '0')]);
        // El WebSocket actualizará automáticamente el estado
      } catch (err) {
        console.error('Error reservando ticket:', err);
        // Revertir selección si falla la reserva
        selectedTickets.value.splice(selectedTickets.value.indexOf(ticketNumber), 1);
      }
    }

    // restaurar loading anterior
    loadingTicketsLocal.value = prevLoading
  } catch (err) {
    console.error('[TicketSelector] Error verificando disponibilidad:', err)
    // En caso de error de red: permitir selección local
    selectedTickets.value.push(ticketNumber)
    loadingTicketsLocal.value = false
  }
}

// Watches
watch(allTickets, (newAvailable) => {
  const availableNumbers = newAvailable
    .filter(t => !t.isSold && !isTicketReservedByOthers(t.number))
    .map(t => t.number);
    
  selectedTickets.value = selectedTickets.value.filter(ticket =>
    availableNumbers.includes(ticket)
  );
  
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

// Watch para soldTicketsLocal con logs detallados
watch(soldTicketsLocal, (newSoldTickets, oldSoldTickets) => {
  console.log(`🔄 [TicketSelector] soldTicketsLocal cambiado: anterior=${oldSoldTickets?.length ?? 0}, nuevo=${newSoldTickets?.length ?? 0}`);
  if (newSoldTickets && newSoldTickets.length > 0) {
    // Filtrar selecciones que ahora están vendidas
    const soldSet = new Set(newSoldTickets)
    const prevSelections = [...selectedTickets.value]
    selectedTickets.value = selectedTickets.value.filter(ticket => !soldSet.has(ticket))

    if (prevSelections.length !== selectedTickets.value.length) {
      const removidos = prevSelections.filter(t => !selectedTickets.value.includes(t))
      console.log(`🗑️ [TicketSelector] Removidos ${removidos.length} tickets de selección (vendidos):`, removidos)
    }
    emit('update:selected', selectedTickets.value)
  }
}, { immediate: true })

// Emit cuando cambie selectedTickets
watch(selectedTickets, (nv) => {
  emit('update:selected', nv)
}, { deep: true })

// NUEVO: Iniciar y detener escucha WebSocket
onMounted(() => {
  console.log('🏗️ [TicketSelector] Componente montado con props:', {
    product: props.product?.title,
    uuid: props.product?.uuid,
    maxTickets: props.maxTickets,
    soldTicketsFromParent: props.soldTickets?.length ?? 0,
    loadingTicketsProp: props.loadingTickets
  });
  
  // Iniciar escucha WebSocket si hay una rifa
  if (props.product?.uuid) {
    gridStore.startListeningToTickets(props.product.uuid);
  }
});

// NUEVO: Detener escucha WebSocket al desmontar
onUnmounted(() => {
  if (props.product?.uuid) {
    gridStore.stopListeningToTickets();
  }
});

// NUEVO: Reiniciar escucha cuando cambia la rifa
watch(() => props.product?.uuid, (newUuid, oldUuid) => {
  if (oldUuid) {
    gridStore.stopListeningToTickets();
  }
  if (newUuid) {
    gridStore.startListeningToTickets(newUuid);
  }
});
</script>

<style scoped>
/* Animaciones mejoradas */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 0.4; }
  100% { opacity: 0.7; }
}

/* Mejoras de hover y touch */
.ticket-hover:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

@media (max-width: 640px) {
  .ticket-hover:active {
    transform: scale(0.95);
  }
}

/* Breakpoint personalizado para móviles muy pequeños */
@media (max-width: 360px) {
  .xs\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* Scroll suave */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

/* NUEVO: Estilos para tickets deshabilitados */
div[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>