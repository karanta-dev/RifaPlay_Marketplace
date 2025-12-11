<template>
  <transition name="fade">
    <div v-if="isParticipateModalOpen" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" @click="close" />
  </transition>

  <transition name="scale-fade">
    <div v-if="isParticipateModalOpen" class="fixed inset-0 z-50" @click.self="close">
      <div class="bg-gradient-to-br from-blue-900 to-gray-800 relative transition-all duration-300 border-purple-400/30 flex flex-col w-screen h-screen p-4 sm:p-6">
        
        <!-- Botón de cerrar -->
        <button v-if="authStore.isAuthenticated" class="absolute top-4 right-4 z-30 bg-transparent border-none p-1" @click="close" aria-label="Cerrar">
          <XMarkIcon class="h-5 w-5 text-white/70 hover:text-white transition-colors" />
        </button>

        <!-- Header -->
        <div class="relative z-10 mb-4 flex-shrink-0 flex items-center justify-between gap-2">   
          <div class="flex items-center justify-left gap-3">
            <img src="/rifaLogo.png" alt="Slot" class="h-10 sm:h-16 w-auto" />
            <h2 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent whitespace-nowrap">
              Compra de tickets
            </h2>
          </div>
          <div v-if="selectionMode === 'manual' && bookingTimerStarted" class="flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300" :class="timerClasses">
            <div class="w-3 h-3 rounded-full animate-pulse" :class="pulseClass"></div>
            <span class="font-mono text-base sm:text-lg font-bold" :class="timerTextClass">{{ formattedTime }}</span>
          </div>
        </div>

        <!-- Formulario principal -->
        <form @submit.prevent="handleConfirm" class="space-y-6 relative z-10 flex-grow overflow-y-auto pr-2 pb-16">
          
          <!-- Si NO está autenticado -->
          <template v-if="!authStore.isAuthenticated">
            <div class="p-6 bg-black/20 rounded-xl border border-white/10 text-center">
              <p class="text-white text-lg font-semibold mb-2">Necesitas iniciar sesión</p>
              <p class="text-gray-300 mb-4">Debes estar autenticado para comprar tickets. Inicia sesión o regístrate para continuar y guardar tus tickets en tu cuenta (Solo mayores de 18).</p>
              <div class="flex justify-center gap-3">
                <button type="button" @click="openAuthModal" class="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500">
                  Iniciar sesión / Registrarse
                </button>
                <button type="button" @click="close" class="px-5 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500">Cerrar</button>
              </div>
            </div>
          </template>

          <!-- Si ESTÁ autenticado -->
          <template v-else>
            
            <!-- Modo de selección -->
            <div class="flex flex-col sm:flex-row justify-center gap-4 p-4 bg-black/30 rounded-xl border border-white/10">
              <label class="flex items-center space-x-3 cursor-pointer group">
                <div class="relative">
                  <input type="radio" v-model="selectionMode" value="auto" class="h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500 bg-transparent"/>
                </div>
                <span class="font-semibold text-white group-hover:text-cyan-300 transition-colors">Selección Automática</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <div class="relative">
                  <input type="radio" v-model="selectionMode" value="manual" class="h-5 w-5 text-cyan-500 border-gray-300 focus:ring-cyan-500 bg-transparent"/>
                </div>
                <span class="font-semibold text-white group-hover:text-cyan-300 transition-colors">Selección Manual</span>
              </label>
            </div>

            <!-- Modo Automático -->
            <div v-if="selectionMode === 'auto'" class="space-y-4">
              <div class="p-5 bg-black/30 rounded-xl border border-cyan-500/30">
                <label class="font-semibold text-cyan-300 mb-3 block text-lg">🎲 Cantidad de tickets (Automático)</label>
                <div class="flex items-center gap-3">
                  <input v-model.number="form.tickets" type="number" min="1" :max="maxAvailable === null ? undefined : maxAvailable" placeholder="Cantidad de tickets" class="input-custom flex-grow" :required="selectionMode === 'auto'"/>
                  <div class="text-sm text-white whitespace-nowrap">Disponibles: <strong class="text-yellow-400">{{ maxAvailable }}</strong></div>
                </div>
                
                <button type="button" @click="fetchRandomTickets" :disabled="loadingRandomTickets || !form.tickets || form.tickets < 1" class="w-full mt-4 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed">
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
                  <div v-for="ticket in randomTicketsResult.successful" :key="ticket.number" class="bg-green-500/20 border border-green-400/50 rounded-lg p-2 text-center">
                    <span class="text-green-300 font-bold text-sm">{{ String(ticket.number).padStart(4, '0') }}</span>
                  </div>
                </div>
                
                <p class="text-green-300 text-sm">
                  Se han reservado <strong>{{ randomTicketsResult.successful.length }}</strong> tickets aleatoriamente. 
                  Tienes 1 minuto para completar la compra.
                </p>
              </div>

              <!-- Tickets fallidos -->
              <div v-if="randomTicketsResult?.failed?.length" class="p-4 bg-black/40 rounded-xl border border-orange-500/30">
                <h3 class="font-semibold text-orange-400 text-lg mb-2">⚠️ Tickets No Disponibles</h3>
                <p class="text-orange-300 text-sm">
                  Algunos tickets no pudieron ser reservados. Intenta con una cantidad menor.
                </p>
              </div>
            </div>

            <!-- TicketGrid para modo manual -->
            <TicketGrid v-if="selectionMode === 'manual' && selectedProduct" :raffleId="selectedProduct.uuid" @update:selected="handleSelectionUpdate" />
              
            <!-- Moneda -->
