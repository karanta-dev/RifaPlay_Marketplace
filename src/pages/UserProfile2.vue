<template>
  <div class="lgtangueta-container">
    <nav class="navbar">
      <div class="top-accent-line"></div>
      
      <div class="nav-content">
        <div class="logo-container">
          <router-link :to="riferoProfileLink" class="logo-text">
            <!-- Agregar estado de loading para el nombre del rifero -->
            <span v-if="loading">Cargando...</span>
            <span v-else>{{ sellerName || 'Rifero' }}</span>
          </router-link>
        </div>

        <ul class="nav-links hidden-mobile">
          <li>
            <router-link to="/" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              INICIO
            </router-link>
          </li>
          <li>
            <a href="#" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              PREMIOS
            </a>
          </li>
          <li>
            <a href="#" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              VERIFICADOR
            </a>
          </li>
          <li>
            <a href="#" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              PREGUNTAS
            </a>
          </li>
          <li>
            <a href="#" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A9.948 9.948 0 0110 5a9.95 9.95 0 014.793 9.39A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
              </svg>
              CONTACTO
            </a>
          </li>
        </ul>

        <button class="btn-boletos">LISTA DE BOLETOS</button>
      </div>
    </nav>

    <!-- Contador de precio flotante para móviles -->
    <div v-if="selectedTicketsCount > 0" class="floating-price-counter">
      <div class="floating-price-content">
        <div class="floating-price-info">
          <span class="floating-price-text">Total:</span>
          <span class="floating-price-amount">${{ totalPrice }} USD</span>
        </div>
        <div class="floating-price-badge">
          <span class="floating-price-count">{{ selectedTicketsCount }}</span>
        </div>
      </div>
    </div>

    <div class="main-content" v-if="raffle">
      <!-- Header con fecha y hora -->
      <div class="date-header">
        <div class="date-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
          </svg>
          {{ formatDate(raffle.raffle_date) }}
        </div>
        <div class="date-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
          </svg>
          {{ formatTime(raffle.raffle_date) }}
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="progress-container">
        <div class="progress-bar-gradient" :style="{ width: progressWidth + '%' }"></div>
        <span class="progress-text">{{ Math.round(progressWidth) }}%</span>
      </div>

      <!-- Título principal -->
      <h1 class="main-title">{{ raffle.name }}</h1>

      <!-- Grid de contenido: imágenes y descripción -->
      <div class="content-grid">
        <div class="image-column">
          <div class="image-wrapper" v-for="(image, index) in displayedImages" :key="index">
            <img :src="image.url" :alt="raffle.name" class="product-image">
          </div>
        </div>

        <div class="text-column">
          <h2 class="price-title">POR TAN SOLO ${{ raffle.ticket_price }} DOLARITOS</h2>
          
          <p class="highlight-p"><strong>{{ getRaffleHighlight(raffle) }}</strong></p>

          <p>{{ raffle.description }}</p>

          <!-- Información del sorteo -->
          <div class="draw-info">
            <p><strong>Fecha del sorteo {{ formatShortDate(raffle.raffle_date) }}</strong></p>
            <p><strong>{{ formatTime(raffle.raffle_date) }} hora Venezuela</strong></p>
          </div>

          <p class="good-luck">BUENA SUERTE 🤞🏻 💚</p>
        </div>
      </div>

      <!-- Sección de lista de boletos -->
      <div class="raffle-tickets-section">
        <div class="raffle-tickets-card">
          <div class="text-center mb-8">
            <h2 class="tickets-title">LISTA DE BOLETOS</h2>
            <div class="tickets-summary">
              <span class="tickets-count">{{ selectedTicketsCount }}</span>
              <span class="tickets-total">Total: USD {{ totalPrice.toFixed(2) }}</span>
            </div>
              <div v-if="bookingTimerStarted" class="flex items-center justify-center mt-3">
                <div class="flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300" :class="timerClasses">
                  <div class="w-3 h-3 rounded-full animate-pulse" :class="pulseClass"></div>
                  <span class="font-mono text-base sm:text-lg font-bold" :class="timerTextClass">{{ formattedTime }}</span>
                </div>
              </div>
              <button class="btn-suerte" @click="selectionMode = 'auto'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9.42 14l1.52 3.82 2.39-1.39-2.09-2.09.84-1.05 1.52 1.51 1.05-.84-1.51-1.52 1.05-1.05-1.52-1.51-1.05.84-2.39-2.39L12 6.07c3.95.49 7 3.85 7 7.93 0 1.25-.33 2.44-.92 3.51l-4.59-4.59.84-1.05L12 11.93l-1.05 1.05-1.52 1.52-1.05-.84L9.42 14l-.84 1.05 4.59 4.59c.28-.51.5-1.05.64-1.63z"/>
              </svg>
              ELEGIR A LA SUERTE
            </button>
          </div>
            <!-- Bloque para selección automática (elegir a la suerte) -->
            <div v-if="selectionMode === 'auto'" class="mt-4 p-4 bg-gray-50 rounded-lg border">
              <label class="block font-semibold mb-2">🎲 Cantidad de tickets (Automático)</label>
              <div class="flex items-center gap-3 mb-3">
                <button class="px-3 py-1 rounded-l bg-gray-200" @click.prevent="formAuto.tickets = Math.max(1, formAuto.tickets - 1)">-</button>
                <input type="number" v-model.number="formAuto.tickets" min="1" :max="maxAvailable ?? undefined" class="input-field text-center" style="width:80px" />
                <button class="px-3 py-1 rounded-r bg-gray-200" @click.prevent="formAuto.tickets = Math.min((maxAvailable || 9999), formAuto.tickets + 1)">+</button>
                <div class="text-sm text-gray-600">Disponibles: <strong class="text-red-600 ml-1">{{ maxAvailable }}</strong></div>
              </div>

              <div class="flex gap-2">
                <button type="button" @click="fetchRandomTickets" :disabled="loadingRandomTickets || !formAuto.tickets || formAuto.tickets < 1" class="btn-suerte">
                  <span v-if="loadingRandomTickets">🔄 Obteniendo tickets...</span>
                  <span v-else>🎯 Obtener Tickets Aleatorios</span>
                </button>
                <button type="button" class="btn-suerte bg-gray-300 text-black" @click="cancelAutoSelection">Cancelar</button>
              </div>

              <!-- Resultado de tickets aleatorios -->
              <div v-if="randomTicketsResult" class="mt-4 p-3 bg-white rounded border">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold">Tickets Reservados</h4>
                  <div v-if="randomTicketsTimeLeft > 0" class="flex items-center gap-2 text-sm bg-green-100 px-2 py-1 rounded">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="font-mono">{{ formattedRandomTime }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-8 gap-2 mb-2">
                  <div v-for="t in randomTicketsResult.successful" :key="t.number" class="p-2 border rounded text-center bg-green-50">
                    <span class="font-bold text-sm">{{ String(t.number).padStart(4, '0') }}</span>
                  </div>
                </div>

                <p class="text-sm text-gray-700">Se han reservado <strong>{{ randomTicketsResult.successful.length }}</strong> tickets aleatoriamente. Tienes {{ formattedRandomTime }} para completar la compra.</p>
              </div>
            </div>

          <!-- Reemplazado por TicketSelector (componente reutilizable) -->
          <div class="tickets-grid-wrapper">
  <div class="tickets-inner-scroll">
    <TicketGrid
      v-if="gridStore.selectedProduct"
      :raffleId="gridStore.selectedProduct.uuid"
      @update:selected="handleSelectionUpdate"
      @reservation-started="onReservationStarted"
    />

    <div class="tickets-selected-count mt-4 p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
        <span class="font-bold text-gray-800 text-sm sm:text-base">
          SELECCIONADOS: 
          <span class="text-green-600 ml-1">{{ selectedTicketsCount }}</span> 
          de 
          <span class="text-red-600">{{ maxAvailable }}</span>
        </span>
        <div class="text-xs text-gray-600">
          Total: <span class="font-bold text-green-600">${{ totalPrice }} USD</span>
        </div>
      </div>
    </div>
  </div>
</div>

          <!-- Contador móvil para boletos seleccionados -->
          <div v-if="selectedTicketsCount > 0" class="mobile-ticket-counter">
            <div class="counter-content">
              <div class="counter-info">
                <span class="counter-text">Boletos seleccionados:</span>
                <span class="counter-number">{{ selectedTicketsCount }}</span>
              </div>
              <button class="btn-continuar" @click="scrollToPersonalData">
                CONTINUAR
              </button>
            </div>
          </div>

          <!-- Sección de datos personales -->
          <!-- <div class="section-divider" id="personal-data">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7.52 4.5 4 8.02 4 12.5S7.52 20.5 12 20.5 20 16.98 20 12.5 16.48 4.5 12 4.5zm0 2c1.78 0 3.3.73 4.4 1.95L15 9.5l.7-.7c.36-.36.85-.56 1.35-.56s.99.2 1.35.56l.7.7-1.4 1.4c.78.78 1.25 1.83 1.25 3.03 0 2.45-1.99 4.44-4.44 4.44-1.2 0-2.25-.47-3.03-1.25l-1.4 1.4-.7-.7c-.36-.36-.56-.85-.56-1.35s.2-1 .56-1.35l.7-.7-1.4-1.4c-1.22 1.1-1.95 2.62-1.95 4.4 0 2.45 1.99 4.44 4.44 4.44 1.2 0 2.25-.47 3.03-1.25l1.4 1.4.7-.7c.36-.36.56-.85.56-1.35s-.2-1-.56-1.35l-.7-.7 1.4-1.4c-1.22 1.1-1.95 2.62-1.95 4.4 0 2.45 1.99 4.44 4.44 4.44 1.2 0 2.25-.47 3.03-1.25l1.4 1.4.7-.7c.36-.36.56-.85.56-1.35s-.2-1-.56-1.35l-.7-.7z"/>
            </svg>
            <h3 class="section-title text-green-600">DATOS PERSONALES</h3>
          </div> -->

          <!-- Formulario de datos personales -->
          <!-- <div class="form-grid">
            <div>
              <label class="input-label" for="nombre">Nombres y Apellidos *</label>
              <input type="text" id="nombre" class="input-field" placeholder="">
            </div>
            <div>
              <label class="input-label" for="cedula">Cédula *</label>
              <input type="text" id="cedula" class="input-field" placeholder="">
            </div>
            <div class="input-tel-group">
              <div class="input-tel-prefix">
                <label class="input-label" for="telefono-prefijo">Teléfono *</label>
                <select id="telefono-prefijo" class="input-field py-3">
                  <option>VE +58</option>
                  <option>CO +57</option>
                </select>
              </div>
              <div class="input-tel-number">
                <input type="tel" id="telefono-numero" class="input-field" placeholder="">
              </div>
            </div>
            <div>
              <label class="input-label" for="estado">Estado *</label>
              <select id="estado" class="input-field py-3">
                <option>Táchira</option>
                <option>Zulia</option>
              </select>
            </div>
            <div>
              <label class="input-label" for="referencia">Referencia del Pago (4 últimos digitos)</label>
              <input type="text" id="referencia" class="input-field" placeholder="">
            </div>
            <div>
              <label class="input-label" for="cuenta">Titular de la Cuenta</label>
              <input type="text" id="cuenta" class="input-field" placeholder="">
            </div>
          </div> -->

          <!-- Sección de métodos de pago -->
          <div class="section-divider">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4.75-8.5h9.5c.41 0 .75.34.75.75s-.34.75-.75.75h-9.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75zM12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <h3 class="section-title text-green-600">MODOS DE PAGO</h3>
          </div>

          <p class="text-sm text-gray-500 mb-6 text-center">Selecciona una opción</p>

          <div class="payment-methods-wrapper">
            <div v-for="method in paymentMethods" :key="method.uuid || method.name" :class="getPaymentMethodClass(method)" @click="selectedPaymentMethod = method">
              <img :src="getPaymentLogo(method)" :alt="method.name" class="w-full h-full object-contain">
              <svg v-if="selectedPaymentMethod && (selectedPaymentMethod.uuid === method.uuid || selectedPaymentMethod.name === method.name)" class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </div>
          </div>
          
          <!-- Detalles de la cuenta -->
          <div class="account-details-box">
            <div class="account-header">
              <div class="flex items-center">
                <span class="text-xs font-semibold uppercase text-gray-600 mr-2">ZINU</span>
                <span class="text-green-600 font-bold">@</span>
              </div>
              <span class="text-red-500 text-sm cursor-pointer hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9.247a3.75 3.75 0 100 5.506 7.502 7.502 0 01-2.434 2.894 1.5 1.5 0 00-2.388-.13 1.5 1.5 0 00-.13 2.388A10.517 10.517 0 0012 22.5c5.78 0 10.5-4.72 10.5-10.5S17.78 1.5 12 1.5A10.517 10.517 0 003.504 5.234a1.5 1.5 0 00.13 2.388 1.5 1.5 0 002.388.13c.48-.38.937-.777 1.346-1.22z"/></svg>
              </span>
            </div>
            
              <div class="account-info">
                <p><strong>TITULAR:</strong> {{ sellerName }}</p>
                <!-- <p><strong>CORREO:</strong> {{ sellerEmail }}</p> -->
              </div>

              <!-- Mostrar campos dinámicos del método de pago seleccionado -->
              <div v-if="selectedPaymentMethod && structuredFields.length > 0" class="payment-structured-data mt-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Metodo seleccionado</h4>
                <div class="text-sm text-gray-800 mb-2">{{ selectedPaymentVariable || 'Ninguno seleccionado' }}</div>
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Detalles del método seleccionado</h4>
                <div v-for="field in structuredFields" :key="field.key || field.label" class="mb-2">
                  <label class="block text-xs text-gray-800 mb-1">{{ field.label || field.key }}:</label>
                  <div class="text-sm text-gray-800">{{ field.value }}</div>
                </div>
              </div>

              <!-- Currency selector -->
              <div class="mb-4">
                <label class="input-label" for="currency-select">Moneda</label>
                <select id="currency-select" v-model="selectedCurrencyId" class="input-field">
                  <option v-for="c in currencies" :key="c.uuid" :value="c.uuid">
                    {{ c.name }} ({{ c.short_name }})
                  </option>
                </select>
              </div>
              <div class="account-total">
                Total: <span class="text-red-600">{{ displayPrice.text }}</span>
                <span v-if="displayPrice.showUsdRate && displayPrice.rate" class="text-xs text-gray-500"> (Tasa: {{ displayPrice.rate.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }} {{ displayPrice.rateCurrency }})</span>
                <span v-if="displayPrice.showUsdPrice" class="text-xs text-gray-500"> (Referencia: ${{ totalPrice.toFixed(2) }} USD)</span>
                ({{ selectedTicketsCount }} boleto{{ selectedTicketsCount !== 1 ? 's' : '' }})
              </div>
          </div>

          <!-- Sección de comprobante de pago -->
          <div class="section-divider">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.71 14.71l-5-5c-.39-.39-.39-1.02 0-1.41l5-5c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41L10.41 12l4.29 4.29c.39.39.39 1.02 0 1.41-.39.38-1.02.38-1.41-.01z"/>
            </svg>
            <h3 class="section-title text-green-600">COMPROBANTE DE PAGO</h3>
          </div>

          <div class="mb-6">

            <!-- Referencia de pago (4 últimos dígitos / número) -->
            <div class="mb-4">
              <label class="input-label" for="referencia-pago">Referencia de Pago</label>
              <input id="referencia-pago" v-model="referenciaPago" type="text" placeholder="🔖 Número de referencia" class="input-field" />
            </div>
          </div>
          
          <div class="text-center">
            <button class="btn-confirmar" @click.prevent="confirmFromProfile">
              CONFIRMAR
            </button>
          </div>
        </div>
      </div>

      <!-- Sección de lista de premios -->
      <div class="additional-section" v-if="prizes && prizes.length > 0">
        <div class="section-header-centered">
          <h2 class="section-title-large">LISTA DE PREMIOS</h2>
          <p class="section-subtitle">Total de premios: {{ prizes.length }}</p>
        </div>
        <div class="prizes-grid">
          <div v-for="prize in prizes" :key="prize.uuid" class="prize-card">
            <img 
              :src="getPrizeImage(prize)" 
              :alt="prize.name" 
              class="prize-image"
            >
            <div class="prize-text">
              <h3 class="prize-title-small">{{ prize.name }}</h3>
              <p class="prize-description">{{ prize.description }}</p>
              <p class="prize-amount">${{ Number(prize.prize_amount).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de verificador de boletos -->
      <!-- <div class="additional-section">
        <div class="section-header-centered">
          <h2 class="section-title-large">VERIFICADOR DE BOLETOS</h2>
          <p class="section-subtitle">Ingresa tu número de teléfono para verificar tus boletos adquiridos.</p>
        </div>
        <div class="verifier-card">
          <div class="input-tel-group verifier-input-group">
            <div class="input-tel-prefix verifier-prefix">
              <label class="input-label" for="telefono-prefijo-verif">Teléfono *</label>
              <select id="telefono-prefijo-verif" class="input-field py-3">
                <option>VE +58</option>
                <option>CO +57</option>
              </select>
            </div>
            <div class="input-tel-number verifier-number">
              <input type="tel" id="telefono-numero-verif" class="input-field" placeholder="Número de Teléfono">
            </div>
          </div>
          <button class="btn-confirmar btn-verificar">
            VERIFICAR
          </button>
        </div>
      </div> -->

      <!-- Sección de preguntas frecuentes -->
      <div class="additional-section">
        <div class="section-header-centered">
          <h2 class="section-title-large">PREGUNTAS FRECUENTES</h2>
        </div>
        <div class="faq-container">
          <div class="faq-item">
            <input type="checkbox" id="faq1" class="faq-toggle">
            <label for="faq1" class="faq-question">¿Qué pasa si no venden el 100% de los boletos?</label>
            <div class="faq-answer">
              <p>Si no se logra vender el 100% de los boletos para la fecha límite, se hará una rifa con el monto recaudado.</p>
            </div>
          </div>
          <div class="faq-item">
            <input type="checkbox" id="faq2" class="faq-toggle">
            <label for="faq2" class="faq-question">¿Dónde puedo ver el sorteo?</label>
            <div class="faq-answer">
              <p>El sorteo se realizará en vivo por Instagram y se tomará como referencia el sorteo del Súper Gana de la lotería de Venezuela.</p>
            </div>
          </div>
          <div class="faq-item">
            <input type="checkbox" id="faq3" class="faq-toggle">
            <label for="faq3" class="faq-question">¿Cómo sé si mi pago fue procesado correctamente?</label>
            <div class="faq-answer">
              <p>24 horas después de realizar el pago, puedes verificar tus boletos en la sección "Verificador de Boletos" al final de esta página, ingresando el número de teléfono con el que te registraste.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="text-center py-20">
      <p class="text-xl font-bold text-gray-500">Cargando detalles de la rifa...</p>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-20">
      <p class="text-xl font-bold text-red-500">No se pudo cargar la información de la rifa.</p>
      <router-link to="/" class="btn-confirmar mt-4 inline-block">Volver al catálogo</router-link>
    </div>

  <!-- Instanciar ParticipateModal oculto para reutilizar su lógica de compra -->
  <ParticipateModal ref="participateModalRef" :open="false" />

  <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-text">
          <h3>Nuestro objetivo es <span class="highlight">premiarte!</span></h3>
        </div>
        
        <div class="footer-sections">
          <div class="footer-section">
            <h4>BOLIDOS RIFAS</h4>
            <ul>
              <li><a href="#">SORTEOS - PREMIOS🍀</a></li>
              <li><a href="#">Nuestro objetivo es premiarte!</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>SECCIONES</h4>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Premios</a></li>
              <li><a href="#">Verificar mis Boletos</a></li>
              <li><a href="#">Preguntas Frecuentes</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>CONTACTO</h4>
            <ul>
              <li><a href="mailto:info@bolidosrifas.com">www.bolidorifas.com/</a></li>
              <li><a href="https://www.bolidosrifas.com">+573205477340</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>SIGUENOS</h4>
            <ul>
              <li>
                <a href="https://www.instagram.com/bolidosrifas/" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>      
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2023 Bólidos Rifas. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePaymentStore } from '@/stores/usePaymentStore'
import { useRoute } from 'vue-router'
import { RaffleService, PrizeService, type Raffle, type Prize } from '@/services/RaffleService'
import { PaymentFlowService, type PaymentMethod } from '@/services/PaymentFlow'
import apiClient from '@/services/api'
import { useGridStore } from '@/stores/useGridStore'
import { useAuthStore } from '@/stores/useAuthStore'
import TicketGrid from '@/components/TicketGrid.vue'
import ParticipateModal from '@/components/ParticipateModal.vue'
import { useBookingTimer } from '@/composables/useBookingTimer'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const gridStore = useGridStore()
const { showToast } = useToast()
const authStore = useAuthStore()

// Estados
const raffle = ref<Raffle | null>(null)
const prizes = ref<Prize[]>([])
const loading = ref(true)
const selectedTickets = ref<number[]>([])
const progressWidth = ref<number>(0)
const targetProgress = ref<number>(32.5)
const animationDuration = ref<number>(2000)
const maxTickets = computed(() => raffle.value?.end_range || 100)
const loadingProfile = ref(true);

// Ticket pagination and ranges
const ticketsPerPage = ref<number>(200)
const currentTicketPage = ref<number>(1)

// Métodos de pago provenientes del backend
const paymentMethods = ref<PaymentMethod[]>([])
const selectedPaymentMethod = ref<PaymentMethod | null>(null)
const loadingPaymentMethods = ref(false)

// Exponer el nombre/variable del método seleccionado para mostrar en UI fácilmente
const selectedPaymentVariable = computed(() => {
  const m = selectedPaymentMethod.value
  if (!m) return ''
  // preferimos la propiedad explicitamente mapeada, luego el nombre legible
  return (m as any).variable_name || (m as any).method_name || m.name || ''
})

// Referencia de pago ingresada por el usuario (campo de comprobante)
const referenciaPago = ref('')

// Selección manual (igual que ParticipateModal)
const selectedManualTickets = ref<number[]>([])

// Modo de selección: 'manual' | 'auto' (elegir a la suerte)
const selectionMode = ref<'auto' | 'manual'>('manual')

// Formulario mínimo para modo automático
const formAuto = ref({ tickets: 1 })

// Estado para la reserva automática (tickets aleatorios)
const loadingRandomTickets = ref(false)
const randomTicketsResult = ref<null | { successful: { number: number; expires_in_seconds?: number }[]; failed?: any[] }>(null)
const randomTicketsTimer = ref<number | null>(null)
const randomTicketsTimeLeft = ref(0)
// Estado para tickets vendidos (provenientes del backend) y carga
const soldTickets = ref<number[]>([])
const loadingTickets = ref(false)
const maxAvailable = computed(() => gridStore.availableTickets)

// --- Currency selection and price logic (use centralized payment store like ParticipateModal) ---
const paymentStore = usePaymentStore()
const { currencies, defaultCurrencyId, bcvRate, copRate, loadingRates } = storeToRefs(paymentStore)
const loadingCurrencies = ref(false)
const selectedCurrencyId = ref<string | undefined>(undefined)

const displayPrice = computed(() => {
  if (loadingRates.value) {
    return { text: 'Cargando...', showUsdRate: false, showUsdPrice: false }
  }

  const selectedCurrency = (currencies?.value ?? []).find((c: any) => c.uuid === selectedCurrencyId.value)
  if (!selectedCurrency) {
    return { text: `${totalPrice.value} USD`, showUsdRate: false, showUsdPrice: false }
  }

  const currencyName = (selectedCurrency.name || '').toLowerCase()
  const totalUsd = Number(totalPrice.value)

  if (currencyName.includes('bolívar') || selectedCurrency.short_name === 'VES') {
    const totalBs = totalUsd * (bcvRate.value ?? 1)
    return {
      text: `${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`,
      showUsdRate: true,
      rate: bcvRate.value,
      rateCurrency: '/ USD',
      showUsdPrice: true
    }
  } else if (currencyName.includes('peso colombiano') || selectedCurrency.short_name === 'COP') {
    const totalCop = totalUsd * (copRate.value ?? 1)
    return {
      text: `${totalCop.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`,
      showUsdRate: true,
      rate: copRate.value,
      rateCurrency: '/ USD',
      showUsdPrice: true
    }
  } else {
    return { text: `${totalUsd.toFixed(2)} USD`, showUsdRate: false, showUsdPrice: false }
  }
})
const riferoProfileLink = computed(() => {
  if (raffle.value?.seller?.uuid) {
    return { 
      name: 'user-profile', 
      params: { id: raffle.value.seller.uuid } 
    }
  }
  // Fallback si no hay seller info
  return '/'
})
// Valores para los campos dinámicos de structured_data
// structuredFields devuelve un array de { key, label, value } para mostrar como texto (no editables)
const structuredFieldValues = ref<Record<string, any>>({})

const structuredFields = computed(() => {
  const method = selectedPaymentMethod.value
  const raw = method?.structured_data || method?.original_data?.structured_data || null
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((f: any) => ({
      key: f.key || f.name || f.label,
      label: f.label || f.name || f.key,
      value: f.value ?? f.default ?? f.example ?? ''
    }))
  }

  if (typeof raw === 'object') {
    // Puede ser un objeto con pares primitivos: {"BINANCE":"41213411"}
    return Object.keys(raw).map(k => {
      const v = raw[k]
      if (v !== null && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
        return { key: k, label: k, value: String(v) }
      }
      return { key: k, label: raw[k]?.label || k, value: raw[k]?.value ?? raw[k]?.default ?? '' }
    })
  }

  return []
})

// Computed properties
const sellerName = computed(() => {
  // Mostrar "Cargando..." mientras loading es true
  if (loading.value) return 'Cargando...'
  
  return raffle.value?.seller?.name 
    ? `${raffle.value.seller.name} ${raffle.value.seller.last_name || ''}`.trim().toUpperCase()
    : 'Rifero'
})


const sellerEmail = computed(() => {
  // En un caso real, esto vendría de la API
  return 'contacto@bolidosrifas.com'
})

const displayedImages = computed(() => {
  if (!raffle.value?.images) return []
  // Tomar solo las primeras 2 imágenes
  return raffle.value.images.slice(0, 2)
})

const ticketPrice = computed(() => {
  // ticket_price normalmente es un number desde el servicio; usar Number() por seguridad
  return raffle.value?.ticket_price != null ? Number(raffle.value.ticket_price) : 35
})

// Número actual de tickets a comprar (respeta modo manual/auto)
const currentQty = computed(() => {
  if (selectionMode.value === 'manual') {
    return selectedManualTickets.value.length;
  } else if (selectionMode.value === 'auto' && randomTicketsResult.value) {
    return randomTicketsResult.value.successful.length;
  } else {
    return Number(formAuto.value.tickets || 0);
  }
});

const selectedTicketsCount = computed(() => currentQty.value)
const totalPrice = computed(() => currentQty.value * ticketPrice.value)


const totalTickets = computed(() => {
  if (!raffle.value) return 100
  const start = raffle.value.initial_range || 1
  const end = raffle.value.end_range || 100
  return end - start + 1
})

const totalTicketPages = computed(() => Math.max(1, Math.ceil(totalTickets.value / ticketsPerPage.value)))

const fullTicketList = computed(() => {
  if (!raffle.value) return Array.from({ length: 100 }, (_, i) => i + 1)
  const start = raffle.value.initial_range || 1
  const end = raffle.value.end_range || 100
  const arr: number[] = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})

const paginatedTickets = computed(() => {
  const startIndex = (currentTicketPage.value - 1) * ticketsPerPage.value
  const endIndex = startIndex + ticketsPerPage.value
  return fullTicketList.value.slice(startIndex, endIndex)
})

const formattedRandomTime = computed(() => {
  const minutes = Math.floor(randomTicketsTimeLeft.value / 60)
  const seconds = randomTicketsTimeLeft.value % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
})

const startRandomTicketsTimer = (seconds: number) => {
  clearRandomTicketsTimer()
  randomTicketsTimeLeft.value = seconds
  randomTicketsTimer.value = setInterval(() => {
    randomTicketsTimeLeft.value--
    if (randomTicketsTimeLeft.value <= 0) {
      clearRandomTicketsTimer()
      randomTicketsResult.value = null
        selectedManualTickets.value = []
        selectedTickets.value = []
      showToast('⏰ El tiempo de reserva para los tickets aleatorios ha expirado', 'warning')
    }
  }, 1000) as unknown as number
}

const clearRandomTicketsTimer = () => {
  if (randomTicketsTimer.value) {
    clearInterval(randomTicketsTimer.value)
    randomTicketsTimer.value = null
  }
}

const freeRandomTickets = async () => {
  if (randomTicketsResult.value && selectedManualTickets.value.length > 0 && raffle.value) {
    try {
      const user = authStore.user
      if (user?.natural_profile?.document_number) {
        await RaffleService.unbookTickets(
          raffle.value.uuid,
          'V',
          user.natural_profile.document_number,
          selectedManualTickets.value.map(t => String(t))
        )
      }
    } catch (e) {
      console.error('Error liberando random tickets:', e)
    }
  }
}

const fetchRandomTickets = async () => {
  if (!raffle.value) return
  if (!authStore.user?.natural_profile?.document_number) {
    showToast('Necesitas tener tu cédula en el perfil para usar selección automática', 'error')
    return
  }

  const quantity = Math.max(1, Number(formAuto.value.tickets ?? 1))
  if (quantity > (maxAvailable.value ?? 0)) {
    showToast(`Solo quedan ${maxAvailable.value} tickets disponibles`, 'error')
    return
  }

  loadingRandomTickets.value = true
  randomTicketsResult.value = null
  try {
    const result = await RaffleService.getRandomTickets(
      raffle.value.uuid,
      'V',
      authStore.user.natural_profile.document_number,
      quantity
    )

    if (result && result.successful && Array.isArray(result.successful) && result.successful.length > 0) {
      randomTicketsResult.value = result
      const expiresIn = result.successful[0]?.expires_in_seconds || 60
      startRandomTicketsTimer(expiresIn)
      selectedManualTickets.value = result.successful.map((r: any) => r.number)
      // mantener consistencia con selectedTickets usado en el resto de la página
      selectedTickets.value = selectedManualTickets.value.slice()
      showToast(`✅ Se han reservado ${result.successful.length} tickets aleatoriamente`, 'success')
    } else {
      showToast('No se pudieron obtener tickets aleatorios', 'error')
    }
  } catch (err: any) {
    console.error('Error obteniendo tickets aleatorios:', err)
    showToast(err?.message || 'Error al obtener tickets aleatorios', 'error')
  } finally {
    loadingRandomTickets.value = false
  }
}
const bookingTimerStarted = ref(false)
const { timeLeft, formattedTime, isExpired, startTimer, clearTimer, resetTimer } = useBookingTimer(10)

// Ref al componente ParticipateModal para reutilizar su método público externalBuy
const participateModalRef = ref<any>(null)

watch(isExpired, (expired) => {
  if (expired) {
    // cuando expira, limpiar selección
    selectedManualTickets.value = []
    bookingTimerStarted.value = false
    clearTimer()
    resetTimer()
    showToast('⏰ El tiempo para completar la selección ha expirado. Los tickets han sido liberados.', 'error')
  }
})

// Watch para limpiar la referencia cuando cambia el método de pago
watch(selectedPaymentMethod, (newMethod) => {
  if (newMethod) {
    // Limpiar la referencia anterior cuando se cambia el método de pago
    referenciaPago.value = ''
  }
})

const timerClasses = computed(() => {
  if (timeLeft.value > 300) {
    return 'bg-green-500/80 border border-green-400/50'
  } else if (timeLeft.value > 120) {
    return 'bg-yellow-500/80 border border-yellow-400/50'
  } else if (timeLeft.value > 60) {
    return 'bg-orange-500/80 border border-orange-400/50'
  } else {
    return 'bg-red-600/90 border border-red-400/50 animate-pulse'
  }
})

const pulseClass = computed(() => {
  if (timeLeft.value > 300) return 'bg-green-500'
  if (timeLeft.value > 120) return 'bg-yellow-500'
  if (timeLeft.value > 60) return 'bg-orange-500'
  return 'bg-red-500'
})

const timerTextClass = computed(() => 'text-white')

// Handler igual que ParticipateModal: recibe la selección desde TicketGrid
function handleSelectionUpdate(newSelection: number[]) {
  selectedManualTickets.value = newSelection

  // Mantener compatibilidad con selectedTickets usado en esta página
  selectedTickets.value = Array.isArray(newSelection) ? [...newSelection] : []

  if (newSelection.length === 1 && !bookingTimerStarted.value) {
    bookingTimerStarted.value = true
    startTimer()
  }

  if (newSelection.length === 0 && bookingTimerStarted.value) {
    bookingTimerStarted.value = false
    clearTimer()
    resetTimer()
  }
}

// Se llama cuando TicketGrid emite 'reservation-started'.
// TicketGrid emite ese evento ANTES de emitir update:selected, por lo
// que si solo seteamos bookingTimerStarted = true no se llamará a startTimer
// en handleSelectionUpdate (porque bookingTimerStarted ya será true).
// Aquí iniciamos el temporizador explícitamente para evitar ese caso.
function onReservationStarted() {
  if (!bookingTimerStarted.value) {
    bookingTimerStarted.value = true
    startTimer()
  }
}

// Función para resetear el formulario después de una compra exitosa
function resetForm() {
  // Limpiar selección de tickets
  selectedManualTickets.value = []
  selectedTickets.value = []
  
  // Volver al modo de selección manual
  selectionMode.value = 'manual'
  
  // Resetear el formulario automático
  formAuto.value = { tickets: 1 }
  
  // Limpiar resultados de tickets aleatorios
  if (randomTicketsResult.value) {
    clearRandomTicketsTimer()
    randomTicketsResult.value = null
  }
  
  // Limpiar temporizador de reserva manual
  bookingTimerStarted.value = false
  clearTimer()
  resetTimer()
  
  // Limpiar método de pago seleccionado
  selectedPaymentMethod.value = null
  
  // Limpiar referencia de pago
  referenciaPago.value = ''
  
  // Limpiar structured fields
  structuredFieldValues.value = {}
  
  // No resetear la moneda seleccionada para mantener preferencia del usuario
  // selectedCurrencyId.value = defaultCurrencyId.value || currencies.value[0]?.uuid
  
  // Forzar actualización del grid si está visible
  if (gridStore.selectedProduct) {
    // Esto ayudará a que TicketGrid se actualice
    gridStore.fetchAvailableTickets(gridStore.selectedProduct.uuid)
  }
  
  console.log('✅ Formulario reseteado en UserProfile2.vue')
}
// Invocado desde el botón CONFIRMAR en UserProfile2: reutiliza la lógica
// de ParticipateModal (externalBuy) para procesar la compra con la selección
// y datos de pago actuales de esta página.
async function confirmFromProfile() {
  const modal = participateModalRef.value
  if (!modal || typeof modal.externalBuy !== 'function') {
    showToast('No se pudo procesar la compra (modal no disponible)', 'error')
    return
  }

  const metodoPago = selectedPaymentMethod.value ? 
    ((selectedPaymentMethod.value as any).slug || 
     (selectedPaymentMethod.value as any).uuid || 
     (selectedPaymentMethod.value as any).name) : 
    undefined

  // ✅ CORRECCIÓN: Determinar qué tickets enviar según el modo de selección
  let ticketsToSend: number[] = []
  
  if (selectionMode.value === 'manual') {
    ticketsToSend = selectedManualTickets.value
  } else if (selectionMode.value === 'auto' && randomTicketsResult.value) {
    ticketsToSend = randomTicketsResult.value.successful.map((r: any) => r.number)
  }

  // Validar que hay tickets para comprar
  if (ticketsToSend.length === 0) {
    if (selectionMode.value === 'auto') {
      showToast('Primero debes obtener tickets aleatorios', 'error')
    } else {
      showToast('Debes seleccionar al menos un ticket', 'error')
    }
    return
  }

  // Validar que se haya seleccionado un método de pago
  if (!metodoPago) {
    showToast('Debes seleccionar un método de pago', 'error')
    return
  }

  // Validar que se haya ingresado la referencia de pago
  if (!referenciaPago.value || referenciaPago.value.trim() === '') {
    showToast('Debes ingresar la referencia de pago', 'error')
    return
  }

  // Validar moneda seleccionada
  if (!selectedCurrencyId.value) {
    showToast('Debes seleccionar una moneda', 'error')
    return
  }

  // Validar disponibilidad de tickets
  if (ticketsToSend.length > (maxAvailable.value || 0)) {
    showToast(`No hay suficientes tickets disponibles. Solo quedan ${maxAvailable.value}`, 'error')
    return
  }

  try {
    await modal.externalBuy({
      selectionMode: selectionMode.value,
      selectedManualTickets: ticketsToSend,
      formOverrides: {
        referencia: referenciaPago.value,
        metodoPago: metodoPago
      },
      selectedCurrencyId: selectedCurrencyId.value
    })
    
    showToast('✅ Compra procesada exitosamente', 'success')
    
    // ✅ RESETEO DEL FORMULARIO después de una compra exitosa
    resetForm()
    
  } catch (err: any) {
    console.error('Error al confirmar desde perfil:', err)
    showToast(err?.message || 'Error procesando la compra', 'error')
  }
}

// Métodos
const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha por definir'

const formatShortDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('es-ES') : 'Fecha por definir'

const formatTime = (dateString: string) => dateString ? new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Hora por definir'

const getRaffleHighlight = (raffle: Raffle) => {
  // Lógica para generar un highlight basado en la rifa
  return raffle.name.includes('Caracas') 
    ? 'HERMOSO APARTAMENTO UBICADO EN CARACAS' 
    : 'OPORTUNIDAD ÚNICA DE GANAR'
}

const getTicketClass = (n: number) => {
  const ticketNumber = n
  
  if (selectedTickets.value.includes(ticketNumber)) {
    return 'ticket-box selected'
  }
  
  // Simular algunos boletos vendidos (en un caso real, esto vendría de la API)
  if (n % 7 === 0) {
    return 'ticket-box sold'
  }
  
  return 'ticket-box available'
}

const getPaymentMethodClass = (method: any) => {
  const base = 'payment-method-box'
  const isSelected = selectedPaymentMethod.value && (selectedPaymentMethod.value.uuid === method.uuid || selectedPaymentMethod.value.name === method.name)
  return isSelected ? `${base} selected-payment` : `${base} available-payment`
}

const getPrizeImage = (prize: Prize) => {
  // Acceso seguro a images (puede ser undefined)
  return prize.images?.[0]?.url || 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Premio'
}

// Obtener URL absoluta del logo del método de pago
const getPaymentLogo = (method: any) => {
  const candidate = method?.logoUrl || method?.original_data?.icon || method?.original_data?.logo_url || method?.original_data?.image || null
  const placeholder = '/default.png'
  if (!candidate) return placeholder
  try {
    if (typeof candidate === 'string') {
      if (candidate.startsWith('http://') || candidate.startsWith('https://')) return candidate
      if (candidate.startsWith('/')) return `${apiClient.defaults.baseURL?.replace(/\/$/, '')}${candidate}`
      return `${apiClient.defaults.baseURL?.replace(/\/$/, '')}/${candidate}`
    }
    return placeholder
  } catch (e) {
    return String(candidate) || placeholder
  }
}

// Cargar métodos de pago desde el backend
const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = true
  try {
    const methods = await PaymentFlowService.fetchPaymentMethods()
    paymentMethods.value = methods
    // Preseleccionar el método por defecto si existe
    const def = methods.find(m => m.is_default) || methods[0]
    if (def) selectedPaymentMethod.value = def
  } catch (err) {
    console.warn('No se pudieron cargar métodos de pago:', err)
  } finally {
    loadingPaymentMethods.value = false
  }
}

