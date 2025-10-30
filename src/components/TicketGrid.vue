<template>
  <div class="bg-black/20 rounded-xl border border-white/10 p-4">
    <!-- SPINNER: Se muestra en la carga inicial Y CADA VEZ que se cambia de página -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="grid-spinner"></div>
    </div>

    <!-- CONTENIDO: Se muestra cuando los datos de la página actual han llegado -->
    <div v-else>
      <!-- GRILLA DE TICKETS -->
      <div class="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1.5 p-2 bg-gray-800/50 rounded-lg max-h-72 overflow-y-auto">
        <button
          v-for="ticket in tickets"
          :key="ticket.number"
          :disabled="ticket.status !== 'available'"
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
        <!-- Resumen de selección -->
        <div class="font-semibold">
          Seleccionados: 
          <span class="ml-2 px-3 py-1 bg-green-800 rounded-full">{{ selectedTickets.length }}</span>
        </div>

        <!-- Navegación de página -->
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
import { ref, onMounted, computed } from 'vue';
import { RaffleService, type RaffleGridTicket, type PaginationMeta } from '@/services/RaffleService';

const props = defineProps<{
  raffleId: string;
}>();

const emit = defineEmits(['update:selected']);

const isLoading = ref(true);
const tickets = ref<RaffleGridTicket[]>([]);
const selectedTickets = ref<string[]>([]); // Almacena los números de ticket como strings

const currentPage = ref(1);
const paginationMeta = ref<PaginationMeta | null>(null);
const TICKETS_PER_PAGE = 50;

const totalPages = computed(() => paginationMeta.value?.last_page || 1);

async function fetchTicketGrid(page: number) {
  isLoading.value = true;
  selectedTickets.value = [];
  emit('update:selected', []);
  try {
    const response = await RaffleService.getRaffleGrid(props.raffleId, page, TICKETS_PER_PAGE);
    tickets.value = response.data;
    paginationMeta.value = response.meta;
    currentPage.value = response.meta.current_page;
  } catch (error) {
    console.error("Error al cargar la grilla de tickets:", error);
    tickets.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchTicketGrid(1);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    fetchTicketGrid(currentPage.value + 1);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    fetchTicketGrid(currentPage.value - 1);
  }
}

function getTicketClasses(ticket: RaffleGridTicket): string {
  if (selectedTickets.value.includes(ticket.number)) {
    return 'bg-green-500 text-white scale-110 shadow-lg';
  }
  switch (ticket.status) {
    case 'sold':
      return 'bg-red-700 text-gray-400 cursor-not-allowed line-through opacity-70';
    case 'reserved':
      return 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-80';
    case 'available':
      return 'bg-white text-black hover:bg-yellow-300';
    default:
      return 'bg-gray-800';
  }
}

function toggleTicket(ticket: RaffleGridTicket) {
  if (ticket.status !== 'available') return;
  const index = selectedTickets.value.indexOf(ticket.number);
  if (index > -1) {
    selectedTickets.value.splice(index, 1);
  } else {
    selectedTickets.value.push(ticket.number);
  }
  emit('update:selected', selectedTickets.value);
}
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