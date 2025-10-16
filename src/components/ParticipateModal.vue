<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" @click="close" />
  </transition>

  <transition name="scale-fade">
    <div v-if="open" class="fixed inset-0 flex items-center justify-center z-50 p-0" @click.self="close">

      <div
        :class="{
          'max-w-lg': selectionMode === 'auto',
          'max-w-2xl': selectionMode === 'manual'
        }"
        class="bg-gradient-to-br from-blue-900 to-orange-800 rounded-2xl shadow-2xl p-2 relative transition-all duration-300 mx-4 md:mx-0 max-h-[90vh] overflow-y-auto overflow-x-hidden border border-purple-400/30"
      >
        <button
          class="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 border border-white/20 backdrop-blur-sm"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-xl"></div>

        <div class="relative z-10 mb-4">
          <div class="flex items-center justify-left gap-10 ">
            <img src="/rifaLogo.png" alt="Slot" class="h-12 sm:h-16 w-auto" />
            <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Compra de tickets
            </h2>
          </div>
        </div>

        <form @submit.prevent="handleConfirm" class="space-y-6 relative z-10">
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

          <template v-if="!authStore.isAuthenticated">
            <div class="space-y-4 bg-black/20 p-3 rounded-xl border border-white/10">
              <input 
                v-model="form.nombre" 
                type="text" 
                placeholder="👤 Nombre completo" 
                class="input-custom" 
                required 
              />
              <div class="flex gap-2">
                <select v-model="form.tipoId" class="select-custom" required>
                  <option value="V">V</option>
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
          </template>
          
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
                :required="selectionMode === 'auto'"
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

          <div class="space-y-4">
            <label class="font-semibold text-white text-lg">💳 Método de Pago</label>
            <select v-model="form.metodoPago" class="input-custom" :required="!authStore.isAuthenticated">
              <option value="">Seleccionar método de pago</option>
              <option value="binance">Binance</option>
              <option value="kontigo">KONTIGO</option>
              <option value="pago-movil">Pago móvil</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="tarjeta">Tarjeta crédito/débito</option>
              <option value="zelle">Zelle</option>
            </select>

            <div v-if="form.metodoPago === 'pago-movil'" class="mt-4">
              <div class="flex bg-black/30 rounded-xl p-1 border border-cyan-500/30 shadow-lg">
                <button
                  type="button"
                  @click="pagoMovilMode = 'manual'"
                  :class="{
                    'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform scale-105': pagoMovilMode === 'manual',
                    'text-white/70 hover:text-white bg-transparent': pagoMovilMode !== 'manual'
                  }"
                  class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-out backdrop-blur-sm border border-transparent hover:border-cyan-500/30"
                >
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-lg">👤</span>
                    <span>Manual</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  @click="pagoMovilMode = 'automatico'"
                  :class="{
                    'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg transform scale-105': pagoMovilMode === 'automatico',
                    'text-white/70 hover:text-white bg-transparent': pagoMovilMode !== 'automatico'
                  }"
                  class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-out backdrop-blur-sm border border-transparent hover:border-emerald-500/30"
                >
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-lg">⚡</span>
                    <span>Automático</span>
                  </div>
                </button>
              </div>

              <div v-if="pagoMovilMode === 'manual'" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30">
                <p class="flex items-center gap-2">
                  <span class="text-cyan-400">📱</span>Teléfono: 0414-1908656 <br></br> RIF-J:507080994 <br></br>Banco nacional de credito (0191) 
                </p>
              </div>

              <div v-else-if="pagoMovilMode === 'automatico'" class="space-y-4">
                <h3 class="font-semibold text-cyan-300 text-lg">Ingrese los datos de pago móvil</h3>
                
                <input v-model="form.pagoMovilCedula" type="text" placeholder="🔢 Número de cédula" class="input-custom" maxlength="8" />
                <input v-model="form.pagoMovilTelefono" type="tel" placeholder="📞 Número de teléfono" class="input-custom" maxlength="11" />
                <select v-model="form.pagoMovilBanco" class="input-custom">
                  <option value="">🏦 Seleccionar banco</option>
                  <option value="banco-de-venezuela">Banco de Venezuela</option>
                  <option value="bancaamiga">BancaAmiga</option>
                  <option value="mercantil">Mercantil</option>
                  <option value="bancaribe">Bancaribe</option>
                  <option value="banco-del-tesoro">Banco del Tesoro</option>
                </select>
              </div>
            </div>

            <div v-else-if="form.metodoPago" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30">
              <p v-if="form.metodoPago === 'tarjeta'" class="flex items-center gap-2">
                <span class="text-cyan-400">🔒</span> Número: 4111-1111-1111-1111
              </p>
              <p v-if="form.metodoPago === 'transferencia'" class="flex items-center gap-2">
                <span class="text-cyan-400">🏦</span> Banco Ejemplo - Cuenta: 0102-123456789
              </p>
              <p v-if="form.metodoPago === 'kontigo'" class="flex items-center gap-2">
                <span class="text-cyan-400">⚡</span> Kontigo - usuario@ejemplo.com
              </p>
              <p v-if="form.metodoPago === 'binance'" class="flex items-center gap-2">
                <span class="text-cyan-400">⚡</span> Binance - usuario@ejemplo.com
              </p>
              <p v-if="form.metodoPago === 'zelle'" class="flex items-center gap-2">
                <span class="text-cyan-400">⚡</span> Zelle - usuario@ejemplo.com
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <input 
              v-if="!(form.metodoPago === 'pago-movil' && pagoMovilMode === 'automatico')"
              v-model="form.referencia" 
              type="text" 
              placeholder="🔖 Número de referencia" 
              class="input-custom" 
              required 
            />

            <div v-if="!(form.metodoPago === 'pago-movil' && pagoMovilMode === 'automatico')">
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

          <div class="pt-4 border-t border-white/20 mt-6 ">
            <div class="flex flex-col items-end gap-1">
              <p class="text-lg font-bold text-white">
                Precio:
                <strong class="text-2xl text-yellow-400 ml-2">
                  {{ loadingBcv ? 'Cargando...' : `${totalPriceBs} Bs` }}
                </strong>
              </p>
              
              <span v-if="!loadingBcv && bcvRate > 0" class="text-sm text-gray-400">
                (Tasa BCV: {{ bcvRate.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }} Bs/USD)
              </span>
            </div>

            <div class="text-right space-y-2">
              <p class="text-lg font-bold text-white">
                Precio: <span class="text-2xl text-yellow-400 ml-2">{{ totalPrice }} USD</span>
              </p>
              
              <p v-if="currentQty > 0" class="text-sm text-cyan-300">
                Tickets a comprar: <strong class="text-white">{{ currentQty }}</strong>
              </p>
            </div>
          </div>

          <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            ⚠️ {{ error }}
          </div>

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
              🎉 {{ authStore.isAuthenticated ? 'Participar' : 'Confirmar' }}
            </button>
          </div>
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
const bcvRate = ref(0)
const loadingBcv = ref(false)
// Agrega esto con las otras refs
const pagoMovilMode = ref<'manual' | 'automatico'>('manual')
// SELECCIÓN
const selectionMode = ref<'auto' | 'manual'>('auto')
const selectedManualTickets = ref<number[]>([])