// Inicializar valores de structured fields cuando cambia el método seleccionado
watch(selectedPaymentMethod, (newVal) => {
  structuredFieldValues.value = {}
  if (!newVal) return

  const raw = newVal.structured_data || newVal.original_data?.structured_data || null
  if (!raw) return

  if (Array.isArray(raw)) {
    for (const f of raw) {
      const key = f.key || f.name || f.label
      structuredFieldValues.value[key] = f.value ?? f.default ?? ''
    }
  } else if (typeof raw === 'object') {
    for (const k of Object.keys(raw)) {
      const v = raw[k]
      // Si el valor es un primitivo (string/number), usarlo directamente
      if (v !== null && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) {
        structuredFieldValues.value[k] = v
      } else {
        structuredFieldValues.value[k] = v?.value ?? v?.default ?? ''
      }
    }
  }

}, { immediate: true })

const scrollToPersonalData = () => {
  const personalDataSection = document.getElementById('personal-data')
  if (personalDataSection) {
    personalDataSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleTicketSelection = (n: number) => {
  const ticketNumber = n
  
  if (selectedTickets.value.includes(ticketNumber)) {
    const index = selectedTickets.value.indexOf(ticketNumber)
    selectedTickets.value.splice(index, 1)
  } else {
    // Limitar la selección a un máximo (por ejemplo, 10 boletos)
    if (selectedTickets.value.length < 10) {
      selectedTickets.value.push(ticketNumber)
    }
  }
}

const selectRandomTickets = () => {
  // Abrir la UI de selección automática (el usuario escoge la cantidad y obtiene tickets)
  selectionMode.value = 'auto'
}

// Cancelar la selección automática: liberar tickets reservados, limpiar timers y volver a modo manual
const cancelAutoSelection = async () => {
  try {
    // si hay tickets aleatorios reservados, liberarlos en backend
    if (randomTicketsResult.value && selectedManualTickets.value.length > 0) {
      await freeRandomTickets()
    }
  } catch (err) {
    console.error('Error liberando tickets al cancelar:', err)
  }

  // limpiar estados locales
  clearRandomTicketsTimer()
  randomTicketsResult.value = null
  selectedManualTickets.value = []
  selectedTickets.value = []
  loadingRandomTickets.value = false
  selectionMode.value = 'manual'
}

const prevTicketPage = () => {
  if (currentTicketPage.value > 1) currentTicketPage.value--
}

const nextTicketPage = () => {
  if (currentTicketPage.value < totalTicketPages.value) currentTicketPage.value++
}

// Animación de la barra de progreso
const animateProgressBar = () => {
  const startTime = Date.now()
  const startValue = 0
  const endValue = targetProgress.value
  
  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / animationDuration.value, 1)
    
    // Easing function para animación suave
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    progressWidth.value = startValue + (endValue - startValue) * easeOutQuart
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  animate()
}


// Cargar datos de la rifa
const loadRaffleData = async () => {
  const raffleId = route.params.id as string
  if (!raffleId) {
    loading.value = false
    return
  }

  try {
    // Cargar datos de la rifa
    const raffleResponse = await RaffleService.getByUuid(raffleId)
    if (!raffleResponse) {
      loading.value = false
      return
    }
    raffle.value = raffleResponse

    // Establecer la rifa cargada como selectedProduct en gridStore (igual que ParticipateModal)
    try {
      const gridStore = useGridStore()
      const productObj = {
        uuid: raffleResponse.uuid,
        title: raffleResponse.name,
        description: raffleResponse.description || '',
        ticketsMax: raffleResponse.end_range || 100,
        drawDate: raffleResponse.raffle_date,
        ticketPrice: Number(raffleResponse.ticket_price) || 0,
        rifero: raffleResponse.seller ? `${raffleResponse.seller.name} ${raffleResponse.seller.last_name || ''}`.trim() : 'Rifero',
        images: raffleResponse.images?.map((i: any) => i.url) ?? [],
        categories: [],
        status: raffleResponse.status,
        ticketsVendidos: raffleResponse.tickets_sold ?? null,
        isProgressLoading: false,
      }
      gridStore.selectedProduct = productObj
      // también solicitar disponibles
      gridStore.fetchAvailableTickets(productObj.uuid)
    } catch (e) {
      console.warn('No se pudo setear gridStore.selectedProduct:', e)
    }

    // Cargar premios de la rifa
    const prizesResponse = await PrizeService.getRafflePrizes(raffleId)
    prizes.value = prizesResponse

    // Cargar boletos vendidos desde el backend para mostrar en el selector
    try {
      loadingTickets.value = true
      const sold = await RaffleService.getSoldTickets(raffleId)
      soldTickets.value = Array.isArray(sold) ? sold : []
    } catch (err) {
      console.warn('No se pudieron cargar los tickets vendidos:', err)
      soldTickets.value = []
    } finally {
      loadingTickets.value = false
    }

  } catch (error) {
    console.error('Error cargando datos de la rifa:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  loadRaffleData()
  // cargar métodos de pago
  loadPaymentMethods()

  // Cargar monedas y tasas desde el paymentStore (igual que ParticipateModal)
  try {
    paymentStore.loadPaymentDataOnce()
    paymentStore.fetchAllRates()
  } catch (e) {
    console.warn('No se pudieron cargar datos de pago desde paymentStore:', e)
  }

  // Si las monedas se cargan después, seleccionar la por defecto
  const stopWatch = watch(currencies, (val) => {
    if (val && val.length && !selectedCurrencyId.value) {
      selectedCurrencyId.value = (defaultCurrencyId?.value as string) || val[0].uuid
      stopWatch()
    }
  })

  // Iniciar animación después de que el componente esté montado
  setTimeout(() => {
    animateProgressBar()
  }, 300)
})
</script>

<style scoped>
/* Importación de Montserrat (Fuente Gruesa) */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap');

.lgtangueta-container {
  font-family: 'Montserrat', Arial, sans-serif;
  background-color: #fff;
  color: #000;
  width: 100%;
  min-height: 100vh;
}

/* --- Navbar Estilo Premium --- */
.navbar {
  background-color: #111; /* Fondo Negro Intenso */
  padding-bottom: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.top-accent-line {
  width: 100%;
  height: 4px;
  background-color: #ff3366; /* Línea rosa superior */
  box-shadow: 0 0 10px #ff3366;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px 5px;
}

.logo-container {
  display: flex;
  align-items: center;
}

/* Logo simulado (puedes poner tu img aquí) */
.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-style: italic;
  color: #fff;
  font-size: 20px;
  letter-spacing: -1px;
  /* Efecto cromado simple */
  background: linear-gradient(to bottom, #fff, #999);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 25px;
  font-size: 13px;
  font-weight: 800;
  margin: 0;
  padding: 0;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px; /* Espacio entre icono y texto */
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #ff3366;
}

.btn-boletos {
  background-color: #ff4757; /* Rosa rojizo */
  color: #000; /* Texto negro */
  border: none;
  padding: 10px 25px;
  border-radius: 9999px; /* Borde redondeado completo (pill) */
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
}

.btn-boletos:hover {
  background-color: #ff3366;
  transform: scale(1.05);
}

/* --- Contenido Principal (Rifa Intro) --- */
.main-content {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}

/* Date Header */
.date-header {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 15px;
  color: #000;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* --- Barra de Progreso Estilizada --- */
.progress-container {
  background-color: #fff;
  border-radius: 20px; /* Bordes redondeados */
  height: 26px;
  width: 100%;
  max-width: 650px;
  margin: 0 auto 30px;
  border: 2px solid #333; /* Borde negro grueso */
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0,0,0,0.5);
}

.progress-bar-gradient {
  height: 100%;
  /* Degradado de rosa claro a rosa intenso */
  background: linear-gradient(90deg, #ff8fa3 0%, #ff4757 100%);
  border-radius: 18px 0 0 18px;
  box-shadow: 0 2px 15px rgba(0,0,0,2.5);
}

.progress-text {
  color: #000; /* Texto negro sobre la barra */
  font-size: 12px;
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Títulos */
.main-title {
  text-align: center;
  font-size: 48px; /* Tamaño grande */
  font-weight: 900; /* Extra bold */
  margin-bottom: 40px;
  line-height: 1;
  text-transform: uppercase;
  color: #000;
}

/* Grid Layout */
.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr; /* Imagen un poco más ancha */
  gap: 50px;
  align-items: start;
}

/* Images */
.image-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 25px; /* Bordes redondeados en fotos */
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Text Content */
.text-column {
  text-align: left;
  font-size: 15px;
  line-height: 1.5;
  color: #000;
}

.price-title {
  font-weight: 900;
  font-size: 18px;
  margin: 0;
  text-transform: uppercase;
}

.promo-subtitle {
  font-weight: 900;
  font-size: 18px;
  margin: 0 0 25px 0;
  text-transform: uppercase;
}

.highlight-p {
  font-weight: 900;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-size: 16px;
}

.bold-p {
  font-weight: 800;
  margin: 20px 0;
  text-transform: uppercase;
}

.draw-info p {
  margin: 5px 0;
}

.good-luck {
  font-weight: 900;
  text-transform: uppercase;
  margin-top: 30px;
  font-size: 18px;
}

p {
  margin-bottom: 15px;
}

/* Botones flotantes */
.floating-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 99;
}

.float-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.float-btn:hover {
  transform: scale(1.1);
}

.whatsapp { background-color: #25D366; }
.chat { background-color: #ff4757; }

/* ------------------------------------------- */
/* --- ESTILOS: LISTA DE BOLETOS Y FORMULARIO --- */
/* ------------------------------------------- */
.raffle-tickets-section {
    max-width: 800px;
    margin: 50px auto 30px;
}

.raffle-tickets-card {
    padding: 24px;
    background-color: #fff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
    border-radius: 1rem; /* rounded-2xl */
    border: 1px solid #f3f4f6;
}

.tickets-title {
    font-size: 1.875rem; /* text-3xl */
    font-weight: 900; /* font-extrabold */
    color: #ff3366; /* text-green-600 */
    letter-spacing: -0.025em; /* tracking-tight */
    text-transform: uppercase;
}

.tickets-summary {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.75rem;
    color: #4b5563; /* text-gray-700 */
    font-weight: 600; /* font-semibold */
}

.tickets-count {
    font-size: 1.5rem; /* text-2xl */
    margin-right: 0.5rem;
    color: #dc2626; /* text-red-600 */
}

.tickets-total {
    font-size: 1.25rem; /* text-xl */
}

.btn-suerte {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    font-size: 0.875rem; /* text-sm */
    font-weight: 700; /* font-bold */
    border-radius: 9999px; /* rounded-full */
    color: #fff;
    letter-spacing: 0.025em; /* tracking-wide */
    transition: background-color 0.3s;
    background-color: #ff3366; 
    box-shadow: 0 4px 10px rgba(255, 51, 102, 0.4);
}

/* Malla de Boletos */
.tickets-grid-wrapper {
    overflow-x: auto;
    margin-bottom: 2rem;
    background-color: #f9fafb; /* bg-gray-50 */
    border: 1px solid #e5e7eb; /* border-gray-200 */
    border-radius: 0.5rem; /* rounded-lg */
}

.tickets-inner-scroll {
    width: 100%; /* Ajustar para que ocupe todo el ancho en mobile con overflow */
    padding: 1rem;
}

.tickets-pagination-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-semibold */
    color: #6b7280; /* text-gray-500 */
    margin-bottom: 0.5rem;
}

.tickets-nav-buttons {
    display: flex;
    gap: 0.5rem;
}

.tickets-nav-btn {
    color: #ec4899; /* text-pink-600 */
    transition: color 0.3s;
}
.tickets-nav-btn:hover {
    color: #be185d; /* hover:text-pink-800 */
}

/* Malla de Boletos - Optimizada para móvil */
.tickets-grid-layout {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 0.375rem; /* gap-1.5 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 600;
}

/* Estilos para los números de boletos */
.ticket-box {
  text-align: center;
  padding: 8px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.1s;
  user-select: none;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  line-height: 1.2;
}
.available {
  background-color: #f3f4f6; /* Gris claro */
  color: #4b5563; /* Gris oscuro */
  border: 1px solid #e5e7eb;
}
.available:hover {
  background-color: #e5e7eb;
}
.selected {
  background-color: #ff3366; /* Verde */
  color: white;
  font-weight: 700;
  border: 1px solid #ff3366;
}
.sold {
  background-color: #e5e7eb; /* Gris deshabilitado */
  color: #9ca3af;
  cursor: not-allowed;
  text-decoration: line-through;
  border: 1px solid #d1d5db;
}
.tickets-pagination-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
}

.tickets-nav-btn-mobile {
    background-color: #fce7f3; /* bg-pink-100 */
    color: #ec4899; /* text-pink-600 */
    padding: 0.5rem;
    border-radius: 9999px; /* rounded-full */
    margin: 0 0.5rem;
}

.tickets-page-info {
    color: #1f2937; /* text-gray-800 */
}

.tickets-selected-count {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #4b5563;
}

/* Contador de precio flotante para móviles - POSICIÓN CORREGIDA */
.floating-price-counter {
  position: fixed;
  top: 80px; /* Debajo del navbar */
  right: 20px;
  background: linear-gradient(135deg, #ff3366, #ff6b9c);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3);
  z-index: 99; /* Por debajo del navbar pero por encima del contenido */
  padding: 12px 16px;
  min-width: 150px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: none; /* Oculto por defecto, se mostrará solo en móvil */
}

.floating-price-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.floating-price-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.floating-price-text {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 2px;
}

.floating-price-amount {
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
}

.floating-price-badge {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  flex-shrink: 0;
}

.floating-price-count {
  font-size: 14px;
  font-weight: 900;
  color: white;
}

/* Mostrar el contador flotante solo en dispositivos móviles */
@media (max-width: 768px) {
  .floating-price-counter {
    display: block;
    animation: slideInDown 0.3s ease-out;
  }
}

/* Animación de entrada */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto hover para el contador flotante */
.floating-price-counter:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 51, 102, 0.4);
  transition: all 0.3s ease;
}

/* Contador móvil para boletos seleccionados */
.mobile-ticket-counter {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 2px solid #ff3366;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 12px 16px;
  display: none; /* Oculto por defecto, se mostrará solo en móvil */
}

.counter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
}

.counter-info {
  display: flex;
  flex-direction: column;
}

.counter-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.counter-number {
  font-size: 18px;
  font-weight: 900;
  color: #ff3366;
}

.btn-continuar {
  background-color: #ff3366;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 8px rgba(255, 51, 102, 0.4);
}

.btn-continuar:hover {
  background-color: #e62e5c;
}

/* Mostrar el contador solo en dispositivos móviles */
@media (max-width: 768px) {
  .mobile-ticket-counter {
    display: block;
  }
  
  /* Ajuste para evitar que el contador tape el contenido */
  .raffle-tickets-section {
    padding-bottom: 80px;
  }
}

/* Añadir funcionalidad de clic a los boletos disponibles */
.ticket-box.available {
  cursor: pointer;
}

.ticket-box.available:hover {
  background-color: #e5e7eb;
  transform: scale(1.05);
}

/* Estilos de Seccion / Divider */
.section-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 5px;
}
.section-title {
    font-size: 1.25rem; /* text-xl */
    font-weight: 900;
    text-transform: uppercase;
}

/* Formulario */
.form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
}

