<template>
  <div class="min-h-screen p-6 bg-gradient-to-b from-[#0a0f1e] via-[#111827] to-[#0a0f1e] text-white">
    <div class="max-w-4xl mx-auto">
      
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
        <p class="mb-6 text-sm text-gray-300 italic">
          Mostrando tickets para <span class="font-semibold text-yellow-300">{{ user.name }}</span>
        </p>

        <!-- Sin tickets -->
        <div v-if="userTickets.length === 0" class="p-8 text-center bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur">
          <p class="text-sm">Aún no tienes tickets. Participa en alguna rifa para verlos aquí 🎟️</p>
        </div>

        <!-- Lista de tickets -->
        <div v-else class="space-y-5">
          <div 
            v-for="ticketInfo in userTickets" 
            :key="ticketInfo.ticket.ticketNumber" 
            class="bg-gradient-to-r from-[#1a1f35] via-[#0f172a] to-[#1a1f35] p-5 rounded-xl border border-gray-700/50 shadow-lg hover:shadow-yellow-500/10 transition relative overflow-hidden group"
          >
            <!-- Glow decorativo -->
            <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3),transparent)]"></div>

            <div class="flex gap-5 items-center relative z-10">
              <img 
                :src="ticketInfo.product.images?.[0] || '/default.png'" 
                alt="product" 
                class="w-28 h-20 object-cover rounded-md border border-gray-600 shadow-md"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-lg font-bold text-white drop-shadow">{{ ticketInfo.product.title }}</div>
                    <div class="text-xs text-gray-400">🎲 Rifero: {{ ticketInfo.product.rifero }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-400">Ticket</div>
                    <div class="font-mono text-xl text-yellow-300 drop-shadow">#{{ ticketInfo.ticket.ticketNumber }}</div>
                  </div>
                </div>

              <div class="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
                <div class="text-gray-400">  📅 Sorteo: {{ formatDate(ticketInfo.product.drawDate ?? '') }}</div>
                <div>
                  <span 
                    :class="[ 
                      'px-3 py-1 rounded-full text-sm font-bold tracking-wide shadow-md w-fit mx-auto sm:mx-0',
                      statusClass(ticketInfo.status) 
                    ]"
                  >
                    {{ ticketInfo.status }}
                  </span>
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
import { computed } from 'vue'
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

// decide which userId to show: prefer route param, otherwise current authenticated
const routeUserId = route.params.userId as string | undefined
const user = computed(() => authStore.user)
const userIdToShow = routeUserId ?? (authStore.user?.id ?? null)

const userTickets = computed(() => {
  if (!userIdToShow) return [] as Array<{ ticket: Ticket; product: Product; status: string }>
  const list = ticketStore.tickets.filter((t: Ticket) => String(t.userId) === String(userIdToShow))
  // join with product info
  return list.map((t: Ticket) => {
    const product = ticketStore.topProducts.find((p: any) => p.title === t.productId) || ({} as Product)
    // determine status
    const now = Date.now()
    const drawTime = product.drawDate ? new Date(product.drawDate).getTime() : null
    let status = 'En transcurso'
    if (drawTime && drawTime > now) status = 'En transcurso'
    else if (drawTime && drawTime <= now) {
      // if winner selected
      if ((product as any).winnerTicketNumber === undefined || (product as any).winnerTicketNumber === null) {
        status = 'En transcurso'
      } else {
        status = (t.isWinner || t.ticketNumber === (product as any).winnerTicketNumber) ? 'Ganador' : 'Perdiste'
      }
    }
    return { ticket: t, product, status }
  })
})

function formatDate(d: string) {
  if (!d) return 'Sin fecha'
  const dt = new Date(d)
  return dt.toLocaleString()
}

function statusClass(s: string) {
  if (s === 'Ganador') return 'bg-emerald-500 text-white'
  if (s === 'Perdiste') return 'bg-red-600 text-white'
  return 'bg-yellow-500 text-black'
}
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
</style>