// ✅ NUEVO: Guardar el estado inicial ANTES de generar tickets
const initialTicketsCount = ref(0)

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

// ✅ CALCULAR ESTADO INICIAL CUANDO SE ABRE EL MODAL
watch(() => props.open, (open) => {
  if (open) {
    // Calcular tickets iniciales ANTES de cualquier compra
    const userId = authStore.user?.id
    if (userId) {
      initialTicketsCount.value = ticketStore.userTicketsCount(userId)
    } else {
      initialTicketsCount.value = ticketStore.tickets.filter(t => t.userId === null).length
    }
    console.log('📊 Initial tickets calculated:', initialTicketsCount.value)
  }
})
// ✅ NUEVO: Función para obtener la tasa BCV
async function fetchBcvRate() {
  loadingBcv.value = true
  try {
    const response = await fetch('https://bcv-api.karanta.dev/rates/')
    const data = await response.json()
    bcvRate.value = data.bcv || 0
    console.log('💰 BCV Rate:', bcvRate.value)
  } catch (error) {
    console.error('❌ Error fetching BCV rate:', error)
    bcvRate.value = 0
  } finally {
    loadingBcv.value = false
  }
}
watch(() => form.pagoMovilTelefono, (newValue) => {
  if (newValue) {
    form.pagoMovilTelefono = newValue.replace(/[^\d]/g, '')
  }
})
// ✅ NUEVO: Computed para el precio en bolívares
const totalPriceBs = computed(() => {
  if (!bcvRate.value) return '0,00'
  const totalUsd = parseFloat(totalPrice.value)
  const totalBs = totalUsd * bcvRate.value
  return totalBs.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

// ✅ NUEVO: Cargar tasa BCV cuando se abre el modal
watch(() => props.open, (open) => {
  if (open) {
    fetchBcvRate()
    
    // Calcular tickets iniciales ANTES de cualquier compra
    const userId = authStore.user?.id
    if (userId) {
      initialTicketsCount.value = ticketStore.userTicketsCount(userId)
    } else {
      initialTicketsCount.value = ticketStore.tickets.filter(t => t.userId === null).length
    }
    console.log('📊 Initial tickets calculated:', initialTicketsCount.value)
  }
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
  
  // ✅ Guardar el estado inicial ANTES de generar tickets
  const initialTickets = initialTicketsCount.value
  const purchasedTickets = quantity
  
  console.log('🎫 Pre-generateTicket:', {
    initialTickets,
    purchasedTickets,
    ticketsToBuy
  })
  
  // Generar tickets
  ticketStore.generateTicket(form, props.product, userId, ticketsToBuy)
  
  console.log('🎫 Post-generateTicket:', {
    lastAssignedTickets: ticketStore.lastAssignedTickets,
    ticketNumber: ticketStore.ticketNumber
  })
  
  // Guardar los totales en el store ANTES de emitir el evento
  ticketStore.formData.totalPrice = parseFloat(totalPrice.value);
  ticketStore.formData.totalPriceBs = parseFloat(totalPriceBs.value);

  // ✅ Emitir con los datos CORRECTOS del estado anterior
  emit('confirmed', {
    initialTickets,
    purchasedTickets
  })
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

.select-custom {
  width: auto;
  min-width: 80px;
  max-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  outline: none;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-custom:focus,
.select-custom:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  background: rgba(0, 0, 0, 0.5);
}

.input-custom::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.select-custom option {
  background: #1e1b4b;
  color: white;
}
</style>