/* Estilo para el campo de teléfono con prefijo */
.input-tel-group {
    display: flex;
    gap: 0.5rem;
}
.input-tel-prefix {
    width: 33.333333%;
}
.input-tel-number {
    width: 66.666667%;
    margin-top: 22px; /* Alinea el input con el select */
}

/* Estilos de Input Comunes */
.input-label {
    display: block;
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-semibold */
    color: #4b5563; /* text-gray-700 */
    margin-bottom: 0.5rem;
}

.input-field {
    width: 100%;
    padding: 0.75rem 1rem; /* py-3 px-4 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    font-size: 0.875rem; /* text-sm */
    color: #1f2937; /* text-gray-900 */
    background-color: white;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.input-field:focus {
    border-color: #6b7280; /* focus:border-gray-500 */
    outline: none;
    box-shadow: 0 0 0 1px #6b7280;
}

/* Opciones de Pago */
.payment-methods-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.payment-method-box {
    width: 4rem; /* w-16 */
    height: 2rem; /* h-8 */
    border: 2px solid #d1d5db; /* border-2 border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem; /* p-1 */
    position: relative;
    transition: all 0.2s;
    cursor: pointer;
}

.available-payment {
    opacity: 0.6;
}

.available-payment:hover {
    opacity: 1;
}

.selected-payment {
    border-color: #ff3366; /* border-green-500 */
    box-shadow: 0 0 0 4px #d1fae5; /* ring-4 ring-green-200 */
}

/* Icono de check en Zelle */
.check-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    height: 16px;
    width: 16px;
    color: white;
    background-color: #10b981;
    border-radius: 50%;
    border: 2px solid white;
}