<label class="font-semibold text-white text-lg">💱 Moneda</label>
  <select v-model="selectedCurrencyId" :disabled="loadingCurrencies || availableCurrencies.length === 0" class="select-custom">
    <option v-for="c in availableCurrencies" :key="c.uuid" :value="c.uuid">
      {{ c.name }} ({{ c.short_name }})
    </option>
  </select>
  <p v-if="availableCurrencies.length === 0" class="text-red-400 text-sm">
    No hay monedas disponibles en los métodos de pago.
  </p>

            <!-- Método de Pago -->
            <div class="space-y-4">
              <label class="font-semibold text-white text-lg">💳 Método de Pago</label>
              <select v-model="form.metodoPago" class="input-custom" required>
  <option value="" disabled :selected="!form.metodoPago">Seleccionar método de pago</option>
  <option v-for="method in filteredPaymentMethods" :key="method.uuid" :value="method.uuid">
    {{ method.name }} {{ method.is_default ? '' : '' }}
  </option>
</select>

<!-- También cambia el mensaje cuando no hay métodos: -->
<div v-if="filteredPaymentMethods.length === 0" class="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
  <p class="text-yellow-400 text-sm">
    ⚠️ No hay métodos de pago disponibles para la moneda seleccionada.
    Por favor, selecciona otra moneda o contacta al rifero.
  </p>
