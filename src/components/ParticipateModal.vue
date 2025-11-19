<template>
  <transition name="fade">
    <div v-if="isParticipateModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" @click="close" />
  </transition>

  <transition name="scale-fade">
    <div v-if="isParticipateModalOpen" class="fixed inset-0 z-50" @click.self="close">
      <div
        class="bg-gradient-to-br from-blue-900 to-gray-800 relative transition-all duration-300 border-purple-400/30 flex flex-col w-screen h-screen p-4 sm:p-6"
      >
        <button
          v-if="authStore.isAuthenticated"
          class="absolute top-4 right-4 z-30 bg-transparent border-none p-1"
          @click="close"
          aria-label="Cerrar"
        >
          <XMarkIcon class="h-5 w-5 text-white/70 hover:text-white transition-colors" />
        </button>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>

        <div class="relative z-10 mb-4 flex-shrink-0 flex items-center justify-between gap-2">   
          <div class="flex items-center justify-left gap-3">
            <img src="/rifaLogo.png" alt="Slot" class="h-10 sm:h-16 w-auto" />
            <h2 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent whitespace-nowrap">
              Compra de tickets
            </h2>
          </div>
          <div v-if="selectionMode === 'manual' && bookingTimerStarted" 
                 class="flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300"
                 :class="timerClasses">
              <div class="w-3 h-3 rounded-full animate-pulse" :class="pulseClass"></div>
             <span class="font-mono text-base sm:text-lg font-bold" :class="timerTextClass">{{ formattedTime }}</span>
            </div>
        </div>

        <form @submit.prevent="handleConfirm" class="space-y-6 relative z-10 flex-grow overflow-y-auto pr-2 pb-16">
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
            <div class="flex flex-col sm:flex-row justify-center gap-4 p-4 bg-black/30 rounded-xl border border-white/10">
              <label class="flex items-center space-x-3 cursor-pointer group">
                <div class="relative"><input type="radio" v-model="selectionMode" value="auto" class="h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500 bg-transparent"/></div>
                <span class="font-semibold text-white group-hover:text-cyan-300 transition-colors">Selección Automática</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <div class="relative"><input type="radio" v-model="selectionMode" value="manual" class="h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500 bg-transparent"/></div>
                <span class="font-semibold text-white group-hover:text-cyan-300 transition-colors">Selección Manual</span>
              </label>
            </div>

            <div v-if="selectionMode === 'auto'" class="space-y-4">
              <div class="p-5 bg-black/30 rounded-xl border border-cyan-500/30">
                <label class="font-semibold text-cyan-300 mb-3 block text-lg">🎲 Cantidad de tickets (Automático)</label>
                <div class="flex items-center gap-3">
                  <input v-model.number="form.tickets" type="number" min="1" :max="maxAvailable === null ? undefined : maxAvailable" placeholder="Cantidad de tickets" class="input-custom flex-grow" :required="selectionMode === 'auto'"/>
                  <div class="text-sm text-white whitespace-nowrap">Disponibles: <strong class="text-yellow-400">{{ maxAvailable }}</strong></div>
                </div>
                
                <!-- Botón para obtener tickets aleatorios -->
                <button 
                  type="button" 
                  @click="fetchRandomTickets"
                  :disabled="loadingRandomTickets || !form.tickets || form.tickets < 1"
                  class="w-full mt-4 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loadingRandomTickets">🔄 Obteniendo tickets...</span>
                  <span v-else>🎯 Obtener Tickets Aleatorios</span>
                </button>
              </div>

              <!-- Resultado de tickets aleatorios -->
              <div v-if="randomTicketsResult" class="p-4 bg-black/40 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-green-400 text-lg">Tickets Reservados</h3>
                  <div v-if="randomTicketsTimeLeft > 0" class="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-lg">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-green-400 font-mono text-sm">{{ formattedRandomTime }}</span>
                  </div>
                </div>
                
                <div class="grid grid-cols-4 gap-2 mb-3">
                  <div 
                    v-for="ticket in randomTicketsResult.successful" 
                    :key="ticket.number"
                    class="bg-green-500/20 border border-green-400/50 rounded-lg p-2 text-center"
                  >
                    <span class="text-green-300 font-bold text-sm">{{ String(ticket.number).padStart(4, '0') }}</span>
                  </div>
                </div>
                
                <p class="text-green-300 text-sm">
                  Se han reservado <strong>{{ randomTicketsResult.successful.length }}</strong> tickets aleatoriamente. 
                  Tienes 1 minuto para completar la compra.
                </p>
              </div>

              <!-- Mostrar tickets fallidos si los hay -->
              <div v-if="randomTicketsResult?.failed?.length" class="p-4 bg-black/40 rounded-xl border border-orange-500/30">
                <h3 class="font-semibold text-orange-400 text-lg mb-2">⚠️ Tickets No Disponibles</h3>
                <p class="text-orange-300 text-sm">
                  Algunos tickets no pudieron ser reservados. Intenta con una cantidad menor.
                </p>
              </div>
            </div>
            <TicketGrid v-if="selectionMode === 'manual' && selectedProduct" :raffleId="selectedProduct.uuid" @update:selected="handleSelectionUpdate" />
              
            <label class="font-semibold text-white text-lg">💱 Moneda</label>
              <select v-model="selectedCurrencyId" :disabled="loadingCurrencies" class="select-custom">
                <option v-for="c in currencies" :key="c.uuid" :value="c.uuid">{{ c.name }} ({{ c.short_name }})</option>
              </select>
              <p v-if="!loadingCurrencies && currencies.length === 0" class="text-red-400 text-sm">No hay monedas disponibles.</p>

            <div class="space-y-4">
              <label class="font-semibold text-white text-lg">💳 Método de Pago</label>
              <select v-model="form.metodoPago" class="input-custom" :required="!authStore.isAuthenticated" :disabled="loadingMethods">
                <option value="" disabled :selected="!form.metodoPago">{{ loadingMethods ? 'Cargando métodos...' : 'Seleccionar método de pago' }}</option>
                <option v-for="method in paymentMethods" :key="method.uuid" :value="method.slug">{{ method.name }}</option>
              </select>
              <p v-if="!loadingMethods && paymentMethods.length === 0" class="text-red-400 text-sm">No se pudieron cargar métodos de pago.</p>
              

              <!-- Sección de Pago Móvil -->
              <div v-if="form.metodoPago === 'pago-movil'" class="mt-4">
                <div class="flex flex-col sm:flex-row bg-black/30 rounded-xl p-1 border border-cyan-500/30 shadow-lg">
                  <button type="button" @click="pagoMovilMode = 'manual'" :class="{'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform scale-105': pagoMovilMode === 'manual', 'text-white/70 hover:text-white bg-transparent': pagoMovilMode !== 'manual'}" class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-out backdrop-blur-sm border border-transparent hover:border-cyan-500/30">
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-lg">👤</span>
                      <span>Manual</span>
                    </div>
                  </button>
                  <button type="button" @click="pagoMovilMode = 'automatico'" :class="{'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg transform scale-105': pagoMovilMode === 'automatico', 'text-white/70 hover:text-white bg-transparent': pagoMovilMode !== 'automatico'}" class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-out backdrop-blur-sm border border-transparent hover:border-emerald-500/30">
                    <div class="flex items-center justify-center gap-2">
                      <span class="text-lg">⚡</span>
                      <span>Automático</span>
                    </div>
                  </button>
                </div>
                
                <!-- Modo Manual - Mostrar información del rifero -->
                <div v-if="pagoMovilMode === 'manual'" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30 relative">
                  <div class="flex justify-between items-start mb-2">
                    <p class="flex items-center gap-2 text-cyan-400 font-semibold">
                      <span>📱</span> Datos para Pago Móvil del Rifero
                    </p>
                    <button type="button" @click="copyPagoMovilData($event)" class="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all duration-200 text-xs border border-cyan-400/30" title="Copiar datos al portapapeles">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg> 
                      Copiar
                    </button>
                  </div>
                  
                  <!-- Mostrar información específica del rifero -->
                  <div v-if="paymentMethods.length > 0">
                    <div v-for="method in paymentMethods.filter(m => m.slug === 'pago-movil')" :key="method.uuid" class="space-y-2 mb-4 p-3 bg-cyan-500/10 rounded-lg">
                      <div class="flex items-center justify-between">
                        <p class="font-semibold text-cyan-300">{{ method.name }}</p>
                        <span v-if="method.is_default" class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Principal</span>
                      </div>
                      <div class="space-y-1 text-sm">
                        <p class="flex items-center gap-2">
                          <span class="text-cyan-400">🏦</span> 
                          Banco: <strong>{{ method.bank_name }} ({{ method.bank_code }})</strong>
                        </p>
                        <p class="flex items-center gap-2">
                          <span class="text-cyan-400">📋</span> 
                          C.I: <strong>{{ method.document_number }}</strong>
                        </p>
                        <p class="flex items-center gap-2">
                          <span class="text-cyan-400">👤</span> 
                          Titular: <strong>{{ method.holder_name }}</strong>
                        </p>
                        <p class="flex items-center gap-2">
                          <span class="text-cyan-400">📞</span> 
                          Teléfono: <strong>{{ method.account_number }}</strong>
                        </p>
                        <p v-if="method.description" class="flex items-center gap-2 text-cyan-200/80">
                          <span class="text-cyan-400">📝</span> 
                          Observación: {{ method.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-yellow-400 text-sm">
                    ⚠️ No se encontraron métodos de pago móvil configurados por el rifero
                  </div>
                </div>
                
                <!-- Modo Automático -->
                <div v-else-if="pagoMovilMode === 'automatico'" class="space-y-4">
                  <h3 class="font-semibold text-cyan-300 text-lg">Ingrese los datos de pago móvil</h3>
                  <input v-model="form.pagoMovilCedula" type="text" placeholder="🔢 Número de cédula" class="input-custom" maxlength="8" />
                  <input v-model="form.pagoMovilTelefono" type="tel" placeholder="📞 Número de teléfono" class="input-custom" maxlength="11" />
                  <select v-model="form.pagoMovilBanco" class="input-custom" :disabled="loadingBanks">
                    <option value="" disabled>{{ loadingBanks ? 'Cargando bancos...' : '🏦 Seleccionar banco' }}</option>
                    <option v-for="bank in banks" :key="bank.uuid" :value="bank.uuid">{{ bank.name }}</option>
                  </select>
                  <p v-if="!loadingBanks && banks.length === 0" class="text-red-400 text-sm mt-1">No se pudieron cargar los bancos.</p>
                </div>
              </div>
              
              <!-- Para otros métodos de pago, mostrar la información específica del rifero -->
              <div v-else-if="form.metodoPago && form.metodoPago !== 'pago-movil'" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30">
                <div v-for="method in paymentMethods.filter(m => m.slug === form.metodoPago)" :key="method.uuid" class="space-y-2">
                  <p class="font-semibold text-cyan-400 mb-2">{{ method.name }}</p>
                  
                  <div v-if="method.slug === 'transferencia'" class="space-y-1">
                    <p class="flex items-center gap-2">
                      <span class="text-cyan-400">🏦</span> 
                      Banco: <strong>{{ method.bank_name }} ({{ method.bank_code }})</strong>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="text-cyan-400">📋</span> 
                      Número de Cuenta: <strong>{{ method.account_number }}</strong>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="text-cyan-400">👤</span> 
                      Titular: <strong>{{ method.holder_name }}</strong>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="text-cyan-400">📋</span> 
                      C.I: <strong>{{ method.document_number }}</strong>
                    </p>
                  </div>
                  
                  <div v-else class="space-y-1">
                    <p class="flex items-center gap-2" v-if="method.account_number">
                      <span class="text-cyan-400">🔢</span> 
                      Cuenta/Usuario: <strong>{{ method.account_number }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="method.holder_name">
                      <span class="text-cyan-400">👤</span> 
                      Titular: <strong>{{ method.holder_name }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="method.bank_name">
                      <span class="text-cyan-400">🏦</span> 
                      Banco: <strong>{{ method.bank_name }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="method.description">
                      <span class="text-cyan-400">📝</span> 
                      Observación: {{ method.description }}
                    </p>
                  </div>
                </div>
                
                <!-- Mensaje si no hay métodos específicos configurados -->
                <div v-if="paymentMethods.filter(m => m.slug === form.metodoPago).length === 0" class="text-yellow-400 text-sm">
                  ⚠️ El rifero no tiene configurado este método de pago específicamente
                </div>
              </div>
              
            
            </div>

            <div class="space-y-4">
              <div v-if="form.metodoPago === 'pago-movil' && pagoMovilMode === 'manual'" class="mt-2">
                <button type="button" class="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30 font-semibold" @click="pagoMovilNeedsReverify ? (showReverifyModal = true) : handleVerifyPagoMovil()" :disabled="verifyingPagoMovil || reverifySubmitting">
                  <span v-if="verifyingPagoMovil">Verificando...</span>
                  <span v-else-if="pagoMovilNeedsReverify">Volver a verificar</span>
                  <span v-else>Ya pagué</span>
                </button>
                <p v-if="pagoMovilVerifyResult" :class="{'text-green-400': pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente', 'text-yellow-400': pagoMovilVerifyResult.status === 'pendiente', 'text-red-400': !pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente'}" class="mt-2 text-sm">{{ pagoMovilVerifyResult.message }}</p>
              </div>
              <div v-if="!(form.metodoPago === 'pago-movil' && pagoMovilMode === 'automatico')">
                <label class="block font-semibold text-white mb-3 text-lg">📎 Comprobante de pago (opcional)</label>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange"/>
                <button type="button" @click="triggerFileDialog" class="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30">📸 Insertar imagen del comprobante</button>
                <p v-if="form.comprobante" class="text-sm text-green-400 mt-2 flex items-center gap-2"><span>✅</span> Archivo seleccionado: {{ form.comprobante.name }}</p>
                <div v-if="previewUrl" class="mt-3"><img :src="previewUrl" alt="preview" class="max-h-40 object-contain border-2 border-cyan-500/50 rounded-xl shadow-lg" /></div>
              </div>
            </div>

            <!-- Sección de precios -->
            <div class="pt-4 border-t border-white/20 mt-6">
              <div class="flex flex-col items-end gap-1">
                <p class="text-lg font-bold text-white">
                  Precio: <strong class="text-2xl text-yellow-400 ml-2">{{ displayPrice.text }}</strong>
                </p>
                <span 
                  v-if="displayPrice.showUsdRate && displayPrice.rate" 
                  class="text-sm text-gray-400"
                >
                  (Tasa: {{ displayPrice.rate.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }} {{ displayPrice.rateCurrency }})
                </span>
              </div>
              
              <!-- Mostrar precio en USD como referencia solo si no es la moneda principal -->
              <div v-if="displayPrice.showUsdPrice" class="text-right space-y-2">
                <p class="text-lg font-bold text-white">
                  Precio: <span class="text-2xl text-yellow-400 ml-2">{{ totalPrice }} USD</span>
                </p>
              </div>
              
              <div v-if="currentQty > 0" class="text-right space-y-2">
                <p class="text-sm text-cyan-300">Tickets a comprar: <strong class="text-white">{{ currentQty }}</strong></p>
              </div>
            </div>

            <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">⚠️ {{ error }}</div>

            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
              <button type="button" @click="close" class="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-500/30">Cancelar</button>
              <button type="submit" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-yellow-400/30" :disabled="currentQty === 0 || submitting">
                <span v-if="submitting">Procesando...</span>
                <span v-else> {{ authStore.isAuthenticated ? 'Participar' : 'Confirmar' }}</span>
              </button>
            </div>
          </template>
        </form>

        <teleport to="body">
          <transition name="fade">
            <div v-if="showReverifyModal" class="fixed inset-0 z-[9999] flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showReverifyModal = false"></div>
              <div class="relative z-[10000] w-full max-w-xl mx-auto">
                <div class="bg-gradient-to-br from-blue-900 to-gray-800 rounded-2xl shadow-2xl p-6 border border-purple-400/30">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white">Verificación de Pago - Manual</h3>
                    <button @click="showReverifyModal = false" class="text-white/70 hover:text-white bg-purple-500">✖</button>
                  </div>
                  <div class="space-y-3">
                    <input v-model="reverifyForm.referencia" type="text" placeholder="🔖 Número de referencia" class="input-custom" />
                    <input v-model="reverifyForm.fecha" type="date" placeholder="Fecha del pago" class="input-custom" />
                    <select v-model="reverifyForm.banco" class="input-custom" :disabled="loadingBanks">
                      <option value="" disabled>{{ loadingBanks ? 'Cargando bancos...' : '🏦 Seleccionar banco' }}</option>
                      <option v-for="bank in banks" :key="bank.uuid" :value="bank.uuid">{{ bank.name }}</option>
                    </select>
                    <p v-if="!loadingBanks && banks.length === 0" class="text-red-400 text-sm mt-1">No se pudieron cargar los bancos.</p>
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
                  <p v-if="pagoMovilVerifyResult" :class="{'text-green-400': pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente', 'text-yellow-400': pagoMovilVerifyResult.status === 'pendiente', 'text-red-400': !pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente'}" class="mt-2 text-sm">{{ pagoMovilVerifyResult.message }}</p>
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
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useTicketStore } from '@/stores/useTicketStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGridStore } from '@/stores/useGridStore';
import { RaffleService } from '@/services/RaffleService';
import { PaymentFlowService, type Currency} from '@/services/PaymentFlow';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useBookingTimer } from '@/composables/useBookingTimer';
import { useToast } from '@/composables/useToast';
import TicketGrid from './TicketGrid.vue';
defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['close', 'confirmed', 'time-expired']);
const { showToast } = useToast();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const gridStore = useGridStore();
const paymentStore = usePaymentStore();
const { paymentMethods, banks, currencies } = storeToRefs(paymentStore);
const { selectedProduct, isParticipateModalOpen } = storeToRefs(gridStore);
const loadingRandomTickets = ref(false);
const randomTicketsResult = ref<{
  successful: { number: number; expires_in_seconds: number }[];
  failed: any[];
} | null>(null);
const verifyingPagoMovil = ref(false);
const pagoMovilVerifyResult = ref<{ success: boolean; message: string; status?: string } | null>(null);
const pagoMovilNeedsReverify = ref(false)
const showReverifyModal = ref(false)
const reverifySubmitting = ref(false)
const reverifyForm = ref({ fecha: '', referencia: '', banco: '', prefix: '0414', telefono: '', cedula: '', monto: '' })
// const banks = ref<Bank[]>([])
const loadingBanks = ref(false)
const selectionMode = ref<'auto' | 'manual'>('auto')
const selectedManualTickets = ref<number[]>([])
const pagoMovilMode = ref<'manual' | 'automatico'>('manual')
const bcvRate = computed(() => paymentStore.bcvRate);
const loadingRates = computed(() => paymentStore.loadingRates);
const copRate = computed(() => paymentStore.copRate);
// const paymentMethods = ref<PaymentMethod[]>([])
const loadingMethods = ref(false)
// const currencies = ref<Currency[]>([])
const loadingCurrencies = ref(false)
const selectedCurrencyId = ref<string | undefined>(undefined)
const initialTicketsCount = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const form = ticketStore.formData
const previewUrl = ref<string | null>(null)
const error = ref<string | null>(null)
const submitting = ref(false)
// Timer para la reserva automática
const randomTicketsTimer = ref<number | null>(null);
const randomTicketsTimeLeft = ref(0);

// Método para obtener tickets aleatorios
const fetchRandomTickets = async () => {
  if (!selectedProduct.value || !authStore.user?.natural_profile?.document_number) {
    error.value = 'No se puede obtener tickets aleatorios. Verifica tu información.';
    return;
  }

  const quantity = Math.max(1, Number(form.tickets ?? 1));
  
  if (quantity > (maxAvailable.value ?? 0)) {
    error.value = `Solo quedan ${maxAvailable.value} tickets disponibles`;
    return;
  }

  loadingRandomTickets.value = true;
  error.value = null;
  randomTicketsResult.value = null;

  try {
    const result = await RaffleService.getRandomTickets(
      selectedProduct.value.uuid,
      "V", // Tipo de documento (siempre "V" para Venezuela)
      authStore.user.natural_profile.document_number,
      quantity
    );

    console.log('Respuesta de tickets aleatorios:', result); // Para debugging

    // Verificar si result tiene la estructura correcta
    if (result && result.successful && Array.isArray(result.successful) && result.successful.length > 0) {
      randomTicketsResult.value = result;
      
      // Iniciar timer de reserva
      const expiresIn = result.successful[0]?.expires_in_seconds || 60;
      startRandomTicketsTimer(expiresIn);
      
      // Actualizar la selección manual con los números obtenidos
      selectedManualTickets.value = result.successful.map(item => item.number);
      
      showToast(`✅ Se han reservado ${result.successful.length} tickets aleatoriamente`, 'success');
    } else {
      console.error('Estructura de respuesta inválida:', result);
      error.value = 'No se pudieron obtener tickets aleatorios. La respuesta del servidor es inválida.';
    }
  } catch (err: any) {
    console.error('Error obteniendo tickets aleatorios:', err);
    error.value = err?.message || 'Error al obtener tickets aleatorios';
  } finally {
    loadingRandomTickets.value = false;
  }
};

// Timer para la reserva automática
const startRandomTicketsTimer = (seconds: number) => {
  clearRandomTicketsTimer();
  randomTicketsTimeLeft.value = seconds;
  
  randomTicketsTimer.value = setInterval(() => {
    randomTicketsTimeLeft.value--;
    
    if (randomTicketsTimeLeft.value <= 0) {
      clearRandomTicketsTimer();
      randomTicketsResult.value = null;
      selectedManualTickets.value = [];
      showToast('⏰ El tiempo de reserva para los tickets aleatorios ha expirado', 'warning');
    }
  }, 1000);
};

const clearRandomTicketsTimer = () => {
  if (randomTicketsTimer.value) {
    clearInterval(randomTicketsTimer.value);
    randomTicketsTimer.value = null;
  }
};

// Formatear tiempo para mostrar
const formattedRandomTime = computed(() => {
  const minutes = Math.floor(randomTicketsTimeLeft.value / 60);
  const seconds = randomTicketsTimeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Liberar tickets aleatorios al cerrar
const freeRandomTickets = async () => {
  if (randomTicketsResult.value && selectedManualTickets.value.length > 0 && selectedProduct.value) {
    try {
      const user = authStore.user;
      if (user?.natural_profile?.document_number) {
        await RaffleService.unbookTickets(
          selectedProduct.value.uuid, 
          "V", 
          user.natural_profile.document_number, 
          selectedManualTickets.value.map(t => t.toString())
        );
      }
    } catch (error) {
      console.error('Error liberando tickets aleatorios:', error);
    }
  }
};
const totalPrice = ref('0.00');
const totalPriceBs = ref('0,00');
const { 
  timeLeft,         
  formattedTime, 
  isExpired, 
  startTimer, 
  clearTimer, 
  resetTimer 
} = useBookingTimer(10);

const bookingTimerStarted = ref(false);

const timerClasses = computed(() => {
  if (timeLeft.value > 300) { 
    return 'bg-green-500/80 border border-green-400/50';
  } else if (timeLeft.value > 120) { 
    return 'bg-yellow-500/80 border border-yellow-400/50';
  } else if (timeLeft.value > 60) { 
    return 'bg-orange-500/80 border border-orange-400/50';
  } else { 
    return 'bg-red-600/90 border border-red-400/50 animate-pulse';
  }
});

const pulseClass = computed(() => {
  if (timeLeft.value > 300) return 'bg-green-500';
  if (timeLeft.value > 120) return 'bg-yellow-500';
  if (timeLeft.value > 60) return 'bg-orange-500';
  return 'bg-red-500';
});

const timerTextClass = computed(() => {
  return 'text-white';
});

watch(isExpired, (expired) => {
  if (expired) {
    handleTimeExpired();
  }
});
// Computed para el precio a mostrar según la moneda seleccionada
const displayPrice = computed(() => {
  if (loadingRates.value) {
    return { 
      text: 'Cargando...', 
      showUsdRate: false,
      showUsdPrice: false // Nueva propiedad
    };
  }

  const selectedCurrency = currencies.value.find(c => c.uuid === selectedCurrencyId.value);
  if (!selectedCurrency) {
    return { 
      text: `${totalPrice.value} USD`, 
      showUsdRate: false,
      showUsdPrice: false // Ya estamos mostrando USD
    };
  }

  const currencyName = selectedCurrency.name.toLowerCase();
  const totalUsd = parseFloat(totalPrice.value);

  if (currencyName.includes('bolívar') || selectedCurrency.short_name === 'VES') {
    // Moneda VES - mostrar en Bs con tasa USD
    const totalBs = totalUsd * bcvRate.value;
    return {
      text: `${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`,
      showUsdRate: true,
      rate: bcvRate.value,
      rateCurrency: '/ USD',
      showUsdPrice: true // Mostrar precio USD como referencia
    };
  } else if (currencyName.includes('peso colombiano') || selectedCurrency.short_name === 'COP') {
    // Moneda COP - mostrar en COP con tasa USD
    const totalCop = totalUsd * copRate.value;
    return {
      text: `${totalCop.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`,
      showUsdRate: true,
      rate: copRate.value,
      rateCurrency: '/ USD',
      showUsdPrice: true // Mostrar precio USD como referencia
    };
  } else {
    // Por defecto USD - solo mostrar precio
    return {
      text: `${totalUsd.toFixed(2)} USD`,
      showUsdRate: false,
      showUsdPrice: false // No mostrar duplicado
    };
  }
});

const handleTimeExpired = async () => {
  showToast('⏰ El tiempo para completar la compra ha expirado. Los tickets han sido liberados.', 'error', 5000);
  
  if (selectedManualTickets.value.length > 0 && selectedProduct.value) {
    try {
      const user = authStore.user;
      if (user?.natural_profile?.document_number) {
        await RaffleService.unbookTickets(
          selectedProduct.value.uuid, 
          "V", 
          user.natural_profile.document_number, 
          selectedManualTickets.value.map(t => t.toString())
        );
      }
    } catch (error) {
      console.error('Error liberando tickets expirados:', error);
    }
  }
  
  selectedManualTickets.value = [];
 bookingTimerStarted.value = false;
  clearTimer();
  
  setTimeout(() => {
    gridStore.closeParticipateModal();
    emit('time-expired');
  }, 3000);
};
// Computed para obtener el método de pago actual
// const currentPaymentMethod = computed(() => {
//   if (!form.metodoPago) return null;
//   return paymentMethods.value.find(method => method.slug === form.metodoPago);
// });

function handleSelectionUpdate(newSelection: number[]) {
  selectedManualTickets.value = newSelection;
  
  if (newSelection.length === 1 && !bookingTimerStarted.value) {
    bookingTimerStarted.value = true;
    startTimer();
  }
  
  if (newSelection.length === 0 && bookingTimerStarted.value) {
    bookingTimerStarted.value = false;
    clearTimer();
    resetTimer();
  }
}

watch(isParticipateModalOpen, (open) => {
  if (!open) {
    bookingTimerStarted.value = false;
    clearTimer();
    resetTimer();
    selectedManualTickets.value = [];
  }
});

const close = () => {
  if (selectionMode.value === 'manual' && selectedManualTickets.value.length > 0) {
    freeAllBookedTickets();
  }
  
  // Liberar tickets aleatorios si existen
  if (selectionMode.value === 'auto' && randomTicketsResult.value) {
    freeRandomTickets();
  }
  
  bookingTimerStarted.value = false;
  clearTimer();
  resetTimer();
  clearRandomTicketsTimer();
  selectedManualTickets.value = [];
  randomTicketsResult.value = null;
  gridStore.closeParticipateModal();
};

const freeAllBookedTickets = async () => {
  if (selectedManualTickets.value.length > 0 && selectedProduct.value) {
    try {
      const user = authStore.user;
      if (user?.natural_profile?.document_number) {
        await RaffleService.unbookTickets(
          selectedProduct.value.uuid, 
          "V", 
          user.natural_profile.document_number, 
          selectedManualTickets.value.map(t => t.toString())
        );
      }
    } catch (error) {
      console.error('Error liberando tickets al cerrar:', error);
    }
  }
};

watch(selectionMode, (newMode) => {
  if (newMode === 'auto') {
    if (selectedManualTickets.value.length > 0) {
      freeAllBookedTickets();
      selectedManualTickets.value = [];
    }
    bookingTimerStarted.value = false;
    clearTimer();
    resetTimer();
  }
});

const maxAvailable = computed(() => gridStore.availableTickets)
const currentQty = computed(() => {
  if (selectionMode.value === 'manual') {
    return selectedManualTickets.value.length;
  } else {
    // En modo automático, usar los tickets aleatorios si existen, sino la cantidad del form
    return randomTicketsResult.value 
      ? randomTicketsResult.value.successful.length 
      : Number(form.tickets || 0);
  }
});

watch([currentQty, bcvRate, selectedProduct], ([qty, rate, product]) => {
  if (!product || typeof product.ticketPrice === 'undefined') {
    totalPrice.value = '0.00';
    totalPriceBs.value = '0,00';
    return;
  }
  const pricePerTicket = Number(product.ticketPrice);
  if (isNaN(pricePerTicket)) {
    totalPrice.value = '0.00';
    totalPriceBs.value = '0,00';
    return;
  }
  const totalUsd = qty * pricePerTicket;
  totalPrice.value = totalUsd.toFixed(2);
  if (rate > 0) {
    const totalBsNum = totalUsd * rate;
    totalPriceBs.value = totalBsNum.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    totalPriceBs.value = '0,00';
  }
}, {
  immediate: true,
  deep: true
});

function triggerAuth() {
  close();
  window.dispatchEvent(new CustomEvent('open-auth'))
}

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

watch(() => showReverifyModal.value, (open) => {
  if (!open) return
  let sourcePhone = ''
  if (authStore.isAuthenticated && authStore.user) {
    sourcePhone = authStore.user.phone || ''
  } else {
    sourcePhone = form.telefono || form.pagoMovilTelefono || ''
  }
  const { prefix, localPart } = detectPrefixFromPhone(sourcePhone)
  reverifyForm.value.prefix = prefix
  reverifyForm.value.telefono = (localPart || '').replace(/[^\d]/g, '')
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

const executeAutomaticSale = async (verificationData: any) => {
  submitting.value = true;
  try {
    const { payload, idempotencyKey, quantity, ticketsToBuy } = buildSalePayload(verificationData);
    const res = await PaymentFlowService.createSale(payload, idempotencyKey);
    if (res.data?.status === 'pendiente') {
      pagoMovilVerifyResult.value = {
        success: true,
        message: '🟡 Su pago se encuentra en estado pendiente. Será verificado próximamente.',
        status: 'pendiente'
      };
      submitting.value = false;
      return;
    }
    if (res.status === 200 || res.status === 201) {
      const data = res.data || {};
      const assignedNumbers: number[] = []
      if (data.details && Array.isArray(data.details)) {
        for (const d of data.details) {
          const num = Number(d.number)
          if (!Number.isNaN(num)) assignedNumbers.push(num)
        }
      }
      if (assignedNumbers.length > 0) {
        ticketStore.generateTicket(form, selectedProduct.value, authStore.user?.id ?? null, assignedNumbers)
      } else {
        ticketStore.generateTicket(form, selectedProduct.value, authStore.user?.id ?? null, ticketsToBuy)
      }
      ticketStore.formData.totalPrice = parseFloat(totalPrice.value);
      ticketStore.formData.totalPriceBs = parseFloat(totalPriceBs.value);
      const userId = authStore.user?.id
      let initialTickets = 0
      if (userId) {
        initialTickets = initialTicketsCount.value
      } else {
        initialTickets = ticketStore.tickets.filter(t => t.userId === null).length - quantity
      }
      emit('confirmed', {
        initialTickets: Math.max(0, initialTickets),
        purchasedTickets: assignedNumbers.length > 0 ? assignedNumbers.length : quantity
      });
    }
  } catch (err: any) {
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
  let phone = '';
  if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || '';
  }
  if (!phone) {
    phone = form.pagoMovilTelefono || form.telefono || '';
  }
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
    if (res && res.success === true) {
      pagoMovilVerifyResult.value = { 
        success: true, 
        message: res?.message || '✅ Pago móvil verificado correctamente. Procesando compra...',
        status: res?.status || 'aprobado'
      };
      await executeAutomaticSale(res.data);
    } else if (res && (res.success === false || res.success === 'false')) {
      const msg = typeof res.message === 'string' ? res.message : String(res.message || 'Pago no verificado');
      pagoMovilVerifyResult.value = { success: false, message: msg };
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
        showReverifyModal.value = true;
      }
    }
  } catch (err: any) {
    pagoMovilVerifyResult.value = { 
      success: false, 
      message: err?.message || '❌ Error al verificar el pago móvil.' 
    };
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

const buildSalePayload = (verificationData: any = null) => {
  const userId = authStore.user?.id ?? null;
  let phone = '';
  if (verificationData?.telefono_emisor) {
    phone = verificationData.telefono_emisor
  } else if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || ''
  } else {
    phone = form.pagoMovilTelefono || form.telefono || ''
  }
  let ticketsToBuy: number[] | undefined = undefined;
  let quantity = 0;
  if (selectionMode.value === 'manual') {
    ticketsToBuy = selectedManualTickets.value;
    quantity = ticketsToBuy.length;
  } else {
    quantity = Math.max(1, Number(form.tickets ?? 1));
    try {
      ticketsToBuy = ticketStore.getAvailableNumbers(selectedProduct.value?.title ?? selectedProduct.value, quantity);
    } catch (e) {
      console.error('Error obteniendo números disponibles:', e);
      ticketsToBuy = Array.from({length: quantity}, (_, i) => i + 1);
    }
  }
  const details: any[] = [];
  if (ticketsToBuy) {
    for (const n of ticketsToBuy) {
      details.push({ 
        number: String(n).padStart(4, '0'), 
        amount: Number(selectedProduct.value?.ticketPrice ?? 0), 
        prizes: '' 
      });
    }
  }
  const selectedMethod = paymentMethods.value.find(m => m.slug === form.metodoPago);
  const paymentMethodId = selectedMethod ? selectedMethod.uuid : form.metodoPago;
  const referencia = verificationData?.referencia || form.referencia || `TX-${Date.now()}`;
  const idempotencyKey = `sale-${userId ?? 'guest'}-${Date.now()}`;
  const payload: any = {
    raffle_id: selectedProduct.value?.uuid ?? selectedProduct.value?.title,
    user_id: userId,
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
  };
  function formatSqlDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  payload.payment.payment_date = formatSqlDate(new Date(payload.payment.payment_date));
  return { payload, idempotencyKey, quantity, ticketsToBuy };
};

const copyPagoMovilData = async (event: Event) => {
  // Buscar el método de pago móvil del rifero
  const pagoMovilMethod = paymentMethods.value.find(method => 
    method.slug === 'pago-movil' && method.is_default
  ) || paymentMethods.value.find(method => 
    method.slug === 'pago-movil'
  );

  if (!pagoMovilMethod) {
    showToast('No se encontró información de pago móvil del rifero', 'error');
    return;
  }

  const pagoMovilData = `${pagoMovilMethod.bank_code || ''}\n${pagoMovilMethod.document_number || ''}\n${pagoMovilMethod.account_number || ''}`;
  
  try {
    await navigator.clipboard.writeText(pagoMovilData);
    const button = event?.currentTarget as HTMLElement;
    if (button) {
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> ¡Copiado!`;
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
      setTimeout(() => {
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copiar`;
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
      }, 2000);
    }
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    showToast('Error al copiar datos', 'error');
  }
};

async function handleSubmitReverify() {
  reverifySubmitting.value = true;
  pagoMovilVerifyResult.value = null;
  const { fecha, referencia, banco, prefix, telefono, cedula, monto: montoStr } = reverifyForm.value;
  const phoneLocal = (telefono || '').replace(/[^\d]/g, '');
  const phone = (prefix || '') + phoneLocal;
  const montoRaw = String(montoStr || '').replace(/[^\d.]/g, '');
  const monto = parseFloat(montoRaw);
  const missing = [];
  if (!fecha) missing.push('Fecha');
  if (!referencia) missing.push('Referencia');
  if (!banco) missing.push('Banco');
  if (!phone || phone.length < 11) missing.push('Teléfono');
  if (!cedula) missing.push('Cédula');
  if (!monto || isNaN(monto) || monto <= 0) missing.push('Monto válido');
  if (missing.length > 0) {
    pagoMovilVerifyResult.value = { 
      success: false, 
      message: `Todos los campos son requeridos. Por favor, verifica: ${missing.join(', ')}.`
    };
    reverifySubmitting.value = false;
    return;
  }
  const userId = authStore.user?.id ?? null;
  const payload = {
    user_id: userId,
    fecha,
    referencia,
    banco,
    phone, 
    cedula,
    exchange_rate: Number(bcvRate.value) || 1,
    monto
  };
  try {
    const res = await PaymentFlowService.verifyPagoMovilManual(payload);
    if (res && (res.success === false || res.success === 'false')) {
      const errorMessage = res.message || 'Pago no verificado.';
      pagoMovilVerifyResult.value = { 
        success: false, 
        message: errorMessage 
      };
      pagoMovilNeedsReverify.value = true;
    } else {
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
        await executeAutomaticSale(res.data);
        pagoMovilNeedsReverify.value = false;
        showReverifyModal.value = false;
      }
    }
  } catch (err: any) {
    pagoMovilVerifyResult.value = { 
      success: false, 
      message: err?.message || 'Error al conectar con el servicio de verificación.' 
    };
    pagoMovilNeedsReverify.value = true;
  } finally {
    reverifySubmitting.value = false;
  }
}

// async function loadBanks() {
//   loadingBanks.value = true;
//   try {
//     banks.value = await PaymentFlowService.fetchBanks();
//   } catch (error: any) {
//     console.error('Error al cargar los bancos:', error);
//   } finally {
//     loadingBanks.value = false;
//   }
// }

function triggerFileDialog() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  ticketStore.setComprobante(file);
}

watch(() => form.comprobante, (newFile) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile);
  }
});

