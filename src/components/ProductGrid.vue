<template>
  <div>
    <div v-if="isLoadingList" class="loading-container">
      <div class="main-spinner"></div>
      <p class="text-white mt-4">Cargando rifas...</p>
    </div>

    <div
      v-else
      class="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2"
    >
      <ProductCard
        v-for="product in products"
        :key="product.uuid"
        :product="product"
        @view-details="openDetails(product)"
      />
    </div>

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

    <JackpotAnimation :show="showJackpot" :initial-tickets="userInitialTickets" :purchased-tickets="purchasedTicketsCount" @close="handleJackpotClose"/>
    <ProductModal :isOpen="showProductModal" :category="selectedCategory" @close="showProductModal = false" @participar="openParticipateModalThroughStore"/>
    <ConfirmacionModal :open="showConfirm" :selectedProduct="selectedProduct" @close="showConfirm = false" @showJackpot="handleShowJackpot"/>
    <DetailsModal :open="showDetails" :product="selectedProduct" @close="showDetails = false" @buy="openParticipateModalThroughStore"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { storeToRefs } from "pinia"

import { useGridStore } from '@/stores/useGridStore' 
import { useTicketStore } from "@/stores/useTicketStore" 
import { useAuthStore } from "@/stores/useAuthStore"

import ProductCard from "./ProductCard.vue"
import ConfirmacionModal from "./ConfirmationModal.vue"
import DetailsModal from "./ProductDetailsModal.vue"
import ProductModal from "./ProductModal.vue"
import JackpotAnimation from "./JackpotAnimation.vue"

const gridStore = useGridStore()
const { products, isLoadingList, pagination } = storeToRefs(gridStore)

const ticketStore = useTicketStore() 
const authStore = useAuthStore()

const itemsPerPage = 16

onMounted(() => {
  gridStore.fetchProductList(1, itemsPerPage)
})

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

const showConfirm = ref(false)
const showJackpot = ref(false)
const showProductModal = ref(false)
const selectedCategory = ref<string | null>(null)
const showDetails = ref(false)
const selectedProduct = ref<any | null>(null)
const userInitialTickets = ref(0)
const purchasedTicketsCount = ref(0)

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

function openParticipateModalThroughStore(product: any) {
  selectedProduct.value = product;
  showDetails.value = false;
  gridStore.openParticipateModal(product);
}
</script>

<style scoped>
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