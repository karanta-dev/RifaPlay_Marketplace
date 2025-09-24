<template>
  <div>
    <div
      class="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2"
    >
      <ProductCard
        v-for="(item, i) in topProducts"
        :key="i"
        :image="item.images[0]"
        :title="item.title"
        :description="item.description"
        :progress="productProgress(item)"
        :drawDate="item.drawDate"
        @participar="showForm = true"
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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTicketStore } from '@/stores/useTicketStore'

import ProductCard from './ProductCard.vue'
import ParticiparModal from './ParticipateModal.vue'
import ConfirmacionModal from './ConfirmationModal.vue'
import DetailsModal from './ProductDetailsModal.vue'


const showForm = ref(false)
const showConfirm = ref(false)
const showDetails = ref(false)
const selectedProduct = ref<any | null>(null)

const ticketStore = useTicketStore()
const { topProducts } = storeToRefs(ticketStore)
const { productProgress } = ticketStore

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