watch(selectionMode, (newMode) => {
  if (newMode === 'auto') {
    // Limpiar selección manual y timers
    if (selectedManualTickets.value.length > 0) {
      freeAllBookedTickets();
      selectedManualTickets.value = [];
    }
    bookingTimerStarted.value = false;
    clearTimer();
    resetTimer();
    
    // Limpiar tickets aleatorios
    clearRandomTicketsTimer();
    randomTicketsResult.value = null;
  }
});

// async function loadPaymentMethods() {
//   loadingMethods.value = true;
//   try {
//     paymentMethods.value = await PaymentFlowService.fetchPaymentMethods();
//   } catch (error) {
//     console.error('Error al cargar los métodos de pago:', error);
//   } finally {
//     loadingMethods.value = false;
//   }
// }

// async function fetchBcvRate() {
//   loadingBcv.value = true;
//   try {
//     const response = await fetch('https://bcv-api.karanta.dev/rates/');
//     const data = await response.json();
//     bcvRate.value = data.bcv || 0;
//   } catch (error) {
//     console.error('Error fetching BCV rate:', error);
//   } finally {
//     loadingBcv.value = false;
//   }
// }

onMounted(() => {
  console.log('✅ ParticipateModal montado - usando datos ya cargados en App.vue')

  // // Cargar los datos desde App.vue
  // fetchBcvRate()
  // loadPaymentMethods()
  // loadBanks()
  
  // loadingCurrencies.value = true
  // PaymentFlowService.fetchCurrencies().then(result => {
  //   const currs = result?.currencies ?? []
  //   currencies.value = currs
  //   selectedCurrencyId.value = result?.defaultCurrencyId || currs[0]?.uuid
  // }).finally(() => {
  //   loadingCurrencies.value = false
  // })
})

