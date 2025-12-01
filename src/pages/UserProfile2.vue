<template>
  <div class="lgtangueta-container">
    <nav class="navbar">
      <div class="top-accent-line"></div>
      
      <div class="nav-content">
        <div class="logo-container">
           <div class="logo-text">Bolidos Rifas</div>
        </div>

        <ul class="nav-links hidden-mobile">
          <li>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              INICIO
            </a>
          </li>
          <li>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              PREMIOS
            </a>
          </li>
          <li>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              VERIFICADOR
            </a>
          </li>
          <li>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              PREGUNTAS
            </a>
          </li>
          <li>
            <a href="#">
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

    <div class="main-content">
      <div class="date-header">
        <div class="date-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
          </svg>
          30 NOV 2025
        </div>
        <div class="date-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
          </svg>
          10:00 PM
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-bar-gradient" style="width: 32.5%;"></div>
        <span class="progress-text">32.5%</span>
      </div>

      <h1 class="main-title">LA TANQUETA DE<br>BÓLIDOS 2.0</h1>

      <div class="content-grid">
        <div class="image-column">
          <div class="image-wrapper">
            <img src="https://via.placeholder.com/600x400/8B0000/FFFFFF?text=Toyota+Tanqueta+1" alt="Camioneta vista lateral" class="product-image">
          </div>
          <div class="image-wrapper">
            <img src="https://via.placeholder.com/600x400/8B0000/FFFFFF?text=Toyota+Tanqueta+2" alt="Camioneta vista frontal" class="product-image">
          </div>
        </div>

        <div class="text-column">
          <h2 class="price-title">POR TAN SOLO 35 DOLARITOS</h2>
          <h3 class="promo-subtitle">4 OPORTUNIDADES X 100</h3>

          <p class="highlight-p"><strong>HEMBRITA 2024 CON ESTEROIDES</strong></p>

          <p>Si llevas 4 boletos y resultas ganador de la camioneta te entrego 10.000 dólares más en efectivo o transferencia.</p>

          <p class="bold-p">(SI NO QUIERES LA CAMIONETA TE ENTREGO 70.000 DÓLARES O 260 MILLONES DE PESOS)</p>

          <p class="bold-p">LA PERSONA QUE MÁS BOLETOS COMPRE LE ENTREGÓ 2 IPHONE 17 PRO MAX.</p>

          <p>Si quieres disfrutar de la promo 4x100 despreocúpate y paga el precio de la promo no importa que la página marque más.</p>

          <p>24H después de hacer la compra ingresas nuevamente en la pág, al final está el verificador pones el número de tlf tal cual te registraste y conseguirás tus bolets verificados, si la transferencia la hiciste correctamente despreocúpate que vas jugando 🙌🏻</p>

          <div class="draw-info">
            <p><strong>Fecha del sorteo 30/11/25</strong></p>
            <p><strong>10:00pm hora venezuela por el súper gana</strong></p>
          </div>

          <p class="bold-p">Si vendemos el 100% de los boletos antes adelantamos la fecha del sorteo</p>

          <p class="good-luck">BUENA SUERTE 🤞🏻 💚</p>
        </div>
      </div>
      
    <div class="raffle-tickets-section">
    <div class="raffle-tickets-card">
      <div class="text-center mb-8">
        <h2 class="tickets-title">LISTA DE BOLETOS</h2>
        <div class="tickets-summary">
          <span class="tickets-count">1</span>
          <span class="tickets-total">Total: USD 35,00</span>
        </div>
        <button class="btn-suerte">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9.42 14l1.52 3.82 2.39-1.39-2.09-2.09.84-1.05 1.52 1.51 1.05-.84-1.51-1.52 1.05-1.05-1.52-1.51-1.05.84-2.39-2.39L12 6.07c3.95.49 7 3.85 7 7.93 0 1.25-.33 2.44-.92 3.51l-4.59-4.59.84-1.05L12 11.93l-1.05 1.05-1.52 1.52-1.05-.84L9.42 14l-.84 1.05 4.59 4.59c.28-.51.5-1.05.64-1.63z"/>
          </svg>
          ELEGIR A LA SUERTE
        </button>
      </div>

      <div class="tickets-grid-wrapper">
        <div class="tickets-inner-scroll">
          <div class="tickets-pagination-header">
            <span>Pag: 7/7</span>
            <div class="tickets-nav-buttons">
              <button class="tickets-nav-btn disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button class="tickets-nav-btn disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <!-- Malla de boletos optimizada para móvil -->
          <div class="tickets-grid-layout">
            <div v-for="n in 120" :key="n" :class="getTicketClass(n)">
              {{ 5090 + n - 1 }}
            </div>
          </div>

          <div class="tickets-pagination-footer">
            <button class="tickets-nav-btn-mobile">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span class="tickets-page-info">Pag: 7/7</span>
            <button class="tickets-nav-btn-mobile">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div class="tickets-selected-count">
            SELECCIONADOS
            <span class="text-green-600 ml-1">1</span> de <span class="text-red-600">1</span>
          </div>
        </div>
      </div>

              
              <div class="section-divider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7.52 4.5 4 8.02 4 12.5S7.52 20.5 12 20.5 20 16.98 20 12.5 16.48 4.5 12 4.5zm0 2c1.78 0 3.3.73 4.4 1.95L15 9.5l.7-.7c.36-.36.85-.56 1.35-.56s.99.2 1.35.56l.7.7-1.4 1.4c.78.78 1.25 1.83 1.25 3.03 0 2.45-1.99 4.44-4.44 4.44-1.2 0-2.25-.47-3.03-1.25l-1.4 1.4-.7-.7c-.36-.36-.56-.85-.56-1.35s.2-1 .56-1.35l.7-.7-1.4-1.4c-1.22 1.1-1.95 2.62-1.95 4.4 0 2.45 1.99 4.44 4.44 4.44 1.2 0 2.25-.47 3.03-1.25l1.4 1.4.7-.7c.36-.36.56-.85.56-1.35s-.2-1-.56-1.35l-.7-.7 1.4-1.4c-1.22 1.1-1.95 2.62-1.95 4.4 0 2.45 1.99 4.44 4.44 4.44 1.2 0 2.25-.47 3.03-1.25l1.4 1.4.7-.7c.36-.36.56-.85.56-1.35s-.2-1-.56-1.35l-.7-.7z"/>
                  </svg>
                  <h3 class="section-title text-green-600">DATOS PERSONALES</h3>
              </div>

              <div class="form-grid">
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
              </div>

              <div class="section-divider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4.75-8.5h9.5c.41 0 .75.34.75.75s-.34.75-.75.75h-9.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75zM12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <h3 class="section-title text-green-600">MODOS DE PAGO</h3>
              </div>

              <p class="text-sm text-gray-500 mb-6 text-center">Selecciona una opción</p>

              <div class="payment-methods-wrapper">
                  <div v-for="method in paymentMethods" :key="method.name" :class="getPaymentMethodClass(method)">
                      <img :src="method.logoUrl" :alt="method.name" class="w-full h-full object-contain">
                      <svg v-if="method.name === 'Zelle'" class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  </div>
              </div>
              
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
                      <p><strong>TITULAR:</strong> Kinmariany Gimón</p>
                      <p><strong>CORREO:</strong> Kinmariany@gmail.com</p>
                      <p><strong>TITULAR:</strong> Kimberly Rincón</p>
                  </div>
                  
                  <div class="account-total">
                      Total: <span class="text-red-600">$35.00 USD</span> (1 boleto)
                  </div>
              </div>

              <div class="section-divider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.71 14.71l-5-5c-.39-.39-.39-1.02 0-1.41l5-5c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41L10.41 12l4.29 4.29c.39.39.39 1.02 0 1.41-.39.38-1.02.38-1.41-.01z"/>
                  </svg>
                  <h3 class="section-title text-green-600">COMPROBANTE DE PAGO</h3>
              </div>

              <div class="mb-6">
                  <label class="input-label" for="file-upload">Foto/Captura de Pantalla</label>
                  <div class="upload-area">
                      <input id="file-upload" type="file" class="sr-only">
                      <div class="space-y-1 text-center">
                          <svg class="upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v-2a4 4 0 00-4-4H18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20l.3 5.3L15 29l-3 4-2 3M24 30h4v6H24z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 32a6 6 0 11-12 0 6 6 0 0112 0z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          <div class="flex text-sm text-gray-600">
                              <span class="upload-text-button">
                                  <span>Subir archivo</span>
                              </span>
                              <p class="pl-1">o arrastrar y soltar</p>
                          </div>
                          <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      </div>
                  </div>
              </div>
              
              <div class="confirm-checkbox-wrapper">
                  <input type="checkbox" id="terminos" class="rounded text-pink-600 focus:ring-pink-500">
                  <label for="terminos" class="ml-2 text-xs text-gray-500">
                      Al confirmar autorizo el uso de los **Datos Personales**
                  </label>
              </div>
              
              <div class="text-center">
                  <button class="btn-confirmar">
                      CONFIRMAR
                  </button>
              </div>
          </div>
      </div>

      <div class="additional-section">
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
      </div>
      
      <div class="additional-section">
          <div class="section-header-centered">
              <h2 class="section-title-large">LISTA DE PREMIOS</h2>
              <p class="section-subtitle">Total de premios: 3</p>
          </div>
          <div class="prizes-grid">
              <div class="prize-card">
                  <img src="https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Premio+1" alt="Premio Adicional 1" class="prize-image">
                  <div class="prize-text">
                      <h3 class="prize-title-small">PREMIO COMPRADOR MAYOR</h3>
                      <p class="prize-description">El comprador con la mayor cantidad de boletos se lleva un iPhone 17 Pro Max.</p>
                  </div>
              </div>
              <div class="prize-card">
                  <img src="https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Premio+2" alt="Premio Adicional 2" class="prize-image">
                  <div class="prize-text">
                      <h3 class="prize-title-small">PREMIO EXTRA CASH</h3>
                      <p class="prize-description">Ganador de la tanqueta que haya comprado 4 o más boletos recibe 10.000$ extra.</p>
                  </div>
              </div>
              <div class="prize-card">
                  <img src="https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Premio+3" alt="Premio Adicional 3" class="prize-image">
                  <div class="prize-text">
                      <h3 class="prize-title-small">SORTEO CONSUELO</h3>
                      <p class="prize-description">Pronto anunciaremos el premio de consolación para el segundo lugar.</p>
                  </div>
              </div>
          </div>
      </div>
      
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
            <li><a href="https://www.instagram.com/bolidosrifas/" target="_blank">
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

