<template>
  <div 
    v-if="props.open"
    class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
    @click.self="close"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-gray-800 relative overflow-hidden"
    >
      <!-- 🟣 Título -->
      <h1 class="text-3xl font-extrabold text-center text-indigo-700 mb-2">RifaPlay</h1>
      <p class="text-center text-sm text-gray-500 mb-4">{{ formattedDate }}</p>

      <!-- 🧍 Datos del Cliente -->
      <div class="text-left mb-4">
        <p class="font-semibold">
          Cédula:
          <span class="font-normal">
            {{ ticketStore.formData.tipoId }}-{{ ticketStore.formData.numeroId ?? '—' }}
          </span>
        </p>
        <p class="font-semibold">
          Cliente:
          <span class="font-normal">{{ ticketStore.formData.nombre || 'Usuario' }}</span>
        </p>
      </div>

      <hr class="border-gray-300 my-3" />

      <!-- 🎟️ Datos de la rifa -->
      <div class="text-left mb-4">
        <p><span class="font-semibold">Rifa:</span> {{ selectedProduct?.title ?? 'Sin nombre' }}</p>
        <p><span class="font-semibold">Creador:</span> {{ selectedProduct?.rifero ?? 'Desconocido' }}</p>

        <div class="mt-3">
          <p class="font-semibold mb-2">Tickets seleccionados:</p>
          <div
            v-if="ticketStore.formData.selectionMode === 'manual' && ticketStore.formData.selectedManualTickets?.length"
            class="flex flex-wrap gap-2"
          >
            <span
              v-for="(num, i) in ticketStore.formData.selectedManualTickets"
              :key="i"
              class="px-3 py-1 bg-indigo-100 rounded-lg text-indigo-700 font-bold"
            >
              {{ num }}
            </span>
          </div>
          <div v-else-if="ticketStore.lastAssignedTickets?.length" class="flex flex-wrap gap-2">
            <span
              v-for="(num, i) in ticketStore.lastAssignedTickets"
              :key="i"
              class="px-3 py-1 bg-indigo-100 rounded-lg text-indigo-700 font-bold"
            >
              {{ num }}
            </span>
          </div>
          <p v-else class="text-gray-500 italic">—</p>
        </div>
      </div>

      <hr class="border-gray-300 my-3" />

      <!-- 💳 Totales -->
      <div class="text-sm mb-4">
        <div class="flex justify-between mb-1">
          <span class="font-semibold">Pagado en Bs:</span>
          <span class="font-bold">{{ formatCurrency(ticketStore.formData.totalPriceBs) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Ref USD:</span>
          <span>{{ formatCurrency(ticketStore.formData.totalPrice, 'USD') }}</span>
        </div>
      </div>

      <!-- 📱 QR -->
      <div class="flex justify-center my-4">
        <img
          :src="qrPlaceholder"
          alt="QR Code"
          class="w-32 h-32 object-contain"
        />
      </div>

      <hr class="border-gray-300 my-4" />

      <!-- 🟡 Botones -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="downloadInvoice"
          class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl shadow transition-all duration-300"
        >
          📄 Descargar factura
        </button>

        <button
          @click="handleContinue"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow transition-all duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

const props = defineProps<{ open: boolean, selectedProduct?: any }>()
const emit = defineEmits(['close', 'showJackpot'])
const ticketStore = useTicketStore()

const close = () => emit('close')
const handleContinue = () => {
  emit('showJackpot')
  emit('close')
}

// 🗓 Fecha formateada
const formattedDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// 🧾 Factura simple
function downloadInvoice() {
  const data = `
Factura - RifaPlay
-----------------------
Cliente: ${ticketStore.formData.nombre}
Cédula: ${ticketStore.formData.tipoId}-${ticketStore.formData.numeroId}
Teléfono: ${ticketStore.formData.telefono}
Correo: ${ticketStore.formData.correo}

Rifa: ${props.selectedProduct?.title ?? '—'}
Creador: ${props.selectedProduct?.rifero ?? '—'}

Tickets: ${
    ticketStore.formData.selectionMode === 'manual'
      ? ticketStore.formData.selectedManualTickets.join(', ')
      : ticketStore.lastAssignedTickets.join(', ')
  }

Total USD: $${ticketStore.formData.totalPrice?.toFixed(2)}
Total Bs: ${ticketStore.formData.totalPriceBs?.toFixed(2)}

Fecha: ${formattedDate.value}
  `
  const blob = new Blob([data], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Factura_${ticketStore.formData.nombre || 'Cliente'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const qrPlaceholder =
  'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RifaPlay-' +
  Math.random().toString(36).substring(2, 10)

const formatCurrency = (value: number | string | undefined, currency = 'Bs') => {
  if (!value) return '0.00 ' + currency
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('es-VE', { minimumFractionDigits: 2 }) + ' ' + currency
}
</script>

<style scoped>
.fixed {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
