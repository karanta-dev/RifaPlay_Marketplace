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

    <!-- modal de confirmación -->
    <ConfirmacionModal
      :open="showConfirm"
      @close="showConfirm = false"
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

import ProductCard from "./ProductCard.vue"
import ParticiparModal from "./ParticipateModal.vue"
import ConfirmacionModal from "./ConfirmationModal.vue"
import DetailsModal from "./ProductDetailsModal.vue"

// ✅ Nuevo: recibir productos opcionales
const props = defineProps<{
  products?: any[] | null
}>()

const ticketStore = useTicketStore()
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
const showDetails = ref(false)
const selectedProduct = ref<any | null>(null)

const handleConfirmed = () => {
  showForm.value = false
  showConfirm.value = true
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
