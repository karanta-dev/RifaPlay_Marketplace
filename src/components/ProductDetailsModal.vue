<script setup lang="ts">
import { computed } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

const props = defineProps<{ open: boolean; product: any | null }>()
const emit = defineEmits(['close', 'buy']) // 👈 añadimos 'buy'

const ticketStore = useTicketStore()

const progress = computed(() =>
  props.product ? ticketStore.productProgress(props.product) : 0
)

function handleBuy() {
  emit('buy', props.product) // 👈 enviamos el producto al padre
}
</script>

<template>
  <div
    v-if="open && product"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden relative">
      <!-- Close -->
      <button
        class="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
        @click="emit('close')"
      >
        ✖
      </button>

      <!-- Galería -->
      <div class="flex overflow-x-auto space-x-4 p-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        <img
          v-for="(img, i) in product.images"
          :key="i"
          :src="img"
          class="h-48 w-auto rounded-lg shadow"
        />
      </div>

      <!-- Detalles -->
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ product.title }}</h2>
        <p class="text-sm text-gray-500 mb-2">Rifero: {{ product.rifero }}</p>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>

        <!-- Tickets -->
        <p class="font-semibold text-blue-800 mb-2">
          Precio por ticket: ${{ product.ticketPrice.toFixed(2) }}
        </p>
        <p class="text-gray-600">
          {{ product.ticketsVendidos.toLocaleString() }} /
          {{ product.ticketsMax.toLocaleString() }} vendidos
        </p>

        <!-- Barra progreso -->
        <div class="w-full bg-gray-200 rounded-full h-3 my-3">
          <div
            class="bg-blue-600 h-3 rounded-full transition-all"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <p class="text-sm text-gray-500">{{ progress }}% vendido</p>

        <!-- Botón comprar -->
        <button
          class="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition"
          @click="handleBuy"
        >
          Comprar Ticket
        </button>
      </div>
    </div>
  </div>
</template>
