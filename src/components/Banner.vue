<template>
  <div class="w-full max-w-7xl mx-auto relative overflow-hidden casino-banner" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <!-- Fondo casino animado -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-yellow-900 opacity-80 pointer-events-none"></div>
    <!-- Floating casino icons -->
    <div class="absolute inset-0 pointer-events-none">
      <i v-for="n in 4" :key="`coin-${n}`" class="fas fa-coins text-yellow-400 casino-float" :style="randomStyle(n)"></i>
      <i v-for="n in 2" :key="`dice-${n}`" class="fas fa-dice text-green-400 casino-float" :style="randomStyle(n+10)"></i>
      <i v-for="n in 2" :key="`ticket-${n}`" class="fas fa-ticket-alt text-orange-400 casino-float" :style="randomStyle(n+20)"></i>
      <i v-for="n in 6" :key="`star-${n}`" class="fas fa-star text-yellow-300 opacity-30 casino-float" :style="randomStyle(n+30)"></i>
    </div>
    <!-- Slides container -->
    <div class="flex transition-transform duration-700 ease-in-out relative z-10" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(banner, i) in banners" :key="i" class="min-w-full flex items-center justify-center relative px-6 sm:px-20 py-4 sm:py-12 shadow-lg rounded-xl">
        <!-- Content -->
        <div class="flex flex-col sm:flex-row items-center justify-center w-full text-center">
          <img :src="banner.image" alt="Banner image" class="h-28 sm:h-40 w-auto sm:mr-8 mb-4 sm:mb-0 relative z-10 casino-img" />
          <div class="flex flex-col items-center justify-center flex-1 relative z-10 text-center">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2 sm:mb-4 tracking-tight drop-shadow-lg casino-title">
              <i class="fas fa-dice text-green-400 mr-2"></i>
              {{ banner.title }}
            </h1>
            <p class="text-yellow-100 mb-3 sm:mb-4 max-w-xl mx-auto text-xs sm:text-base font-semibold casino-desc">
              {{ banner.text }}
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <button class="bg-gradient-to-r from-yellow-400 via-blue-700 to-green-600 text-white px-6 sm:px-8 py-2 rounded-xl font-extrabold text-sm sm:text-base shadow-xl casino-btn transition w-full sm:w-auto">
                <i class="fas fa-ticket-alt mr-2"></i>
                {{ banner.button1 }}
              </button>
              <button class="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 rounded-xl font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 w-full sm:w-auto">
                <i class="fas fa-coins mr-2"></i>
                {{ banner.button2 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation dots -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
      <button v-for="(b, i) in banners" :key="i" class="w-3 h-3 rounded-full" :class="i === currentIndex ? 'bg-yellow-400' : 'bg-white/40'" @click="goToSlide(i)"></button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const currentIndex = ref(0)
const banners = ref([
  {
    title: "¡JUEGA, GANA Y CELEBRA!",
    text: "Recarga (1 USD) y obtén (1000) créditos para ganar tickets.",
    image: "/slot.png",
    button1: "¡PARTICIPAR!",
    button2: "RECARGAR $",
  },
  {
    title: "Categorías destacadas",
    text: "Descubre rifas de autos, tecnología, viajes y más.",
    image: "/slot.png",
    button1: "EXPLORAR",
    button2: "VER MÁS",
  },
  {
    title: "Promociones especiales",
    text: "Aprovecha ofertas exclusivas y duplica tus tickets.",
    image: "/slot.png",
    button1: "APROVECHAR",
    button2: "DETALLES",
  },
])

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
  box-shadow: 0 0 32px 8px #ffd70033, 0 0 8px 2px #00336699;
  border-radius: 1.5rem;
}
.casino-title {
  text-shadow: 0 2px 8px #ffd70099;
  animation: casinoTitlePulse 2s infinite alternate;
}
@keyframes casinoTitlePulse {
  0% { text-shadow: 0 2px 8px #ffd70099; }
  100% { text-shadow: 0 4px 16px #00ff0099; }
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
</style>
