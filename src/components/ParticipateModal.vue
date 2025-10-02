<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="close" />
  </transition>

  <transition name="scale-fade">
    <div v-if="open" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" @click.self="close">
      <div
        :class="{
          'max-w-lg': selectionMode === 'auto',
          'max-w-2xl': selectionMode === 'manual'
        }"
        class="bg-white p-6 rounded-xl justify-center text-black shadow-lg w-full relative transition-all duration-300 mx-4 md:mx-0 max-h-[90vh] overflow-y-auto"
      >
        <img src="/rifaLogo.png" alt="Slot" class="h-24 sm:h-25 w-auto mb-4 block mx-auto" />

        <h2 class="text-xl font-bold mb-4 text-center">Formulario de Participación</h2>

        <form @submit.prevent="handleConfirm" class="space-y-4">
          <!-- Opciones de Selección -->
          <div class="flex justify-center gap-4 p-2 bg-blue-50 rounded-lg">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" v-model="selectionMode" value="auto" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="font-semibold text-gray-700">Selección Automática</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" v-model="selectionMode" value="manual" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="font-semibold text-gray-700">Selección Manual</span>
            </label>
          </div>

          <!-- BLOQUE: USUARIOS AUTENTICADOS -->
          <template v-if="authStore.isAuthenticated">
            <!-- Modo Automático -->
            <div v-if="selectionMode === 'auto'" class="p-4 border rounded-xl bg-green-50">
              <label class="font-semibold text-gray-700 mb-2 block">Cantidad de tickets (Automático)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="form.tickets"
                  type="number"
                  min="1"
                  :max="maxAvailable"
                  placeholder="Cantidad de tickets"
                  class="input flex-grow"
                />
                <div class="text-sm text-gray-700 whitespace-nowrap">Disponibles: <strong>{{ maxAvailable }}</strong></div>
              </div>
            </div>

            <!-- Modo Manual - TicketSelector -->
            <TicketSelector
              v-else-if="selectionMode === 'manual' && product"
              :product="product"
              @update:selected="selectedManualTickets = $event"
              :maxTickets="maxAvailable"
            />

            <!-- Métodos de pago y inputs comunes para auth -->
            <select v-model="form.metodoPago" class="input">
              <option value="">Seleccionar método de pago</option>
              <option value="tarjeta">Tarjeta crédito/débito</option>
              <option value="pago-movil">Pago móvil</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="kontigo">KONTIGO</option>
            </select>

            <div v-if="form.metodoPago" class="p-3 bg-gray-100 rounded-lg text-sm">
              <p v-if="form.metodoPago === 'tarjeta'">Número: 4111-1111-1111-1111</p>
              <p v-if="form.metodoPago === 'pago-movil'">Teléfono: 0412-0000000</p>
              <p v-if="form.metodoPago === 'transferencia'">Banco Ejemplo - Cuenta: 0102-123456789</p>
              <p v-if="form.metodoPago === 'kontigo'">Kontigo - usuario@ejemplo.com</p>
            </div>

            <!-- NUEVOS CAMPOS: referencia + comprobante (imagen) -->
            <div class="space-y-2">
              <input v-model="form.referencia" type="text" placeholder="Referencia" class="input" required />

              <div>
                <label class="block font-semibold text-gray-700 mb-1">Comprobante de pago</label>

                <!-- input file oculto -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />

                <!-- boton visible -->
                <button
                  type="button"
                  @click="fileInput?.value?.click()"
                  class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Insertar imagen foto/captura de pantalla
                </button>

                <p v-if="form.comprobante" class="text-sm text-green-600 mt-2">Archivo seleccionado: {{ form.comprobante.name }}</p>

                <div v-if="previewUrl" class="mt-2">
                  <img :src="previewUrl" alt="preview" class="max-h-40 object-contain border rounded" />
                </div>
              </div>
            </div>

            <!-- Resumen y botones -->
            <div class="text-right text-lg font-bold pt-4 border-t mt-4">
              Total: <span class="text-blue-700">{{ totalPrice }} USD</span>
            </div>
            <p v-if="currentQty > 0" class="text-right text-sm text-gray-500">Tickets a comprar: **{{ currentQty }}**</p>

            <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

            <div class="flex justify-end gap-3 mt-4">
              <button type="button" @click="close" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentQty === 0"
              >
                Participar
              </button>
            </div>
          </template>

          <!-- BLOQUE: USUARIOS NO AUTENTICADOS (AHORA con selección manual disponible) -->
          <template v-else>
            <input v-model="form.nombre" type="text" placeholder="Nombre completo" class="input" required />

            <div class="flex gap-2">
              <select v-model="form.tipoId" class="input w-20" required>
                <option value="">Tipo</option>
                <option>V</option>
                <option>E</option>
                <option>P</option>
              </select>

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

            <!-- Automático -->
            <div v-if="selectionMode === 'auto'" class="p-4 border rounded-xl bg-green-50">
              <label class="font-semibold text-gray-700 mb-2 block">Cantidad de tickets (Automático)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="form.tickets"
                  type="number"
                  min="1"
                  :max="maxAvailable"
                  placeholder="Cantidad de tickets"
                  class="input flex-grow"
                  required
                />
                <div class="text-sm text-gray-700 whitespace-nowrap">Disponibles: <strong>{{ maxAvailable }}</strong></div>
              </div>
            </div>

            <!-- Manual (también para no autenticados) -->
            <TicketSelector
              v-else-if="selectionMode === 'manual' && product"
              :product="product"
              @update:selected="selectedManualTickets = $event"
              :maxTickets="maxAvailable"
            />

            <select v-model="form.metodoPago" class="input" required>
              <option value="">Seleccionar método de pago</option>
              <option value="tarjeta">Tarjeta crédito/débito</option>
              <option value="pago-movil">Pago móvil</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="kontigo">KONTIGO</option>
            </select>

            <div v-if="form.metodoPago" class="p-3 bg-gray-100 rounded-lg text-sm">
              <p v-if="form.metodoPago === 'tarjeta'">Número: 4111-1111-1111-1111</p>
              <p v-if="form.metodoPago === 'pago-movil'">Teléfono: 0412-0000000</p>
              <p v-if="form.metodoPago === 'transferencia'">Banco Ejemplo - Cuenta: 0102-123456789</p>
              <p v-if="form.metodoPago === 'kontigo'">Kontigo - usuario@ejemplo.com</p>
            </div>

            <!-- NUEVOS CAMPOS para no autenticados: referencia + comprobante -->
            <div class="space-y-2">
              <input v-model="form.referencia" type="text" placeholder="Referencia" class="input" required />

              <div>
                <label class="block font-semibold text-gray-700 mb-1">Comprobante de pago</label>

                <!-- input file oculto (mismo ref, solo uno visible a la vez) -->
                <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />

                  <button
                    type="button"
                    @click="fileInput?.click()"
                    class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Insertar imagen foto/captura de pantalla
                  </button>


                <p v-if="form.comprobante" class="text-sm text-green-600 mt-2">Archivo seleccionado: {{ form.comprobante.name }}</p>

                <div v-if="previewUrl" class="mt-2">
                  <img :src="previewUrl" alt="preview" class="max-h-40 object-contain border rounded" />
                </div>
              </div>
            </div>

            <div class="text-right text-lg font-bold pt-4 border-t mt-4">
              Total: <span class="text-blue-700">{{ totalPrice }} USD</span>
            </div>

            <div class="flex justify-end gap-3 mt-4">
              <button type="button" @click="close" class="px-4 py-0 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
              <button type="submit" class="px-4 py-0 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Confirmar</button>
            </div>
          </template>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'
