<template>
  <div class="min-h-screen p-6 bg-gradient-to-b from-[#0a0f1e] via-[#111827] to-[#0a0f1e] text-white">
    <div class="max-w-7xl mx-auto">
      
      <h1 class="text-4xl font-extrabold mb-6 flex items-center gap-3 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.7)]">
        <svg class="w-9 h-9 text-yellow-400 animate-pulse" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        Mis tickets
      </h1>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
        <p class="text-gray-400 animate-pulse">Cargando tus tickets...</p>
      </div>

      <div v-else-if="!authStore.user && !isLoading" class="p-6 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
        <p class="text-sm text-center text-gray-300">🎰 Necesitas iniciar sesión para ver tus tickets.</p>
      </div>

      <div v-else>
        <div class="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="text-sm text-gray-300 italic">
                Mostrando tickets para <span class="font-semibold text-yellow-300">{{ authStore.user?.name || 'Usuario' }}</span>
              </p>
              <div class="flex gap-4 mt-2 text-sm">
                <span class="text-green-400">✅ Ganados: {{ stats.won }}</span>
                <span class="text-yellow-400">⏳ En curso: {{ stats.inProgress }}</span>
                <span class="text-gray-400">⏱️ Pendientes: {{ stats.pending }}</span>
                <span class="text-blue-400">🎟️ Total: {{ stats.total }}</span>
              </div>
            </div>
            <button 
              @click="clearAllFilters"
              v-if="hasActiveFilters"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>

        <div class="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="🔍 Buscar tickets..."
                class="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <select v-model="statusFilter" class="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="all">Todos los estados</option>
              <option value="En transcurso">En transcurso</option>
              <option value="Ganador">Ganados</option>
              <option value="Pendiente">Pendientes</option>
            </select>
            <select v-model="categoryFilter" class="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="all">Todas las categorías</option>
              <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <select v-model="dateFilter" class="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="upcoming">Próximos sorteos</option>
              <option value="past">Sorteos pasados</option>
            </select>
          </div>
        </div>

        <div v-if="filteredRaffleGroups.length === 0" class="p-8 text-center bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <div v-if="hasActiveFilters">
            <p class="text-lg text-gray-300 mb-2">No se encontraron tickets con los filtros aplicados</p>
            <button @click="clearAllFilters" class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors">
              Mostrar todos los tickets
            </button>
          </div>
          <div v-else>
            <p class="text-lg text-gray-300 mb-2">Aún no tienes tickets 🎟️</p>
            <p class="text-sm text-gray-400">Participa en alguna rifa para verlos aquí</p>
          </div>
        </div>

        <!-- Grid 3x3 en escritorio, 2x2 en móvil -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="group in filteredRaffleGroups" 
            :key="group.raffleId" 
            @click="openGroupDetails(group)"
            class="bg-gradient-to-r from-[#1a1f35] via-[#0f172a] to-[#1a1f35] rounded-xl border border-gray-700/50 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 relative overflow-hidden group h-full flex flex-col cursor-pointer hover:border-yellow-500/50 hover:-translate-y-1"
          >
            <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3),transparent)]"></div>

            <!-- Contenedor de imagen con estado -->
            <div class="relative p-3 pb-0">
              <div class="relative overflow-hidden rounded-lg">
                <img 
                  :src="getProductImage(group.product)" 
                  :alt="group.product.title"
                  class="w-full h-40 object-cover rounded-lg border border-gray-600 shadow-md transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />
                <div class="absolute top-2 right-2">
                  <span 
                    :class="[ 
                      'px-2 py-1 rounded-full text-xs font-bold tracking-wide shadow-md',
                      group.hasWinner ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-black'
                    ]"
                  >
                    {{ group.hasWinner ? '🎉 ¡Ganador!' : 'En curso' }}
                  </span>
                </div>
                <!-- Overlay para imagen -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="relative z-10 p-3 flex-1 flex flex-col">
              <!-- Título y contador -->
              <div class="mb-2">
                <h3 class="text-base font-bold text-white drop-shadow line-clamp-2 mb-1">
                  {{ group.product.title || 'Rifa sin nombre' }}
                </h3>
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400 flex items-center gap-1">
                    🎫 {{ group.tickets.length }} tickets
                    <span v-if="group.hasWinner" class="text-emerald-400 ml-1">✨</span>
                  </span>
                  <span class="text-yellow-300 font-mono">
                    {{ group.tickets.length }} comprados
                  </span>
                </div>
              </div>

              <!-- Categorías -->
              <div class="mb-3 flex flex-wrap gap-1">
                <span v-if="group.product.categories.length > 0" class="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                  {{ getFirstCategory(group.product.categories) }}
                </span>
                <span v-if="group.product.paymentMethod" class="px-2 py-0.5 bg-blue-900/50 rounded text-xs text-blue-300">
                  {{ group.product.paymentMethod }}
                </span>
                <span v-if="group.product.rifero" class="px-2 py-0.5 bg-purple-900/50 rounded text-xs text-purple-300">
                  {{ group.product.rifero }}
                </span>
              </div>

              <!-- Información de fecha y precio -->
              <div class="mb-3 text-xs text-gray-400 space-y-1">
                <div v-if="group.product.drawDate && isUpcoming(group.product.drawDate)" class="text-orange-400 flex items-center gap-1">
                  <span>⏰</span>
                  <div>
                    <div class="font-medium">{{ formatDateShort(group.product.drawDate) }}</div>
                    <div class="text-xs opacity-90">({{ getTimeRemaining(group.product.drawDate) }})</div>
                  </div>
                </div>
                <div v-else-if="group.tickets.some(t => t.status === 'En transcurso')" class="text-yellow-400">
                  ⏳ Esperando sorteo
                </div>
                <div v-if="group.product.ticketPrice" class="text-green-400 flex justify-between items-center">
                  <span>💰 Precio:</span>
                  <span class="font-bold">${{ group.product.ticketPrice }}</span>
                </div>
                <div v-if="group.product.progress" class="text-xs mt-2">
                  <div class="flex justify-between mb-1 text-gray-300">
                    <span>Progreso:</span>
                    <span>{{ group.product.ticketsSold }}/{{ group.product.ticketsMax }}</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      class="bg-yellow-500 h-1.5 rounded-full transition-all duration-300" 
                      :style="{ width: `${group.product.progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Lista de Tickets (máximo 5) -->
              <div class="mt-auto pt-3 border-t border-gray-700/50">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-xs font-semibold text-white">Tus números:</h4>
                  <span class="text-xs text-gray-400">{{ group.tickets.length }} total</span>
                </div>
                
                <!-- Tickets visibles -->
                <div class="flex flex-wrap gap-1">
                  <div 
                    v-for="(ticket, index) in group.visibleTickets" 
                    :key="ticket.uniqueKey"
                    :class="[
                      'px-2 py-1 rounded text-xs font-mono transition-all relative',
                      ticket.status === 'Ganador' 
                        ? 'bg-emerald-500 text-white shadow-[0_0_6px_rgba(16,185,129,0.6)]' 
                        : ticket.status === 'Finalizado' 
                          ? 'bg-red-600/80 text-white shadow-[0_0_6px_rgba(220,38,38,0.6)]'
                          : ticket.status === 'Pendiente'
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                    ]"
                    :title="`Ticket #${ticket.ticket.ticketNumber} - ${ticket.status}`"
                    @click.stop="toggleShowAll(group)"
                  >
                    {{ ticket.ticket.ticketNumber }}
                    <span v-if="ticket.status === 'Ganador'" class="ml-0.5">🎉</span>
                    <span v-else-if="ticket.status === 'Finalizado'" class="ml-0.5">❌</span>
                  </div>
                  
                  <!-- Botón para mostrar más tickets -->
                  <button 
                    v-if="group.tickets.length > 5 && !group.showAllTickets"
                    @click.stop="toggleShowAll(group)"
                    class="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors flex items-center"
                  >
                    +{{ group.tickets.length - 5 }}
                    <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <!-- Botón para mostrar menos -->
                  <button 
                    v-if="group.showAllTickets"
                    @click.stop="toggleShowAll(group)"
                    class="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors flex items-center"
                  >
                    <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Menos
                  </button>
                </div>
                
                <!-- Indicador de hacer clic para más detalles -->
                <div class="mt-2 pt-2 border-t border-gray-700/30 text-center">
                  <span class="text-xs text-yellow-400 flex items-center justify-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Haz clic para ver detalles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Rifa -->
    <div v-if="selectedGroup" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-[#0f172a] to-[#1e293b] shadow-2xl">
        <!-- Botón para cerrar -->
        <button 
          @click="closeGroupDetails" 
          class="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Contenido del Modal -->
        <div class="overflow-y-auto max-h-[85vh]">
          <!-- Cabecera con imagen y título -->
          <div class="relative">
            <img 
              :src="getProductImage(selectedGroup.product)" 
              :alt="selectedGroup.product.title"
              class="w-full h-64 object-cover"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">{{ selectedGroup.product.title }}</h2>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      :class="[ 
                        'px-3 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg',
                        selectedGroup.hasWinner ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-black'
                      ]"
                    >
                      {{ selectedGroup.hasWinner ? '🎉 ¡TIENE TICKET GANADOR!' : '🎟️ En curso' }}
                    </span>
                    <span v-if="selectedGroup.product.categories.length > 0" class="px-3 py-1 bg-gray-700/80 rounded-full text-sm text-gray-300">
                      {{ getFirstCategory(selectedGroup.product.categories) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Información General -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <!-- Información de la Rifa -->
              <div class="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información de la Rifa
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">Rifero:</span>
                    <span class="text-white font-medium">{{ selectedGroup.product.rifero }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">Precio por ticket:</span>
                    <span class="text-green-400 font-bold">${{ selectedGroup.product.ticketPrice }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">Fecha del sorteo:</span>
                    <span class="text-orange-400">{{ formatDateLong(selectedGroup.product.drawDate) || 'Por definir' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">Método de pago:</span>
                    <span class="text-blue-400">{{ selectedGroup.product.paymentMethod }}</span>
                  </div>

                </div>
              </div>

              <!-- Estado de Tickets -->
              <div class="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Estado de Tickets
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span class="text-gray-300">Ganadores</span>
                    </div>
                    <span class="text-emerald-400 font-bold">{{ selectedGroup.tickets.filter(t => t.status === 'Ganador').length }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span class="text-gray-300">En transcurso</span>
                    </div>
                    <span class="text-yellow-400 font-bold">{{ selectedGroup.tickets.filter(t => t.status === 'En transcurso').length }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span class="text-gray-300">Pendientes</span>
                    </div>
                    <span class="text-gray-400 font-bold">{{ selectedGroup.tickets.filter(t => t.status === 'Pendiente').length }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-red-600"></div>
                      <span class="text-gray-300">Finalizados (perdidos)</span>
                    </div>
                    <span class="text-red-400 font-bold">{{ selectedGroup.tickets.filter(t => t.status === 'Finalizado').length }}</span>
                  </div>
                  <div class="pt-3 border-t border-gray-700/50">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-300">Total tickets:</span>
                      </div>
                      <span class="text-white font-bold">{{ selectedGroup.tickets.length }}</span>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                      <div class="flex items-center gap-2">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Tickets Detallados -->
            <div class="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div class="p-4 border-b border-gray-700/50">
                <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Todos tus tickets comprados ({{ selectedGroup.tickets.length }})
                </h3>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-800/80">
                      <th class="p-3 text-left text-sm font-semibold text-gray-300">Ticket #</th>
                      <th class="p-3 text-left text-sm font-semibold text-gray-300">Número de Factura</th>
                      <th class="p-3 text-left text-sm font-semibold text-gray-300">Serial de Compra</th>
                      <th class="p-3 text-left text-sm font-semibold text-gray-300">Fecha de Compra</th>
                      <th class="p-3 text-left text-sm font-semibold text-gray-300">Estado</th>
                      <th class="p-3 text-left text-sm font-semibold text-gray-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="ticket in selectedGroup.tickets" 
                      :key="ticket.uniqueKey"
                      class="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                    >
                      <td class="p-3">
                        <div class="flex items-center gap-2">
                          <span class="font-mono text-lg font-bold text-white">#{{ ticket.ticket.ticketNumber }}</span>
                          <span v-if="ticket.status === 'Ganador'" class="text-emerald-400">🎉</span>
                          <span v-else-if="ticket.status === 'Finalizado'" class="text-red-400">❌</span>
                        </div>
                      </td>
                      <td class="p-3">
                        <span class="font-mono text-sm text-gray-300">{{ ticket.invoiceNumber }}</span>
                      </td>
                      <td class="p-3">
                        <span class="font-mono text-xs text-gray-400 break-all">{{ ticket.uniqueKey }}</span>
                      </td>
                      <td class="p-3">
                        <div class="flex flex-col">
                          <span class="text-sm text-gray-300">{{ formatDateLong(ticket.purchaseDate) }}</span>
                          <span class="text-xs text-gray-500">Hace {{ getTimeAgo(ticket.purchaseDate) }}</span>
                        </div>
                      </td>
                      <td class="p-3">
                        <span 
                          :class="[
                            'px-3 py-1 rounded-full text-xs font-bold',
                            ticket.status === 'Ganador' ? 'bg-emerald-500 text-white' :
                            ticket.status === 'Finalizado' ? 'bg-red-600 text-white' :
                            ticket.status === 'Pendiente' ? 'bg-gray-500 text-white' :
                            'bg-yellow-500 text-black'
                          ]"
                        >
                          {{ ticket.status }}
                        </span>
                      </td>
                      <td class="p-3">
                        <button 
                          @click="copyTicketInfo(ticket)"
                          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors flex items-center gap-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copiar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Resumen de tickets -->
              <div class="p-4 border-t border-gray-700/50 bg-gray-800/20">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-emerald-400">{{ selectedGroup.tickets.filter(t => t.status === 'Ganador').length }}</div>
                    <div class="text-sm text-gray-400">Tickets Ganadores</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-yellow-400">{{ selectedGroup.tickets.filter(t => t.status === 'En transcurso').length }}</div>
                    <div class="text-sm text-gray-400">En Transcurso</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-400">{{ selectedGroup.tickets.filter(t => t.status === 'Pendiente').length }}</div>
                    <div class="text-sm text-gray-400">Pendientes</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje para tickets ganadores -->
            <div v-if="selectedGroup.hasWinner" class="mt-6 p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 rounded-xl border border-emerald-700/50">
              <div class="flex items-center gap-3">
                <div class="text-3xl">🎉</div>
                <div>
                  <h4 class="text-lg font-bold text-emerald-300">¡Felicidades! Tienes tickets ganadores</h4>
                  <p class="text-sm text-emerald-200/80">Contacta al rifero para reclamar tu premio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useGridStore } from '@/stores/useGridStore'
import { InvoiceService, type Invoice } from '@/services/InvoiceService'

// --- Interfaces para la vista ---
interface UiTicket {
  ticketNumber: string
  isWinner?: boolean
}

interface UiProduct {
  title: string
  categories: string[]
  images: string[]
  drawDate: string
  paymentMethod: string
  rifero: string
  ticketPrice: number
  ticketsMax: number
  ticketsSold: number
  progress: number
}

interface TicketItem {
  uniqueKey: string
  ticket: UiTicket
  product: UiProduct
  status: string
  purchaseDate: string
  invoiceNumber: string
  raffleId: string
}

interface RaffleGroup {
  raffleId: string
  product: UiProduct
  tickets: TicketItem[]
  visibleTickets: TicketItem[]
  hasWinner: boolean
  showAllTickets: boolean
}

// --- Stores ---
const authStore = useAuthStore()
const gridStore = useGridStore()

// --- Estados Locales ---
const invoices = ref<Invoice[]>([])
const isLoading = ref(false)
const raffleGroups = ref<RaffleGroup[]>([])
const selectedGroup = ref<RaffleGroup | null>(null)

// --- Filtros ---
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const dateFilter = ref('all')

// --- Carga de Datos (API) ---
const fetchMyTickets = async () => {
  if (!authStore.user) return
  
  isLoading.value = true
  try {
    // 1. Cargar facturas/tickets
    const data = await InvoiceService.getMyInvoices()
    invoices.value = data
    console.log("Facturas cargadas:", data)
    
    // 2. Cargar lista de rifas del gridStore (ya incluye imágenes)
    if (gridStore.products.length === 0) {
      console.log("Cargando rifas desde GridStore...")
      await gridStore.fetchProductList(1, 100)
    }
    
    console.log("Rifas cargadas en GridStore:", gridStore.products)
    
    // 3. Procesar tickets después de cargar ambos
    processTicketGroups()
    
  } catch (error) {
    console.error("Error cargando tickets:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMyTickets()
})

// --- Función para buscar rifa en el GridStore ---
const findRaffleInGridStore = (raffleId: string) => {
  console.log(`Buscando rifa ${raffleId} en GridStore...`)
  const raffle = gridStore.products.find(p => p.uuid === raffleId)
  if (raffle) {
    console.log(`✅ Rifa ${raffleId} encontrada:`, raffle.title)
    return raffle
  }
  
  console.log(`⚠️ Rifa ${raffleId} no encontrada en GridStore`)
  return null
}

// --- Procesar y agrupar tickets por rifa ---
const processTicketGroups = () => {
  console.log("Procesando tickets...")
  console.log("Facturas:", invoices.value)
  console.log("Productos en GridStore:", gridStore.products)
  
  if (!invoices.value.length || !gridStore.products.length) {
    console.log("No hay datos suficientes para procesar")
    raffleGroups.value = []
    return
  }

  const groupsMap = new Map<string, RaffleGroup>()
  
  invoices.value.forEach((invoice) => {
    if (!invoice.itemable) {
      console.log("Factura sin itemable:", invoice.uuid)
      return
    }

    const ticketData = invoice.itemable
    const raffleId = ticketData.raffle_id
    
    if (!raffleId) {
      console.log("Ticket sin raffle_id:", ticketData.uuid)
      return
    }
    
    // Buscar rifa en GridStore
    const raffle = findRaffleInGridStore(raffleId)
    
    // Obtener método de pago
    const paymentMethod = invoice.payments?.[0]?.payment_method?.method_name || 'Sin método'

    // Calcular progreso
    const ticketsMax = raffle?.ticketsMax || 0
    const ticketsSold = raffle?.ticketsVendidos || 0
    const progress = ticketsMax > 0 ? Math.round((ticketsSold / ticketsMax) * 100) : 0

    // Información de la rifa
    const productInfo: UiProduct = {
      title: raffle?.title || `Rifa #${raffleId?.substring(0, 8) || 'Desconocida'}`,
      categories: raffle?.categories || [],
      images: raffle?.images || [],
      drawDate: raffle?.drawDate || '',
      paymentMethod,
      rifero: raffle?.rifero || 'Desconocido',
      ticketPrice: raffle?.ticketPrice || 0,
      ticketsMax,
      ticketsSold,
      progress
    }

    // Para cada detalle en el ticket (puede haber múltiples números)
    const details = ticketData.details || [{ number: ticketData.ticket_number }]
    
    details.forEach((detail, index) => {
      // Determinar estado
      let status = 'En transcurso'
      
      if (ticketData.is_winner === true) {
        status = 'Ganador'
      } else if (ticketData.status === 'Pendiente') {
        status = 'Pendiente'
      } else if (ticketData.is_winner === false) {
        status = 'Finalizado'
      } else {
        status = 'En transcurso'
      }

      const ticketItem: TicketItem = {
        uniqueKey: `${invoice.uuid}-${detail.number}-${index}`,
        ticket: {
          ticketNumber: detail.number,
          isWinner: ticketData.is_winner
        },
        product: productInfo,
        status,
        purchaseDate: invoice.created_at || '',
        invoiceNumber: invoice.invoice_number,
        raffleId
      }

      // Agrupar por raffleId
      if (!groupsMap.has(raffleId)) {
        groupsMap.set(raffleId, {
          raffleId,
          product: productInfo,
          tickets: [],
          visibleTickets: [],
          hasWinner: false,
          showAllTickets: false
        })
      }
      
      const group = groupsMap.get(raffleId)!
      group.tickets.push(ticketItem)
      
      // Si hay un ganador, marcar el grupo
      if (status === 'Ganador') {
        group.hasWinner = true
      }
    })
  })

  console.log(`Mapa de grupos creado con ${groupsMap.size} grupos`)

  // Procesar cada grupo para organizar tickets visibles
  groupsMap.forEach((group) => {
    // Ordenar tickets: ganadores primero, luego por número
    group.tickets.sort((a, b) => {
      if (a.status === 'Ganador' && b.status !== 'Ganador') return -1
      if (a.status !== 'Ganador' && b.status === 'Ganador') return 1
      return a.ticket.ticketNumber.localeCompare(b.ticket.ticketNumber)
    })

    // Si hay ganador, mostrar solo el ganador y marcar otros como perdidos
    if (group.hasWinner) {
      const winnerTickets = group.tickets.filter(t => t.status === 'Ganador')
      const loserTickets = group.tickets.filter(t => t.status !== 'Ganador')
      
      // Marcar tickets no ganadores como "Finalizado" (perdidos)
      loserTickets.forEach(ticket => {
        if (ticket.status !== 'Pendiente') {
          ticket.status = 'Finalizado'
        }
      })
      
      // Mostrar ganadores + primeros perdedores (hasta 5 total)
      group.visibleTickets = [
        ...winnerTickets,
        ...loserTickets.slice(0, Math.max(0, 5 - winnerTickets.length))
      ]
    } else {
      // Mostrar primeros 5 tickets
      group.visibleTickets = group.tickets.slice(0, 5)
    }
  })

  raffleGroups.value = Array.from(groupsMap.values())
  console.log("Grupos procesados:", raffleGroups.value)
}

// --- Modal Functions ---
const openGroupDetails = (group: RaffleGroup) => {
  selectedGroup.value = group
}

const closeGroupDetails = () => {
  selectedGroup.value = null
}

// --- Toggle para mostrar todos los tickets ---
const toggleShowAll = (group: RaffleGroup) => {
  group.showAllTickets = !group.showAllTickets
  
  if (group.showAllTickets) {
    group.visibleTickets = group.tickets
  } else {
    if (group.hasWinner) {
      const winnerTickets = group.tickets.filter(t => t.status === 'Ganador')
      const loserTickets = group.tickets.filter(t => t.status !== 'Ganador')
      group.visibleTickets = [
        ...winnerTickets,
        ...loserTickets.slice(0, Math.max(0, 5 - winnerTickets.length))
      ]
    } else {
      group.visibleTickets = group.tickets.slice(0, 5)
    }
  }
}

// --- Computed: Filtrado de grupos ---
const filteredRaffleGroups = computed(() => {
  return raffleGroups.value.filter(group => {
    // Búsqueda en título y categorías
    const matchesSearch = searchQuery.value === '' || 
      group.product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      group.product.categories.some(cat => 
        cat.toLowerCase().includes(searchQuery.value.toLowerCase())
      ) ||
      group.product.rifero.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Estado: si el grupo tiene tickets que cumplan el filtro de estado
    const matchesStatus = statusFilter.value === 'all' || 
      group.tickets.some(ticket => ticket.status === statusFilter.value)

    // Categoría
    const matchesCategory = categoryFilter.value === 'all' ||
      group.product.categories.includes(categoryFilter.value)

    // Fecha: verificar si algún ticket cumple
    const matchesDate = dateFilter.value === 'all' || 
      group.tickets.some(ticket => matchesDateFilter(ticket.purchaseDate, dateFilter.value))

    return matchesSearch && matchesStatus && matchesCategory && matchesDate
  })
})

// --- Estadísticas ---
const stats = computed(() => {
  const allTickets = raffleGroups.value.flatMap(group => group.tickets)
  const total = allTickets.length
  const won = allTickets.filter(t => t.status === 'Ganador').length
  const inProgress = allTickets.filter(t => t.status === 'En transcurso').length
  const pending = allTickets.filter(t => t.status === 'Pendiente').length
  return { total, won, inProgress, pending }
})

// --- Categorías disponibles (para el select) ---
const availableCategories = computed(() => {
  const categories = new Set<string>()
  raffleGroups.value.forEach(group => {
    group.product.categories.forEach(cat => categories.add(cat))
  })
  return Array.from(categories).sort()
})

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         statusFilter.value !== 'all' || 
         categoryFilter.value !== 'all' || 
         dateFilter.value !== 'all'
})

// --- Helpers de Fecha y Utilidades ---
function formatDateShort(d: string) {
  if (!d) return 'Sin fecha'
  const dt = new Date(d)
  return dt.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateLong(d: string) {
  if (!d) return 'Sin fecha'
  const dt = new Date(d)
  return dt.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTimeAgo(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays} día${diffDays !== 1 ? 's' : ''}`
  if (diffHours > 0) return `${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  if (diffMins > 0) return `${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
  return `${diffSecs} segundo${diffSecs !== 1 ? 's' : ''}`
}

function getFirstCategory(categories?: string[]) {
  return categories && categories.length > 0 ? categories[0] : 'Sin categoría'
}

function getProductImage(product: UiProduct) {
  if (product.images && product.images.length > 0) {
    return product.images[0]
  }
  return '/default.png'
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/default.png'
}

function isUpcoming(drawDate?: string) {
  if (!drawDate) return false
  const drawTime = new Date(drawDate).getTime()
  return drawTime > Date.now()
}

function getTimeRemaining(drawDate?: string) {
  if (!drawDate) return ''
  const now = new Date().getTime()
  const drawTime = new Date(drawDate).getTime()
  const diff = drawTime - now
  
  if (diff <= 0) return 'Finalizado'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function matchesDateFilter(purchaseDate: string, filter: string): boolean {
  if (!purchaseDate) return false
  const date = new Date(purchaseDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  switch (filter) {
    case 'today': return date.toDateString() === today.toDateString()
    case 'week': return date >= weekAgo && date <= now
    case 'month': return date >= monthAgo && date <= now
    case 'upcoming': return date > now
    case 'past': return date <= now
    default: return true
  }
}

async function copyTicketInfo(ticket: TicketItem) {
  const text = `Ticket #${ticket.ticket.ticketNumber}\n` +
               `Factura: ${ticket.invoiceNumber}\n` +
               `Rifa: ${ticket.product.title}\n` +
               `Estado: ${ticket.status}\n` +
               `Comprado: ${formatDateLong(ticket.purchaseDate)}`
  
  try {
    await navigator.clipboard.writeText(text)
    alert('Información del ticket copiada al portapapeles')
  } catch (err) {
    console.error('Error al copiar:', err)
    alert('No se pudo copiar la información')
  }
}

function clearAllFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
  dateFilter.value = 'all'
}
</script>

<style scoped>
/* extra aura estilo casino */
.bg-emerald-500 { box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); }
.bg-red-600 { box-shadow: 0 0 8px rgba(220, 38, 38, 0.6); }
.bg-yellow-500 { box-shadow: 0 0 8px rgba(234, 179, 8, 0.6); }
.bg-gray-500 { box-shadow: 0 0 8px rgba(107, 114, 128, 0.6); }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ajustes responsivos */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Animación para el modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>