</div>

              <!-- Structured data general (NO para Pago Móvil) -->
              <div v-if="shouldShowGeneralStructuredData" class="mt-3 p-3 bg-black/20 rounded-lg text-sm text-white/90 border border-white/10">
                <p class="font-semibold text-cyan-300 mb-2">🔎 Datos del método seleccionado</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="(v, k) in parsedStructured" :key="k" class="flex items-start gap-2">
                    <span class="text-gray-300 font-medium">{{ k }}:</span>
                    <span class="text-white break-all">{{ v }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Referencia de pago (excepto Pago Móvil automático) -->
              <div v-if="!(isPagoMovilSelected && pagoMovilMode === 'automatico')" class="mt-4">
                <label class="font-semibold text-white text-lg">🔖 Referencia de pago</label>
                <input v-model="form.referencia" type="text" placeholder="Ingresa el número de referencia" class="input-custom" required />
                <p class="text-gray-400 text-sm mt-1">Número de referencia, comprobante o transacción de tu pago.</p>
              </div>

              <!-- SECCIÓN PAGO MÓVIL -->
              <div v-if="isPagoMovilSelected" class="mt-4">
                
                <!-- Selector de modo (Manual/Automático) -->
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
                
                <!-- Modo Manual: Mostrar información del rifero -->
                <div v-if="pagoMovilMode === 'manual' && isPagoMovilSelected" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30 relative mt-4">
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
                  
                  <div v-if="selectedPaymentMethod" class="space-y-2 mb-4 p-3 bg-cyan-500/10 rounded-lg">
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-cyan-300">{{ selectedPaymentMethod.name }}</p>
                      <span v-if="selectedPaymentMethod.is_default" class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Principal</span>
                    </div>
                    
                    <!-- Mostrar structured_data parseado si existe -->
                    <div v-if="parsedStructured" class="space-y-1 text-sm">
                      <div v-for="(value, key) in parsedStructured" :key="key" class="flex items-center gap-2">
                        <span class="text-cyan-400">📌</span> 
                        {{ key }}: <strong>{{ value }}</strong>
                      </div>
                    </div>
                    
                    <!-- Mostrar campos mapeados si no hay structured_data -->
                    <div v-else class="space-y-1 text-sm">
                      <p class="flex items-center gap-2" v-if="selectedPaymentMethod.bank_name">
                        <span class="text-cyan-400">🏦</span> 
                        Banco: <strong>{{ selectedPaymentMethod.bank_name }}</strong>
                      </p>
                      <p class="flex items-center gap-2" v-if="selectedPaymentMethod.document_number">
                        <span class="text-cyan-400">📋</span> 
                        Cédula: <strong>{{ selectedPaymentMethod.document_number }}</strong>
                      </p>
                      <p class="flex items-center gap-2" v-if="selectedPaymentMethod.holder_name">
                        <span class="text-cyan-400">👤</span> 
                        Titular: <strong>{{ selectedPaymentMethod.holder_name }}</strong>
                      </p>
                      <p class="flex items-center gap-2" v-if="selectedPaymentMethod.account_number">
                        <span class="text-cyan-400">📞</span> 
                        Teléfono: <strong>{{ selectedPaymentMethod.account_number }}</strong>
                      </p>
                      <p v-if="selectedPaymentMethod.description" class="flex items-center gap-2 text-cyan-200/80">
                        <span class="text-cyan-400">📝</span> 
                        Observación: {{ selectedPaymentMethod.description }}
                      </p>
                    </div>
                  </div>
                  
                  <div v-else class="text-yellow-400 text-sm">
                    ⚠️ No se encontraron métodos de pago móvil configurados por el rifero
                  </div>
                </div>
                
                <!-- Modo Automático: Campos para ingresar datos -->
                <div v-else-if="pagoMovilMode === 'automatico'" class="space-y-4 mt-4">
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
              
              <!-- Otros métodos de pago (NO Pago Móvil y SIN structured_data) -->
              <div v-else-if="form.metodoPago && !isPagoMovilSelected && !parsedStructured" class="p-4 bg-black/40 rounded-lg text-sm text-white border border-cyan-500/30 mt-4">
                <div v-if="selectedPaymentMethod" class="space-y-2">
                  <p class="font-semibold text-cyan-400 mb-2">{{ selectedPaymentMethod.name }}</p>
                  
                  <div class="space-y-1">
                    <p class="flex items-center gap-2" v-if="selectedPaymentMethod.account_number">
                      <span class="text-cyan-400">🔢</span> 
                      Cuenta/Usuario: <strong>{{ selectedPaymentMethod.account_number }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="selectedPaymentMethod.holder_name">
                      <span class="text-cyan-400">👤</span> 
                      Titular: <strong>{{ selectedPaymentMethod.holder_name }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="selectedPaymentMethod.bank_name">
                      <span class="text-cyan-400">🏦</span> 
                      Banco: <strong>{{ selectedPaymentMethod.bank_name }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="selectedPaymentMethod.document_number">
                      <span class="text-cyan-400">📋</span> 
                      Cédula: <strong>{{ selectedPaymentMethod.document_number }}</strong>
                    </p>
                    <p class="flex items-center gap-2" v-if="selectedPaymentMethod.description">
                      <span class="text-cyan-400">📝</span> 
                      Observación: {{ selectedPaymentMethod.description }}
                    </p>
                  </div>
                </div>
                
                <div v-else class="text-yellow-400 text-sm">
                  ⚠️ No se encontró información detallada para este método de pago
                </div>
              </div>
            </div>

            <!-- Botones de acción y comprobante -->
            <div class="space-y-4">
              <!-- Botón de verificación para Pago Móvil manual -->
              <div v-if="isPagoMovilSelected && pagoMovilMode === 'manual'" class="mt-2">
                <button type="button" class="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30 font-semibold" @click="pagoMovilNeedsReverify ? (showReverifyModal = true) : handleVerifyPagoMovil()" :disabled="verifyingPagoMovil || reverifySubmitting">
                  <span v-if="verifyingPagoMovil">Verificando...</span>
                  <span v-else-if="pagoMovilNeedsReverify">Volver a verificar</span>
                  <span v-else>Ya pagué</span>
                </button>
                <p v-if="pagoMovilVerifyResult" :class="{'text-green-400': pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente', 'text-yellow-400': pagoMovilVerifyResult.status === 'pendiente', 'text-red-400': !pagoMovilVerifyResult.success && pagoMovilVerifyResult.status !== 'pendiente'}" class="mt-2 text-sm">{{ pagoMovilVerifyResult.message }}</p>
              </div>
              
              <!-- Comprobante de pago (excepto Pago Móvil automático) -->
              <div v-if="!(isPagoMovilSelected && pagoMovilMode === 'automatico')">
                <label class="block font-semibold text-white mb-3 text-lg">📎 Comprobante de pago (opcional)</label>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange"/>
                <button type="button" @click="triggerFileDialog" class="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-cyan-400/30">📸 Insertar imagen del comprobante</button>
                <p v-if="form.comprobante" class="text-sm text-green-400 mt-2 flex items-center gap-2"><span>✅</span> Archivo seleccionado: {{ form.comprobante.name }}</p>
                <div v-if="previewUrl" class="mt-3">
                  <img :src="previewUrl" alt="preview" class="max-h-40 object-contain border-2 border-cyan-500/50 rounded-xl shadow-lg" />
                </div>
              </div>
            </div>

            <!-- Sección de precios -->
            <div class="pt-4 border-t border-white/20 mt-6">
              <div class="flex flex-col items-end gap-1">
                <p class="text-lg font-bold text-white">
                  Precio: <strong class="text-2xl text-yellow-400 ml-2">{{ displayPrice.text }}</strong>
                </p>
                <span v-if="displayPrice.showUsdRate && displayPrice.rate" class="text-sm text-gray-400">
                  (Tasa: {{ displayPrice.rate.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }} {{ displayPrice.rateCurrency }})
                </span>
              </div>
              
              <div v-if="displayPrice.showUsdPrice" class="text-right space-y-2">
                <p class="text-lg font-bold text-white">
                  Precio: <span class="text-2xl text-yellow-400 ml-2">{{ totalPrice }} USD</span>
                </p>
              </div>
              
              <div v-if="currentQty > 0" class="text-right space-y-2">
                <p class="text-sm text-cyan-300">Tickets a comprar: <strong class="text-white">{{ currentQty }}</strong></p>
              </div>
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">⚠️ {{ error }}</div>

            <!-- Botones de acción finales -->
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
              <button type="button" @click="close" class="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-500/30">Cancelar</button>
              <button type="submit" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-yellow-400/30" :disabled="currentQty === 0 || submitting">
                <span v-if="submitting">Procesando...</span>
                <span v-else> {{ authStore.isAuthenticated ? 'Participar' : 'Confirmar' }}</span>
              </button>
            </div>
          </template>
        </form>

        <!-- Modal de re-verificación -->
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

  <!-- Componente Bill -->
  <Bill
    :open="showBill"
    :qr-url="billData.qrUrl"
    :serial-number="billData.serialNumber"
    :date="billData.date"
    :seller-name="billData.sellerName"  
    :raffle-name="billData.raffleName"
    :selected-numbers="billData.selectedNumbers"
    :draw-date="billData.drawDate"
    :quantity="billData.quantity"
    :price="billData.price"
    :total="billData.total"
    :amount-usd="billData.amountUsd"
    :exchange-rate="billData.exchangeRate"
    :amount-local-currency-label="billData.amountLocalCurrencyLabel"
    :amount-local="billData.amountLocal"
    :client-name="billData.clientName"
    :client-id="billData.clientId"
    :client-phone="billData.clientPhone"
    @close="handleBillClose"
    @download="handleBillDownload"
    @print="handleBillPrint"
    @sell-another="handleSellAnother"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useTicketStore } from '@/stores/useTicketStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGridStore } from '@/stores/useGridStore';
import { RaffleService } from '@/services/RaffleService';
import { PaymentFlowService, type Currency, type PaymentMethod} from '@/services/PaymentFlow';
import Bill from './Bill.vue';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useBookingTimer } from '@/composables/useBookingTimer';
import { useToast } from '@/composables/useToast';
import TicketGrid from './TicketGrid.vue';
defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['close', 'confirmed', 'time-expired', 'open-auth']);
const { showToast } = useToast();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const gridStore = useGridStore();
const paymentStore = usePaymentStore();
const { banks, currencies } = storeToRefs(paymentStore);
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
const paymentMethods = computed(() => {
  if (!selectedProduct.value?.seller?.payment_methods) {
    console.log('⚠️ No hay seller o payment_methods:', selectedProduct.value?.seller);
    return [] as PaymentMethod[];
  }
  
  const methods = selectedProduct.value.seller.payment_methods as any[];
  
  console.log('💳 Métodos de pago del rifero (raw):', methods);
  
  return methods.map((method: any): PaymentMethod => {
    // Parsear structured_data si existe
    let parsedStructuredData = null;
    if (method.structured_data) {
      try {
        parsedStructuredData = typeof method.structured_data === 'string' 
          ? JSON.parse(method.structured_data) 
          : method.structured_data;
      } catch (e) {
        console.warn('Error parseando structured_data:', e);
      }
    }
    
    // Crear slug basado en el nombre del método
    const slug = method.method_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // ✅ Devolver objeto que cumple con la interfaz PaymentMethod
    return {
      uuid: method.uuid,
      name: method.method_name,
      slug: slug,
      is_default: method.is_default || false,
      bank_name: parsedStructuredData?.Banco || parsedStructuredData?.banco || '',
      bank_code: parsedStructuredData?.CodigoBanco || parsedStructuredData?.codigo || '',
      account_number: parsedStructuredData?.Cuenta || parsedStructuredData?.Telefono || parsedStructuredData?.telefono || '',
      holder_name: parsedStructuredData?.Titular || parsedStructuredData?.Nombre || '',
      document_number: parsedStructuredData?.Cedula || parsedStructuredData?.cedula || '',
      description: method.observation || '',
      structured_data: method.structured_data,
      variable_name: method.method_name.toLowerCase().replace(/\s+/g, '_'),
      original_data: method,
      logoUrl: method.logo_url || method.icon || '',
      is_active: method.is_active ?? true,
      // 🔥 NUEVO: Incluir la moneda del método de pago
      currency: method.currency ? {
        uuid: method.currency.uuid,
        name: method.currency.name,
        short_name: method.currency.short_name,
        symbol: method.currency.symbol
      } : null,
      parsed_structured_data: parsedStructuredData
    } as PaymentMethod;
  });
});

const availableCurrencies = computed(() => {
  const currenciesFromMethods = paymentMethods.value
    .map(method => method.currency)
    .filter((currency): currency is { uuid: string; name: string; short_name: string; symbol?: string | null } => 
      currency !== null && currency !== undefined
    );
  
  // Eliminar duplicados por uuid
  const uniqueCurrencies = currenciesFromMethods.filter((currency, index, self) =>
    index === self.findIndex(c => c.uuid === currency.uuid)
  );
  
  console.log('💰 Monedas disponibles de los métodos de pago:', uniqueCurrencies);
  return uniqueCurrencies;
});

const filteredPaymentMethods = computed(() => {
  if (!selectedCurrencyId.value) {
    return paymentMethods.value;
  }
  
  // Filtrar métodos de pago por la moneda seleccionada
  return paymentMethods.value.filter(method => {
    // Si el método no tiene moneda definida, mostrarlo (compatibilidad hacia atrás)
    if (!method.currency) {
      return true;
    }
    
    // Comparar UUIDs de las monedas
    return method.currency.uuid === selectedCurrencyId.value;
  });
});
// 🔥 Depuración para verificar
watch(selectedProduct, (newProduct) => {
  if (newProduct) {
    console.log('🎯 Producto seleccionado:', {
      title: newProduct.title,
      hasSeller: !!newProduct.seller,
      seller: newProduct.seller,
      paymentMethods: paymentMethods.value
    });
  }
}, { immediate: true });

// const loadingMethods = ref(false)
// const currencies = ref<Currency[]>([])
const loadingCurrencies = ref(false)
const selectedCurrencyId = ref<string | undefined>(undefined)
const initialTicketsCount = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const form = ticketStore.formData
// Parsed structured_data of the selected payment method
const parsedStructured = ref<Record<string, any> | null>(null)

// Computed: método de pago actualmente seleccionado (objeto completo)
const selectedPaymentMethod = computed(() => {
  return paymentMethods.value.find(m => m.slug === form.metodoPago || m.uuid === form.metodoPago) || null
})

const selectedMethodHasStructured = computed(() => {
  const m: any = selectedPaymentMethod.value
  return !!(m && m.structured_data)
})

// Modificar o agregar la función openAuthModal
const openAuthModal = () => {
  close(); // Cierra el modal actual de participación
  authStore.showLoginModal = true; // Abre el modal de autenticación
};


/**
 * Try to map common structured_data keys into existing form fields
 * (telefono, cedula, email, banco, account, etc.)
 */
function applyStructuredToForm(obj: Record<string, any> | null, methodSlug: string | undefined) {
  if (!obj) return
  try {
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      const key = String(k).toLowerCase()
      if (!v) continue
      // telefono / phone
      if (key.includes('telefono') || key.includes('phone') || key.includes('tel')) {
        // prefer pagoMovil fields when pago-movil selected
        if (methodSlug === 'pago-movil') {
          if (!form.pagoMovilTelefono) form.pagoMovilTelefono = String(v)
        }
        if (!form.telefono) form.telefono = String(v)
      }
      // cedula / ci / document
      if (key.includes('cedula') || key.includes('ci') || key.includes('document')) {
        if (methodSlug === 'pago-movil') {
          if (!form.pagoMovilCedula) form.pagoMovilCedula = String(v)
        }
        if (!form.pagoMovilCedula) form.pagoMovilCedula = String(v)
      }
      // email (no rellenar referencia; solo dejamos el dato en parsedStructured para mostrar)
      if (key.includes('email')) {
        // no hacemos asignación automática a form.referencia por petición del usuario
      }
      // banco / bank
      if (key.includes('banco') || key.includes('bank')) {
        // we can't map to a bank uuid here, so store in pagoMovilBanco text field
        if (!form.pagoMovilBanco) form.pagoMovilBanco = String(v)
      }
      // account / cuenta / account_number (no escribir en referencia)
      if (key.includes('account') || key.includes('cuenta') || key.includes('account_number') || key.includes('usuario')) {
        // dejamos en parsedStructured; no asignamos a form.referencia
      }
    }
  } catch (e) {
    console.error('Error applying structured_data to form:', e)
  }
}
const previewUrl = ref<string | null>(null)
const error = ref<string | null>(null)
const submitting = ref(false)
const showBill = ref(false);
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

  const selectedCurrency = availableCurrencies.value.find(c => c.uuid === selectedCurrencyId.value);
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
    const totalBs = totalUsd * bcvRate.value;
    return {
      text: `${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`,
      showUsdRate: true,
      rate: bcvRate.value,
      rateCurrency: '/ USD',
      showUsdPrice: true // Mostrar precio USD como referencia
    };
  } else if (currencyName.includes('peso colombiano') || selectedCurrency.short_name === 'COP') {
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

const isPagoMovilSelected = computed(() => {
  if (!selectedPaymentMethod.value) return false;
  
  // Verificar por nombre del método (case insensitive)
  const methodName = selectedPaymentMethod.value.name.toLowerCase();
  return methodName.includes('pago') && methodName.includes('movil');
});

// Detecta si el método seleccionado es Transferencia
// const isTransferenciaSelected = computed(() => {
//   if (!selectedPaymentMethod.value) return false;
  
//   const methodName = selectedPaymentMethod.value.name.toLowerCase();
//   return methodName.includes('transferencia');
// });

// También puedes crear un slug para comparación
// const selectedMethodSlug = computed(() => {
//   if (!selectedPaymentMethod.value) return '';
//   return selectedPaymentMethod.value.name
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '');
// });
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
    showBill.value = false;
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

