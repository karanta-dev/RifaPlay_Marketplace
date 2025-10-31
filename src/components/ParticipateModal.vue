<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" @click="close" />
  </transition>

  <transition name="scale-fade">
    <div v-if="open" class="fixed inset-0 flex items-center justify-center z-50 p-0" @click.self="close">

      <div
        :class="[
          selectionMode === 'auto' ? 'max-w-lg' : 'max-w-2xl',
          'bg-gradient-to-br from-blue-900 to-purple-800 rounded-2xl shadow-2xl p-2 relative transition-all duration-300 mx-4 md:mx-0 max-h-[90vh] border border-purple-400/30',
          !authStore.isAuthenticated ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'
        ]"
      >
        <button
          v-if="authStore.isAuthenticated"
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
          <template v-if="!authStore.isAuthenticated">
            <div class="p-6 bg-black/20 rounded-xl border border-white/10 text-center">
              <p class="text-white text-lg font-semibold mb-2">Necesitas iniciar sesión</p>
              <p class="text-gray-300 mb-4">Debes estar autenticado para comprar tickets. Inicia sesión o regístrate para continuar y guardar tus tickets en tu cuenta (Solo mayores de 18).</p>
              <div class="flex justify-center gap-3">
                <button type="button" @click="triggerAuth" class="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500">Iniciar sesión / Registrarse</button>
                <button type="button" @click="close" class="px-5 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500">Cerrar</button>
              </div>
            </div>
          </template>

          <template v-else>

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
      :soldTickets="soldTicketNumbers" 
      :loadingTickets="loadingSoldTickets" />
  </div>

          <div class="space-y-4">
            <label class="font-semibold text-white text-lg">💳 Método de Pago</label>
            
            <select 
                v-model="form.metodoPago" 
                class="input-custom" 
                :required="!authStore.isAuthenticated"
                :disabled="loadingMethods"
            >
              <option value="" disabled :selected="!form.metodoPago">
                {{ loadingMethods ? 'Cargando métodos...' : 'Seleccionar método de pago' }}
              </option>
              <option 
                  v-for="method in paymentMethods" 
                  :key="method.uuid" 
                  :value="method.slug"
              >
                  {{ method.name }}
              </option>
            </select>
            <p v-if="!loadingMethods && paymentMethods.length === 0" class="text-red-400 text-sm">
                No se pudieron cargar métodos de pago.
            </p>
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

              <div v-if="pagoMovilMode === 'manual'" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30 relative">
                <div class="flex justify-between items-start mb-2">
                  <p class="flex items-center gap-2 text-cyan-400 font-semibold">
                    <span>📱</span> Datos para Pago Móvil
                  </p>
              <button
                type="button"
                @click="copyPagoMovilData($event)"
                class="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all duration-200 text-xs border border-cyan-400/30"
                title="Copiar datos al portapapeles"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar
              </button>
                </div>
                <div class="space-y-1">
                  <p class="flex items-center gap-2">
                    <span class="text-cyan-400">🏦</span> Banco: <strong>(0191) Banco Nacional de Crédito</strong>
                  </p>
                  <p class="flex items-center gap-2">
                    <span class="text-cyan-400">📋</span> C.I: 
                    <strong>
                      {{ authStore.user?.natural_profile?.document_number || 'N/A' }}
                    </strong>
                  </p>
                  <p class="flex items-center gap-2">
                    <span class="text-cyan-400">📞</span> Teléfono: <strong>0414-1908656</strong>
                  </p>
                </div>
              </div>

              <div v-else-if="pagoMovilMode === 'automatico'" class="space-y-4">
                <h3 class="font-semibold text-cyan-300 text-lg">Ingrese los datos de pago móvil</h3>
                
                <input v-model="form.pagoMovilCedula" type="text" placeholder="🔢 Número de cédula" class="input-custom" maxlength="8" />
                <input v-model="form.pagoMovilTelefono" type="tel" placeholder="📞 Número de teléfono" class="input-custom" maxlength="11" />
              <select 
                v-model="form.pagoMovilBanco" 
                class="input-custom"
                :disabled="loadingBanks"
              >
                <option value="" disabled>{{ loadingBanks ? 'Cargando bancos...' : '🏦 Seleccionar banco' }}</option>
                <option 
                  v-for="bank in banks" 
                  :key="bank.uuid" 
                  :value="bank.uuid"
                >
                  {{ bank.name }} <!-- ← Esto ahora mostrará "0191 - BANCO NACIONAL DE CREDITO" -->
                </option>
              </select>
                <p v-if="!loadingBanks && banks.length === 0" class="text-red-400 text-sm mt-1">
                  No se pudieron cargar los bancos.
                </p>
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
              <label class="font-semibold text-white text-lg">💱 Moneda</label>
              <select v-model="selectedCurrencyId" :disabled="loadingCurrencies" class="select-custom">
                <option v-for="c in currencies" :key="c.uuid" :value="c.uuid">{{ c.name }} ({{ c.short_name }})</option>
              </select>
              <p v-if="!loadingCurrencies && currencies.length === 0" class="text-red-400 text-sm">
                No hay monedas disponibles.
              </p>
          </div>

          <div class="space-y-4">

            <!-- <input 
              v-if="!(form.metodoPago === 'pago-movil' && pagoMovilMode === 'automatico')"
              v-model="form.referencia" 
              type="text" 
              placeholder="🔖 Número de referencia" 
              class="input-custom" 
              required 
            /> -->

            <!-- Botón de verificación pago móvil -->
            <div v-if="form.metodoPago === 'pago-movil' && pagoMovilMode === 'manual'" class="mt-2">
              <button
                type="button"
                class="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30 font-semibold"
                @click="pagoMovilNeedsReverify ? (showReverifyModal = true) : handleVerifyPagoMovil()"
                :disabled="verifyingPagoMovil || reverifySubmitting"
              >
                <span v-if="verifyingPagoMovil">Verificando...</span>
                <span v-else-if="pagoMovilNeedsReverify">Volver a verificar</span>
                <span v-else>Ya pagué</span>
              </button>
                  <p v-if="pagoMovilVerifyResult" 
                    :class="{
                      'text-green-400': pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente',
                      'text-yellow-400': pagoMovilVerifyResult.status === 'pendiente',
                      'text-red-400': !pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente'
                    }" 
                    class="mt-2 text-sm">
                    {{ pagoMovilVerifyResult.message }}
                  </p>
            </div>

            <div v-if="!(form.metodoPago === 'pago-movil' && pagoMovilMode === 'automatico')">
              <label class="block font-semibold text-white mb-3 text-lg">📎 Comprobante de pago (opcional)</label>
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
              :disabled="currentQty === 0 || submitting"
            >
              <span v-if="submitting">Procesando...</span>
              <span v-else>🎉 {{ authStore.isAuthenticated ? 'Participar' : 'Confirmar' }}</span>
            </button>
          </div>
          </template>
        </form>

        <!-- Teleported Re-verify modal (overlay) so it sits on top of everything -->
        <teleport to="body">
          <transition name="fade">
            <div v-if="showReverifyModal" class="fixed inset-0 z-[9999] flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showReverifyModal = false"></div>
              <div class="relative z-[10000] w-full max-w-xl mx-auto">
                <div class="bg-gradient-to-br from-blue-900 to-purple-800 rounded-2xl shadow-2xl p-6 border border-purple-400/30">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white">Verificación de Pago - Manual</h3>
                    <button @click="showReverifyModal = false" class="text-white/70 hover:text-white bg-purple-500">✖</button>
                  </div>
                  <div class="space-y-3">
                    <input v-model="reverifyForm.referencia" type="text" placeholder="🔖 Número de referencia" class="input-custom" />
                    <input v-model="reverifyForm.fecha" type="date" placeholder="Fecha del pago" class="input-custom" />
                  <select 
                    v-model="reverifyForm.banco" 
                    class="input-custom"
                    :disabled="loadingBanks"
                  >
                    <option value="" disabled>{{ loadingBanks ? 'Cargando bancos...' : '🏦 Seleccionar banco' }}</option>
                    <option 
                      v-for="bank in banks" 
                      :key="bank.uuid" 
                      :value="bank.uuid"
                    >
                      {{ bank.name }} 
                    </option>
                  </select>
                  <p v-if="!loadingBanks && banks.length === 0" class="text-red-400 text-sm mt-1">
                    No se pudieron cargar los bancos.
                  </p>
                    <div class="flex gap-3 items-center">
                      <select v-model="reverifyForm.prefix" class="select-prefix flex-shrink-0">
                        <option value="0412">0412</option>
                        <option value="0414">0414</option>
                        <option value="0424">0424</option>
                        <option value="0416">0416</option>
                        <option value="0422">0422</option>
                      </select>
                      <input v-model="reverifyForm.telefono" type="tel" placeholder="📞 Teléfono" class="input-custom flex-1" />
                    </div>
                    <input v-model="reverifyForm.cedula" type="tel" placeholder="🔢 Cédula" class="input-custom" />
                    <input v-model="reverifyForm.monto" type="tel" placeholder="💰 Monto (ej: 123.45)" class="input-custom" />
                  </div>
                  <div class="flex justify-end gap-3 mt-4">
                    <button @click="showReverifyModal = false" type="button" class="px-4 py-2 bg-gray-600 text-white rounded-xl">Cancelar</button>
                    <button @click="handleSubmitReverify" :disabled="reverifySubmitting" type="button" class="px-4 py-2 bg-emerald-600 text-white rounded-xl">
                      <span v-if="reverifySubmitting">Enviando...</span>
                      <span v-else>Enviar y verificar</span>
                    </button>
                  </div>
                  <!-- Y reemplázala por esto: -->
                  <p v-if="pagoMovilVerifyResult" 
                    :class="{
                      'text-green-400': pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente',
                      'text-yellow-400': pagoMovilVerifyResult.status === 'pendiente',
                      'text-red-400': !pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente'
                    }" 
                    class="mt-2 text-sm">
                    {{ pagoMovilVerifyResult.message }}
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTicketStore } from '@/stores/useTicketStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { RaffleService } from '@/services/RaffleService'; // ✅ AÑADE ESTA IMPORTACIÓN