/* Detalle de Cuenta */
.account-details-box {
    background-color: #f9fafb; /* bg-gray-50 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.75rem; /* rounded-xl */
    padding: 1rem;
    margin-bottom: 2rem;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* shadow-inner */
}

.account-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
    margin-bottom: 0.75rem;
}

.account-info p {
    margin-bottom: 0.25rem;
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25;
}

.account-total {
    text-align: center;
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-weight: 900; /* font-extrabold */
    font-size: 1.25rem; /* text-xl */
    background-color: #f7f7f7;
}

/* Área de Subida de Comprobante */
.upload-area {
    margin-top: 0.25rem;
    display: flex;
    justify-content: center;
    padding: 1.25rem 1.5rem;
    border: 2px dashed #d1d5db; /* border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    cursor: pointer;
    transition: border-color 0.3s;
    position: relative;
}

.upload-area:hover {
    border-color: #9ca3af; /* hover:border-gray-400 */
}

.upload-icon {
    margin: auto;
    height: 3rem;
    width: 3rem;
    color: #ec4899; /* text-pink-500 */
}

.upload-text-button {
    position: relative;
    cursor: pointer;
    background-color: white;
    border-radius: 0.375rem;
    font-weight: 500; /* font-medium */
    color: #ec4899; /* text-pink-600 */
    outline: none;
}

