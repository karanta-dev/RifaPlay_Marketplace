<template> 
  <transition name="fade"> 
    <div 
      v-if="open" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="close" /> 
  </transition> 

  <transition name="scale-fade"> 
    <div v-if="open" class="fixed inset-0 flex items-center justify-center z-50"> 
<div 
  :class="{
    'max-w-lg': selectionMode === 'auto',
    'max-w-2xl': selectionMode === 'manual'  // achiqué de 3xl → 2xl (~896px)
  }"
  class="bg-white p-6 rounded-xl justify-center text-black shadow-lg w-full relative transition-all duration-300 mx-4 md:mx-0
         max-h-[90vh] overflow-y-auto"
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
          
          <!-- Bloque para USUARIOS AUTENTICADOS -->
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

            <!-- Modo Manual - Integra TicketSelector -->
            <TicketSelector 
              v-else-if="selectionMode === 'manual' && product" 
              :product="product"
              @update:selected="selectedManualTickets = $event"
              :maxTickets="maxAvailable"
            /> 
            
            <!-- Resumen de Compra -->
            <div class="text-right text-lg font-bold pt-4 border-t mt-4"> 
              Total: <span class="text-blue-700">{{ totalPrice }} USD</span> 
            </div> 
            <p v-if="currentQty > 0" class="text-right text-sm text-gray-500">
                Tickets a comprar: **{{ currentQty }}**
            </p> 

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

          <!-- Bloque para USUARIOS NO AUTENTICADOS (solo modo automático) -->
          <template v-else> 
            <input v-model="form.nombre" type="text" placeholder="Nombre completo" class="input" required /> 

            <div class="flex gap-2"> 
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
            
            <div class="p-4 border rounded-xl bg-green-50">
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
import { reactive, computed, ref } from 'vue' 
import { useTicketStore } from '@/stores/useTicketStore' 
import { useAuthStore } from '@/stores/useAuthStore' 
// IMPORTAMOS EL NUEVO COMPONENTE 
import TicketSelector from './TicketSelector.vue' 

const props = defineProps<{ 
  open: boolean 
  product: any | null 
}>() 

const emit = defineEmits(['close', 'confirmed']) 

const ticketStore = useTicketStore() 
const authStore = useAuthStore() 

// ESTADOS PARA SELECCIÓN MANUAL/AUTOMÁTICA
const selectionMode = ref<'auto' | 'manual'>('auto') 
const selectedManualTickets = ref<number[]>([]) // Array de números de ticket seleccionados

const form = reactive({ 
  nombre: '', 
  tipoId: '', 
  numeroId: '', 
  telefono: '', 
  correo: '', 
  tickets: 1, 
  metodoPago: '' 
}) 

const error = ref<string | null>(null) 

const close = () => { 
    // Limpiar la selección manual si el modal se cierra
    if (selectionMode.value === 'manual') selectedManualTickets.value = [] 
    emit('close') 
} 

const maxAvailable = computed(() => { 
  const p = ticketStore.topProducts.find((t: any) => t.title === props.product?.title) 
  if (!p) return 0 
  return Math.max(1, (p.ticketsMax || Infinity) - (p.ticketsVendidos || 0)) 
}) 

// Cantidad actual a comprar (depende del modo y la autenticación) 
const currentQty = computed(() => {
    if (authStore.isAuthenticated) {
        // Usuario autenticado: revisa el modo
        return selectionMode.value === 'auto' 
            ? Math.max(1, Number(form.tickets || 0)) // Usa el campo de cantidad para auto
            : selectedManualTickets.value.length // Usa la longitud del array para manual
    } else {
        // Usuario no autenticado: siempre usa el campo de cantidad (implícitamente modo 'auto')
        return Math.max(1, Number(form.tickets || 0))
    }
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

  if (authStore.isAuthenticated) {
      if (selectionMode.value === 'manual') {
          ticketsToBuy = selectedManualTickets.value
          quantity = ticketsToBuy.length
          
          if (quantity === 0) {
              error.value = 'Debes seleccionar al menos un ticket.'
              return
          }
      } else {
          // Modo automático
          quantity = Math.max(1, Number(form.tickets ?? 1)) 
          if (quantity > maxAvailable.value) { 
              error.value = `Solo quedan ${maxAvailable.value} tickets disponibles` 
              return 
          } 
      }
  } else {
    // Usuario no autenticado (solo modo automático)
    quantity = Math.max(1, Number(form.tickets ?? 1))
    if (quantity > maxAvailable.value) { 
        error.value = `Solo quedan ${maxAvailable.value} tickets disponibles` 
        return 
    }
  }
    
  // Obtener el ID del usuario para el store
  const userId = authStore.user?.id ?? null
  
  // Pasamos ticketsToBuy (el array de números de ticket si es manual)
  // o undefined si es automático, dejando que el store genere los números por la cantidad (quantity)
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
  /* Tailwind equivalent for border and focus styles */
  @apply border-gray-300 focus:ring-2 focus:ring-blue-500;
} 

/* Fondo fade */ 
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; } 
.fade-enter-from, .fade-leave-to { opacity: 0; } 

/* Caja blanca animada */ 
.scale-fade-enter-active, .scale-fade-leave-active { transition: all 0.3s ease; } 
.scale-fade-enter-from { opacity: 0; transform: scale(0.9); } 
.scale-fade-leave-to { opacity: 0; transform: scale(0.9); } 
</style>