import TicketSelector from './TicketSelector.vue'
import { PaymentFlowService, type Currency, type PaymentMethod, type Bank } from '@/services/PaymentFlow';
const verifyingPagoMovil = ref(false);
// En la definición de pagoMovilVerifyResult, cambia el tipo:
const pagoMovilVerifyResult = ref<{ success: boolean; message: string; status?: string } | null>(null);const pagoMovilNeedsReverify = ref(false)
const showReverifyModal = ref(false)
const reverifySubmitting = ref(false)
const reverifyForm = ref({ fecha: '', referencia: '', banco: '', prefix: '0414', telefono: '', cedula: '', monto: '' })
const banks = ref<Bank[]>([])
const showForm = ref(false) // ← AÑADE ESTA LÍNEA
const soldTicketNumbers = ref<number[]>([])
const loadingSoldTickets = ref(false)
const loadingBanks = ref(false)
// Helper: detect prefix and local part from various phone formats
function detectPrefixFromPhone(rawPhone: string | undefined | null) {
  const prefixes = ['0412', '0414', '0424', '0416', '0422']
  let detectedPrefix = '0414'
  let localPart = ''
  if (!rawPhone) return { prefix: detectedPrefix, localPart }
  const normalized = (rawPhone + '').replace(/[^\d]/g, '')
  let candidate = normalized
  if (candidate.startsWith('0058')) candidate = candidate.slice(4)
  else if (candidate.startsWith('58')) candidate = candidate.slice(2)

  for (const p of prefixes) {
    if (candidate.startsWith(p)) {
      detectedPrefix = p
      localPart = candidate.slice(p.length)
      break
    }
  }

  if (!localPart) {
    for (const p of prefixes) {
      const idx = candidate.indexOf(p)
      if (idx === 0 || idx === 1) {
        detectedPrefix = p
        localPart = candidate.slice(idx + p.length)
        break
      }
    }
  }

  if (!localPart) {
    localPart = candidate.slice(-7)
  }

  return { prefix: detectedPrefix, localPart }
}

