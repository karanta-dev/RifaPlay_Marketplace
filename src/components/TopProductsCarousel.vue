<template>
  <h2 class="text-sm sm:text-2xl font-extrabold text-yellow-400 text-center mb-1 sm:mb-2 drop-shadow casino-title">
    <i class="fas fa-dice text-green-400 mr-2"></i>
    🎟️ Productos con más tickets vendidos
  </h2>

  <div class="w-full max-w-7xl bg-gradient-to-br from-[#0a0f1e] via-[#111827] to-[#0a0f1e] border rounded-2xl py-2 sm:py-1 overflow-hidden relative shadow-2xl casino-carousel">
    <!-- Iconos casino flotantes -->
    <i class="fas fa-coins text-yellow-400 absolute left-4 top-4 opacity-30 text-lg casino-float"></i>
    <i class="fas fa-dice text-green-400 absolute right-4 top-4 opacity-30 text-lg casino-float"></i>
    <i class="fas fa-ticket-alt text-orange-400 absolute left-1/2 top-2 opacity-30 text-lg casino-float"></i>

    <div class="whitespace-nowrap flex animate-marquee relative z-10">
      <!-- 🔹 Items -->
      <div
  v-for="(item, i) in topProducts"
  :key="i"
  class="inline-flex flex-col justify-between bg-gradient-to-b from-[#1a1f35] via-[#0f172a] to-[#1a1f35] rounded-xl shadow-lg border border-gray-700/50 mx-2 px-3 py-0 min-w-[120px] sm:min-w-[220px] relative transition-all cursor-pointer casino-card group"
  :class="{
    'bg-gray-700/50 pointer-events-none grayscale': isSoldOut(item),
    'animate-pulse-hot': isHot(item)
  }"
  @click="openDetails(item)"
>
  <div class="flex flex-col items-center">
    <!-- Badge HOT -->
    <span
      v-if="isHot(item)"
      class="absolute top-0 right-0 mt-1 mr-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase z-10 animate-bounce shadow-lg"
    >
      🔥 ¡Caliente!
    </span>

    <!-- Imagen -->
    <img
      :src="item.images && item.images[0] ? item.images[0] : '/default.png'"
      alt="Producto"
      class="w-24 h-16 sm:w-32 sm:h-24 object-cover rounded-lg mb-2 border casino-img"
    />

    <!-- Título -->
    <h3 class="font-bold text-white text-xs sm:text-base text-center truncate w-full drop-shadow">
      {{ item.title }}
    </h3>

    <!-- Timer -->
    <div class="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
      <p v-if="timeLeft(item).total > 0">
        ⏱️ Termina en: 
        <span class="text-yellow-300">{{ timeLeft(item).days }}d {{ timeLeft(item).hours }}h {{ timeLeft(item).minutes }}m</span>
      </p>
      <p v-else class="text-red-400 font-bold">🎉 ¡Sorteado!</p>
    </div>

    <!-- Progreso -->
    <p class="text-yellow-300 font-extrabold text-sm sm:text-lg mt-0.5 drop-shadow">
      {{ item.ticketsVendidos.toLocaleString() }} /
      {{ item.ticketsMax.toLocaleString() }} 🎫
    </p>
    <div class="w-full bg-gray-700 rounded-full h-1.5 sm:h-3 mt-1 sm:mt-2 casino-bar">
      <div
        class="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-600 h-1.5 sm:h-3 rounded-full transition-all duration-500"
        :style="{ width: productProgress(item) + '%' }"
      ></div>
    </div>

    <!-- Casi agotado -->
    <p
      v-if="productAlmostSoldOut(item)"
      class="mt-1 text-center text-red-400 bg-red-900/40 border border-red-500/30 rounded-lg px-1 py-0.5 text-xs font-semibold"
    >
      ⚠️ ¡Últimas oportunidades!
    </p>
  </div>

  <!-- Botón siempre abajo -->
  <!-- <button
    class="mt-3 px-2 sm:px-6 py-1 sm:py-2 rounded-full w-full font-bold text-xs sm:text-base shadow-lg casino-btn"
    :class="{
      'bg-gray-500 text-white cursor-not-allowed': isSoldOut(item),
      'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black hover:scale-105 hover:shadow-yellow-500/50': !isSoldOut(item)
    }"
    :disabled="isSoldOut(item)"
    @click.stop="openParticipateModal(item)"
  >
    {{ isSoldOut(item) ? '¡VENDIDO!' : 'PARTICIPAR' }}
  </button> -->
