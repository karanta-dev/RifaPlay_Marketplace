<template>
  <div class="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-4 sm:px-20 py-6 shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-center overflow-hidden">
    <!-- Partículas -->
    <div class="absolute inset-0 pointer-events-none">
      <i
        v-for="n in 10"
        :key="n"
        class="fas fa-star text-yellow-400 opacity-40 animate-float"
        :style="randomStyle(n)"
      ></i>
      <i
        v-for="n in 10"
        :key="'coins'+n"
        class="fas fa-coins text-orange-400 opacity-30 animate-float"
        :style="randomStyle(n)"
      ></i>
      <i
        v-for="n in 10"
        :key="'dice'+n"
        class="fas fa-dice text-green-400 opacity-30 animate-float"
        :style="randomStyle(n)"
      ></i>
    </div>

    <!-- Contenido principal -->
    <img src="/slot.png" alt="Slot" class="h-32 sm:h-48 w-auto sm:mr-8 mb-4 sm:mb-0 relative z-10" />
    <div class="flex flex-col items-center flex-1 relative z-10 text-center">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-4 tracking-tight drop-shadow-lg">
        ¡JUEGA, GANA Y CELEBRA!
      </h1>
      <p class="text-white mb-6 max-w-xl mx-auto text-sm sm:text-lg">
        Recarga <span class="font-bold text-yellow-300">(1 USD)</span> y obtén 
        <span class="font-bold text-orange-400">(1000)</span> créditos para ganar tickets.
      </p>

      <div class="flex justify-center items-center gap-4 mb-2">
        <button class="bg-blue-600 hover:bg-yellow-400 hover:text-blue-900 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg transition">
          ¡PARTICIPAR!
        </button>
        <button class="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2">
          RECARGAR $
          <span class="grid grid-cols-2 grid-rows-2 gap-1 ml-2">
            <i class="fab fa-cc-visa text-white text-base"></i>
            <i class="fab fa-cc-mastercard text-white text-base"></i>
            <i class="fab fa-cc-amex text-white text-base"></i>
            <i class="fab fa-cc-paypal text-white text-base"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
// Genera posiciones y tiempos aleatorios
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
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 0.6; }
  50% { transform: translateY(-40px) translateX(30px); opacity: 0.4; }
  80% { opacity: 0.6; }
  100% { transform: translateY(-100px) translateX(-40px); opacity: 0; }
}

.animate-float {
  position: absolute;
  animation: float linear infinite;
}
</style>