// When the reverify modal is opened directly (e.g., user clicked "Volver a verificar"),
// prefill prefix and telefono based on available payload (user profile or form)
watch(() => showReverifyModal.value, (open) => {
  if (!open) return
  // Determine source phone: prefer authenticated user's phone
  let sourcePhone = ''
  if (authStore.isAuthenticated && authStore.user) {
    sourcePhone = authStore.user.phone || ''
  } else {
    sourcePhone = form.telefono || form.pagoMovilTelefono || ''
  }
  const { prefix, localPart } = detectPrefixFromPhone(sourcePhone)
  reverifyForm.value.prefix = prefix
  reverifyForm.value.telefono = (localPart || '').replace(/[^\d]/g, '')

  // Prefill monto if empty using the same logic as handleVerifyPagoMovil
  if (!reverifyForm.value.monto) {
    let monto = 0
    if (selectedCurrencyId.value) {
      const curr = currencies.value.find((c: Currency) => c.uuid === selectedCurrencyId.value)
      if (curr && (curr.short_name.toLowerCase() === 'ves' || curr.name.toLowerCase().includes('bolívar'))) {
        monto = parseFloat(totalPriceBs.value.replace(/[^\d.,]/g, '').replace(',', '.'))
      } else {
        monto = parseFloat(totalPrice.value)
      }
    }
    reverifyForm.value.monto = monto ? Number(monto).toFixed(2) : ''
  }
})
// ✅ NUEVA FUNCIÓN: Ejecutar venta automáticamente después de verificación exitosa
const executeAutomaticSale = async (verificationData: any) => {
  submitting.value = true;
  
  try {
    // Construir payload con los datos de verificación
    const { payload, idempotencyKey, quantity, ticketsToBuy } = buildSalePayload(verificationData);
    
    console.log('🔄 Payload para createSale:', payload);

    // Llamar al servicio createSale
    const res = await PaymentFlowService.createSale(payload, idempotencyKey);
    
    // ✅ Manejar estado pendiente
    if (res.data?.status === 'pendiente') {
      pagoMovilVerifyResult.value = {
        success: true,
        message: '🟡 Su pago se encuentra en estado pendiente. Será verificado próximamente.',
        status: 'pendiente'
      };
      submitting.value = false;
      return;
    }

    // ✅ VENTA EXITOSA
    if (res.status === 200 || res.status === 201) {
      const data = res.data || {};

      // Extraer números asignados por backend
      const assignedNumbers: number[] = []
      if (data.details && Array.isArray(data.details)) {
        for (const d of data.details) {
          const num = Number(d.number)
          if (!Number.isNaN(num)) assignedNumbers.push(num)
        }
      }

      // Actualizar store
      if (assignedNumbers.length > 0) {
        ticketStore.generateTicket(form, props.product, authStore.user?.id ?? null, assignedNumbers)
      } else {
        ticketStore.generateTicket(form, props.product, authStore.user?.id ?? null, ticketsToBuy)
      }

      // Guardar totales
      ticketStore.formData.totalPrice = parseFloat(totalPrice.value);
      ticketStore.formData.totalPriceBs = parseFloat(totalPriceBs.value);

      // ✅ CERRAR MODAL Y ABRIR CONFIRMACIÓN
      console.log('✅ Venta automática completada, abriendo confirmación...');
      
      // Calcular conteos para la confirmación
      const userId = authStore.user?.id
      let initialTickets = 0
      if (userId) {
        initialTickets = initialTicketsCount.value
      } else {
        initialTickets = ticketStore.tickets.filter(t => t.userId === null).length - quantity
      }

      // Cerrar modal actual
      emit('close')
      
      // Abrir modal de confirmación
      emit('confirmed', {
        initialTickets: Math.max(0, initialTickets),
        purchasedTickets: assignedNumbers.length > 0 ? assignedNumbers.length : quantity
      });

    }
  } catch (err: any) {
    console.error('❌ Error en venta automática:', err)
    
    // Mostrar error específico
    if (err && err.data && err.data.errors && err.data.errors.details) {
      const detailsErr = err.data.errors.details
      pagoMovilVerifyResult.value = { 
        success: false, 
        message: Array.isArray(detailsErr) 
          ? `Los siguientes números ya no están disponibles: ${detailsErr.join(', ')}` 
          : String(detailsErr)
      };
    } else if (err && err.data && err.data.message) {
      pagoMovilVerifyResult.value = { success: false, message: String(err.data.message) };
    } else {
      pagoMovilVerifyResult.value = { success: false, message: 'Ocurrió un error procesando la venta automática.' };
    }
  } finally {
    submitting.value = false;
  }
}
async function handleVerifyPagoMovil() {
  pagoMovilVerifyResult.value = null;
  verifyingPagoMovil.value = true;
  
  // ✅ Lógica para obtener teléfono
  let phone = '';
  if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || '';
  }
  if (!phone) {
    phone = form.pagoMovilTelefono || form.telefono || '';
  }

  // ✅ Lógica para obtener monto
  let monto = 0;
  if (selectedCurrencyId.value) {
    const curr = currencies.value.find((c: Currency) => c.uuid === selectedCurrencyId.value);
    if (curr && (curr.short_name.toLowerCase() === 'ves' || curr.name.toLowerCase().includes('bolívar'))) {
      const totalBsClean = totalPriceBs.value.replace(/[^\d,]/g, '').replace(',', '.');
      monto = parseFloat(totalBsClean);
    } else {
      monto = parseFloat(totalPrice.value);
    }
  }

  console.log('🔍 Debug - Verificación Pago Móvil:', { phone, monto, totalPriceBs: totalPriceBs.value });

  // ✅ Validaciones
  if (!phone || phone.trim() === '') {
    pagoMovilVerifyResult.value = { success: false, message: 'Debes ingresar un número de teléfono válido.' };
    verifyingPagoMovil.value = false;
    return;
  }

  if (!monto || isNaN(monto) || monto <= 0) {
    pagoMovilVerifyResult.value = { success: false, message: 'El monto debe ser mayor a cero.' };
    verifyingPagoMovil.value = false;
    return;
  }

  try {
    const payload = {
      phone,
      monto,
      exchange_rate: Number(bcvRate.value) || 1
    };

    const res = await PaymentFlowService.verifyPagoMovil(payload);
    
    // ✅ VERIFICACIÓN EXITOSA - Ejecutar createSale automáticamente
    if (res && res.success === true) {
      pagoMovilVerifyResult.value = { 
        success: true, 
        message: res?.message || '✅ Pago móvil verificado correctamente. Procesando compra...',
        status: res?.status || 'aprobado'
      };

      // ✅ EJECUCIÓN AUTOMÁTICA DE createSale
      console.log('🔄 Ejecutando createSale automáticamente...');
      await executeAutomaticSale(res.data);
      
    } else if (res && (res.success === false || res.success === 'false')) {
      const msg = typeof res.message === 'string' ? res.message : String(res.message || 'Pago no verificado');
      pagoMovilVerifyResult.value = { success: false, message: msg };
      
      // ✅ NUEVO: Abrir modal de reverify cuando el mensaje sea "No se encontró el pago móvil."
      if (msg.toLowerCase().includes('no se encontró el pago móvil') || 
          msg.toLowerCase().includes('pago no verificado') ||
          msg.toLowerCase().includes('no encontrado')) {
        
        pagoMovilNeedsReverify.value = true;
        const { prefix, localPart } = detectPrefixFromPhone(phone);
        reverifyForm.value.prefix = prefix;
        reverifyForm.value.telefono = (localPart || '').replace(/[^\d]/g, '');
        reverifyForm.value.monto = monto.toFixed(2);
        reverifyForm.value.referencia = form.referencia || '';
        reverifyForm.value.banco = form.pagoMovilBanco || '';
        reverifyForm.value.cedula = form.pagoMovilCedula || '';
        
        // ✅ ABRIR MODAL AUTOMÁTICAMENTE
        showReverifyModal.value = true;
        console.log('🔄 Modal de reverify abierto automáticamente por pago no encontrado');
      }
    }
  } catch (err: any) {
    pagoMovilVerifyResult.value = { 
      success: false, 
      message: err?.message || '❌ Error al verificar el pago móvil.' 
    };
    
    // ✅ También abrir modal en caso de error genérico
    pagoMovilNeedsReverify.value = true;
    const { prefix, localPart } = detectPrefixFromPhone(phone);
    reverifyForm.value.prefix = prefix;
    reverifyForm.value.telefono = (localPart || '').replace(/[^\d]/g, '');
    reverifyForm.value.monto = monto.toFixed(2);
    showReverifyModal.value = true;
  } finally {
    verifyingPagoMovil.value = false;
  }
}
// Función auxiliar para construir el payload de venta
const buildSalePayload = (verificationData: any = null) => {
  const userId = authStore.user?.id ?? null
  
  // Determinar teléfono: priorizar el de la verificación, luego usuario, luego formulario
  let phone = ''
  if (verificationData?.telefono_emisor) {
    phone = verificationData.telefono_emisor
  } else if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || ''
  } else {
    phone = form.pagoMovilTelefono || form.telefono || ''
  }

  // Determinar tickets a comprar
  let ticketsToBuy: number[] | undefined = undefined
  let quantity = 0

  if (selectionMode.value === 'manual') {
    ticketsToBuy = selectedManualTickets.value
    quantity = ticketsToBuy.length
  } else {
    quantity = Math.max(1, Number(form.tickets ?? 1))
    try {
      ticketsToBuy = ticketStore.getAvailableNumbers(props.product?.title ?? props.product, quantity)
    } catch (e) {
      console.error('Error obteniendo números disponibles:', e)
      ticketsToBuy = Array.from({length: quantity}, (_, i) => i + 1) // Fallback
    }
  }

  // Construir detalles de tickets
  const details = []
  if (ticketsToBuy) {
    for (const n of ticketsToBuy) {
      details.push({ 
        number: String(n).padStart(4, '0'), 
        amount: Number(props.product?.ticketPrice ?? 0), 
        prizes: '' 
      })
    }
  }

  // Mapear método de pago
  const selectedMethod = paymentMethods.value.find(m => m.slug === form.metodoPago)
  const paymentMethodId = selectedMethod ? selectedMethod.uuid : form.metodoPago

  // Usar referencia de la verificación si está disponible
  const referencia = verificationData?.referencia || form.referencia || `TX-${Date.now()}`

  const idempotencyKey = `sale-${userId ?? 'guest'}-${Date.now()}`

  const payload: any = {
    raffle_id: props.product?.uuid ?? props.product?.title,
    client_id: userId,
    details: details,
    payment: {
      payment_method_id: paymentMethodId,
      currency_id: selectedCurrencyId.value,
      current_currency_id: selectedCurrencyId.value,
      exchange_rate: Number(bcvRate.value) || 1,
      payment_date: new Date().toISOString(),
      transaction_id: referencia,
      entity: form.metodoPago === 'pago-movil' ? (verificationData?.banco_emisor || form.pagoMovilBanco) : undefined,
      idempotency_key: idempotencyKey,
      pago_movil_data: verificationData ? {
        uuid: verificationData.uuid,
        banco_emisor: verificationData.banco_emisor,
        telefono_emisor: verificationData.telefono_emisor,
        monto_verificado: verificationData.monto,
        referencia_verificada: verificationData.referencia,
        status: verificationData.status
      } : undefined
    },
    invoice_data: {
      document_id: authStore.user?.natural_profile?.document_number,
      name: form.nombre || authStore.user?.name || 'Comprador',
      phone: phone,
      address: authStore.user?.natural_profile?.address || 'Direccion',
    }
  }

  // Formatear fecha para el backend
  function formatSqlDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  payload.payment.payment_date = formatSqlDate(new Date(payload.payment.payment_date))

  return { payload, idempotencyKey, quantity, ticketsToBuy }
}
// Función para copiar datos de pago móvil al portapapeles - CORREGIDA
const copyPagoMovilData = async (event: Event) => {
  const pagoMovilData = `0191
507080994
04141908656`;
  
  try {
    await navigator.clipboard.writeText(pagoMovilData);
    
    // Mostrar feedback visual
    const button = event?.currentTarget as HTMLElement;
    if (button) {
      // const originalText = button.innerHTML;
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ¡Copiado!
      `;
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
      
      setTimeout(() => {
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copiar
        `;
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
      }, 2000);
    }
    
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    // Fallback para navegadores más antiguos
    const textArea = document.createElement('textarea');
    textArea.value = pagoMovilData;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Feedback para fallback
    const button = event?.currentTarget as HTMLElement;
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '✅ Copiado!';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    }
  }
};

