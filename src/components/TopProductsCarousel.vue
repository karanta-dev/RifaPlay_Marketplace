<template>
  <h2 class="text-lg sm:text-2xl font-bold text-center text-white mb-2 sm:mb-6">
    🎟️ Productos con más tickets vendidos
  </h2>

  <div
    class="w-full max-w-7xl bg-blue-100 border border-blue-300 rounded-2xl py-1 overflow-hidden relative shadow"
  >
    <div class="whitespace-nowrap flex animate-marquee">
      <!-- 🔹 Items -->
      <div
        v-for="(item, i) in topProducts"
        :key="i"
        class="inline-flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 mx-1 px-2 py-2 min-w-[160px] sm:min-w-[260px] relative transition-all cursor-pointer"
        :class="{
          'bg-gray-300 pointer-events-none': isSoldOut(item),
          'animate-pulse-hot': isHot(item)
        }"
        @click="openDetails(item)"
      >
        <span
          v-if="isHot(item)"
          class="absolute top-0 right-0 mt-1 mr-1 bg-red-600 text-white text-xs font-bold px-1 py-0.5 rounded-full uppercase z-10 animate-bounce"
        >
          ¡Caliente!
        </span>

        <img
          :src="item.images[0]"
          alt="Producto"
          class="w-24 h-16 sm:w-32 sm:h-24 object-cover rounded-lg mb-1 border"
          @error="($event) => $event.target.src = '/default.png'"
        />

        <h3 class="font-bold text-gray-800 text-xs sm:text-base text-center truncate w-full">
          {{ item.title }}
        </h3>

        <div class="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
          <p v-if="timeLeft(item).total > 0">
            ⏱️ Termina en: {{ timeLeft(item).days }}d {{ timeLeft(item).hours }}h {{ timeLeft(item).minutes }}m
          </p>
          <p v-else class="text-red-500 font-bold">🎉 ¡Sorteado!</p>
        </div>

        <p class="text-blue-700 font-extrabold text-sm sm:text-lg mt-0.5">
          {{ item.ticketsVendidos.toLocaleString() }} /
          {{ item.ticketsMax.toLocaleString() }} 🎫
        </p>

        <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-3 mt-1 sm:mt-2">
          <div
            class="bg-blue-600 h-1.5 sm:h-3 rounded-full transition-all duration-500"
            :style="{ width: productProgress(item) + '%' }"
          ></div>
        </div>

        <p
          v-if="productAlmostSoldOut(item)"
          class="mt-1 text-center text-red-800 bg-red-100 border border-red-300 rounded-lg px-1 py-0.5 text-xs font-semibold"
        >
          ⚠️ ¡No pierdas tu única oportunidad de entrar, ya casi acaba!
        </p>

        <button
          class="mt-1 px-2 sm:px-6 py-1 sm:py-2 rounded-full w-full font-bold text-xs sm:text-base shadow border-4"
          :class="{
            'bg-green-600 text-white': isSoldOut(item),
            'bg-blue-800 text-white hover:bg-blue-500': !isSoldOut(item)
          }"
          :disabled="isSoldOut(item)"
          @click.stop="openParticipateModal(item)"
        >
          {{ isSoldOut(item) ? '¡VENDIDO!' : 'PARTICIPAR' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 🔹 Participar modal -->
  <ParticiparModal
    :open="showForm"
    :product="selectedProduct"
    @close="showForm = false"
    @confirmed="handleConfirmed"
  />

  <!-- 🔹 Confirmación modal -->
  <ConfirmacionModal
    :open="showConfirm"
    @close="showConfirm = false"
  />

  <!-- 🔹 Details modal -->
  <DetailsModal
    :open="showDetails"
    :product="selectedProduct"
    @close="showDetails = false"
    @buy="openParticipateModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTicketStore } from '@/stores/useTicketStore'

import ParticiparModal from './ParticipateModal.vue'
import ConfirmacionModal from './ConfirmationModal.vue'
import DetailsModal from './ProductDetailsModal.vue'

const ticketStore = useTicketStore()
const { topProducts } = storeToRefs(ticketStore)
const { productProgress, productAlmostSoldOut } = ticketStore

// 🔹 Control de modales
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

// 🔹 Lógica de "Hot"
const isHot = (item: any) => {
  const progress = productProgress(item)
  return progress > 75 && progress < 100
}
// 🔹 Lógica de "Vendido"
const isSoldOut = (item: any) => {
  return productProgress(item) === 100
}

// 🔹 Timer
const now = ref(Date.now())
let interval: any = null
onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(interval)
})

const timeLeft = (item: any) => {
  const drawDate = item.drawDate || '2025-12-01T23:59:59'
  const diff = new Date(drawDate).getTime() - now.value
  if (diff < 0) return { total: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { total: diff, days, hours, minutes, seconds }
}
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
</style>
