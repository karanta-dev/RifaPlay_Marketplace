<template>
  <div>
    <!-- SPINNER GRANDE: Se muestra mientras se carga la LISTA de productos -->
    <div v-if="isLoadingList" class="loading-container">
      <div class="main-spinner"></div>
      <p class="text-white mt-4">Cargando rifas...</p>
    </div>

    <!-- CUADRÍCULA DE PRODUCTOS: Se muestra cuando la lista ha terminado de cargar -->
    <div
      v-else
      class="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2"
    >
      <ProductCard
        v-for="product in products"
        :key="product.uuid"
        :product="product"
        @participar="openParticipateModal(product)"
        @view-details="openDetails(product)"
      />
    </div>

    <!-- PAGINACIÓN: Solo se muestra si no está cargando la lista y hay más de una página -->
    <div v-if="!isLoadingList && totalPages > 1" class="flex justify-center items-center gap-4 mt-6">
      <button
        class="px-4 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-700 transition disabled:opacity-40"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        ◀ Anterior
      </button>
      <span class="text-white font-semibold">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-700 transition disabled:opacity-40"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Siguiente ▶
      </button>
    </div>

    <!-- MODALES (Estos no usan el gridStore, así que no se tocan) -->
    <ParticiparModal :open="showForm" :product="selectedProduct" @close="showForm = false" @confirmed="handleConfirmed"/>
    <JackpotAnimation :show="showJackpot" :initial-tickets="userInitialTickets" :purchased-tickets="purchasedTicketsCount" @close="handleJackpotClose"/>
    <ProductModal :isOpen="showProductModal" :category="selectedCategory" @close="showProductModal = false" @participar="openParticipateModal"/>
    <ConfirmacionModal :open="showConfirm" :selectedProduct="selectedProduct" @close="showConfirm = false" @showJackpot="handleShowJackpot"/>
    <DetailsModal :open="showDetails" :product="selectedProduct" @close="showDetails = false" @buy="openParticipateModal"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { storeToRefs } from "pinia"

// ✅ 1. IMPORTAMOS EL NUEVO STORE INDEPENDIENTE
import { useGridStore } from '@/stores/useGridStore' 
// Los stores viejos para los modales que los necesiten
import { useTicketStore } from "@/stores/useTicketStore" 
import { useAuthStore } from "@/stores/useAuthStore"

import ProductCard from "./ProductCard.vue"
// El resto de los imports de componentes no cambian
import ParticiparModal from "./ParticipateModal.vue"
import ConfirmacionModal from "./ConfirmationModal.vue"
import DetailsModal from "./ProductDetailsModal.vue"
import ProductModal from "./ProductModal.vue"
import JackpotAnimation from "./JackpotAnimation.vue"

// ✅ 2. USAMOS EL NUEVO STORE PARA LA PARRILLA
const gridStore = useGridStore()
const { products, isLoadingList, pagination } = storeToRefs(gridStore)

// Los stores viejos se mantienen para la lógica de los modales
const ticketStore = useTicketStore() 
const authStore = useAuthStore()

const itemsPerPage = 16

// ✅ 3. onMounted AHORA LLAMA A LA ACCIÓN DEL NUEVO STORE
onMounted(() => {
  gridStore.fetchProductList(1, itemsPerPage)
})

// ✅ 4. Lógica de paginación ahora usa el nuevo store
const currentPage = computed(() => pagination.value?.current_page || 1)
const totalPages = computed(() => pagination.value?.last_page || 1)

function nextPage() {
  if (currentPage.value < totalPages.value) {
    gridStore.fetchProductList(currentPage.value + 1, itemsPerPage)
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    gridStore.fetchProductList(currentPage.value - 1, itemsPerPage)
  }
}

// El resto del script es para los modales y no cambia
const showForm = ref(false)
const showConfirm = ref(false)
const showJackpot = ref(false)
const showProductModal = ref(false)
const selectedCategory = ref<string | null>(null)
const showDetails = ref(false)
const selectedProduct = ref<any | null>(null)
const userInitialTickets = ref(0)
const purchasedTicketsCount = ref(0)

const handleConfirmed = (data?: { initialTickets: number; purchasedTickets: number; }) => {
  showForm.value = false
  if (data) {
    userInitialTickets.value = data.initialTickets
    purchasedTicketsCount.value = data.purchasedTickets
  } else {
    userInitialTickets.value = getUserInitialTickets()
    purchasedTicketsCount.value = getPurchasedTicketsCount()
  }
  showConfirm.value = true
}
const getUserInitialTickets = () => {
  const userId = authStore.user?.id
  if (userId) return Math.max(0, ticketStore.userTicketsCount(userId) - (ticketStore.lastAssignedTickets?.length || 0))
  return Math.max(0, ticketStore.tickets.filter((t: any) => t.userId === null).length - (ticketStore.lastAssignedTickets?.length || 0))
}
const getPurchasedTicketsCount = () => {
  return ticketStore.lastAssignedTickets?.length || (ticketStore.ticketNumber ? 1 : 0) || Number(ticketStore.formData?.tickets) || 1
}
const handleShowJackpot = () => {
  showConfirm.value = false
  showJackpot.value = true
}
const handleJackpotClose = () => {
  showJackpot.value = false
  setTimeout(() => ticketStore.reset(), 500)
}
const openDetails = (product: any) => {
  selectedProduct.value = product
  showDetails.value = true
}
function openParticipateModal(product: any) {
  selectedProduct.value = product
  showDetails.value = false
  showForm.value = true
}
</script>

<style scoped>
/* CSS para el spinner grande */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.main-spinner {
  width: 4rem;
  height: 4rem;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #f3b243;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>