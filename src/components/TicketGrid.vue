<template>
  <div class="bg-black/20 rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-60 sm:h-72 md:h-80">
      <div class="grid-spinner"></div>
    </div>

    <div v-else>
      <!-- GRILLA MÁS ALTA Y COMPACTA - MEJORADA -->
      <div class="grid gap-0.5 sm:gap-1 p-2 sm:p-3 md:p-4 bg-gray-800/50 rounded-lg max-h-[500px] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[800px] overflow-y-auto"
           :class="gridColumnsClass">
        <button
          v-for="ticket in tickets"
          :key="ticket.number"
          :disabled="isTicketDisabled(ticket)"
          type="button"
          class="min-w-8 h-8 sm:min-w-9 sm:h-9 md:min-w-10 md:h-10 flex items-center justify-center rounded-sm text-xs font-mono font-bold transition-all duration-200 focus:outline-none relative ticket-button"
          :class="getTicketClasses(ticket)"
          @click="toggleTicket(ticket)"
        >
          {{ ticket.number }}
          <!-- Indicador de reserva en tiempo real -->
          <div v-if="isReservedBySomeoneElse(ticket.number)" 
            class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
        </button>
      </div>

      <!-- PAGINACIÓN MEJORADA -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-4 text-white">
        <div class="font-semibold text-sm sm:text-base flex items-center gap-2 flex-wrap justify-center">
          <span class="flex items-center gap-2">
            <span>Seleccionados:</span>
            <span class="px-3 py-1 bg-green-800 rounded-full text-xs sm:text-sm">{{ selectedTickets.length }}</span>
          </span>
          <span v-if="realTimeReservedCount > 0" class="px-3 py-1 bg-yellow-600 rounded-full text-xs sm:text-sm flex items-center gap-1">
            <div class="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            {{ realTimeReservedCount }} reservando
          </span>
        </div>
        
        <div class="flex items-center gap-2 mt-2 sm:mt-0">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="px-3 py-2 sm:px-4 sm:py-2 bg-blue-800 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-w-12 shadow-md"
          >
            ◀
          </button>
          <span class="px-3 py-1 text-sm sm:text-base min-w-20 text-center bg-blue-900/50 rounded-lg">
            Pág {{ currentPage }} de {{ totalPages }}
          </span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages" 
            class="px-3 py-2 sm:px-4 sm:py-2 bg-blue-800 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-w-12 shadow-md"
          >
            ▶
          </button>
        </div>
      </div>

      <!-- INFORMACIÓN DE DISPONIBILIDAD -->
      <div class="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div class="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-white/90 rounded-sm"></div>
            <span class="text-white/80">Disponible</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-600 rounded-sm"></div>
            <span class="text-white/80">Seleccionado</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-red-800 rounded-sm"></div>
            <span class="text-white/80">Reservando</span>
          </div>
          <!-- <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-sm relative">
              <div class="absolute inset-0 bg-yellow-500 rounded-sm animate-pulse"></div>
            </div>
            <span class="text-white/80">Reservando</span>
          </div> -->
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
const selectedTickets = ref<string[]>([]);
const paginationMeta = ref<PaginationMeta | null>(null);
const currentPage = ref(1);

const totalPages = computed(() => paginationMeta.value?.last_page || 1);
// Aumentar tickets por página para mejor densidad
const TICKETS_PER_PAGE = 300;

// Grid más compacto en escritorio
const gridColumnsClass = computed(() => {
  return 'grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16';
});

// Resto del código se mantiene igual...
function isSelectedByMe(ticketNumber: string): boolean {
  return selectedTickets.value.includes(ticketNumber);
}

function isReservedBySomeoneElse(ticketNumber: string): boolean {
  const isReservedInSocket = gridStore.isTicketReserved(ticketNumber);
  const doIHaveIt = isSelectedByMe(ticketNumber);
  return isReservedInSocket && !doIHaveIt;
}

function isTicketDisabled(ticket: RaffleGridTicket): boolean {
  return ticket.status !== 'available' || isReservedBySomeoneElse(ticket.number);
}

const realTimeReservedCount = computed(() => {
  return tickets.value.filter(ticket => 
    isTicketReservedByOthers(ticket.number) && 
    !isSelected(ticket.number)
  ).length;
});

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

// Clases CSS mejoradas para mejor contraste
function getTicketClasses(ticket: RaffleGridTicket) {
  if (isSelectedByMe(ticket.number)) {
    return 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-105 shadow-lg ring-2 ring-green-400 z-10 hover:from-green-600 hover:to-green-700';
  }
  
  if (isReservedBySomeoneElse(ticket.number)) {
    return 'bg-gradient-to-br from-red-600 to-red-700 text-white cursor-not-allowed opacity-90 border border-red-500';
  }
  
  switch (ticket.status) {
    case 'sold': 
      return 'bg-gradient-to-br from-red-800 to-red-900 text-gray-400 cursor-not-allowed opacity-70';
    case 'reserved': 
      return 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed opacity-80';
    case 'available': 
      return 'bg-gradient-to-br from-white to-gray-100 text-gray-900 hover:from-yellow-200 hover:to-yellow-300 cursor-pointer hover:scale-105 shadow-sm hover:shadow-md border border-gray-300';
    default: 
      return 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400';
  }
}

async function toggleTicket(ticket: RaffleGridTicket) {
  if (isTicketDisabled(ticket)) return;

  const user = authStore.user;
  if (!user?.natural_profile?.document_number) {
    showToast('Inicia sesión para seleccionar tickets', 'warning');
    return;
  }

  const ticketNumber = ticket.number;
  const index = selectedTickets.value.indexOf(ticketNumber);

  if (index > -1) {
    selectedTickets.value.splice(index, 1);
    gridStore.clearReservedTickets([ticketNumber]); 
    
    try {
      await RaffleService.unbookTickets(props.raffleId, "V", user.natural_profile.document_number, [ticket.number]);
    } catch (err) {
      console.error('Error liberando ticket:', err);
    }
  } else {
    selectedTickets.value.push(ticketNumber);
    
    if (selectedTickets.value.length === 1) {
      emit('reservation-started');
    }

    try {
      await RaffleService.bookTickets(props.raffleId, "V", user.natural_profile.document_number, [ticket.number]);
    } catch (err) {
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

/* Mejoras de animación para los botones */
.ticket-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ticket-button:hover:not(:disabled) {
  transform: scale(1.08);
  z-index: 5;
}

/* Scrollbar personalizado mejorado */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #f3b243, #e67e22);
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #e67e22, #d35400);
}

/* Breakpoints mejorados para mayor responsividad */
@media (max-width: 480px) {
  .grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 380px) {
  .grid-cols-5 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Mejoras de touch para móviles */
@media (max-width: 640px) {
  button {
    -webkit-tap-highlight-color: transparent;
  }
  
  .ticket-button:active:not(:disabled) {
    transform: scale(0.95);
  }
}
</style>