</div>

    </div>
  </div>

  <!-- 🔹 Participar modal -->
  <ParticipateModal
    :open="showForm"
    :product="selectedProduct"
    @close="showForm = false"
    @confirmed="handleConfirmed"
  />
    <!-- modal de jackpot animado -->
    <JackpotAnimation
      :show="showJackpot"
      :initial-tickets="userInitialTickets"
      :purchased-tickets="purchasedTicketsCount"
      @close="handleJackpotClose"
    />

    <!-- modal de confirmación - AHORA CON NUEVO EVENTO -->
    <ConfirmacionModal
      :open="showConfirm"
      @close="showConfirm = false"
      @showJackpot="handleShowJackpot"
    />

  <!-- 🔹 Details modal -->
  <DetailsModal
    :open="showDetails"
    :product="selectedProduct"
    @close="showDetails = false"
    @buy="openParticipateModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGridStore } from '@/stores/useGridStore'
// import { useAuthStore } from "@/stores/useAuthStore"

import ParticipateModal from './ParticipateModal.vue'
import ConfirmacionModal from './ConfirmationModal.vue'
import DetailsModal from './ProductDetailsModal.vue'
import JackpotAnimation from "./JackpotAnimation.vue"

const gridStore = useGridStore()
// const authStore = useAuthStore()
const { products } = storeToRefs(gridStore)

// Ordenamos por más vendidos primero
const topProducts = ref<any[]>([])

// Cada vez que cambien los productos, actualizamos el carrusel 
//ADemas con filtrado de productos ya sorteados
watch(products, async (list) => {
  // Si no hay lista, limpiar el carrusel
  if (!Array.isArray(list) || list.length === 0) {
    topProducts.value = []
    return
  }

  // Pedir progreso real (si procede)
  for (const p of list) {
    if (p && p.uuid) {
      // no await aquí para lanzar todas las peticiones en paralelo desde el store
      gridStore.fetchProductProgress(p.uuid)
    }
  }

  // Filtrar rifas que *NO* queremos mostrar:
  // - status que indique 'sorteado' / 'completed' / 'finalizado' (case-insensitive)
  // - rifas cuya drawDate ya haya pasado
  // - rifas agotadas (ticketsVendidos >= ticketsMax) — opcional según tu lógica
  const now = Date.now()
  const filtered = list.filter((p: any) => {
    if (!p || !p.uuid) return false

    // 1) status textual
    const st = (p.status ?? '').toString().toLowerCase().trim()
    const badStatuses = ['sorteado', 'completed', 'finalizado', 'closed', 'finished']
    if (st && badStatuses.includes(st)) return false

    // 2) fecha de sorteo en el pasado
    const draw = p.drawDate || p.raffle_date || p.raffleDate
    if (draw) {
      const d = new Date(draw)
      if (!Number.isNaN(d.getTime()) && d.getTime() < now) return false
    }

    // 3) agotada (ticketsVendidos >= ticketsMax) — si tienes ticketsMax reliable
    if (typeof p.ticketsMax !== 'undefined' && typeof p.ticketsVendidos !== 'undefined') {
      const max = Number(p.ticketsMax) || Infinity
      const sold = Number(p.ticketsVendidos) || 0
      if (sold >= max) return false
    }

    return true
  })

  // Ordenar por más vendidos (si ticketsVendidos aún es null, lo tratamos como 0)
  topProducts.value = [...filtered].sort((a, b) => (Number(b.ticketsVendidos) || 0) - (Number(a.ticketsVendidos) || 0))

}, { immediate: true, deep: true })
// ----------------- FIN DEL WATCH -----------------


