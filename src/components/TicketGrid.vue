<template>
  <div class="bg-black/20 rounded-xl border border-white/10 p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="grid-spinner"></div>
    </div>

    <div v-else>
      <!-- GRILLA CON COLUMNAS ADAPTATIVAS -->
      <div class="grid gap-2 p-4 bg-gray-800/50 rounded-lg max-h-96 overflow-y-auto"
           :class="gridColumnsClass">
        <button
          v-for="ticket in tickets"
          :key="ticket.number"
          :disabled="ticket.status !== 'available'"
          type="button"
          class="w-12 h-4 flex items-center justify-center rounded text-xs  font-mono font-bold transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
          :class="getTicketClasses(ticket)"
          @click="toggleTicket(ticket)"
        >
          {{ ticket.number }}
        </button>
      </div>

      <!-- PAGINACIÓN -->
      <div class="flex justify-between items-center mt-4 text-white">
        <div class="font-semibold">
          Seleccionados: <span class="ml-2 px-3 py-1 bg-green-800 rounded-full">{{ selectedTickets.length }}</span>
        </div>
        
        <div class="flex gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 bg-blue-800 rounded disabled:opacity-40">
            ◀
          </button>
          <span class="px-3 py-1">Pág {{ currentPage }}</span>
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
const selectedTickets = ref<number[]>([]);
const paginationMeta = ref<PaginationMeta | null>(null);
const currentPage = ref(1);

const totalPages = computed(() => paginationMeta.value?.last_page || 1);

// COLUMNAS ADAPTATIVAS
const gridColumnsClass = computed(() => {
  return 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12';
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
    const response = await RaffleService.getRaffleGrid(props.raffleId, page, 50);
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
    return 'bg-green-500 text-white scale-110 shadow-lg';
  }
  
  switch (ticket.status) {
    case 'sold': return 'bg-red-700 text-gray-400 cursor-not-allowed opacity-70';
    case 'reserved': return 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-80';
    case 'available': return 'bg-white text-black hover:bg-yellow-300 cursor-pointer';
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
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #f3b243;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>