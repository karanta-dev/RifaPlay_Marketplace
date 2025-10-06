<template>
  <div class="min-h-screen p-6 bg-gradient-to-b from-[#0a0f1e] via-[#111827] to-[#0a0f1e] text-white">
    <div class="max-w-7xl mx-auto">
      
      <!-- Título con efecto glow -->
      <h1 class="text-4xl font-extrabold mb-6 flex items-center gap-3 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.7)]">
        <svg class="w-9 h-9 text-yellow-400 animate-pulse" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        Mis tickets
      </h1>

      <!-- Cuando no está logueado -->
      <div v-if="!user" class="p-6 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
        <p class="text-sm text-center text-gray-300">🎰 Necesitas iniciar sesión para ver tus tickets.</p>
      </div>

      <div v-else>
        <!-- Header con estadísticas -->
        <div class="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="text-sm text-gray-300 italic">
                Mostrando tickets para <span class="font-semibold text-yellow-300">{{ user.name }}</span>
              </p>
              <div class="flex gap-4 mt-2 text-sm">
                <span class="text-green-400">✅ Ganados: {{ stats.won }}</span>
                <span class="text-yellow-400">⏳ En curso: {{ stats.inProgress }}</span>
                <span class="text-red-400">❌ Perdidos: {{ stats.lost }}</span>
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

        <!-- Sistema de Filtros y Búsqueda -->
        <div class="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            <!-- Búsqueda por texto -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="🔍 Buscar tickets..."
                class="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <!-- Filtro por estado -->
            <select 
              v-model="statusFilter"
              class="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Todos los estados</option>
              <option value="En transcurso">En transcurso</option>
              <option value="Ganador">Ganados</option>
              <option value="Perdiste">Perdidos</option>
            </select>

            <!-- Filtro por categoría -->
            <select 
              v-model="categoryFilter"
              class="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Todas las categorías</option>
              <option v-for="cat in availableCategories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>

            <!-- Filtro por fecha -->
            <select 
              v-model="dateFilter"
              class="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="upcoming">Próximos sorteos</option>
              <option value="past">Sorteos pasados</option>
            </select>
          </div>

          <!-- Filtros activos -->
          <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-4">
            <div 
              v-if="searchQuery"
              class="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30"
            >
              <span class="text-blue-400 text-sm">Búsqueda:</span>
              <span class="text-white text-sm font-medium">{{ searchQuery }}</span>
              <button @click="searchQuery = ''" class="text-blue-400 hover:text-white">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div 
              v-if="statusFilter !== 'all'"
              class="inline-flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30"
            >
              <span class="text-green-400 text-sm">Estado:</span>
              <span class="text-white text-sm font-medium">{{ statusFilter }}</span>
              <button @click="statusFilter = 'all'" class="text-green-400 hover:text-white">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div 
              v-if="categoryFilter !== 'all'"
              class="inline-flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30"
            >
              <span class="text-purple-400 text-sm">Categoría:</span>
              <span class="text-white text-sm font-medium">{{ categoryFilter }}</span>
              <button @click="categoryFilter = 'all'" class="text-purple-400 hover:text-white">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div 
              v-if="dateFilter !== 'all'"
              class="inline-flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30"
            >
              <span class="text-orange-400 text-sm">Fecha:</span>
              <span class="text-white text-sm font-medium">{{ getDateFilterLabel(dateFilter) }}</span>
              <button @click="dateFilter = 'all'" class="text-orange-400 hover:text-white">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Sin tickets -->
        <div v-if="filteredTickets.length === 0" class="p-8 text-center bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <div v-if="hasActiveFilters">
            <p class="text-lg text-gray-300 mb-2">No se encontraron tickets con los filtros aplicados</p>
            <button 
              @click="clearAllFilters"
              class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors"
            >
              Mostrar todos los tickets
            </button>
          </div>
          <div v-else>
            <p class="text-lg text-gray-300 mb-2">Aún no tienes tickets 🎟️</p>
            <p class="text-sm text-gray-400">Participa en alguna rifa para verlos aquí</p>
          </div>
        </div>

        <!-- Grid de tickets - CORREGIDO: 3 columnas desktop, 2 móvil -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="ticketInfo in filteredTickets" 
            :key="generateUniqueKey(ticketInfo)" 
            class="bg-gradient-to-r from-[#1a1f35] via-[#0f172a] to-[#1a1f35] p-4 rounded-xl border border-gray-700/50 shadow-lg hover:shadow-yellow-500/10 transition relative overflow-hidden group"
          >
            <!-- Glow decorativo -->
            <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3),transparent)]"></div>

            <!-- Imagen del producto -->
            <div class="relative z-10 mb-3">
              <img 
                :src="ticketInfo.product.images?.[0] || '/default.png'" 
                alt="product" 
                class="w-full h-32 object-cover rounded-lg border border-gray-600 shadow-md"
              />
              <!-- Badge de estado -->
              <div class="absolute top-2 right-2">
                <span 
                  :class="[ 
                    'px-2 py-1 rounded-full text-xs font-bold tracking-wide shadow-md',
                    statusClass(ticketInfo.status) 
                  ]"
                >
                  {{ ticketInfo.status }}
                </span>
              </div>
            </div>

            <!-- Contenido -->
            <div class="relative z-10">
              <!-- Título y número de ticket -->
              <div class="mb-3">
                <h3 class="text-lg font-bold text-white drop-shadow line-clamp-2 mb-1">
                  {{ ticketInfo.product.title }}
                </h3>
                <div class="flex justify-between items-center">
                  <div class="text-xs text-gray-400 flex items-center gap-1">
                    <span>🎲 {{ ticketInfo.product.rifero }}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-400">Ticket</div>
                    <div class="font-mono text-lg text-yellow-300 drop-shadow">
                      #{{ ticketInfo.ticket.ticketNumber }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Categoría -->
              <div class="mb-3">
                <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                  {{ getFirstCategory(ticketInfo.product.categories) }}
                </span>
              </div>

              <!-- Fecha y tiempo restante -->
              <div class="text-xs text-gray-400 space-y-1">
                <div class="flex items-center gap-1">
                  <span>📅 {{ formatDateShort(ticketInfo.product.drawDate ?? '') }}</span>
                </div>
                <div v-if="isUpcoming(ticketInfo.product.drawDate)" class="text-orange-400">
                  ⏰ {{ getTimeRemaining(ticketInfo.product.drawDate) }}
                </div>
                <div v-else-if="ticketInfo.status === 'En transcurso'" class="text-yellow-400">
                  ⏳ Esperando sorteo
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketStore } from '@/stores/useTicketStore'
import { useAuthStore } from '@/stores/useAuthStore'

