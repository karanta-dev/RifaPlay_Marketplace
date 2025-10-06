<template>
  <div>
    <div
      class="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2"
    >
      <ProductCard
        v-for="(item, i) in items"
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
    
    <!-- modal de confirmación - AHORA CON NUEVO EVENTO -->
    <ConfirmacionModal
      :open="showConfirm"
      @close="showConfirm = false"
      @showJackpot="handleShowJackpot"
    />

    <!-- details modal -->
    <DetailsModal
      :open="showDetails"
      :product="selectedProduct"
      @close="showDetails = false"
      @buy="openParticipateModal"
    />


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useTicketStore } from "@/stores/useTicketStore"
import { useAuthStore } from "@/stores/useAuthStore"

import ProductCard from "./ProductCard.vue"
import ParticiparModal from "./ParticipateModal.vue"
import ConfirmacionModal from "./ConfirmationModal.vue"
import DetailsModal from "./ProductDetailsModal.vue"
import ProductModal from "./ProductModal.vue"
import JackpotAnimation from "./JackpotAnimation.vue"

// ✅ Nuevo: recibir productos opcionales
const props = defineProps<{
  products?: any[] | null
}>()

const ticketStore = useTicketStore()
const authStore = useAuthStore()
const { topProducts } = storeToRefs(ticketStore)
const { productProgress } = ticketStore

// 🔎 Usar productos filtrados si existen, sino los del store
const items = computed(() => {
  if (props.products && props.products.length) {
    return props.products
  }
  return topProducts.value
})

const showForm = ref(false)
const showConfirm = ref(false)
const showJackpot = ref(false)
const showProductModal = ref(false)
const selectedCategory = ref<string | null>(null)
const showDetails = ref(false)
const selectedProduct = ref<any | null>(null)
const userInitialTickets = ref(0)
const purchasedTicketsCount = ref(0)

// ✅ Manejar la confirmación de compra (ACTUALIZADO)
const handleConfirmed = (data?: { initialTickets: number; purchasedTickets: number }) => {
  console.log('🎯 handleConfirmed called with data:', data)
  showForm.value = false
  
  if (data) {
    // ✅ USAR LOS DATOS ENVIADOS DESDE ParticiparModal
    userInitialTickets.value = data.initialTickets
    purchasedTicketsCount.value = data.purchasedTickets
  } else {
    // Fallback: cálculo tradicional (puede fallar en primer intento)
    userInitialTickets.value = getUserInitialTickets()
    purchasedTicketsCount.value = getPurchasedTicketsCount()
  }
  
  console.log('🎰 Jackpot Animation Data (CORREGIDO):', {
    initialTickets: userInitialTickets.value,
    purchasedTickets: purchasedTicketsCount.value,
    lastAssignedTickets: ticketStore.lastAssignedTickets
  })
  
  // Mostrar confirmación primero
  showConfirm.value = true
  console.log('✅ showConfirm set to:', true)
}

// ✅ Función para obtener los tickets iniciales del usuario (como fallback)
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

// ✅ Función para calcular tickets comprados (como fallback)
const getPurchasedTicketsCount = () => {
  return ticketStore.lastAssignedTickets?.length || 
         (ticketStore.ticketNumber ? 1 : 0) ||
         Number(ticketStore.formData?.tickets) || 1
}

// ✅ NUEVA FUNCIÓN: Manejar cuando el usuario presiona "Continuar" en ConfirmacionModal
const handleShowJackpot = () => {
  console.log('🎯 handleShowJackpot called')
  showConfirm.value = false
  showJackpot.value = true
  console.log('🔄 State change: showConfirm -> false, showJackpot -> true')
}

// ✅ Manejar el cierre del jackpot
const handleJackpotClose = () => {
  console.log('🎯 handleJackpotClose called')
  showJackpot.value = false
  // Resetear el store para la próxima compra
  setTimeout(() => {
    ticketStore.reset()
  }, 500)
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