// 🔥 funciones que **ya existen** visualmente en tu carrusel
const productProgress = (item: any) => {
  if (!item.ticketsVendidos || !item.ticketsMax) return 0
  return Math.min(100, (item.ticketsVendidos / item.ticketsMax) * 100)
}

const productAlmostSoldOut = (item: any) => productProgress(item) > 80 && productProgress(item) < 100
const isHot = (item: any) => productProgress(item) > 75 && productProgress(item) < 100
const isSoldOut = (item: any) => productProgress(item) === 100

// Modales
const showForm = ref(false)
const showConfirm = ref(false)
const showDetails = ref(false)
const showJackpot = ref(false)

const selectedProduct = ref<any | null>(null)
const userInitialTickets = ref(0)
const purchasedTicketsCount = ref(0)

function openDetails(product: any) {
  selectedProduct.value = product
  showDetails.value = true
}

function openParticipateModal(product: any) {
  showDetails.value = false
  gridStore.openParticipateModal(product) // ✅ Ya selecciona y abre
}

const handleConfirmed = (data?: { initialTickets: number; purchasedTickets: number }) => {
  showForm.value = false
  userInitialTickets.value = data?.initialTickets ?? 0
  purchasedTicketsCount.value = data?.purchasedTickets ?? 0
  showConfirm.value = true
}

const handleShowJackpot = () => {
  showConfirm.value = false
  showJackpot.value = true
}

const handleJackpotClose = () => {
  showJackpot.value = false
}

// Timer
const now = ref(Date.now())
let interval: any = null
onMounted(() => interval = setInterval(() => now.value = Date.now(), 1000))
onUnmounted(() => clearInterval(interval))

const timeLeft = (item: any) => {
  const drawDate = item.drawDate || '2025-12-01T23:59:59'
  const diff = new Date(drawDate).getTime() - now.value
  if (diff < 0) return { total: 0 }

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000) % 24
  const minutes = Math.floor(diff / 60000) % 60
  const seconds = Math.floor(diff / 1000) % 60
  return { total: diff, days, hours, minutes, seconds }
}
</script>


<style scoped>
.casino-carousel {
  box-shadow: 0 0 32px 8px #30058d33, 0 0 12px 4px #003366aa;
  border-radius: 1.5rem;
}
.casino-title {
  text-shadow: 0 2px 8px #7700ff99;
  animation: casinoTitlePulse 2s infinite alternate;
}
@keyframes casinoTitlePulse {
  0% { text-shadow: 0 2px 8px #ffd70099; }
  100% { text-shadow: 0 4px 16px #00ff0099; }
}
.casino-bar {
  animation: casinoBarGlow 2s infinite alternate;
}
@keyframes casinoBarGlow {
  0% { box-shadow: 0 0 6px 2px #ffd70077; }
  100% { box-shadow: 0 0 14px 4px #ff660077; }
}
.casino-btn {
  transition: all 0.3s ease-in-out;
}
.casino-btn:hover {
  transform: translateY(-2px);
}
.casino-card {
  transition: all 0.4s ease-in-out;
}
.casino-card:hover {
  box-shadow: 0 0 20px #ffd70066, 0 0 40px #ff660044;
  transform: translateY(-3px);
}
.casino-img {
  filter: drop-shadow(0 0 6px #ffd70088);
}
.casino-float {
  position: absolute;
  animation: floatCasino 8s linear infinite;
}
@keyframes floatCasino {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
  100% { transform: translateY(-40px) scale(1); opacity: 0.3; }
}
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
</style>