<script>
export default {
  name: 'LgtanguetaDeBolidos',
  data() {
    return {
      // Opciones de métodos de pago
      paymentMethods: [
        { name: 'Zelle', logoUrl: 'https://via.placeholder.com/60x30/232426/FFFFFF?text=Zelle' },
        { name: 'Paypal', logoUrl: 'https://via.placeholder.com/60x30/0070BA/FFFFFF?text=PayPal' },
        { name: 'Banesco', logoUrl: 'https://via.placeholder.com/60x30/F58220/FFFFFF?text=Banesco' },
        { name: 'Binance', logoUrl: 'https://via.placeholder.com/60x30/F0B90B/000000?text=Binance' },
        { name: 'Mercantil', logoUrl: 'https://via.placeholder.com/60x30/F0F0F0/000000?text=Mercantil' },
        { name: 'PagoMovil', logoUrl: 'https://via.placeholder.com/60x30/231F20/FFFFFF?text=PagoMovil' },
      ],
    }
  },
  methods: {
    // Lógica para determinar el estilo de cada boleto
    getTicketClass(n) {
      // Simula boletos seleccionados (color verde) y vendidos (gris)
      if (n === 1) return 'ticket-box selected'; // Boleto 5090 (ejemplo)
      if (n >= 20 && n <= 30) return 'ticket-box sold'; // Boletos 5109 a 5119 (ejemplo)
      return 'ticket-box available';
    },
    // Lógica para determinar el estilo del método de pago (ejemplo: Zelle seleccionado)
    getPaymentMethodClass(method) {
      const base = 'payment-method-box';
      // Simula que Zelle está seleccionado
      if (method.name === 'Zelle') {
        return base + ' selected-payment';
      }
      return base + ' available-payment';
    }
  }
}
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.progress-bar-gradient {
  height: 100%;
  /* Degradado de rosa claro a rosa intenso */
  background: linear-gradient(90deg, #ff8fa3 0%, #ff4757 100%);
  border-radius: 18px 0 0 18px;
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