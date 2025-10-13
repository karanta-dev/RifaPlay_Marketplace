<template>
  <div class="w-full max-w-7xl mx-auto relative overflow-hidden casino-banner">
    
    <div class="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 opacity-80 pointer-events-none"></div>
    
    <div class="absolute inset-0 pointer-events-none">
      <!-- Iconos flotantes del casino -->
      <i v-for="n in 4" v-bind:key="`coin-${n}`" class="fas fa-coins text-yellow-400 casino-float" v-bind:style="randomStyle(n)"></i>
      <i v-for="n in 2" v-bind:key="`dice-${n}`" class="fas fa-dice text-green-400 casino-float" v-bind:style="randomStyle(n+10)"></i>
      <i v-for="n in 2" v-bind:key="`ticket-${n}`" class="fas fa-ticket-alt text-orange-400 casino-float" v-bind:style="randomStyle(n+20)"></i>
      <i v-for="n in 6" v-bind:key="`star-${n}`" class="fas fa-star text-yellow-300 opacity-30 casino-float" v-bind:style="randomStyle(n+30)"></i>
    </div>
    
    <div 
      class="flex transition-transform duration-700 ease-in-out relative z-10" 
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @touchstart="handleTouchStart" 
      @touchend="handleTouchEnd"
    >
<div v-for="(banner, i) in banners" :key="i" 
     class="min-w-full flex items-center justify-center relative px-2 sm:px-20 py-0 sm:py-6 shadow-lg rounded-xl"
     @click="i === 0 ? openRoulette() : null"
     :class="{ 'cursor-pointer': i === 0 }">
    <div 
      :class="[i === 1 || i === 2 
        ? 'sm:flex-row-reverse text-left flex-col-reverse' // Invertir orden en móvil y usar flex-row-reverse en desktop
        : 'sm:flex-row text-center flex-col' // Orden normal en móvil y desktop
      ]"
      class="flex flex-col items-center justify-between w-full"
    >
      
       <div class="flex flex-row items-center justify-between w-full gap-4">
  
  <!-- Imagen a la izquierda -->
  <div class="flex-shrink-0">
<img
  :src="banner.image"
  alt="Banner image"
  class="h-28 sm:h-52 sm:-mr-2 sm:-mb-8 w-auto relative z-10 casino-img"
/>
  </div>
  
  <!-- Texto a la derecha -->
  <div class="flex flex-col justify-center text-left flex-1">
    <h1 class="text-lg font-extrabold text-yellow-400 mb-1 sm:mb-4 tracking-tight drop-shadow-lg casino-title sm:text-4xl">
      <i class="fas fa-dice text-green-400 mr-2" v-if="i === 0"></i>
      {{ banner.title }}
    </h1>
    
    <p class="text-yellow-100 font-semibold casino-desc text-xs sm:text-base">
      {{ banner.text }}
    </p>
  </div>
</div>
    </div>
    
</div>
    </div>
    
    <div class="absolute bottom-1 left-0 right-0 flex justify-center gap-1 z-20">
      <button v-for="(b, i) in banners" :key="i" class="w-3 h-3 rounded-full" :class="i === currentIndex ? 'bg-yellow-400' : 'bg-white/40'" @click="goToSlide(i)"></button>
    </div>
  </div>

  <!-- MODALES COMPLETOS -->
  <RouletteModal :isOpen="showRoulette" @close="showRoulette = false" @categoryPicked="handleCategoryPicked" />
  
  <ProductModal 
    :isOpen="showProduct" 
    :category="selectedCategory" 
    @close="showProduct = false" 
    @participar="handleProductModalParticipar" 
  />
  
  <!-- FLUJO COMPLETO DE COMPRA -->
  <ParticiparModal
    :open="showParticipar"
    :product="selectedProduct"
    @close="handleParticiparClose"
    @confirmed="handleParticiparConfirmed"
  />
  
  <ConfirmacionModal
    :open="showConfirmacion"
    @close="showConfirmacion = false"
    @showJackpot="handleShowJackpot"
  />
  
  <JackpotAnimation
    :show="showJackpot"
    :initial-tickets="userInitialTickets"
    :purchased-tickets="purchasedTicketsCount"
    @close="handleJackpotClose"
  />