interface Ticket {
  ticketNumber: number
  productId: string
  userId: number | string | null
  createdAt: string
  quantity?: number
  isWinner?: boolean
}

interface Product {
  title?: string
  rifero?: string
  categories?: string[]
  description?: string
  images?: string[]
  ticketPrice?: number
  ticketsVendidos?: number
  ticketsMax?: number
  drawDate?: string
  winnerTicketNumber?: number | null
}

const ticketStore = useTicketStore()
const authStore = useAuthStore()
const route = useRoute()

// Filtros
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const dateFilter = ref('all')

// decide which userId to show: prefer route param, otherwise current authenticated
const routeUserId = route.params.userId as string | undefined
const user = computed(() => authStore.user)
const userIdToShow = routeUserId ?? (authStore.user?.id ?? null)

// CORREGIDO: Función para generar keys únicas
const generateUniqueKey = (ticketInfo: { ticket: Ticket; product: Product; status: string }) => {
  return `${ticketInfo.ticket.ticketNumber}-${ticketInfo.product.title}-${ticketInfo.ticket.createdAt}`
}

// Tickets base del usuario
const userTickets = computed(() => {
  if (!userIdToShow) return [] as Array<{ ticket: Ticket; product: Product; status: string }>
  const list = ticketStore.tickets.filter((t: Ticket) => String(t.userId) === String(userIdToShow))
  
  return list.map((t: Ticket) => {
    const product = ticketStore.topProducts.find((p: any) => p.title === t.productId) || ({} as Product)
    const now = Date.now()
    const drawTime = product.drawDate ? new Date(product.drawDate).getTime() : null
    let status = 'En transcurso'
    
    if (drawTime && drawTime > now) status = 'En transcurso'
    else if (drawTime && drawTime <= now) {
      if ((product as any).winnerTicketNumber === undefined || (product as any).winnerTicketNumber === null) {
        status = 'En transcurso'
      } else {
        status = (t.isWinner || t.ticketNumber === (product as any).winnerTicketNumber) ? 'Ganador' : 'Perdiste'
      }
    }
    
    return { ticket: t, product, status }
  })
})

