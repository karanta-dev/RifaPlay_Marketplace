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

    <!-- ✅ CORREGIDO: Indicador de carga de tickets vendidos -->
    <div v-if="loadingTicketsLocal" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-center gap-2 text-yellow-700">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-medium">Cargando información de tickets vendidos...</span>
      </div>
    </div>

    <p v-if="allTickets.length === 0" class="text-center text-red-600 font-extrabold p-5 bg-red-100 border border-red-300 rounded-lg">
      ¡Vaya! Todos los tickets disponibles en esta rifa se han <b>agotado</b>.
    </p>

    <!-- ✅ CORREGIDO: Información de tickets vendidos con verificación de seguridad -->
    <div v-if="soldTicketsLocal.length > 0 && !loadingTicketsLocal" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex justify-between items-center text-sm">
        <span class="text-blue-700 font-medium">
          🎫 Tickets vendidos: <span class="font-bold">{{ soldTicketsLocal.length }}</span>
        </span>
        <span class="text-green-700 font-medium">
          ✅ Disponibles: <span class="font-bold">{{ availableTicketsCount }}</span>
        </span>
      </div>
    </div>

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
    <div v-if="paginatedTickets.length > 0"
      class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 
             gap-1 p-1 border-2 border-blue-400 rounded-xl bg-white shadow-inner">
      <div v-for="ticket in paginatedTickets" :key="ticket.number"
        @click="onTicketClick(ticket)"
        class="text-xs font-mono p-1 rounded-md text-center transition-all duration-150 border select-none leading-none ticket-hover"
        :class="{
          'bg-green-600 text-white border-green-800 font-semibold transform scale-105 shadow-md': isSelected(ticket.number),
          'bg-white text-gray-700 hover:bg-blue-100 border-gray-200': !ticket.isSold && !isSelected(ticket.number),
          'bg-red-600 text-white border-gray-600 cursor-not-allowed opacity-70': ticket.isSold,
          'pulse-animation': loadingTicketsLocal && ticket.isSold
        }"
        :title="getTicketTooltip(ticket.number)">
        {{ ticket.number.toString().padStart(4, '0') }}
      </div>
    </div>

    <p v-if="selectedTickets.length === maxTickets && maxTickets > 0"
      class="text-sm text-center text-red-600 font-semibold mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-300">
      Has alcanzado tu límite: {{ selectedTickets.length }}/{{ maxTickets }} tickets.
    </p>

    <p v-else-if="maxTickets > 0" class="text-xs text-center text-gray-500 mt-2">
      Puedes seleccionar hasta <b>{{ Math.max(0, maxTickets - selectedTickets.length) }}</b> tickets adicionales.
    </p>

    <!-- ✅ NUEVO: Leyenda actualizada -->
    <div class="flex flex-wrap gap-4 mt-4 text-xs justify-center">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-white border border-gray-300 rounded"></div>
        <span class="text-gray-700">Disponible</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-600 rounded"></div>
        <span class="text-gray-700">Seleccionado</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-600 rounded"></div>
        <span class="text-gray-700">Vendido</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, defineProps, onMounted } from 'vue'
import { useTicketStore, type TicketStatus } from '@/stores/useTicketStore'
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

// Local reactive copies (sincronizadas con props)
const soldTicketsLocal = ref<number[]>(props.soldTickets ? [...props.soldTickets] : [])
const loadingTicketsLocal = ref<boolean>(props.loadingTickets ?? false)

// Sincronizar props.soldTickets -> soldTicketsLocal (ya tienes un watcher, lo mantenemos y mejoramos)
watch(() => props.soldTickets, (newVal) => {
  soldTicketsLocal.value = newVal ? [...newVal] : []
}, { immediate: true })

// Sincronizar props.loadingTickets -> loadingTicketsLocal
watch(() => props.loadingTickets, (nv) => {
  loadingTicketsLocal.value = !!nv
}, { immediate: true })

