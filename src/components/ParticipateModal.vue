<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" @click="close" />
  </transition>

  <transition name="scale-fade">
    <div v-if="open" class="fixed inset-0 flex items-center justify-center z-50 p-4" @click.self="close">
      
<div
  :class="{
    'max-w-lg': selectionMode === 'auto',
    'max-w-2xl': selectionMode === 'manual'
  }"
  class="bg-gradient-to-br from-blue-900 to-orange-800 rounded-2xl shadow-2xl p-8 relative transition-all duration-300 mx-4 md:mx-0 max-h-[90vh] overflow-y-auto overflow-x-hidden border border-purple-400/30"
>
      <!-- Botón cerrar -->
      <button
        class="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-sm"
        @click="emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
        <!-- Efectos de brillo -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-xl"></div>
        
        <!-- Logo -->
        <div class="relative z-10 text-center mb-6">
          
        <img src="/rifaLogo.png" alt="Slot" class="h-24 sm:h-25 w-auto mb-4 block mx-auto" />

          <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Formulario de Participación
          </h2>
        </div>

        <form @submit.prevent="handleConfirm" class="space-y-6 relative z-10">
          <!-- Opciones de Selección -->
          <div class="flex justify-center gap-4 p-4 bg-black/30 rounded-xl border border-white/10">
            <label class="flex items-center space-x-3 cursor-pointer group">
              <div class="relative">
                <input 
                  type="radio" 
                  v-model="selectionMode" 
                  value="auto" 
                  class="h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500 bg-transparent"
                />
              </div>
              <span class="font-semibold text-white group-hover:text-cyan-300 transition-colors">Selección Automática</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer group">
              <div class="relative">
                <input 
                  type="radio" 
                  v-model="selectionMode" 
                  value="manual" 
                  class="h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500 bg-transparent"
                />
              </div>
              <span class="font-semibold text-white group-hover:text-cyan-300 transition-colors">Selección Manual</span>
            </label>
          </div>

          <!-- BLOQUE: USUARIOS AUTENTICADOS -->
          <template v-if="authStore.isAuthenticated">
            <!-- Modo Automático -->
            <div v-if="selectionMode === 'auto'" class="p-5 bg-black/30 rounded-xl border border-cyan-500/30">
              <label class="font-semibold text-cyan-300 mb-3 block text-lg">🎲 Cantidad de tickets (Automático)</label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="form.tickets"
                  type="number"
                  min="1"
                  :max="maxAvailable"
                  placeholder="Cantidad de tickets"
                  class="input-custom flex-grow"
                />
                <div class="text-sm text-white whitespace-nowrap">
                  Disponibles: <strong class="text-yellow-400">{{ maxAvailable }}</strong>
                </div>
              </div>
            </div>

            <!-- Modo Manual - TicketSelector -->
            <div v-else-if="selectionMode === 'manual' && product" class="bg-black/20 rounded-xl border border-white/10 p-4">
              <TicketSelector
                :product="product"
                @update:selected="selectedManualTickets = $event"
                :maxTickets="maxAvailable"
              />
            </div>

            <!-- Métodos de pago -->
            <div class="space-y-4">
              <label class="font-semibold text-white text-lg">💳 Método de Pago</label>
              <select v-model="form.metodoPago" class="input-custom">
                <option value="">Seleccionar método de pago</option>
                <option value="tarjeta">Tarjeta crédito/débito</option>
                <option value="pago-movil">Pago móvil</option>
                <option value="transferencia">Transferencia bancaria</option>
                <option value="kontigo">KONTIGO</option>
              </select>

              <div v-if="form.metodoPago" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30">
                <p v-if="form.metodoPago === 'tarjeta'" class="flex items-center gap-2">
                  <span class="text-cyan-400">🔒</span> Número: 4111-1111-1111-1111
                </p>
                <p v-if="form.metodoPago === 'pago-movil'" class="flex items-center gap-2">
                  <span class="text-cyan-400">📱</span> Teléfono: 0412-0000000
                </p>
                <p v-if="form.metodoPago === 'transferencia'" class="flex items-center gap-2">
                  <span class="text-cyan-400">🏦</span> Banco Ejemplo - Cuenta: 0102-123456789
                </p>
                <p v-if="form.metodoPago === 'kontigo'" class="flex items-center gap-2">
                  <span class="text-cyan-400">⚡</span> Kontigo - usuario@ejemplo.com
                </p>
              </div>
            </div>

            <!-- Referencia + Comprobante -->
            <div class="space-y-4">
              <input 
                v-model="form.referencia" 
                type="text" 
                placeholder="🔖 Número de referencia" 
                class="input-custom" 
                required 
              />

              <div>
                <label class="block font-semibold text-white mb-3 text-lg">📎 Comprobante de pago</label>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />
                <button
                  type="button"
                  @click="triggerFileDialog"
                  class="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30"
                >
                  📸 Insertar imagen del comprobante
                </button>
                <p v-if="form.comprobante" class="text-sm text-green-400 mt-2 flex items-center gap-2">
                  <span>✅</span> Archivo seleccionado: {{ form.comprobante.name }}
                </p>
                <div v-if="previewUrl" class="mt-3">
                  <img :src="previewUrl" alt="preview" class="max-h-40 object-contain border-2 border-cyan-500/50 rounded-xl shadow-lg" />
                </div>
              </div>
            </div>

            <!-- Resumen -->
            <div class="pt-4 border-t border-white/20 mt-6">
              <div class="text-right space-y-2">
                <p class="text-lg font-bold text-white">
                  Total: <span class="text-2xl text-yellow-400 ml-2">{{ totalPrice }} USD</span>
                </p>
                <p v-if="currentQty > 0" class="text-sm text-cyan-300">
                  Tickets a comprar: <strong class="text-white">{{ currentQty }}</strong>
                </p>
              </div>
            </div>

            <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              ⚠️ {{ error }}
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                @click="close" 
                class="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-500/30"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-green-400/30"
                :disabled="currentQty === 0"
              >
                🎉 Participar
              </button>
            </div>
          </template>

          <!-- BLOQUE: USUARIOS NO AUTENTICADOS -->
          <template v-else>
            <div class="space-y-4 bg-black/20 p-5 rounded-xl border border-white/10">
              <input 
                v-model="form.nombre" 
                type="text" 
                placeholder="👤 Nombre completo" 
                class="input-custom" 
                required 
              />

              <div class="flex gap-3">
                <select v-model="form.tipoId" class="input-custom w-24" required>
                  <option value="">Tipo</option>
                  <option>V</option>
                  <option>E</option>
                  <option>P</option>
                </select>
                <input
                  v-model="form.numeroId"
                  type="text"
                  placeholder="🆔 Número de identificación"
                  class="input-custom flex-grow"
                  required
                />
              </div>

              <input v-model="form.telefono" type="tel" placeholder="📞 Teléfono" class="input-custom" required />
              <input v-model="form.correo" type="email" placeholder="📧 Correo electrónico" class="input-custom" required />
            </div>

            <!-- Selección de tickets para no autenticados -->
            <div v-if="selectionMode === 'auto'" class="p-5 bg-black/30 rounded-xl border border-cyan-500/30">
              <label class="font-semibold text-cyan-300 mb-3 block text-lg">🎲 Cantidad de tickets (Automático)</label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="form.tickets"
                  type="number"
                  min="1"
                  :max="maxAvailable"
                  placeholder="Cantidad de tickets"
                  class="input-custom flex-grow"
                  required
                />
                <div class="text-sm text-white whitespace-nowrap">
                  Disponibles: <strong class="text-yellow-400">{{ maxAvailable }}</strong>
                </div>
              </div>
            </div>

            <div v-else-if="selectionMode === 'manual' && product" class="bg-black/20 rounded-xl border border-white/10 p-4">
              <TicketSelector
                :product="product"
                @update:selected="selectedManualTickets = $event"
                :maxTickets="maxAvailable"
              />
            </div>

            <!-- Resto del formulario para no autenticados -->
            <div class="space-y-4">
              <select v-model="form.metodoPago" class="input-custom" required>
                <option value="">💳 Seleccionar método de pago</option>
                <option value="tarjeta">Tarjeta crédito/débito</option>
                <option value="pago-movil">Pago móvil</option>
                <option value="transferencia">Transferencia bancaria</option>
                <option value="kontigo">KONTIGO</option>
              </select>

              <div v-if="form.metodoPago" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30">
                <p v-if="form.metodoPago === 'tarjeta'" class="flex items-center gap-2">
                  <span class="text-cyan-400">🔒</span> Número: 4111-1111-1111-1111
                </p>
                <p v-if="form.metodoPago === 'pago-movil'" class="flex items-center gap-2">
                  <span class="text-cyan-400">📱</span> Teléfono: 0412-0000000
                </p>
                <p v-if="form.metodoPago === 'transferencia'" class="flex items-center gap-2">
                  <span class="text-cyan-400">🏦</span> Banco Ejemplo - Cuenta: 0102-123456789
                </p>
                <p v-if="form.metodoPago === 'kontigo'" class="flex items-center gap-2">
                  <span class="text-cyan-400">⚡</span> Kontigo - usuario@ejemplo.com
                </p>
              </div>
            </div>

            <!-- Referencia + Comprobante para no autenticados -->
            <div class="space-y-4">
              <input v-model="form.referencia" type="text" placeholder="🔖 Referencia" class="input-custom" required />
              <div>
                <label class="block font-semibold text-white mb-3 text-lg">📎 Comprobante de pago</label>
                <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
                <button
                  type="button"
                  @click="fileInput?.click()"
                  class="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30"
                >
                  📸 Insertar imagen del comprobante
                </button>
                <p v-if="form.comprobante" class="text-sm text-green-400 mt-2 flex items-center gap-2">
                  <span>✅</span> Archivo seleccionado: {{ form.comprobante.name }}
                </p>
                <div v-if="previewUrl" class="mt-3">
                  <img :src="previewUrl" alt="preview" class="max-h-40 object-contain border-2 border-cyan-500/50 rounded-xl shadow-lg" />
                </div>
              </div>
            </div>

            <!-- Resumen para no autenticados -->
            <div class="text-right text-lg font-bold pt-4 border-t border-white/20 mt-6">
              <p class="text-white">
                Total: <span class="text-2xl text-yellow-400 ml-2">{{ totalPrice }} USD</span>
              </p>
            </div>

            <!-- Botones para no autenticados -->
            <div class="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                @click="close" 
                class="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-500/30"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-400/30"
              >
                🎉 Confirmar
              </button>
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

// file input ref
const fileInput = ref<HTMLInputElement | null>(null)
function triggerFileDialog() {
  fileInput.value?.click()
}

const form = ticketStore.formData

// preview management
const previewUrl = ref<string | null>(null)
watch(() => form.comprobante, (newFile) => {
  if (previewUrl.value) {
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

  if (selectionMode.value === 'manual') {
    ticketsToBuy = selectedManualTickets.value
    quantity = ticketsToBuy.length
    if (quantity === 0) {
      error.value = 'Debes seleccionar al menos un ticket.'
      return
    }
  } else {
    quantity = Math.max(1, Number(form.tickets ?? 1))
    if (quantity > maxAvailable.value) {
      error.value = `Solo quedan ${maxAvailable.value} tickets disponibles`
      return
    }
  }

  const userId = authStore.user?.id ?? null
  ticketStore.generateTicket(form, props.product, userId, ticketsToBuy)
  emit('confirmed')
}
</script>

<style scoped>
.input-custom {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  outline: none;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-custom:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  background: rgba(0, 0, 0, 0.5);
}

.input-custom::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-custom option {
  background: #1e1b4b;
  color: white;
}

/* Animaciones mejoradas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>