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
          :disabled="ticket.status !== 'available'"
          type="button"
          class="min-w-8 h-8 sm:min-w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded text-xs font-mono font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 active:scale-95"
          :class="getTicketClasses(ticket)"
          @click="toggleTicket(ticket)"
        >
          {{ ticket.number }}
        </button>
      </div>

      <!-- PAGINACIÓN MEJORADA -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-4 text-white">
        <div class="font-semibold text-sm sm:text-base flex items-center gap-2">
          <span>Seleccionados:</span>
          <span class="px-3 py-1 bg-green-800 rounded-full text-xs sm:text-sm">{{ selectedTickets.length }}</span>
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
import { ref, onMounted, computed, watch } from 'vue';
import { RaffleService, type RaffleGridTicket, type PaginationMeta } from '../services/RaffleService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/composables/useToast';

const props = defineProps<{
  raffleId: string;
}>();

const emit = defineEmits(['update:selected', 'reservation-started']);

const authStore = useAuthStore();
const { showToast } = useToast();
const isLoading = ref(true);
const tickets = ref<RaffleGridTicket[]>([]);
const selectedTickets = ref<number[]>([]);
const paginationMeta = ref<PaginationMeta | null>(null);
const currentPage = ref(1);

const totalPages = computed(() => paginationMeta.value?.last_page || 1);

// AUMENTAR EL NÚMERO DE TICKETS POR PÁGINA
const TICKETS_PER_PAGE = 252; // Aumentado de 50 a 100

// COLUMNAS MEJORADAS PARA MÓVILES
const gridColumnsClass = computed(() => {
  return 'grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12';
});

// FUNCIONES DE PAGINACIÓN
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

function getTicketClasses(ticket: RaffleGridTicket) {
  if (selectedTickets.value.includes(parseInt(ticket.number))) {
    return 'bg-green-500 text-white scale-105 shadow-lg ring-2 ring-green-300';
  }
  
  switch (ticket.status) {
    case 'sold': return 'bg-red-700 text-gray-400 cursor-not-allowed opacity-70';
    case 'reserved': return 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-80';
    case 'available': return 'bg-white text-black hover:bg-yellow-300 cursor-pointer hover:scale-105';
    default: return 'bg-gray-800 text-gray-400';
  }
}

async function toggleTicket(ticket: RaffleGridTicket) {
  if (ticket.status !== 'available') return;

  const user = authStore.user;
  if (!user?.natural_profile?.document_number) {
    showToast('Error: Usuario no encontrado', 'error');
    return;
  }

  const ticketNumber = parseInt(ticket.number);
  const index = selectedTickets.value.indexOf(ticketNumber);

  if (index > -1) {
    selectedTickets.value.splice(index, 1);
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
      selectedTickets.value.splice(selectedTickets.value.indexOf(ticketNumber), 1);
      showToast('Error reservando ticket', 'error');
    }
  }

  emit('update:selected', selectedTickets.value);
}

onMounted(() => fetchTicketGrid(1));
watch(() => props.raffleId, () => {
  selectedTickets.value = [];
  currentPage.value = 1;
  fetchTicketGrid(1);
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
</style>