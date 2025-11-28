<template>
  <div class="bg-black/20 rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-60 sm:h-72 md:h-80">
      <div class="grid-spinner"></div>
    </div>

    <div v-else>
      <!-- GRILLA MÁS ALTA - AUMENTADA LA ALTURA MÁXIMA -->
      <div class="grid gap-1 sm:gap-2 p-2 sm:p-3 md:p-4 bg-gray-800/50 rounded-lg max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto"
           :class="gridColumnsClass">
        <button
          v-for="ticket in tickets"
          :key="ticket.number"
          :disabled="isTicketDisabled(ticket)"
          type="button"
          class="min-w-8 h-8 sm:min-w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded text-xs font-mono font-bold transition-all duration-200 focus:outline-none relative"
          :class="getTicketClasses(ticket)"
          @click="toggleTicket(ticket)"
        >
          {{ ticket.number }}
          <!-- NUEVO: Indicador de reserva en tiempo real -->
          <div v-if="isReservedBySomeoneElse(ticket.number)" 
            class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
        </button>
      </div>

      <!-- PAGINACIÓN MEJORADA CON WEBSOCKETS -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-4 text-white">
        <div class="font-semibold text-sm sm:text-base flex items-center gap-2">
          <span>Seleccionados:</span>
          <span class="px-3 py-1 bg-green-800 rounded-full text-xs sm:text-sm">{{ selectedTickets.length }}</span>
          <!-- NUEVO: Indicador de reservas en tiempo real -->
          <span v-if="realTimeReservedCount > 0" class="px-3 py-1 bg-yellow-600 rounded-full text-xs sm:text-sm flex items-center gap-1">
            <div class="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            {{ realTimeReservedCount }} reservando
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="px-3 py-2 sm:px-4 sm:py-2 bg-blue-800 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-w-12"
          >
            ◀
          </button>
          <span class="px-3 py-1 text-sm sm:text-base min-w-20 text-center">
            Pág {{ currentPage }} de {{ totalPages }}
          </span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages" 
            class="px-3 py-2 sm:px-4 sm:py-2 bg-blue-800 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-w-12"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { RaffleService, type RaffleGridTicket, type PaginationMeta } from '../services/RaffleService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGridStore } from '@/stores/useGridStore';
import { useToast } from '@/composables/useToast';

const props = defineProps<{
  raffleId: string;
}>();

const emit = defineEmits(['update:selected', 'reservation-started']);

const authStore = useAuthStore();
const gridStore = useGridStore();
const { showToast } = useToast();
const isLoading = ref(true);
const tickets = ref<RaffleGridTicket[]>([]);
// CAMBIO: Cambiar a string[] para que coincida con ticket.number
const selectedTickets = ref<string[]>([]);
const paginationMeta = ref<PaginationMeta | null>(null);
const currentPage = ref(1);

const totalPages = computed(() => paginationMeta.value?.last_page || 1);
const TICKETS_PER_PAGE = 252;

const gridColumnsClass = computed(() => {
  return 'grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12';
});

// 1. Verifica si YO lo tengo seleccionado
function isSelectedByMe(ticketNumber: string): boolean {
  return selectedTickets.value.includes(ticketNumber);
}

// 2. Verifica si el Websocket dice que está ocupado Y NO soy yo quien lo tiene
function isReservedBySomeoneElse(ticketNumber: string): boolean {
  const isReservedInSocket = gridStore.isTicketReserved(ticketNumber);
  const doIHaveIt = isSelectedByMe(ticketNumber);
  
  // Solo devolver TRUE si el socket dice ocupado Y yo NO lo tengo seleccionado.
  // Esto previene que mi propia selección se vuelva roja.
  return isReservedInSocket && !doIHaveIt;
}

// 3. Define si el botón está deshabilitado
function isTicketDisabled(ticket: RaffleGridTicket): boolean {
  // Deshabilitar si:
  // - Está vendido en base de datos (status != available)
  // - O está reservado por ALGUIEN MÁS (Websocket)
  return ticket.status !== 'available' || isReservedBySomeoneElse(ticket.number);
}

// CORRECCIÓN: Ahora funciona porque ambos son strings
const realTimeReservedCount = computed(() => {
  return tickets.value.filter(ticket => 
    isTicketReservedByOthers(ticket.number) && 
    !isSelected(ticket.number)
  ).length;
});

