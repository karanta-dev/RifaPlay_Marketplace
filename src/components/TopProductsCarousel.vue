<template>
  <h2 class="text-xl sm:text-2xl font-bold text-center text-white mb-6">
    🎟️ Productos con más tickets vendidos
  </h2>
  <div
    class="w-full max-w-7xl bg-blue-100 border border-blue-300 rounded-2xl py-4 overflow-hidden relative shadow"
  >
    <!-- Contenedor scroll automático -->
    <div class="whitespace-nowrap flex animate-marquee">
      <div
        v-for="(item, i) in topProducts"
        :key="i"
        class="inline-flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 mx-4 px-6 py-4 min-w-[220px] sm:min-w-[260px]"
      >
        <img
          :src="item.image"
          alt="Producto"
          class="w-32 h-24 object-cover rounded-lg mb-3 border"
        />
        <h3 class="font-bold text-gray-800 text-base text-center truncate w-full">
          {{ item.title }}
        </h3>

        <!-- Tickets vendidos / max -->
        <p class="text-blue-700 font-extrabold text-lg mt-1">
          {{ item.ticketsVendidos.toLocaleString() }} /
          {{ item.ticketsMax.toLocaleString() }} 🎫
        </p>

        <!-- Barra de progreso -->
        <div class="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            class="bg-blue-600 h-3 rounded-full transition-all duration-500"
            :style="{ width: productProgress(item) + '%' }"
          ></div>
        </div>

        <!-- Mensaje de advertencia (solo si >=70%) -->
        <p
          v-if="productAlmostSoldOut(item)"
          class="mt-2 text-center text-red-800 bg-red-100 border border-red-300 rounded-lg px-2 py-1 text-xs sm:text-sm font-semibold"
        >
          ⚠️ ¡No pierdas tu única oportunidad de entrar, ya casi acaba!
        </p>
      </div>

      <!-- Duplicado para loop infinito -->
      <div
        v-for="(item, i) in topProducts"
        :key="'clone-' + i"
        class="inline-flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 mx-4 px-6 py-4 min-w-[220px] sm:min-w-[260px]"
      >
        <img
          :src="item.image"
          alt="Producto"
          class="w-32 h-24 object-cover rounded-lg mb-3 border"
        />
        <h3 class="font-bold text-gray-800 text-base text-center truncate w-full">
          {{ item.title }}
        </h3>

        <p class="text-blue-700 font-extrabold text-lg mt-1">
          {{ item.ticketsVendidos.toLocaleString() }} /
          {{ item.ticketsMax.toLocaleString() }} 🎫
        </p>

        <div class="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            class="bg-blue-600 h-3 rounded-full transition-all duration-500"
            :style="{ width: productProgress(item) + '%' }"
          ></div>
        </div>

        <p
          v-if="productAlmostSoldOut(item)"
          class="mt-2 text-center text-red-800 bg-red-100 border border-red-300 rounded-lg px-2 py-1 text-xs sm:text-sm font-semibold"
        >
          ⚠️ ¡No pierdas tu única oportunidad de entrar, ya casi acaba!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTicketStore } from '@/stores/useTicketStore'

const ticketStore = useTicketStore()
const { topProducts } = storeToRefs(ticketStore)
const { productProgress, productAlmostSoldOut } = ticketStore
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
</style>
