<template>
  <div>
<div
  class="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2"
>
  <ProductCard
    v-for="(item, i) in sortedItems"
    :key="i"
    :image="item.images?.[0] ?? item.image"
    :title="item.title"
    :description="item.description"
    :progress="productProgress(item)"
    :drawDate="item.drawDate"
    @participar="openParticipateModal(item)"
    @view-details="openDetails(item)"
  />
</div>

    <!-- 🧭 Controles de paginación -->
    <div class="flex justify-center items-center gap-4 mt-6">
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

    <!-- modal de participar -->
    <ParticiparModal
      :open="showForm"
      :product="selectedProduct"
      @close="showForm = false"
      @confirmed="handleConfirmed"
    />

    <!-- modal de jackpot animado -->
    <JackpotAnimation
      :show="showJackpot"
      :initial-tickets="userInitialTickets"
      :purchased-tickets="purchasedTicketsCount"
      @close="handleJackpotClose"
    />

    <ProductModal
      :isOpen="showProductModal"
      :category="selectedCategory"
      @close="showProductModal = false"
      @participar="openParticipateModal"
    />

    <!-- <ConfirmacionModal
      :open="showConfirm"
      @close="showConfirm = false"
      @showJackpot="handleShowJackpot"
    /> -->
<ConfirmacionModal
  :open="showConfirm"
  :selectedProduct="selectedProduct"
  @close="showConfirm = false"
  @showJackpot="handleShowJackpot"
/>

    <DetailsModal
      :open="showDetails"
      :product="selectedProduct"
      @close="showDetails = false"
      @buy="openParticipateModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useTicketStore } from "@/stores/useTicketStore"
import { useAuthStore } from "@/stores/useAuthStore"

import ProductCard from "./ProductCard.vue"
import ParticiparModal from "./ParticipateModal.vue"
import ConfirmacionModal from "./ConfirmationModal.vue"
import DetailsModal from "./ProductDetailsModal.vue"
import ProductModal from "./ProductModal.vue"
import JackpotAnimation from "./JackpotAnimation.vue"

const props = defineProps<{
  products?: any[] | null
}>()

const ticketStore = useTicketStore()
const authStore = useAuthStore()

// ✅ OBTENER METADATOS: Traemos 'pagination' del store (así se llama en tu store)
const { topProducts, pagination } = storeToRefs(ticketStore)
const { productProgress } = ticketStore

// 🔹 PAGINACIÓN (Ahora controlada por el backend)
const itemsPerPage = 16 // Debe coincidir con el 'perPage' del store/backend

onMounted(() => {
  // ✅ Cargar la página 1 cuando el componente se monta
  ticketStore.loadRaffles(1, itemsPerPage);
});

// ✅ Productos a mostrar (del prop o del store)
const items = computed(() => {
  if (props.products?.length) return props.products
  // 'topProducts' ahora son solo los 16 productos de la página actual
  return topProducts.value
})

// 🔹 PRODUCTOS ORDENADOS (Esta lógica es correcta, solo ordenará la página actual)
const sortedItems = computed(() => {
  const activeProducts = []
  const soldOutProducts = []
  
  for (const product of items.value) {
    // Tu store ya no tiene 'productProgress' como getter, lo tienes en el componente
    // Asegúrate de que 'product' tenga 'ticketsVendidos' y 'ticketsMax'
    // Tu store SÍ los mapea (línea 363), así que esto está bien.
    const progress = productProgress(product) 
    const drawDate = product.drawDate ? new Date(product.drawDate).getTime() : 0
    const now = Date.now()
    
    const isSoldOut = progress === 100
    const isTimeUp = drawDate <= now
    
    if (isSoldOut || isTimeUp) {
      soldOutProducts.push(product)
    } else {
      activeProducts.push(product)
    }
  }
  
  return [...activeProducts, ...soldOutProducts]
})

// 🔹 LÓGICA DE PAGINACIÓN (Ahora lee del store)

const currentPage = computed(() => pagination.value?.current_page || 1)

const totalPages = computed(() => pagination.value?.last_page || 1)


function nextPage() {
  if (currentPage.value < totalPages.value) {
    // Llama al store para cargar los productos de la SIGUIENTE página
    ticketStore.loadRaffles(currentPage.value + 1, itemsPerPage)
  }
}

// ✅ MODIFICADO: 'prevPage' ahora llama al store
function prevPage() {
  if (currentPage.value > 1) {
    // Llama al store para cargar los productos de la página ANTERIOR
    ticketStore.loadRaffles(currentPage.value - 1, itemsPerPage)
  }
}

// 🔹 Modales y funciones previas (sin cambios)
const showForm = ref(false)
const showConfirm = ref(false)
const showJackpot = ref(false)
const showProductModal = ref(false)
const selectedCategory = ref<string | null>(null)
const showDetails = ref(false)
const selectedProduct = ref<any | null>(null)
const userInitialTickets = ref(0)
const purchasedTicketsCount = ref(0)

const handleConfirmed = (data?: { initialTickets: number; purchasedTickets: number }) => {
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
  if (userId) {
    const currentCount = ticketStore.userTicketsCount(userId)
    const justPurchased = ticketStore.lastAssignedTickets?.length || 0
    return Math.max(0, currentCount - justPurchased)
  }
  const currentNullTickets = ticketStore.tickets.filter(t => t.userId === null).length
  const justPurchased = ticketStore.lastAssignedTickets?.length || 0
  return Math.max(0, currentNullTickets - justPurchased)
}

const getPurchasedTicketsCount = () => {
  return ticketStore.lastAssignedTickets?.length ||
         (ticketStore.ticketNumber ? 1 : 0) ||
         Number(ticketStore.formData?.tickets) || 1
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