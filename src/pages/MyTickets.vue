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

        <div v-if="filteredTickets.length === 0" class="p-8 text-center bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
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

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="ticketInfo in filteredTickets" 
            :key="ticketInfo.uniqueKey" 
            class="bg-gradient-to-r from-[#1a1f35] via-[#0f172a] to-[#1a1f35] p-4 rounded-xl border border-gray-700/50 shadow-lg hover:shadow-yellow-500/10 transition relative overflow-hidden group"
          >
            <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3),transparent)]"></div>

            <div class="relative z-10 mb-3">
              <img 
                :src="getProductImage(ticketInfo.product)" 
                :alt="ticketInfo.product.title"
                class="w-full h-32 object-cover rounded-lg border border-gray-600 shadow-md"
                @error="handleImageError"
              />
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

            <div class="relative z-10">
              <div class="mb-3">
                <h3 class="text-lg font-bold text-white drop-shadow line-clamp-2 mb-1">
                  {{ ticketInfo.product.title || 'Rifa sin nombre' }}
                </h3>
                <div class="flex justify-between items-center">
                  <div class="text-xs text-gray-400 flex items-center gap-1">
                    <span>🎫 Ticket #{{ ticketInfo.ticket.ticketNumber }}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-400">Factura</div>
                    <div class="font-mono text-sm text-yellow-300 drop-shadow">
                      {{ ticketInfo.invoiceNumber }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3 flex flex-wrap gap-2">
                <span v-if="ticketInfo.product.categories.length > 0" class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                  {{ getFirstCategory(ticketInfo.product.categories) }}
                </span>
                <span v-if="ticketInfo.product.paymentMethod" class="px-2 py-1 bg-blue-900/50 rounded text-xs text-blue-300">
                  {{ ticketInfo.product.paymentMethod }}
                </span>
                <span v-if="ticketInfo.product.rifero" class="px-2 py-1 bg-purple-900/50 rounded text-xs text-purple-300">
                  {{ ticketInfo.product.rifero }}
                </span>
              </div>

              <div class="text-xs text-gray-400 space-y-1">
                <div class="flex items-center gap-1">
                  <span>📅 Comprado: {{ formatDateShort(ticketInfo.purchaseDate ?? '') }}</span>
                </div>
                <div v-if="ticketInfo.product.drawDate && isUpcoming(ticketInfo.product.drawDate)" class="text-orange-400">
                  ⏰ Sorteo: {{ formatDateShort(ticketInfo.product.drawDate) }}
                  <span class="ml-1">({{ getTimeRemaining(ticketInfo.product.drawDate) }})</span>
                </div>
                <div v-else-if="ticketInfo.status === 'En transcurso'" class="text-yellow-400">
                  ⏳ Esperando sorteo
                </div>
                <div v-else-if="ticketInfo.status === 'Pendiente'" class="text-gray-400">
                  ⏱️ Pendiente de verificación
                </div>
                <div v-if="ticketInfo.product.ticketPrice" class="text-green-400">
                  💰 Precio: ${{ ticketInfo.product.ticketPrice }}
                </div>
                <div v-if="ticketInfo.product.progress" class="text-xs">
                  <div class="flex justify-between mb-1">
                    <span>Progreso:</span>
                    <span>{{ ticketInfo.product.ticketsSold }}/{{ ticketInfo.product.ticketsMax }}</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      class="bg-yellow-500 h-1.5 rounded-full" 
                      :style="{ width: `${ticketInfo.product.progress}%` }"
                    ></div>
                  </div>
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
// import { RaffleService } from '@/services/RaffleService'

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

// --- Stores ---
const authStore = useAuthStore()
const gridStore = useGridStore()

// --- Estados Locales ---
const invoices = ref<Invoice[]>([])
const isLoading = ref(false)

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
      await gridStore.fetchProductList(1, 100) // Cargar muchas rifas
    }
    
    console.log("Rifas cargadas en GridStore:", gridStore.products.length)
    
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
  // Primero buscar en el gridStore
  const raffle = gridStore.products.find(p => p.uuid === raffleId)
  if (raffle) {
    console.log(`✅ Rifa ${raffleId} encontrada en GridStore:`, raffle.title)
    return raffle
  }
  
  // Si no está en GridStore, intentar cargarla individualmente
  console.log(`⚠️ Rifa ${raffleId} no encontrada en GridStore`)
  return null
}

// --- Computed: Transformación de Datos API a Vista ---
// En la sección de transformación de datos en MyTickets.vue
const userTickets = computed<TicketItem[]>(() => {
  return invoices.value.flatMap((invoice) => {
    if (!invoice.itemable) return []

    const ticketData = invoice.itemable
    const raffleId = ticketData.raffle_id
    
    // Buscar rifa en GridStore
    const raffle = findRaffleInGridStore(raffleId)
    
    // Obtener método de pago - AHORA SÍ EXISTE
    const paymentMethod = invoice.payments?.[0]?.payment_method?.method_name || 'Sin método'

    // Para cada detalle en el ticket (puede haber múltiples números)
    return (ticketData.details || [{ number: ticketData.ticket_number }]).map((detail, index) => {
      // Determinar estado basado en is_winner y status
      // AHORA podemos acceder a ticketData.status
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

      return {
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
    })
  })
})
// --- Computed: Filtrado ---
const filteredTickets = computed(() => {
  return userTickets.value.filter(item => {
    // Búsqueda
    const matchesSearch = searchQuery.value === '' || 
      item.product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.ticket.ticketNumber.includes(searchQuery.value) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.product.rifero.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Estado
    const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value

    // Categoría
    const matchesCategory = categoryFilter.value === 'all' ||
      item.product.categories.includes(categoryFilter.value)

    // Fecha
    const matchesDate = dateFilter.value === 'all' || 
      matchesDateFilter(item.purchaseDate, dateFilter.value)

    return matchesSearch && matchesStatus && matchesCategory && matchesDate
  })
})

// --- Estadísticas ---
const stats = computed(() => {
  const total = userTickets.value.length
  const won = userTickets.value.filter(t => t.status === 'Ganador').length
  const inProgress = userTickets.value.filter(t => t.status === 'En transcurso').length
  const pending = userTickets.value.filter(t => t.status === 'Pendiente').length
  return { total, won, inProgress, pending }
})

// --- Categorías disponibles (para el select) ---
const availableCategories = computed(() => {
  const categories = new Set<string>()
  userTickets.value.forEach(item => {
    item.product.categories.forEach(cat => categories.add(cat))
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

function statusClass(s: string) {
  if (s === 'Ganador') return 'bg-emerald-500 text-white'
  if (s === 'Pendiente') return 'bg-gray-500 text-white'
  if (s === 'Finalizado') return 'bg-red-600 text-white'
  return 'bg-yellow-500 text-black'
}

function getFirstCategory(categories?: string[]) {
  return categories && categories.length > 0 ? categories[0] : 'Sin categoría'
}

function getProductImage(product: UiProduct) {
  // Tomar la primera imagen disponible
  if (product.images && product.images.length > 0) {
    return product.images[0]
  }
  // Imagen por defecto
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
</style>