// Cuando cambie el método de pago, parsear structured_data si existe y aplicar valores al formulario
watch(() => form.metodoPago, (newVal) => {
  parsedStructured.value = null;
  if (!newVal) return;
  const method = paymentMethods.value.find(m => m.slug === newVal || m.uuid === newVal);
  if (!method) return;
  const sd = method.structured_data;
  if (!sd) return;
  try {
    const parsed = typeof sd === 'string' ? JSON.parse(sd) : sd;
    if (parsed && typeof parsed === 'object') {
      parsedStructured.value = parsed as Record<string, any>;
      applyStructuredToForm(parsed as Record<string, any>, method.slug);
    }
  } catch (e) {
    console.warn('No se pudo parsear structured_data del método de pago:', e);
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

// function triggerAuth() {
//   close();
//   window.dispatchEvent(new CustomEvent('open-auth'))
// }
// Determina si mostrar structured_data general
const shouldShowGeneralStructuredData = computed(() => {
  return selectedMethodHasStructured.value && parsedStructured.value && !isPagoMovilSelected.value;
});

// Función para copiar datos de Pago Móvil
const copyPagoMovilData = async (event: Event) => {
  if (!selectedPaymentMethod.value) {
    showToast('No se encontró información de pago móvil del rifero', 'error');
    return;
  }

  let textToCopy = '';
  
  if (parsedStructured.value) {
    for (const [key, value] of Object.entries(parsedStructured.value)) {
      textToCopy += `${key}: ${value}\n`;
    }
  } else {
    if (selectedPaymentMethod.value.bank_name) textToCopy += `Banco: ${selectedPaymentMethod.value.bank_name}\n`;
    if (selectedPaymentMethod.value.document_number) textToCopy += `Cédula: ${selectedPaymentMethod.value.document_number}\n`;
    if (selectedPaymentMethod.value.holder_name) textToCopy += `Titular: ${selectedPaymentMethod.value.holder_name}\n`;
    if (selectedPaymentMethod.value.account_number) textToCopy += `Teléfono: ${selectedPaymentMethod.value.account_number}\n`;
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy.trim());
    const button = event?.currentTarget as HTMLElement;
    if (button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ¡Copiado!
      `;
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
      }, 2000);
    }
    showToast('Datos copiados al portapapeles', 'success');
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    showToast('Error al copiar datos', 'error');
  }
};
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
      showInvoice(data);
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
  
  // ✅ Ahora form.metodoPago ya es el UUID del método de pago
  const paymentMethodId = form.metodoPago;
  const referencia = verificationData?.referencia || form.referencia || `TX-${Date.now()}`;
  const idempotencyKey = `sale-${userId ?? 'guest'}-${Date.now()}`;
  
  const payload: any = {
    raffle_id: selectedProduct.value?.uuid ?? selectedProduct.value?.title,
    user_id: userId,
    details: details,
    payment: {
      payment_method_id: paymentMethodId, // ✅ Ya es UUID
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
      } : undefined,
      is_verify: !!verificationData
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

// const copyPagoMovilData = async (event: Event) => {
//   // Buscar el método de pago móvil del rifero
//   const pagoMovilMethod = paymentMethods.value.find(method => 
//     method.slug === 'pago-movil' && method.is_default
//   ) || paymentMethods.value.find(method => 
//     method.slug === 'pago-movil'
//   );

//   if (!pagoMovilMethod) {
//     showToast('No se encontró información de pago móvil del rifero', 'error');
//     return;
//   }

//   const pagoMovilData = `${pagoMovilMethod.bank_code || ''}\n${pagoMovilMethod.document_number || ''}\n${pagoMovilMethod.account_number || ''}`;
  
//   try {
//     await navigator.clipboard.writeText(pagoMovilData);
//     const button = event?.currentTarget as HTMLElement;
//     if (button) {
//       button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> ¡Copiado!`;
//       button.classList.add('bg-green-600', 'hover:bg-green-700');
//       button.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
//       setTimeout(() => {
//         button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copiar`;
//         button.classList.remove('bg-green-600', 'hover:bg-green-700');
//         button.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
//       }, 2000);
//     }
//   } catch (err) {
//     console.error('Error al copiar al portapapeles:', err);
//     showToast('Error al copiar datos', 'error');
//   }
// };

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
  console.log('💰 Métodos de pago disponibles:', paymentMethods.value);

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

const billData = ref({
  qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example',
  serialNumber: '',
  date: '',
  sellerName: '',
  raffleName: '',
  selectedNumbers: [] as string[], // Cambiado de number[] a string[]
  drawDate: '',
  quantity: 0,
  price: 0,
  total: '0.00',
  amountUsd: '0.00',
  exchangeRate: '',
  amountLocalCurrencyLabel: '',
  amountLocal: '0.00',
  clientName: '',
  clientId: '',
  clientPhone: ''
});

// Función corregida para mostrar la factura
const showInvoice = (saleData: any) => {
  console.log('📋 Datos COMPLETOS de la venta para factura:', saleData); 
  
  // ✅ CORRECCIÓN: Navegar por la estructura anidada de la respuesta
  let responseData = saleData;
  
  // Si existe saleData.data, usamos ese nivel
  if (saleData.data) {
    responseData = saleData.data;
    
    // Si dentro de data hay otro data, usamos ese (estructura anidada)
    if (saleData.data.data) {
      responseData = saleData.data.data;
    }
  }
  
  console.log('🔍 Datos extraídos para factura:', responseData);

  // 1. Formatear fecha actual
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}-${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
  // 2. ✅ CORRECCIÓN: Obtener números de tickets de la estructura correcta
  let ticketNumbers = [];
  
  // Intentar diferentes ubicaciones posibles de details
  if (responseData.details && Array.isArray(responseData.details)) {
    ticketNumbers = responseData.details.map((detail: any) => {
      return String(detail.number).padStart(4, '0');
    });
  } else if (responseData.data && responseData.data.details) {
    ticketNumbers = responseData.data.details.map((detail: any) => {
      return String(detail.number).padStart(4, '0');
    });
  } else {
    // Si no hay details en la respuesta, usar los tickets que enviamos
    if (selectionMode.value === 'manual') {
      ticketNumbers = selectedManualTickets.value.map(num => String(num).padStart(4, '0'));
    } else if (randomTicketsResult.value) {
      ticketNumbers = randomTicketsResult.value.successful.map(t => String(t.number).padStart(4, '0'));
    } else {
      ticketNumbers = Array.from({length: Number(form.tickets || 1)}, (_, i) => String(i + 1).padStart(4, '0'));
    }
  }

  console.log('🎫 Números de tickets procesados:', ticketNumbers);
  console.log('📊 Detalles completos de tickets:', responseData.details);
  
  // 3. Información del RIFERO (esta parte ya funciona bien)
  let sellerName = 'Rifa Play';
  if (selectedProduct.value) {
    const p = selectedProduct.value;
    if (p.rifero) {
      sellerName = p.rifero;
    } else if (p.seller && (p.seller.name || p.seller.first_name)) {
      sellerName = `${p.seller.name || p.seller.first_name} ${p.seller.last_name || ''}`.trim();
    } else if (p.user && (p.user.name || p.user.first_name)) {
      sellerName = `${p.user.name || p.user.first_name} ${p.user.last_name || ''}`.trim();
    } else if (p.created_by && (p.created_by.name || p.created_by.first_name)) {
      sellerName = `${p.created_by.name || p.created_by.first_name} ${p.created_by.last_name || ''}`.trim();
    }
  }
// En la función showInvoice, ANTES del cálculo de moneda, agrega:
console.log('💱 Moneda seleccionada ID:', selectedCurrencyId.value);
console.log('💱 Lista de monedas disponibles:', availableCurrencies.value);
console.log('💱 Tasa BCV:', bcvRate.value);
console.log('💱 Tasa COP:', copRate.value);
console.log('💱 Precio total USD:', totalPrice.value);
// 4. Cálculos de moneda - VERSIÓN CORREGIDA
const selectedCurrency = availableCurrencies.value.find(c => c.uuid === selectedCurrencyId.value);
console.log('💱 Moneda encontrada:', selectedCurrency);

let exchangeRate = '';
let amountLocal = '';
let amountLocalCurrencyLabel = '';

if (selectedCurrency) {
  console.log('💱 Procesando moneda:', selectedCurrency.short_name, selectedCurrency.name);
  
  if (selectedCurrency.short_name === 'VES' || selectedCurrency.name.toLowerCase().includes('bolívar')) {
    const totalUsd = parseFloat(totalPrice.value);
    const totalBs = totalUsd * bcvRate.value;
    exchangeRate = `${bcvRate.value.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Bs/USD`;
    amountLocal = totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    amountLocalCurrencyLabel = 'Bs';
    console.log('💱 Cálculo VES:', { totalUsd, totalBs, exchangeRate, amountLocal });
  } else if (selectedCurrency.short_name === 'COP') {
    const totalUsd = parseFloat(totalPrice.value);
    const totalCop = totalUsd * copRate.value;
    exchangeRate = `${copRate.value.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})} COP/USD`;
    amountLocal = totalCop.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    amountLocalCurrencyLabel = 'COP';
    console.log('💱 Cálculo COP:', { totalUsd, totalCop, exchangeRate, amountLocal });
  } else {
    // Para otras monedas (USD, etc.)
    console.log('💱 Moneda no manejada específicamente:', selectedCurrency.short_name);
    amountLocal = totalPrice.value;
    amountLocalCurrencyLabel = selectedCurrency.short_name;
  }
} else {
  console.warn('⚠️ No se encontró la moneda seleccionada, usando USD por defecto');
  amountLocal = totalPrice.value;
  amountLocalCurrencyLabel = 'USD';
}

console.log('💱 Resultados finales:', { exchangeRate, amountLocal, amountLocalCurrencyLabel });

  // 5. Información del CLIENTE
  const clientName = authStore.user?.name || form.nombre || responseData.invoice_data?.name || 'Cliente';
  const clientId = authStore.user?.natural_profile?.document_number || form.pagoMovilCedula || responseData.invoice_data?.document_number || '';
  const clientPhone = authStore.user?.phone || form.telefono || responseData.invoice_data?.phone || '';

  // 6. Obtener número de serie de la respuesta
  const serialNumber = responseData.serial_number || 'PENDIENTE';

  // 7. Asignar datos a billData
  billData.value = {
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(serialNumber)}`,
    serialNumber: serialNumber,
    date: formattedDate,
    sellerName: sellerName,
    raffleName: selectedProduct.value?.title || selectedProduct.value?.name || 'Sorteo',
    selectedNumbers: ticketNumbers,
    drawDate: selectedProduct.value?.raffle_date ? new Date(selectedProduct.value.raffle_date).toLocaleDateString('es-ES') : 'Por definir',
    quantity: ticketNumbers.length,
    price: parseFloat(selectedProduct.value?.ticketPrice || selectedProduct.value?.ticket_price || '0'),
    total: totalPrice.value,
    amountUsd: totalPrice.value,
    exchangeRate: exchangeRate,
    amountLocalCurrencyLabel: amountLocalCurrencyLabel,
    amountLocal: amountLocal,
    clientName: clientName,
    clientId: clientId,
    clientPhone: clientPhone
  };

  console.log('🧾 Datos finales para Bill.vue:', billData.value);
  showBill.value = true;
};

// Manejar cierre del modal de factura
const handleBillClose = () => {
  showBill.value = false;
  close(); // Cerrar también el modal de participación
};

// Manejar descarga de factura
const handleBillDownload = () => {
  // Implementar lógica de descarga aquí
  console.log('Descargando factura...', billData.value);
  showToast('Descargando comprobante...', 'success');
};

// Manejar impresión de factura
const handleBillPrint = () => {
  // Implementar lógica de impresión aquí
  window.print();
  showToast('Imprimiendo comprobante...', 'success');
};

// Manejar "vender otro ticket"
const handleSellAnother = () => {
  showBill.value = false;
  // Resetear el formulario para una nueva compra
  resetForm();
};

// Función para resetear el formulario
const resetForm = () => {
  form.tickets = 1;
  form.metodoPago = '';
  form.referencia = '';
  form.pagoMovilCedula = '';
  form.pagoMovilTelefono = '';
  form.pagoMovilBanco = '';
  form.comprobante = null;
  selectedManualTickets.value = [];
  randomTicketsResult.value = null;
  selectionMode.value = 'auto';
  pagoMovilMode.value = 'manual';
  error.value = null;
  
  // Limpiar timers
  clearRandomTicketsTimer();
  bookingTimerStarted.value = false;
  clearTimer();
  resetTimer();
};

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
  // Validación para modo manual
  else if (selectionMode.value === 'manual') {
    ticketsToBuy = selectedManualTickets.value;
    quantity = ticketsToBuy.length;
    if (quantity === 0) {
      error.value = 'Debes seleccionar al menos un ticket.';
      return;
    }
  } else {
    // Fallback - no debería ocurrir
    error.value = 'Modo de selección no válido';
    return;
  }

  // Resto de validaciones (método de pago, etc.)
if (isPagoMovilSelected.value && pagoMovilMode.value === 'automatico') {
  if (!form.pagoMovilCedula || !form.pagoMovilTelefono || !form.pagoMovilBanco) {
    error.value = 'Debes completar todos los campos de Pago Móvil Automático.';
    return;
  }
  form.referencia = 'AUTOMATIC'; 
  ticketStore.setComprobante(null);
} 
// Reemplaza la siguiente condición con esta:
else if (form.metodoPago && (!form.referencia || form.referencia.trim() === '')) {
  error.value = 'Debes ingresar la referencia de pago.';
  return;
}
  else if (!form.metodoPago) {
    error.value = 'Debes seleccionar un método de pago.';
    return;
  }

  // Construir el payload - USAR SIEMPRE ticketsToBuy
  const userId = authStore.user?.id ?? null;
  const initialTickets = initialTicketsCount.value;
  const purchasedTickets = quantity;
  const idempotencyKey = `sale-${userId ?? 'guest'}-${Date.now()}`;
  let phone = '';
  
  if (authStore.isAuthenticated && authStore.user) {
    phone = authStore.user.phone || '';
  } else {
    phone = form.telefono || '';
  }

  const payload: any = {
    raffle_id: selectedProduct.value?.uuid ?? selectedProduct.value?.title,
    user_id: userId,
    details: [],
    payment: {
      payment_method_id: form.metodoPago,
      currency_id: selectedCurrencyId.value,
      current_currency_id: selectedCurrencyId.value,
      exchange_rate: Number(bcvRate.value) || 1,
      payment_date: new Date().toISOString(),
      transaction_id: form.referencia || `TX-${Date.now()}`,
      entity: form.metodoPago === 'pago-movil' ? form.pagoMovilBanco : undefined,
      idempotency_key: idempotencyKey,
      original_amount: parseFloat(totalPrice.value || '0') || 0,
      is_verify: (pagoMovilVerifyResult.value && pagoMovilVerifyResult.value.status && pagoMovilVerifyResult.value.status !== 'pendiente') ? true : false
    },
    invoice_data: {
      document_number: authStore.user?.natural_profile?.document_number || form.pagoMovilCedula || null,
      document_type: authStore.user?.natural_profile?.document_type || 'V',
      name: form.nombre || authStore.user?.name || 'Comprador',
      phone,
      address: authStore.user?.natural_profile?.address || 'Direccion',
    }
  };

  // ✅ CORRECCIÓN: SIEMPRE usar ticketsToBuy, ya sea modo manual o automático
  if (ticketsToBuy && ticketsToBuy.length > 0) {
    for (const n of ticketsToBuy) {
      payload.details.push({ 
        number: String(n).padStart(4, '0'), 
        amount: Number(selectedProduct.value?.ticketPrice ?? 0), 
        prizes: '' 
      });
    }
  } else {
    // Esto no debería ocurrir debido a las validaciones anteriores
    error.value = 'No hay tickets seleccionados para comprar.';
    return;
  }

  // Obtener el UUID del método de pago
  const selectedMethod = paymentMethods.value.find(m => m.slug === form.metodoPago);
  if (selectedMethod) {
    payload.payment.payment_method_id = selectedMethod.uuid;
  }

  // Validar que la moneda esté seleccionada
  if (!payload.payment.currency_id) {
    error.value = 'No se ha configurado la moneda. Selecciona una moneda válida.';
    submitting.value = false;
    return;
  }

  // Formatear fecha para SQL
  function formatSqlDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  payload.payment.payment_date = formatSqlDate(new Date(payload.payment.payment_date));

  // Procesar la compra
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
  
  // Extraer números de la respuesta si existen
  if (data.data && data.data.details && Array.isArray(data.data.details)) {
    for (const d of data.data.details) {
      const num = Number(d.number);
      if (!Number.isNaN(num)) assignedNumbers.push(num);
    }
  } else if (data.details && Array.isArray(data.details)) {
    for (const d of data.details) {
      const num = Number(d.number);
      if (!Number.isNaN(num)) assignedNumbers.push(num);
    }
  }

  // Generar ticket en el store
  if (assignedNumbers.length > 0) {
    ticketStore.generateTicket(form, selectedProduct.value, userId, assignedNumbers);
  } else {
    // Usar los tickets que enviamos en el payload
    ticketStore.generateTicket(form, selectedProduct.value, userId, ticketsToBuy);
  }
  
  ticketStore.formData.totalPrice = parseFloat(totalPrice.value);
  ticketStore.formData.totalPriceBs = parseFloat(totalPriceBs.value);
  
  // ✅ Pasar la respuesta completa
  showInvoice(res);
  
  emit('confirmed', {
    initialTickets,
    purchasedTickets: assignedNumbers.length > 0 ? assignedNumbers.length : purchasedTickets
  });
}
  } catch (err: any) {
    console.error('Error procesando venta:', err);
    if (err && err.data && err.data.errors && err.data.errors.details) {
      const detailsErr = err.data.errors.details;
      error.value = Array.isArray(detailsErr) 
        ? `Los siguientes números ya no están disponibles: ${detailsErr.join(', ')}` 
        : String(detailsErr);
    } else if (err && err.data && err.data.message) {
      error.value = String(err.data.message);
    } else {
      error.value = 'Ocurrió un error procesando la venta.';
    }
  } finally {
    submitting.value = false;
  }
}

// Método público para uso externo: permite que otra página/component
// (por ejemplo `UserProfile2.vue`) invoque la compra reutilizando la
// misma lógica de `handleConfirm` sin duplicarla.
async function externalBuy(options: {
  selectionMode?: 'auto' | 'manual',
  selectedManualTickets?: number[],
  formOverrides?: Record<string, any>,
  selectedCurrencyId?: string
} = {}) {
  try {
    if (typeof options.selectionMode !== 'undefined') {
      selectionMode.value = options.selectionMode;
    }
    
    if (Array.isArray(options.selectedManualTickets)) {
      selectedManualTickets.value = options.selectedManualTickets.slice();
    }
    
    if (options.formOverrides && typeof options.formOverrides === 'object') {
      Object.assign(form, options.formOverrides);
    }
    
    if (options.selectedCurrencyId) {
      selectedCurrencyId.value = options.selectedCurrencyId;
    }

    // ✅ CORRECCIÓN MEJORADA: Para modo automático, simular que tenemos randomTicketsResult
    if (selectionMode.value === 'auto' && selectedManualTickets.value.length > 0) {
      // Crear un randomTicketsResult simulado con los tickets que nos pasaron
      randomTicketsResult.value = {
        successful: selectedManualTickets.value.map(number => ({ 
          number, 
          expires_in_seconds: 60 
        })),
        failed: []
      };
    }

    // Llamar a la función interna que maneja la compra
    await handleConfirm();
  } catch (err) {
    console.error('Error en externalBuy:', err);
    throw err;
  }
}

// Exponer API pública mínima para ser invocada desde otras páginas
defineExpose({ externalBuy })
watch(availableCurrencies, (newCurrencies) => {
  // AGREGA EL ?. ANTES DE .length
  if (newCurrencies?.length > 0) { 
    
    // Si no hay una moneda seleccionada o la seleccionada no está en las disponibles
    if (!selectedCurrencyId.value || !newCurrencies.find(c => c.uuid === selectedCurrencyId.value)) {
      // Intentar usar la moneda del método de pago por defecto, si existe
      const defaultMethod = paymentMethods.value.find(m => m.is_default);
      if (defaultMethod?.currency) {
        selectedCurrencyId.value = defaultMethod.currency.uuid;
      } else {
        // Aquí también es buena práctica asegurar que existe el índice 0
        selectedCurrencyId.value = newCurrencies[0]?.uuid; 
      }
    }
  } else {
    selectedCurrencyId.value = undefined;
  }
}, { immediate: true });
watch(selectedCurrencyId, (newCurrencyId, oldCurrencyId) => {
  if (newCurrencyId !== oldCurrencyId) {
    // Resetear el método de pago seleccionado
    form.metodoPago = '';
    
    // También resetear cualquier información relacionada con structured_data
    parsedStructured.value = null;
  }
});
watch(availableCurrencies, (newCurrencies) => {
  if (newCurrencies?.length > 0) { 
    // Si no hay una moneda seleccionada o la seleccionada no está en las disponibles
    if (!selectedCurrencyId.value || !newCurrencies.find(c => c.uuid === selectedCurrencyId.value)) {
      // Intentar usar la moneda del método de pago por defecto, si existe
      const defaultMethod = paymentMethods.value.find(m => m.is_default);
      if (defaultMethod?.currency) {
        selectedCurrencyId.value = defaultMethod.currency.uuid;
      } else {
        selectedCurrencyId.value = newCurrencies[0]?.uuid; 
      }
    }
  } else {
    selectedCurrencyId.value = undefined;
  }
}, { immediate: true });
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