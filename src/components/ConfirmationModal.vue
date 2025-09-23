<template>
  <div v-if="open" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 class="text-2xl font-bold text-green-600 mb-4">✅ Pago exitoso</h2>
      <p class="text-lg mb-4">Gracias por tu compra, {{ ticketStore.formData?.nombre }}</p>
      
      <div class="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 mb-4">
        <p class="text-lg font-bold">🎟️ Ticket N°</p>
        <p class="text-3xl font-extrabold text-blue-700">{{ ticketStore.ticketNumber }}</p>
      </div>

      <p class="text-lg font-semibold text-gray-700">¡Suerte! 🍀</p>

      <button @click="close" class="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg">Cerrar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicketStore } from '@/stores/useTicketStore'
const ticketStore = useTicketStore()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const close = () => {
  ticketStore.reset()
  emit('close')
}
</script>