</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useTicketStore } from '@/stores/useTicketStore'
import { useAuthStore } from '@/stores/useAuthStore'

// Importar todos los modales
import RouletteModal from "./RouletteModal.vue"
import ProductModal from "./ProductModal.vue"
import ParticiparModal from "./ParticipateModal.vue"
import ConfirmacionModal from "./ConfirmationModal.vue"
import JackpotAnimation from "./JackpotAnimation.vue"

const ticketStore = useTicketStore()
const authStore = useAuthStore()

// Estados para los modales
const showRoulette = ref(false)
const showProduct = ref(false)
const showParticipar = ref(false)
const showConfirmacion = ref(false)
const showJackpot = ref(false)

// Datos para el flujo
const selectedCategory = ref("")
const selectedProduct = ref(null)
const userInitialTickets = ref(0)
const purchasedTicketsCount = ref(0)

// Banner carousel
const currentIndex = ref(0)
const banners = ref([
  //banner 1
  {
    title: "¡JUEGA, GANA Y CELEBRA!",
    text: "¿Quiere probar su suerte?, nosotros escogemos una rifa por usted, clickee aqui.",
    image: "/persona3.png",
    button1: "¡PARTICIPAR!",
    button2: "", // Eliminado el botón
  },
  {
    // Banner 2
    title: "¡Empieza a ganar con nosotros!",
    text: "Participa en cualquiera de nuestras rifas y gana premios increíbles.",
    image: "/persona.png",
    button1: "",
    button2: "",
  },
  {
    // Banner 3
    title: "Promociones especiales en RifaPlay",
    text: "Aprovecha ofertas, promos exclusivas y duplica tus tickets.",
    image: "/persona2.png",
    button1: "",
    button2: "",
  },
])

// --- FLUJO DE MODALES COMPLETO ---

// 1. Abrir ruleta desde el banner
function openRoulette() {
  showRoulette.value = true
}

// 2. Categoría seleccionada desde la ruleta
function handleCategoryPicked(category) {
  selectedCategory.value = category
  showRoulette.value = false
  showProduct.value = true
}

// 3. Participar desde ProductModal
function handleProductModalParticipar(product) {
  console.log("Abrir modal participar desde ProductModal:", product.title)
  showProduct.value = false
  selectedProduct.value = product
  showParticipar.value = true
}

// 4. Cerrar ParticiparModal
function handleParticiparClose() {
  showParticipar.value = false
  // Opcional: resetear el store si es necesario
  // ticketStore.reset()
}

// 5. Confirmación de compra desde ParticiparModal
function handleParticiparConfirmed(data) {
  console.log("✅ Compra confirmada:", data)
  showParticipar.value = false
  
  // Calcular tickets para el jackpot
  if (data && data.initialTickets !== undefined) {
    // Usar datos proporcionados por ParticiparModal
    userInitialTickets.value = data.initialTickets
    purchasedTicketsCount.value = data.purchasedTickets
  } else {
    // Calcular basado en el store actual
    userInitialTickets.value = getUserInitialTickets()
    purchasedTicketsCount.value = getPurchasedTicketsCount()
  }
  
  console.log("🎰 Datos para jackpot:", {
    initial: userInitialTickets.value,
    purchased: purchasedTicketsCount.value
  })
  
  // Mostrar confirmación
  showConfirmacion.value = true
}

// 6. Mostrar jackpot desde ConfirmacionModal
function handleShowJackpot() {
  console.log("🎯 Mostrando jackpot...")
  showConfirmacion.value = false
  showJackpot.value = true
}

