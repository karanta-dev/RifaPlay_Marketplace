<template>
  <div
    v-if="open && product"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden relative"
    >
      <!-- Close -->
      <button
        class="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
        @click="emit('close')"
      >
        ✖
      </button>

      <!-- Galería -->
      <div
        class="flex overflow-x-auto space-x-4 p-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100"
      >
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

        <!-- Rifero con foto e hipervínculo -->
        <div
          class="flex items-center space-x-2 cursor-pointer hover:opacity-80"
          @click="goToRiferoProfile"
        >
          <img
            v-if="riferoUser?.avatar"
            :src="riferoUser.avatar"
            alt="avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold"
          >
            {{ product.rifero.charAt(0).toUpperCase() }}
          </div>
          <span class="text-sm text-blue-600 underline">
            {{ product.rifero }}
          </span>

        </div>

        <p class="text-gray-600 mb-4 mt-2">{{ product.description }}</p>

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

<script setup lang="ts">
import { computed } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'

const props = defineProps<{ open: boolean; product: any | null }>()
const emit = defineEmits(['close', 'buy'])

const ticketStore = useTicketStore()
const userStore = useUserStore()
const router = useRouter()

// 🧑‍💻 Buscar el usuario (rifero) por nombre
const riferoUser = computed(() =>
  props.product ? userStore.getUserByName(props.product.rifero) : null
)

const progress = computed(() =>
  props.product ? ticketStore.productProgress(props.product) : 0
)
const close = () => {
  // keep lastAssignedTickets for possible later inspection, but reset temporary form/ticketNumber
  emit('close')
}
function handleBuy() {
  emit('buy', props.product)
}

function goToRiferoProfile() {
  if (riferoUser.value) {
    router.push({ name: 'user-profile', params: { id: riferoUser.value.id } })
  }
}
</script>