onUnmounted(() => {
  clearRandomTicketsTimer();
});
const handleConfirm = async () => {
  error.value = null;
  let ticketsToBuy: number[] | undefined = undefined;
  let quantity: number;

  // Validación para modo automático
  if (selectionMode.value === 'auto') {
    if (!randomTicketsResult.value || randomTicketsResult.value.successful.length === 0) {
      error.value = 'Debes obtener tickets aleatorios primero';
      return;
    }
    ticketsToBuy = randomTicketsResult.value.successful.map(t => t.number);
    quantity = ticketsToBuy.length;
  } 

  if (selectionMode.value === 'manual') {
    ticketsToBuy = selectedManualTickets.value;
    quantity = ticketsToBuy.length;
    if (quantity === 0) {
      error.value = 'Debes seleccionar al menos un ticket.';
      return;
    }
  } else {
    quantity = Math.max(1, Number(form.tickets ?? 1));
    if (quantity > (maxAvailable.value ?? 0)) {
      error.value = `Solo quedan ${maxAvailable.value} tickets disponibles`;
      return;
    }
  }
  if (form.metodoPago === 'pago-movil' && pagoMovilMode.value === 'automatico') {
    if (!form.pagoMovilCedula || !form.pagoMovilTelefono || !form.pagoMovilBanco) {
        error.value = 'Debes completar todos los campos de Pago Móvil Automático.';
        return;
    }
    form.referencia = 'AUTOMATIC'; 
    ticketStore.setComprobante(null);
  } 
  else if (form.metodoPago !== 'pago-movil' && (!form.metodoPago || !form.referencia)) {
    error.value = 'Debes seleccionar un método de pago e ingresar la referencia.';
    return;
  } 
  else if (!form.metodoPago) {
      error.value = 'Debes seleccionar un método de pago.';
      return;
  }
  const userId = authStore.user?.id ?? null;
  const initialTickets = initialTicketsCount.value;
  const purchasedTickets = quantity;
  const idempotencyKey = `sale-${userId ?? 'guest'}-${Date.now()}`;
  let phone = '';
  if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || ''
  } else {
    phone = form.telefono || ''
  }
  const payload: any = {
    raffle_id: selectedProduct.value?.uuid ?? selectedProduct.value?.title,
    user_id: userId,
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
  };
  if (selectionMode.value === 'manual' && ticketsToBuy) {
    for (const n of ticketsToBuy) {
      payload.details.push({ number: String(n).padStart(4, '0'), amount: Number(selectedProduct.value?.ticketPrice ?? 0), prizes: '' });
    }
  } else {
    try {
      const avail = ticketStore.getAvailableNumbers(selectedProduct.value?.title ?? selectedProduct.value, quantity);
      for (const n of avail) {
        payload.details.push({ number: String(n).padStart(4, '0'), amount: Number(selectedProduct.value?.ticketPrice ?? 0), prizes: '' });
      }
    } catch (e: any) {
      error.value = e?.message || 'No hay suficientes tickets disponibles.';
      submitting.value = false;
      return;
    }
  }
  const selectedMethod = paymentMethods.value.find(m => m.slug === form.metodoPago);
  if (selectedMethod) {
    payload.payment.payment_method_id = selectedMethod.uuid;
  }
  payload.payment.currency_id = selectedCurrencyId.value;
  payload.payment.current_currency_id = selectedCurrencyId.value;
  if (!payload.payment.currency_id) {
    error.value = 'No se ha configurado la moneda. Selecciona una moneda válida.';
    submitting.value = false;
    return;
  }
  function formatSqlDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  payload.payment.payment_date = formatSqlDate(new Date(payload.payment.payment_date));
  submitting.value = true;
  try {
    const res = await PaymentFlowService.createSale(payload, idempotencyKey);
    if (res.data?.status === 'pendiente') {
      pagoMovilVerifyResult.value = {
        success: true,
        message: '🟡 Su pago se encuentra en estado pendiente. Será verificado próximamente.',
        status: 'pendiente'
      };
      submitting.value = false;
      return;
    }
    if (res.status === 200 || res.status === 201) {
      const data = res.data || {};
      const assignedNumbers: number[] = [];
      if (data.details && Array.isArray(data.details)) {
        for (const d of data.details) {
          const num = Number(d.number);
          if (!Number.isNaN(num)) assignedNumbers.push(num);
        }
      }
      if (assignedNumbers.length > 0) {
        ticketStore.generateTicket(form, selectedProduct.value, userId, assignedNumbers);
      } else {
        ticketStore.generateTicket(form, selectedProduct.value, userId, ticketsToBuy);
      }
      ticketStore.formData.totalPrice = parseFloat(totalPrice.value);
      ticketStore.formData.totalPriceBs = parseFloat(totalPriceBs.value);
      emit('confirmed', {
        initialTickets,
        purchasedTickets: assignedNumbers.length > 0 ? assignedNumbers.length : purchasedTickets
      });
    }
  } catch (err: any) {
    console.error('Error procesando venta:', err);
    if (err && err.data && err.data.errors && err.data.errors.details) {
      const detailsErr = err.data.errors.details;
      error.value = Array.isArray(detailsErr) ? `Los siguientes números ya no están disponibles: ${detailsErr.join(', ')}` : String(detailsErr);
    } else if (err && err.data && err.data.message) {
      error.value = String(err.data.message);
    } else {
      error.value = 'Ocurrió un error procesando la venta.';
    }
  } finally {
    submitting.value = false;
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
.select-custom:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  background: rgba(0, 0, 0, 0.5);
}
.select-custom option {
  background: #1e1b4b;
  color: white;
}
.select-prefix {
  width: 5.25rem;
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
.grid-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #f3b243;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.md\:grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }
</style>