/* Checkbox y Botón Final */
.confirm-checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.btn-confirmar {
    padding: 0.75rem 2.5rem;
    font-size: 1.125rem; /* text-lg */
    font-weight: 700; /* font-bold */
    border-radius: 0.75rem; /* rounded-xl */
    color: white;
    text-transform: uppercase;
    transition: background-color 0.3s;
    background-color: #ff3366; 
    box-shadow: 0 4px 10px rgba(255, 51, 102, 0.4);
}

/* ------------------------------------------- */
/* --- ESTILOS ADICIONALES (Verificador, Premios, FAQ) --- */
/* ------------------------------------------- */
.additional-section {
    max-width: 800px;
    margin: 50px auto;
    padding: 0 20px;
}

.section-header-centered {
    text-align: center;
    margin-bottom: 30px;
}

.section-title-large {
    font-size: 2rem; /* text-4xl */
    font-weight: 900; /* Extra bold */
    color: #ff3366; /* Verde */
    text-transform: uppercase;
    line-height: 1.1;
}

.section-subtitle {
    font-size: 1rem;
    color: #4b5563;
    margin-top: 5px;
}

/* Verificador de Boletos */
.verifier-card {
    background-color: #f0fdf4; /* Verde muy claro */
    border: 2px solid #ff3366; /* Verde intermedio */
    border-radius: 1rem;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    text-align: center;
}

