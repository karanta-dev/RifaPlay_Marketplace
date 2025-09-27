<template>
  <div class="min-h-screen p-6 bg-gradient-to-b from-[#0b1221] via-[#0f1724] to-[#081228] text-white">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 flex items-center gap-3">
        <svg class="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
        Mis tickets
      </h1>

      <div v-if="!user" class="p-6 bg-gray-900/30 rounded-lg">
        <p class="text-sm">Necesitas iniciar sesión para ver tus tickets.</p>
      </div>

      <div v-else>
        <p class="mb-4 text-sm text-gray-300">Mostrando tickets para <strong>{{ user.name }}</strong></p>

        <div v-if="userTickets.length === 0" class="p-6 bg-gray-900/30 rounded-lg">
          <p class="text-sm">Aún no tienes tickets. Participa en alguna rifa para verlos aquí.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="ticketInfo in userTickets" :key="ticketInfo.ticket.ticketNumber" class="bg-gradient-to-r from-[#0b1221] to-[#0f1724] p-4 rounded-lg border border-gray-700 shadow-md flex gap-4 items-center">
            <img :src="ticketInfo.product.images?.[0] || '/default.png'" alt="product" class="w-24 h-16 object-cover rounded-md border border-gray-600" />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-lg font-semibold">{{ ticketInfo.product.title }}</div>
                  <div class="text-sm text-gray-400">Rifero: {{ ticketInfo.product.rifero }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-400">Ticket</div>
                  <div class="font-mono text-lg">#{{ ticketInfo.ticket.ticketNumber }}</div>
                </div>
              </div>

              <div class="mt-2 flex items-center justify-between">
                <div class="text-sm text-gray-400">Sorteo: {{ formatDate(ticketInfo.product.drawDate) }}</div>
                <div>
                  <span :class="['px-3 py-1 rounded-full text-sm font-semibold', statusClass(ticketInfo.status)]">{{ ticketInfo.status }}</span>
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
/* small styling to match theme */
</style>