// ✅ NUEVO: Tickets disponibles combinando datos locales y del backend
const allTickets = computed<TicketStatus[]>(() => {
  if (!props.product || !props.product.title) return []

  // Obtener tickets del store local
  const localTickets = ticketStore.allTicketsForProduct(props.product.title)

  // Si tenemos datos del backend, actualizar el estado "isSold"
  if (soldTicketsLocal.value && soldTicketsLocal.value.length > 0) {
    const soldSet = new Set(soldTicketsLocal.value)
    return localTickets.map(ticket => ({
      ...ticket,
      isSold: soldSet.has(ticket.number) || ticket.isSold
    }))
  }

  return localTickets
})

// ✅ NUEVO: Contador de tickets disponibles real
const availableTicketsCount = computed(() => {
  return allTickets.value.filter(ticket => !ticket.isSold).length
})

// ✅ NUEVO: Tooltip mejorado
const getTicketTooltip = (ticketNumber: number) => {
  const ticket = allTickets.value.find(t => t.number === ticketNumber)
  if (!ticket) return `Ticket #${ticketNumber}`

  if (ticket.isSold) return `Ticket #${ticketNumber} - VENDIDO 🔴`
  if (isSelected(ticketNumber)) return `Ticket #${ticketNumber} - SELECCIONADO 🟢`
  return `Ticket #${ticketNumber} - DISPONIBLE`
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

// Manejar clic en ticket (usa checkTicketsAvailability para validar antes de seleccionar)
const onTicketClick = async (ticket: TicketStatus) => {
  // Si está vendido, nada que hacer
  if (ticket.isSold) return

  const ticketNumber = ticket.number

  // Si estaba seleccionado, deseleccionarlo
  const idx = selectedTickets.value.indexOf(ticketNumber)
  if (idx >= 0) {
    selectedTickets.value.splice(idx, 1)
    return
  }

  // Validar límite
  if (props.maxTickets > 0 && selectedTickets.value.length >= props.maxTickets) {
    // opcional: mostrar mensaje o toast
    console.warn(`[TicketSelector] Límite alcanzado (${props.maxTickets})`)
    return
  }

  // Verificar en backend si el ticket fue vendido en el intertanto
  try {
    // Si no hay uuid del producto, asumimos disponible pero protegemos
    const raffleUuid = props.product?.uuid
    if (!raffleUuid) {
      // agregar directamente
      selectedTickets.value.push(ticketNumber)
      return
    }

    // marcar loading mientras consultamos (solo si no estaba ya cargando)
    const prevLoading = loadingTicketsLocal.value
    loadingTicketsLocal.value = true

const sold = await RaffleService.searchSoldTickets(raffleUuid, [ticketNumber])
    // sold contiene los números ya vendidos (en formato number)
    if (sold.includes(ticketNumber)) {
      // actualizar sold local y notificar
      if (!soldTicketsLocal.value.includes(ticketNumber)) {
        soldTicketsLocal.value.push(ticketNumber)
      }
      // opcional: mostrar alerta
      console.warn(`[TicketSelector] El ticket ${ticketNumber} fue vendido recientemente.`)
    } else {
      // puedo seleccionar
      selectedTickets.value.push(ticketNumber)
    }

    // restaurar loading anterior
    loadingTicketsLocal.value = prevLoading
  } catch (err) {
    console.error('[TicketSelector] Error verificando disponibilidad:', err)
    // En caso de error de red: permitir selección local (o bloquear según política)
    // Aquí elegimos permitir la selección pero podrías bloquearla
    selectedTickets.value.push(ticketNumber)
    loadingTicketsLocal.value = false
  }
}

// Watches
watch(allTickets, (newAvailable) => {
  const availableNumbers = newAvailable.filter(t => !t.isSold).map(t => t.number)
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

// DIAGNÓSTICO: Verificar props al montar
onMounted(() => {
  console.log('🏗️ [TicketSelector] Componente montado con props:', {
    product: props.product?.title,
    uuid: props.product?.uuid,
    maxTickets: props.maxTickets,
    soldTicketsFromParent: props.soldTickets?.length ?? 0,
    loadingTicketsProp: props.loadingTickets
  })
})
</script>

<style scoped>
/* ✅ NUEVO: Animación para tickets durante carga */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.7;
  }
}

/* Mejoras de hover */
.ticket-hover:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>