.verifier-input-group {
    max-width: 400px;
    margin: 0 auto 20px;
    display: flex;
    gap: 0.5rem;
}
.verifier-prefix {
    width: 35%;
}
.verifier-number {
    width: 65%;
    /* Elimina el margen superior que se añade en otros contextos */
    margin-top: 0; 
}
.verifier-number .input-field {
    margin-top: 22px; /* Alinea con el select del prefijo */
}

.btn-verificar {
    font-size: 1rem;
    padding: 0.75rem 3rem;
    margin-top: 15px;
}


/* Premios Adicionales */
.prizes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.prize-card {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.prize-image {
    width: 100%;
    height: 120px; /* Altura fija para la imagen */
    object-fit: cover;
    border-bottom: 3px solid #ff3366; /* Línea de acento rosa */
}

.prize-text {
    padding: 15px;
}

.prize-title-small {
    font-weight: 900;
    font-size: 0.95rem;
    color: #333;
    margin-bottom: 5px;
    text-transform: uppercase;
}

.prize-description {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.3;
    margin-bottom: 0;
}


/* Preguntas Frecuentes (FAQ) */
.faq-container {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.faq-item {
    border-bottom: 1px solid #e5e7eb;
}
.faq-item:last-child {
    border-bottom: none;
}

.faq-toggle {
    /* Ocultar el checkbox nativo para usar la etiqueta como control */
    position: absolute;
    opacity: 0;
    z-index: -1;
}

.faq-question {
    display: block;
    padding: 15px 20px;
    font-weight: 700;
    color: #333;
    cursor: pointer;
    position: relative;
    user-select: none;
    transition: background-color 0.2s;
}

.faq-question::after {
    content: '+';
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    line-height: 1;
    color: #ff3366;
    transition: transform 0.3s;
}

.faq-toggle:checked + .faq-question {
    background-color: #fef2f2; /* Color de fondo ligero al abrir */
}

.faq-toggle:checked + .faq-question::after {
    content: '-';
    transform: translateY(-50%) rotate(0deg);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
    padding: 0 20px;
    background-color: #f7f7f7;
}

.faq-toggle:checked ~ .faq-answer {
    max-height: 200px; /* Suficiente para el contenido */
    padding: 15px 20px;
}

.faq-answer p {
    font-size: 0.9rem;
    color: #4b5563;
    margin-bottom: 0;
}


/* Responsive */
@media (max-width: 768px) {
  /* ... estilos ya existentes ... */
  .content-grid {
    grid-template-columns: 1fr;
  }
  .main-title {
    font-size: 36px;
  }
  .nav-links {
    display: none;
  }
  .nav-content {
    justify-content: space-between;
  }
  .date-header {
    font-size: 18px;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  .btn-boletos {
    padding: 8px 15px;
    font-size: 12px;
  }
  
  /* Nuevos ajustes Responsive */
  .raffle-tickets-card {
      padding: 15px;
  }
  .tickets-title {
      font-size: 1.5rem;
  }
  .form-grid {
      grid-template-columns: 1fr;
  }
  .input-tel-number {
      /* En móvil se anula el margen de 22px de la versión de escritorio */
      margin-top: 0; 
  }
  .input-tel-group {
    flex-direction: row;
    align-items: flex-end;
  }
  .verifier-number .input-field {
      margin-top: 0; /* No necesita margen extra en móvil */
  }

  /* Ajustes para los 3 nuevos divs en móvil */
  .prizes-grid {
    grid-template-columns: 1fr;
  }
  .prize-image {
      height: 180px;
  }
  .verifier-card {
      padding: 15px;
  }
  .verifier-input-group {
      max-width: 100%;
  }
  .section-title-large {
      font-size: 1.75rem;
  }
}

/* Estilos para el footer */
.site-footer {
  background-color: #ff3366;
  color: #fff;
  padding: 40px 20px 20px;
  margin-top: 50px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-text h3 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.highlight {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
}

.footer-sections {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 20px;
}

.footer-section {
  text-align: left;
}

.footer-section h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #ffffff;
  text-transform: uppercase;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 14px;
}

.footer-section a:hover {
  color: #000000;
}

.footer-bottom {
  max-width: 1200px;
  margin: 30px auto 0;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-sections {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-text h3 {
    font-size: 22px;
  }
}
@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 400px) {
  .tickets-grid-layout {
    grid-template-columns: repeat(4, minmax(0, 1fr)); /* 4 columnas en pantallas muy pequeñas */
    gap: 0.4rem;
  }
  
  .ticket-box {
    padding: 8px 4px;
    min-height: 42px;
    font-size: 0.75rem;
  }
}
@media (min-width: 769px) {
  .tickets-grid-layout {
    gap: 0.5rem;
  }
  
  .ticket-box {
    padding: 10px 6px;
    min-height: 42px;
    font-size: 0.8rem;
  }
}

</style>