// 7. Cerrar jackpot
function handleJackpotClose() {
  console.log("🎯 Cerrando jackpot...")
  showJackpot.value = false
  // Resetear para próxima compra
  setTimeout(() => {
    ticketStore.reset()
    selectedProduct.value = null
  }, 500)
}

// --- FUNCIONES AUXILIARES ---

// Calcular tickets iniciales del usuario
const getUserInitialTickets = () => {
  const userId = authStore.user?.id
  
  if (userId) {
    const currentCount = ticketStore.userTicketsCount(userId)
    const justPurchased = ticketStore.lastAssignedTickets?.length || 0
    return Math.max(0, currentCount - justPurchased)
  }
  
  const currentNullTickets = ticketStore.tickets.filter(t => t.userId === null).length
  const justPurchased = ticketStore.lastAssignedTickets?.length || 0
  return Math.max(0, currentNullTickets - justPurchased)
}

// Calcular tickets comprados
const getPurchasedTicketsCount = () => {
  return ticketStore.lastAssignedTickets?.length || 
         (ticketStore.ticketNumber ? 1 : 0) ||
         Number(ticketStore.formData?.tickets) || 1
}

// --- Autoplay control ---
let interval = null
const startAutoplay = () => {
  stopAutoplay()
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length
  }, 4000)
}
const stopAutoplay = () => {
  if (interval) clearInterval(interval)
}

const goToSlide = (index) => {
  currentIndex.value = index
  startAutoplay() // Reinicia el autoplay al cambiar manualmente
}

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())

// --- Swipe control ---
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}
const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}
const handleSwipe = () => {
  if (touchEndX < touchStartX - 50) {
    // Swipe left
    currentIndex.value = (currentIndex.value + 1) % banners.value.length
    startAutoplay()
  }
  if (touchEndX > touchStartX + 50) {
    // Swipe right
    currentIndex.value =
      (currentIndex.value - 1 + banners.value.length) % banners.value.length
    startAutoplay()
  }
}

// --- Floating icons ---
const randomStyle = (n) => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const duration = 8 + Math.random() * 12
  const delay = Math.random() * -15
  const size = 24 + Math.random() * 32

  return `
    top: ${top}%;
    left: ${left}%;
    font-size: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
  `
}
</script>

<style scoped>
.casino-banner {
  box-shadow: 0 0 32px 8px #31049a33, 0 0 8px 2px #00336699;
  border-radius: 1.5rem;
}
.casino-title {
  text-shadow: 0 2px 8px #ffd70099;
  animation: casinoTitlePulse 2s infinite alternate;
}
@keyframes casinoTitlePulse {
  0% { text-shadow: 0 2px 8px #ffd70099; }
  100% { text-shadow: 0 4px 16px #5d00ff99; }
}
.casino-desc {
  text-shadow: 0 1px 4px #00336699;
}
.casino-btn {
  animation: casinoBtnPulse 1.2s infinite alternate;
}
@keyframes casinoBtnPulse {
  0% { box-shadow: 0 0 8px 2px #ffd70099; }
  100% { box-shadow: 0 0 16px 4px #00ff0099; }
}
.casino-float {
  position: absolute;
  animation: floatCasino 8s linear infinite;
}
@keyframes floatCasino {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
  100% { transform: translateY(-40px) scale(1); opacity: 0.3; }
}
.casino-img {
  filter: drop-shadow(0 0 12px #ffd70088);
}

/* Animación especial para la rueda aleatoria */
.casino-img:hover {
  animation: wheelSpin 2s ease-in-out;
}

@keyframes wheelSpin {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@media (max-width: 640px) {
  .casino-title {
    font-size: 0.775rem; /* Equivalent to Tailwind's text-sm */
    line-height: 1.25rem; /* Equivalent to Tailwind's leading-5 */
  }
  .casino-desc {
    font-size: 0.75rem; /* text-sm */
  }
  .casino-banner {
    border-radius: 1rem;
  }
}
</style>