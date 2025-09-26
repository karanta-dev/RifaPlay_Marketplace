<template>
  <!-- Fondo negro con fade -->
  <transition name="fade">
    <div 
      v-if="open" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="close"
    />
  </transition>

  <!-- Caja blanca con zoom/slide -->
  <transition name="scale-fade">
    <div 
      v-if="open" 
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl justify-center text-black shadow-lg w-full max-w-lg relative">
  <img src="/rifaLogo.png" alt="Slot" class="h-32 sm:h-48 w-auto mb-4 block mx-auto" />

        <h2 class="text-xl font-bold mb-4 text-center">Formulario de Participación</h2>

        <!-- Formulario -->
        <form @submit.prevent="handleConfirm" class="space-y-4">
          <input v-model="form.nombre" type="text" placeholder="Nombre completo" class="input" required />

          <div class="flex gap-2">
  <!-- Select pequeño -->
  <select 
    v-model="form.tipoId" 
    class="input w-20" 
    required
  >
    <option value="">Tipo</option>
    <option>V</option>
    <option>E</option>
    <option>P</option>
  </select>

  <!-- Input grande -->
  <input 
    v-model="form.numeroId" 
    type="text" 
    placeholder="Número de identificación" 
    class="input flex-grow text-gray-800" 
    required 
  />
</div>

          <input v-model="form.telefono" type="tel" placeholder="Teléfono" class="input" required />
          <input v-model="form.correo" type="email" placeholder="Correo" class="input" required />
          <input v-model.number="form.tickets" type="number" min="1" placeholder="Cantidad de tickets" class="input" required />

          <!-- Select de pago -->
          <select v-model="form.metodoPago" class="input" required>
            <option value="">Seleccionar método de pago</option>
            <option value="tarjeta">Tarjeta crédito/débito</option>
            <option value="pago-movil">Pago móvil</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="kontigo">KONTIGO</option>
          </select>

          <!-- Datos ficticios de pago -->
          <div v-if="form.metodoPago" class="p-3 bg-gray-100 rounded-lg text-sm">
            <p v-if="form.metodoPago === 'tarjeta'">Número: 4111-1111-1111-1111</p>
            <p v-if="form.metodoPago === 'pago-movil'">Teléfono: 0412-0000000</p>
            <p v-if="form.metodoPago === 'transferencia'">Banco Ejemplo - Cuenta: 0102-123456789</p>
            <p v-if="form.metodoPago === 'kontigo'">Kontigo - usuario@ejemplo.com</p>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="close" class="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'

const props = defineProps<{
  open: boolean
  product: any | null
}>()

const emit = defineEmits(['close', 'confirmed'])

const ticketStore = useTicketStore()

const form = reactive({
  nombre: '',
  tipoId: '',
  numeroId: '',
  telefono: '',
  correo: '',
  tickets: 1,
  metodoPago: ''
})

const close = () => emit('close')

const handleConfirm = () => {
  // debug rápido (te ayudará a ver qué métodos están disponibles)
  console.log('ticketStore keys:', Object.keys(ticketStore))
  if (typeof ticketStore.generateTicket === 'function') {
    ticketStore.generateTicket(form)
  } else if (typeof ticketStore.venderTickets === 'function') {
    // fallback si tu store no tiene generateTicket
    ticketStore.venderTickets(form.tickets ?? 1)
    // opcional: setear ticketNumber / formData manualmente
    ticketStore.formData = { ...form }
    ticketStore.ticketNumber = Math.floor(100000 + Math.random() * 900000)
  } else {
    console.error('El store no expone generateTicket ni venderTickets')
  }
  emit('confirmed')
}

</script>

<style scoped>
.input {
  @apply w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none;
}

/* Fondo fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Caja blanca animada */
.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all 0.3s ease;
}
.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