// Tickets filtrados
const filteredTickets = computed(() => {
  return userTickets.value.filter(ticketInfo => {
    // Filtro de búsqueda
    const matchesSearch = searchQuery.value === '' || 
      ticketInfo.product.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticketInfo.product.rifero?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticketInfo.ticket.ticketNumber.toString().includes(searchQuery.value)

    // Filtro de estado
    const matchesStatus = statusFilter.value === 'all' || 
      ticketInfo.status === statusFilter.value

    // Filtro de categoría
    const matchesCategory = categoryFilter.value === 'all' ||
      ticketInfo.product.categories?.includes(categoryFilter.value)

    // Filtro de fecha
    const matchesDate = dateFilter.value === 'all' || 
      matchesDateFilter(ticketInfo.product.drawDate, dateFilter.value)

    return matchesSearch && matchesStatus && matchesCategory && matchesDate
  })
})

// Estadísticas
const stats = computed(() => {
  const total = userTickets.value.length
  const won = userTickets.value.filter(t => t.status === 'Ganador').length
  const lost = userTickets.value.filter(t => t.status === 'Perdiste').length
  const inProgress = userTickets.value.filter(t => t.status === 'En transcurso').length
  
  return { total, won, lost, inProgress }
})

// Categorías disponibles
const availableCategories = computed(() => {
  const categories = new Set<string>()
  userTickets.value.forEach(ticket => {
    ticket.product.categories?.forEach(cat => categories.add(cat))
  })
  return Array.from(categories).sort()
})

// // Utilidades
// function formatDate(d: string) {
//   if (!d) return 'Sin fecha'
//   const dt = new Date(d)
//   return dt.toLocaleDateString('es-ES', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   })
// }

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

function statusClass(s: string) {
  if (s === 'Ganador') return 'bg-emerald-500 text-white'
  if (s === 'Perdiste') return 'bg-red-600 text-white'
  return 'bg-yellow-500 text-black'
}

function getFirstCategory(categories?: string[]) {
  return categories && categories.length > 0 ? categories[0] : 'Sin categoría'
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
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

function matchesDateFilter(drawDate: string | undefined, filter: string): boolean {
  if (!drawDate) return false
  
  const date = new Date(drawDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  switch (filter) {
    case 'today':
      return date.toDateString() === today.toDateString()
    case 'week':
      return date >= weekAgo && date <= now
    case 'month':
      return date >= monthAgo && date <= now
    case 'upcoming':
      return date > now
    case 'past':
      return date <= now
    default:
      return true
  }
}

function getDateFilterLabel(filter: string) {
  const labels: { [key: string]: string } = {
    'today': 'Hoy',
    'week': 'Esta semana',
    'month': 'Este mes',
    'upcoming': 'Próximos',
    'past': 'Pasados'
  }
  return labels[filter] || filter
}

function clearAllFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
  dateFilter.value = 'all'
}

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         statusFilter.value !== 'all' || 
         categoryFilter.value !== 'all' || 
         dateFilter.value !== 'all'
})
</script>

<style scoped>
/* extra aura estilo casino */
.bg-emerald-500 {
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}
.bg-red-600 {
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
}
.bg-yellow-500 {
  box-shadow: 0 0 8px rgba(234, 179, 8, 0.6);
}

/* Para el line-clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>