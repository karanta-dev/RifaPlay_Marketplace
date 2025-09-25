
<template>
  <div
    class="relative w-full overflow-hidden"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Slides container -->
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(banner, i) in banners"
        :key="i"
        class="min-w-full flex items-center justify-center relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-6 sm:px-20 py-6 sm:py-12 shadow-lg"
      >
        <!-- Floating icons background -->
        <div class="absolute inset-0 pointer-events-none">
          <i
            v-for="n in 10"
            :key="`star-${i}-${n}`"
            class="fas fa-star text-yellow-400 opacity-40 animate-float"
            :style="randomStyle(n)"
          ></i>
        </div>

        <!-- Content -->
        <img
          :src="banner.image"
          alt="Banner image"
          class="h-28 sm:h-40 w-auto sm:mr-8 mb-4 sm:mb-0 relative z-10"
        />
        <div
          class="flex flex-col items-center sm:items-start flex-1 relative z-10 text-center sm:text-left"
        >
          <h1
            class="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-2 sm:mb-4 tracking-tight drop-shadow-lg"
          >
            {{ banner.title }}
          </h1>
          <p
            class="text-white mb-3 sm:mb-4 max-w-xl mx-auto sm:mx-0 text-xs sm:text-base"
          >
            {{ banner.text }}
          </p>

          <div
            class="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4"
          >
            <button
              class="bg-blue-600 hover:bg-yellow-400 hover:text-blue-900 text-white px-6 sm:px-8 py-2 rounded-xl font-bold text-sm sm:text-base shadow-lg transition w-full sm:w-auto"
            >
              {{ banner.button1 }}
            </button>
            <button
              class="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 rounded-xl font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 w-full sm:w-auto"
            >
              {{ banner.button2 }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation dots -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
      <button
        v-for="(b, i) in banners"
        :key="i"
        class="w-3 h-3 rounded-full"
        :class="i === currentIndex ? 'bg-yellow-400' : 'bg-white/40'"
        @click="goToSlide(i)"
      ></button>
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
@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  50% {
    transform: translateY(-40px) translateX(30px);
    opacity: 0.4;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(-40px);
    opacity: 0;
  }
}
.animate-float {
  position: absolute;
  animation: float linear infinite;
}
</style>