async function handleSubmitReverify() {
  reverifySubmitting.value = true
  pagoMovilVerifyResult.value = null

  // --- 1. Validación Mejorada ---
  const { fecha, referencia, banco, prefix, telefono, cedula, monto: montoStr } = reverifyForm.value
  
  const phoneLocal = (telefono || '').replace(/[^\d]/g, '')
  const phone = (prefix || '') + phoneLocal

  // --- CORRECCIÓN DEL BUG DE MONTO ---
  const montoRaw = String(montoStr || '').replace(/[^\d.]/g, '');
  const monto = parseFloat(montoRaw);
  // --- FIN DE LA CORRECCIÓN ---

  // Verificar todos los campos requeridos
  const missing = []
  if (!fecha) missing.push('Fecha')
  if (!referencia) missing.push('Referencia')
  if (!banco) missing.push('Banco')
  if (!phone || phone.length < 11) missing.push('Teléfono')
  if (!cedula) missing.push('Cédula')
  
  // Esta validación ahora funcionará correctamente
  if (!monto || isNaN(monto) || monto <= 0) missing.push('Monto válido')

  if (missing.length > 0) {
    pagoMovilVerifyResult.value = { 
      success: false, 
      message: `Todos los campos son requeridos. Por favor, verifica: ${missing.join(', ')}.`
    }
    reverifySubmitting.value = false
    return
  }
  
  // ✅ Obtenemos el ID del usuario (será null si no está autenticado)
  const userId = authStore.user?.id ?? null;

  // Este es el objeto que se enviará al backend
  const payload = {
    client_id: userId, // ✅ ID DE USUARIO AÑADIDO AL INICIO
    fecha,
    referencia,
    banco,
    phone, 
    cedula,
    exchange_rate: Number(bcvRate.value) || 1,
    monto // Monto como número (ej: 2037.42)
  }

  // --- DEBUG SOLICITADO ---
  // Aquí puedes ver en la consola del navegador exactamente lo que se envía
  console.log('🔍 Debug: Enviando payload a /api/v1/payments-movil', payload);

  try {
    // --- 3. Llamar al nuevo servicio ---
    const res = await PaymentFlowService.verifyPagoMovilManual(payload)

// ✅ MEJORADO: Manejar específicamente el caso "No se encontró el pago móvil"
    if (res && (res.success === false || res.success === 'false')) {
      const errorMessage = res.message || 'Pago no verificado.'
      pagoMovilVerifyResult.value = { 
        success: false, 
        message: errorMessage 
      }
      
      // Si el mensaje es específicamente "No se encontró el pago móvil", mantener el modal abierto
      if (errorMessage.toLowerCase().includes('no se encontró el pago móvil')) {
        pagoMovilNeedsReverify.value = true
        // El modal permanece abierto para que el usuario corrija los datos
      } else {
        // Para otros errores, también mantener el modal abierto
        pagoMovilNeedsReverify.value = true
      }
    } else {
  // ✅ NUEVO: Manejar estado pendiente
  if (res?.status === 'pendiente') {
    pagoMovilVerifyResult.value = {
      success: true,
      message: '🟡 Su pago se encuentra en estado pendiente. Será verificado próximamente.',
      status: 'pendiente'
    };
    pagoMovilNeedsReverify.value = false;
    showReverifyModal.value = false;
  } else {
    pagoMovilVerifyResult.value = { 
      success: true, 
      message: res.message || 'Pago verificado correctamente.',
      status: res?.status || 'aprobado'
    };
          console.log('🔄 Ejecutando createSale desde reverificación...');
      await executeAutomaticSale(res.data);
    pagoMovilNeedsReverify.value = false;
    showReverifyModal.value = false;
  }
}
} catch (err: any) {
    pagoMovilVerifyResult.value = { 
      success: false, 
      message: err?.message || 'Error al conectar con el servicio de verificación.' 
    }
    // En caso de error de conexión, mantener el modal abierto
    pagoMovilNeedsReverify.value = true
  } finally {
    reverifySubmitting.value = false
  }
}