// CORRECCIÓN: Cambiar parámetro a string
function isSelected(ticketNumber: string): boolean {
  return selectedTickets.value.includes(ticketNumber);
}

function isTicketReservedByOthers(ticketNumber: string): boolean {
  return gridStore.isTicketReserved(ticketNumber) && 
         !isSelected(ticketNumber);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchTicketGrid(currentPage.value);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchTicketGrid(currentPage.value);
  }
}

async function fetchTicketGrid(page: number) {
  isLoading.value = true;
  try {
    const response = await RaffleService.getRaffleGrid(props.raffleId, page, TICKETS_PER_PAGE);
    tickets.value = response.data;
    paginationMeta.value = response.meta;
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al cargar tickets', 'error');
  } finally {
    isLoading.value = false;
  }
}

// 4. Clases CSS 
function getTicketClasses(ticket: RaffleGridTicket) {
  // Prioridad 1: Mi selección (VERDE)
  if (isSelectedByMe(ticket.number)) {
    return 'bg-green-600 text-white scale-105 shadow-lg ring-2 ring-green-400 z-10';
  }
  
  // Prioridad 2: Reservado por otro en tiempo real (ROJO)
  if (isReservedBySomeoneElse(ticket.number)) {
    return 'bg-red-600/90 text-white cursor-not-allowed opacity-90 border border-red-500';
  }
  
  // Prioridad 3: Estados de base de datos
  switch (ticket.status) {
    case 'sold': return 'bg-red-800 text-gray-400 cursor-not-allowed opacity-60';
    case 'reserved': return 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-80';
    case 'available': return 'bg-white/90 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:scale-110 shadow-sm';
    default: return 'bg-gray-800 text-gray-400';
  }
}

// CORRECCIÓN: Actualizar para trabajar con strings
async function toggleTicket(ticket: RaffleGridTicket) {
  // Bloquear clic si ya no está disponible
  if (isTicketDisabled(ticket)) return;

  const user = authStore.user;
  if (!user?.natural_profile?.document_number) {
    showToast('Inicia sesión para seleccionar tickets', 'warning');
    return;
  }

  const ticketNumber = ticket.number;
  const index = selectedTickets.value.indexOf(ticketNumber);

  if (index > -1) {
    // DESELECCIONAR
    selectedTickets.value.splice(index, 1);
    
    // Importante: Liberar visualmente en el store local inmediatamente para evitar lag
    gridStore.clearReservedTickets([ticketNumber]); 
    
    try {
      await RaffleService.unbookTickets(props.raffleId, "V", user.natural_profile.document_number, [ticket.number]);
    } catch (err) {
      console.error('Error liberando ticket:', err);
    }
  } else {
    // SELECCIONAR
    selectedTickets.value.push(ticketNumber);
    
    // Importante: Marcar como reservado localmente de inmediato
    // Esto asegura que si llega el evento WS, ya lo tengamos en "isSelectedByMe"
    
    if (selectedTickets.value.length === 1) {
      emit('reservation-started');
    }

    try {
      await RaffleService.bookTickets(props.raffleId, "V", user.natural_profile.document_number, [ticket.number]);
    } catch (err) {
      // Revertir si falla la API
      const idx = selectedTickets.value.indexOf(ticketNumber);
      if (idx > -1) selectedTickets.value.splice(idx, 1);
      showToast('No se pudo reservar el ticket', 'error');
    }
  }

  emit('update:selected', selectedTickets.value);
}

onMounted(() => {
  fetchTicketGrid(1);
  gridStore.startListeningToTickets(props.raffleId);
});

onUnmounted(() => {
  gridStore.stopListeningToTickets();
});

watch(() => props.raffleId, () => {
  selectedTickets.value = [];
  currentPage.value = 1;
  fetchTicketGrid(1);
  gridStore.stopListeningToTickets();
  gridStore.startListeningToTickets(props.raffleId);
});
</script>

<style scoped>
.grid-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #f3b243;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 
  to { transform: rotate(360deg); } 
}

/* Breakpoint personalizado para móviles muy pequeños */
@media (max-width: 360px) {
  .xs\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* Mejoras de touch para móviles */
@media (max-width: 640px) {
  button {
    -webkit-tap-highlight-color: transparent;
  }
}

/* Scrollbar personalizado para mejor visualización */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* NUEVO: Estilos para mejor visualización de los indicadores */
.relative {
  position: relative;
}
</style>