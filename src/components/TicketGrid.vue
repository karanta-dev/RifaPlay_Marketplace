<template>
  <div class="bg-black/20 rounded-xl border border-white/10 p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="grid-spinner"></div>
    </div>

    <div v-else>
      <!-- GRILLA CON COLUMNAS ADAPTATIVAS -->
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 p-4 bg-gray-800/50 rounded-lg max-h-96 overflow-y-auto">
        <button
          v-for="ticket in tickets"
          :key="ticket.number"
          :disabled="ticket.status !== 'available' || isTicketBlocked(ticket.number)"
          type="button"
          class="w-16 h-4 sm:w-14 sm:h-6 flex items-center justify-center rounded-lg text-lg font-mono font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:scale-105"
          :class="getTicketClasses(ticket)"
          @click="toggleTicket(ticket)"
        >
          {{ ticket.number }}
        </button>
      </div>

      <!-- PAGINACIÓN -->
      <div class="flex justify-between items-center mt-4 text-white">
        <div class="font-semibold text-sm">
          Seleccionados: {{ selectedTickets.length }}
        </div>
        
        <div class="flex gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 bg-blue-800 rounded disabled:opacity-40">
            ◀
          </button>
          <span class="px-3 py-1 text-sm">Pág {{ currentPage }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 bg-blue-800 rounded disabled:opacity-40">
            ▶
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
const blockedTickets = ref<string[]>([]);
const paginationMeta = ref<PaginationMeta | null>(null);
const currentPage = ref(1);
const TICKETS_PER_PAGE = 50;

const totalPages = computed(() => paginationMeta.value?.last_page || 1);

// 👇 NUEVO: Calcular columnas responsive basado en el ancho de pantalla y dígitos
const gridColumnsClass = computed(() => {
  // Detectar el número máximo de dígitos en los tickets actuales
  const maxDigits = Math.max(...tickets.value.map(t => t.number.length));
  
  // Para números de 4-5 dígitos
  if (maxDigits <= 5) {
    return 'grid-cols-8 xs:grid-cols-10 sm:grid-cols-12 md:grid-cols-15 lg:grid-cols-18';
  }
  
  // Para números de 6+ dígitos
  return 'grid-cols-6 xs:grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14';
});

// 👇 NUEVO: Calcular tamaño de texto responsive basado en dígitos
const getTextSizeClass = (ticketNumber: string) => {
  const digitCount = ticketNumber.length;
  
  if (digitCount <= 4) return 'text-xs sm:text-sm';
  if (digitCount === 5) return 'text-xs';
  if (digitCount === 6) return 'text-xs';
  return 'text-xs'; // Para 7+ dígitos
};

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
  const textSizeClass = getTextSizeClass(ticketNumber);
  
  // Si está seleccionado
  if (selectedTickets.value.includes(ticketNumber)) {
    return `${textSizeClass} bg-green-500 text-white scale-105 shadow-lg`;
  }
  
  // Si está bloqueado
  if (blockedTickets.value.includes(ticketNumber)) {
    return `${textSizeClass} bg-gray-800 text-gray-500 cursor-not-allowed opacity-50`;
  }
  
  // Estados normales
  switch (ticket.status) {
    case 'sold': 
      return `${textSizeClass} bg-red-700 text-gray-400 cursor-not-allowed line-through opacity-70`;
    case 'reserved': 
      return `${textSizeClass} bg-gray-600 text-gray-400 cursor-not-allowed opacity-80`;
    case 'available': 
      return `${textSizeClass} bg-white text-black hover:bg-yellow-300 cursor-pointer hover:scale-105`;
    default: 
      return `${textSizeClass} bg-gray-800 text-gray-400`;
  }
}

async function toggleTicket(ticket: RaffleGridTicket) {
  const ticketNumber = ticket.number;
  
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
    selectedTickets.value.splice(index, 1);
    try {
      await RaffleService.unbookTickets(props.raffleId, docType, docNumber, [ticketNumber]);
    } catch (err) {
      console.error(`Fallo al liberar el ticket ${ticketNumber}:`, err);
      showToast('Error al liberar el ticket', 'error');
    }
  } else {
    selectedTickets.value.push(ticketNumber);
    
    if (selectedTickets.value.length === 1) {
      emit('reservation-started');
    }

    try {
      await RaffleService.bookTickets(props.raffleId, docType, docNumber, [ticketNumber]);
    } catch (err: any) {
      const failedIndex = selectedTickets.value.indexOf(ticketNumber);
      if (failedIndex > -1) {
        selectedTickets.value.splice(failedIndex, 1);
      }
      
      if (!blockedTickets.value.includes(ticketNumber)) {
        blockedTickets.value.push(ticketNumber);
      }
      
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
  blockedTickets.value = [];
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

/* Clases de columnas para diferentes breakpoints */
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); }
.grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
.grid-cols-14 { grid-template-columns: repeat(14, minmax(0, 1fr)); }
.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }
.grid-cols-18 { grid-template-columns: repeat(18, minmax(0, 1fr)); }

/* Breakpoints personalizados */
@media (min-width: 475px) { .xs\:grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); } }
@media (min-width: 475px) { .xs\:grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)); } }
@media (min-width: 640px) { .sm\:grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)); } }
@media (min-width: 640px) { .sm\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); } }
@media (min-width: 768px) { .md\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); } }
@media (min-width: 768px) { .md\:grid-cols-14 { grid-template-columns: repeat(14, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .lg\:grid-cols-14 { grid-template-columns: repeat(14, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .lg\:grid-cols-18 { grid-template-columns: repeat(18, minmax(0, 1fr)); } }

/* Para mostrar/ocultar texto en botones en móvil */
@media (max-width: 475px) {
  .xs\:inline {
    display: none;
  }
}
</style>