// ✅ Función para cargar bancos
async function loadBanks() {
  loadingBanks.value = true;
  try {
    const banksList = await PaymentFlowService.fetchBanks();
    banks.value = banksList;
    console.log('🏦 Bancos cargados exitosamente:', banks.value);
  } catch (error: any) {
    console.error('❌ Error al cargar los bancos:', error);
    console.error('❌ Mensaje de error:', error.message);
    console.error('❌ Stack:', error.stack);
    banks.value = [];
  } finally {
    loadingBanks.value = false;
  }
}

const props = defineProps<{
  open: boolean
  product: any | null
}>()

const emit = defineEmits(['close', 'confirmed'])

const ticketStore = useTicketStore()
const authStore = useAuthStore()
const bcvRate = ref(0)
const loadingBcv = ref(false)
const pagoMovilMode = ref<'manual' | 'automatico'>('manual')
// SELECCIÓN
const selectionMode = ref<'auto' | 'manual'>('auto')
const selectedManualTickets = ref<number[]>([])

// ✅ NUEVOS REFS PARA MÉTODOS DE PAGO Y MONEDAS
const paymentMethods = ref<PaymentMethod[]>([])
const loadingMethods = ref(false)
const currencies = ref<Currency[]>([])
const loadingCurrencies = ref(false)
const selectedCurrencyId = ref<string | undefined>(undefined)
// ✅ NUEVO: Guardar el estado inicial ANTES de generar tickets
const initialTicketsCount = ref(0)