import { useAuthStore } from '@/stores/useAuthStore'
import TicketSelector from './TicketSelector.vue'

const props = defineProps<{
  open: boolean
  product: any | null
}>()

const emit = defineEmits(['close', 'confirmed'])

const ticketStore = useTicketStore()
const authStore = useAuthStore()

// SELECCIÓN
const selectionMode = ref<'auto' | 'manual'>('auto')
const selectedManualTickets = ref<number[]>([])

// file input ref (el mismo ref se usa porque solo hay un bloque visible a la vez)
const fileInput = ref<HTMLInputElement | null>(null)

// Tipado del form
const form = ticketStore.formData

// preview management
const previewUrl = ref<string | null>(null)
watch(() => form.comprobante, (newFile, oldFile) => {
  if (previewUrl.value) {
    // revoke previous
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile)
  } else {
    previewUrl.value = null
  }
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  ticketStore.setComprobante(file)
}

function clearFile() {
  ticketStore.setComprobante(null)
}

const error = ref<string | null>(null)

const close = () => {
  if (selectionMode.value === 'manual') selectedManualTickets.value = []
  emit('close')
}

const maxAvailable = computed(() => {
  const p = ticketStore.topProducts.find((t: any) => t.title === props.product?.title)
  if (!p) return 0
  return Math.max(1, (p.ticketsMax || Infinity) - (p.ticketsVendidos || 0))
})

// Unificamos: si selectionMode manual => cantidad = seleccionados, sino => form.tickets
const currentQty = computed(() => {
  return selectionMode.value === 'manual'
    ? selectedManualTickets.value.length
    : Math.max(1, Number(form.tickets || 0))
})

const totalPrice = computed(() => {
  const p = ticketStore.topProducts.find((t: any) => t.title === props.product?.title)
  const price = p?.ticketPrice ?? 0
  return (currentQty.value * Number(price)).toFixed(2)
})

const handleConfirm = () => {
  error.value = null

  let ticketsToBuy: number[] | undefined = undefined
  let quantity: number

  // Ahora manual está permitido tanto para auth como para no auth
  if (selectionMode.value === 'manual') {
    ticketsToBuy = selectedManualTickets.value
    quantity = ticketsToBuy.length
    if (quantity === 0) {
      error.value = 'Debes seleccionar al menos un ticket.'
      return
    }
  } else {
    // Auto
    quantity = Math.max(1, Number(form.tickets ?? 1))
    if (quantity > maxAvailable.value) {
      error.value = `Solo quedan ${maxAvailable.value} tickets disponibles`
      return
    }
  }

  // Obtener userId (null si no autenticado)
  const userId = authStore.user?.id ?? null

  // Pasar form y ticketsToBuy (si manual) al store
  ticketStore.generateTicket(form, props.product, userId, ticketsToBuy)
  emit('confirmed')
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  @apply border-gray-300 focus:ring-2 focus:ring-blue-500;
  background-color: #ffffff; /* fondo blanco */
  color: #000000; /* texto negro */
  
}

.input option {
  background-color: #ffffff;
  color: #000000;
}
/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-fade-enter-active,
.scale-fade-leave-active {
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
