<!-- TicketGrid.vue - VERSIÓN CON MANEJO DE ERRORES -->
<template>
  <div class="bg-black/20 rounded-xl border border-white/10 p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="grid-spinner"></div>
    </div>

    <div v-else>
      <!-- GRILLA DE TICKETS -->
      <div class="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1.5 p-2 bg-gray-800/50 rounded-lg max-h-72 overflow-y-auto">
        <button
          v-for="ticket in tickets"
          :key="ticket.number"
          :disabled="ticket.status !== 'available' || isTicketBlocked(ticket.number)"
          type="button"
          class="p-1.5 rounded text-xs font-mono font-bold transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          :class="getTicketClasses(ticket)"
          @click="toggleTicket(ticket)"
        >
          {{ ticket.number }}
        </button>
      </div>

      <!-- CONTROLES DE PAGINACIÓN -->
      <div class="flex justify-between items-center mt-4 text-white">
        <div class="font-semibold">
          Seleccionados: 
          <span class="ml-2 px-3 py-1 bg-green-800 rounded-full">{{ selectedTickets.length }}</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            type="button"
            class="px-4 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-700 transition disabled:opacity-40"
          >
            ◀ Anterior
          </button>
          
          <span class="font-semibold text-sm">
            Página {{ currentPage }} de {{ totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            type="button"
            class="px-4 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-700 transition disabled:opacity-40"
          >
            Siguiente ▶
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { RaffleService, type RaffleGridTicket, type PaginationMeta } from '@/services/RaffleService';
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
const selectedTickets = ref<string[]>([]);
const blockedTickets = ref<string[]>([]); // 👈 NUEVO: Tickets bloqueados por errores
const paginationMeta = ref<PaginationMeta | null>(null);
const currentPage = ref(1);
const TICKETS_PER_PAGE = 50;

const totalPages = computed(() => paginationMeta.value?.last_page || 1);

// 👇 NUEVA FUNCIÓN: Verificar si un ticket está bloqueado
const isTicketBlocked = (ticketNumber: string) => {
  return blockedTickets.value.includes(ticketNumber);
};

async function fetchTicketGrid(page: number) {
  isLoading.value = true;
  try {
    const response = await RaffleService.getRaffleGrid(props.raffleId, page, TICKETS_PER_PAGE);
    
    if (response && response.data) {
      tickets.value = response.data;
      paginationMeta.value = response.meta;
    } else {
      tickets.value = [];
      console.error('No se recibieron datos del grid de tickets');
    }
  } catch (error) {
    console.error('Error fetching ticket grid:', error);
    showToast('Error al cargar los tickets', 'error');
    tickets.value = [];
  } finally {
    isLoading.value = false;
  }
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

function getTicketClasses(ticket: RaffleGridTicket): string {
  const ticketNumber = ticket.number;
  
  // Si está seleccionado
  if (selectedTickets.value.includes(ticketNumber)) {
    return 'bg-green-500 text-white scale-110 shadow-lg';
  }
  
  // Si está bloqueado
  if (blockedTickets.value.includes(ticketNumber)) {
    return 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50';
  }
  
  // Estados normales
  switch (ticket.status) {
    case 'sold': return 'bg-red-700 text-gray-400 cursor-not-allowed line-through opacity-70';
    case 'reserved': return 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-80';
    case 'available': return 'bg-white text-black hover:bg-yellow-300 cursor-pointer';
    default: return 'bg-gray-800 text-gray-400';
  }
}

async function toggleTicket(ticket: RaffleGridTicket) {
  const ticketNumber = ticket.number;
  
  // No hacer nada si está bloqueado
  if (blockedTickets.value.includes(ticketNumber)) {
    return;
  }

  if (ticket.status !== 'available' && !selectedTickets.value.includes(ticketNumber)) return;

  const user = authStore.user;
  if (!user?.natural_profile?.document_number) {
    showToast('Error: No se encontró tu información de usuario', 'error');
    return;
  }

  const docType = "V";
  const docNumber = user.natural_profile.document_number;
  const index = selectedTickets.value.indexOf(ticketNumber);

  if (index > -1) {
    // 👇 DESELECCIONAR - Con manejo de errores
    selectedTickets.value.splice(index, 1);
    try {
      await RaffleService.unbookTickets(props.raffleId, docType, docNumber, [ticketNumber]);
    } catch (err) {
      console.error(`Fallo al liberar el ticket ${ticketNumber}:`, err);
      showToast('Error al liberar el ticket', 'error');
    }
  } else {
    // 👇 SELECCIONAR - Con manejo de errores
    selectedTickets.value.push(ticketNumber);
    
    if (selectedTickets.value.length === 1) {
      emit('reservation-started');
    }

    try {
      await RaffleService.bookTickets(props.raffleId, docType, docNumber, [ticketNumber]);
      // ✅ Éxito - el ticket queda seleccionado
    } catch (err: any) {
      // ❌ Error - desmarcar el ticket y bloquearlo
      const failedIndex = selectedTickets.value.indexOf(ticketNumber);
      if (failedIndex > -1) {
        selectedTickets.value.splice(failedIndex, 1);
      }
      
      // Agregar a tickets bloqueados
      if (!blockedTickets.value.includes(ticketNumber)) {
        blockedTickets.value.push(ticketNumber);
      }
      
      // Mostrar mensaje de error específico
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'No se pudo reservar el ticket. Puede que ya esté ocupado.';
      
      showToast(errorMessage, 'error');
      
      console.error(`Fallo al reservar el ticket ${ticketNumber}:`, err);
    }
  }

  emit('update:selected', selectedTickets.value);
}

// Watchers
onMounted(() => {
  fetchTicketGrid(1);
});

watch(() => props.raffleId, () => {
  selectedTickets.value = [];
  blockedTickets.value = []; // 👈 Limpiar tickets bloqueados al cambiar de rifa
  currentPage.value = 1;
  emit('update:selected', []);
  fetchTicketGrid(1);
});
</script>

<style scoped>
.grid-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #f3b243;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)); }
@media (min-width: 640px) { .sm\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .md\:grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); } }
</style>