// file input ref
const fileInput = ref<HTMLInputElement | null>(null)
function triggerFileDialog() {
  fileInput.value?.click()
}

const form = ticketStore.formData

function triggerAuth() {
  // Emitir un evento personalizado para que el padre abra el modal de autenticación
  emit('close')
  window.dispatchEvent(new CustomEvent('open-auth'))
}

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
const submitting = ref(false)

const close = () => {
  if (selectionMode.value === 'manual') selectedManualTickets.value = []
  showForm.value = false
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

// ✅ NUEVO: Función para cargar métodos de pago
async function loadPaymentMethods() {
  loadingMethods.value = true;
  try {
    const methods = await PaymentFlowService.fetchPaymentMethods();
    paymentMethods.value = methods;
    console.log('💳 Métodos de pago cargados y ordenados:', paymentMethods.value);
  } catch (error) {
    console.error('❌ Error al cargar los métodos de pago:', error);
    // Manejo de error simple para el select
    paymentMethods.value = [];
  } finally {
    loadingMethods.value = false;
  }
}

// ✅ Función para obtener la tasa BCV
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
// ✅ Computed para el precio en bolívares
const totalPriceBs = computed(() => {
  if (!bcvRate.value) return '0,00'
  const totalUsd = parseFloat(totalPrice.value)
  const totalBs = totalUsd * bcvRate.value
  return totalBs.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
const loadSoldTickets = async () => { 
  console.log('🔍 [DIAGNÓSTICO] loadSoldTickets INICIADA');
  console.log('📋 [DIAGNÓSTICO] Estado actual:', {
    product: props.product,
    tieneUUID: props.product?.uuid,
    modalAbierto: props.open
  });

  if (!props.product?.uuid) {
    console.warn('❌ [DIAGNÓSTICO] No hay UUID de producto para cargar tickets vendidos');
    soldTicketNumbers.value = [];
    return;
  }

  loadingSoldTickets.value = true;
  
  try {
    console.log(`🚀 [DIAGNÓSTICO] Llamando a RaffleService.getSoldTickets con UUID: ${props.product.uuid}`);
    const soldTickets = await RaffleService.getSoldTickets(props.product.uuid);

    console.log(`✅ [DIAGNÓSTICO] Respuesta recibida de getSoldTickets:`, {
      cantidad: soldTickets.length,
      primeros10: soldTickets.slice(0, 10)
    });

    soldTicketNumbers.value = soldTickets;
    console.log(`📊 [DIAGNÓSTICO] Estado actualizado - soldTicketNumbers:`, soldTicketNumbers.value.length);
  } catch (error) {
    console.error('❌ [DIAGNÓSTICO] Error en loadSoldTickets:', error);
    soldTicketNumbers.value = [];
  } finally {
    loadingSoldTickets.value = false;
    console.log('🏁 [DIAGNÓSTICO] loadSoldTickets COMPLETADA');
  }
};
// ✅ Cargar tasa BCV, métodos de pago y monedas cuando se abre el modal
watch(() => props.open, async (open) => {
  if (open) {
    showForm.value = true
    fetchBcvRate()
    loadPaymentMethods()
    loadBanks()

    loadingCurrencies.value = true
    try {
      const result = await PaymentFlowService.fetchCurrencies()
      const currs: Currency[] = result?.currencies ?? []
      const defaultCurrencyId = result?.defaultCurrencyId

      currencies.value = currs
      // Asignación segura de moneda seleccionada
      let chosen: string | undefined = undefined
      if (defaultCurrencyId) chosen = defaultCurrencyId
      else if (currs.length > 0) chosen = currs[0]?.uuid
      selectedCurrencyId.value = chosen
    } catch (e) {
      currencies.value = []
      selectedCurrencyId.value = undefined
    } finally {
      loadingCurrencies.value = false
    }

    // Calcular tickets iniciales ANTES de cualquier compra
    const userId = authStore.user?.id
    if (userId) {
      initialTicketsCount.value = ticketStore.userTicketsCount(userId)
    } else {
      initialTicketsCount.value = ticketStore.tickets.filter(t => t.userId === null).length
    }
    console.log('📊 Initial tickets calculated:', initialTicketsCount.value)

    // 🟦 NUEVO BLOQUE: cargar tickets vendidos
    if (props.product?.uuid) {
      console.log('🎟 Ejecutando loadSoldTickets desde watcher...')
      try {
        await loadSoldTickets()
      } catch (err) {
        console.error('❌ Error al cargar tickets vendidos desde watcher:', err)
      }
    } else {
      console.warn('⚠️ No se ejecuta loadSoldTickets: no hay product.uuid disponible aún')
    }
  }
})


const handleConfirm = async () => {
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

  // Validar si el modo de pago es automático y los campos no están llenos
  if (form.metodoPago === 'pago-movil' && pagoMovilMode.value === 'automatico') {
    if (!form.pagoMovilCedula || !form.pagoMovilTelefono || !form.pagoMovilBanco) {
        error.value = 'Debes completar todos los campos de Pago Móvil Automático.';
        return;
    }
    // No se necesita referencia ni comprobante en modo automático
    form.referencia = 'AUTOMATIC'; 
    ticketStore.setComprobante(null);
  } 
  
  // ✅ MODIFICACIÓN CLAVE
  // 1. Si el método de pago no es Pago Móvil (es decir, es una transferencia, etc.)
  // 2. Y el método de pago no está seleccionado O la referencia está vacía
  else if (form.metodoPago !== 'pago-movil' && (!form.metodoPago || !form.referencia)) {
    // Si no es Pago Móvil, la referencia es OBLIGATORIA (o al menos así lo indica tu mensaje de error)
    error.value = 'Debes seleccionar un método de pago e ingresar la referencia.';
    return;
  } 
  
  // ✅ NUEVA VALIDACIÓN: Si es Pago Móvil Manual, la referencia NO es requerida aquí.
  // La validación se moverá al servicio o se centrará en la verificación previa.
  else if (!form.metodoPago) {
      // Caso de que no se haya seleccionado NINGÚN método de pago
      error.value = 'Debes seleccionar un método de pago.';
      return;
  }

  const userId = authStore.user?.id ?? null

  // ✅ Guardar el estado inicial ANTES de generar tickets
  const initialTickets = initialTicketsCount.value
  const purchasedTickets = quantity

  // Construir payload para POST /sales
  const idempotencyKey = `sale-${userId ?? 'guest'}-${Date.now()}`
  // Poblar address y phone desde el usuario autenticado si existen
  let phone = ''
  if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || ''
  } else {
    phone = form.telefono || ''
  }

  const payload: any = {
    raffle_id: props.product?.uuid ?? props.product?.title,
    client_id: userId,
    details: [],
    payment: {
      payment_method_id: form.metodoPago,
      currency_id: undefined,
      current_currency_id: undefined,
      exchange_rate: Number(bcvRate.value) || 1,
      payment_date: new Date().toISOString(),
      transaction_id: form.referencia || `TX-${Date.now()}`,
      entity: form.metodoPago === 'pago-movil' ? form.pagoMovilBanco : undefined,
      idempotency_key: idempotencyKey
    },
    invoice_data: {
      document_id: authStore.user?.natural_profile?.document_number,
      name: form.nombre || authStore.user?.name || 'Comprador',
      phone,
      address: authStore.user?.natural_profile?.address || 'Direccion',
    }
  }

  if (selectionMode.value === 'manual' && ticketsToBuy) {
    for (const n of ticketsToBuy) {
      payload.details.push({ number: String(n).padStart(4, '0'), amount: Number(props.product?.ticketPrice ?? 0), prizes: '' })
    }
  } else {
    // Para modo automático, el store puede proporcionar números disponibles
    try {
      const avail = ticketStore.getAvailableNumbers(props.product?.title ?? props.product, quantity)
      for (const n of avail) {
        payload.details.push({ number: String(n).padStart(4, '0'), amount: Number(props.product?.ticketPrice ?? 0), prizes: '' })
      }
    } catch (e: any) {
      error.value = e?.message || 'No hay suficientes tickets disponibles.'
      submitting.value = false
      return
    }
  }

// ✅ REEMPLAZA EL WATCH DE selectionMode (Línea 1430) CON ESTO:
watch(() => selectionMode.value, async (newMode) => {
  console.log(`🔄 [ParticipateModal] selectionMode cambiado: ${newMode}`);
  
  if (newMode === 'manual' && props.product?.uuid) {
    console.log('🎯 [ParticipateModal] Modo manual activado, cargando tickets vendidos...');
    
    // ✅ SOLUCIÓN AL RACE CONDITION:
    // Setea el 'loading' a true INMEDIATAMENTE.
    // Así, TicketSelector se montará ya con 'loadingTickets: true'
    loadingSoldTickets.value = true; 
    
    // Ahora sí llamamos a la función que hace el fetch
    await loadSoldTickets();
  }
});
// ✅ CORREGIDO: Watch mejorado para props.product
watch(() => props.product, async (newProduct) => {
  if (newProduct?.uuid && props.open) {
    console.log('🔄 [ParticipateModal] Producto cambiado, recargando tickets vendidos:', newProduct.title)
    await loadSoldTickets()
  }
}, { immediate: true }) // ✅ Añade immediate: true para que se ejecute al montar el componente
  // Mapear metodoPago (slug) a uuid si está disponible en paymentMethods
  const selectedMethod = paymentMethods.value.find(m => m.slug === form.metodoPago)
  if (selectedMethod) {
    payload.payment.payment_method_id = selectedMethod.uuid
  }

  // Asegurar currency_id usando el UUID seleccionado
  payload.payment.currency_id = selectedCurrencyId.value
  payload.payment.current_currency_id = selectedCurrencyId.value
  if (!payload.payment.currency_id) {
    error.value = 'No se ha configurado la moneda. Selecciona una moneda válida.'
    submitting.value = false
    return
  }

  // Formatear fecha al formato esperado por el backend (YYYY-MM-DD HH:mm:ss)
  function formatSqlDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  payload.payment.payment_date = formatSqlDate(new Date(payload.payment.payment_date))
  // Llamada al servicio
  submitting.value = true
  try {
    const res = await PaymentFlowService.createSale(payload, idempotencyKey)
    // ✅ NUEVO: Manejar estado pendiente ANTES de procesar la respuesta exitosa
    if (res.data?.status === 'pendiente') {
      // Mostrar mensaje de pendiente en amarillo
      pagoMovilVerifyResult.value = {
        success: true,
        message: '🟡 Su pago se encuentra en estado pendiente. Será verificado próximamente.',
        status: 'pendiente'
      };
      
      // NO generamos tickets ni actualizamos el store porque el pago está pendiente
      // Solo mostramos el mensaje y mantenemos el modal abierto
      submitting.value = false;
      return; // Salimos de la función sin emitir 'confirmed'
    }

    if (res.status === 200 || res.status === 201) {
      const data = res.data || {}

      // Extraer números asignados por backend, si vienen
      const assignedNumbers: number[] = []
      if (data.details && Array.isArray(data.details)) {
        for (const d of data.details) {
          const num = Number(d.number)
          if (!Number.isNaN(num)) assignedNumbers.push(num)
        }
      }

      // Actualizar store usando números asignados o los locales
      if (assignedNumbers.length > 0) {
        ticketStore.generateTicket(form, props.product, userId, assignedNumbers)
      } else {
        ticketStore.generateTicket(form, props.product, userId, ticketsToBuy)
      }

      // Guardar totales
      ticketStore.formData.totalPrice = parseFloat(totalPrice.value);
      ticketStore.formData.totalPriceBs = parseFloat(totalPriceBs.value);

      // Emitir confirmado con conteos reales
      emit('confirmed', {
        initialTickets,
        purchasedTickets: assignedNumbers.length > 0 ? assignedNumbers.length : purchasedTickets
      })
    }
  } catch (err: any) {
    console.error('Error procesando venta:', err)
    if (err && err.data && err.data.errors && err.data.errors.details) {
      const detailsErr = err.data.errors.details
      error.value = Array.isArray(detailsErr) ? `Los siguientes números ya no están disponibles: ${detailsErr.join(', ')}` : String(detailsErr)
    } else if (err && err.data && err.data.message) {
      error.value = String(err.data.message)
    } else {
      error.value = 'Ocurrió un error procesando la venta.'
    }
  } finally {
    submitting.value = false
  }
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

/* Compact prefix select used next to phone input */
.select-prefix {
  width: 5.25rem; /* approx space for 4 digits */
  min-width: 5.25rem;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 0.75rem;
  padding: 0.6rem 0.5rem;
  outline: none;
  background: rgba(0,0,0,0.3);
  color: white;
  text-align: center;
}
.select-prefix:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6,182,212,0.08);
}
</style>