<template>
  <div class="relative bg-gradient-to-b from-green-100 to-green-200 px-20 py-5 shadow mb-8 flex items-center justify-center overflow-hidden">
    <!-- Partículas -->
    <div class="absolute inset-0 pointer-events-none">
      <i
        v-for="n in 15"
        :key="n"
        class="fas fa-dice text-yellow-500 opacity-30 animate-float"
        :style="randomStyle(n)"
      ></i>
      <i
        v-for="n in 15"
        :key="'slot'+n"
        class="fas fa-clover text-green-500 opacity-30 animate-float"
        :style="randomStyle(n)"
      ></i>
      <i
        v-for="n in 15"
        :key="'cards'+n"
        class="fas fa-chess-knight text-red-500 opacity-30 animate-float"
        :style="randomStyle(n)"
      ></i>
    </div>

    <!-- Contenido principal -->
    <img src="/slot.png" alt="Slot" class="h-48 w-auto mr-8 relative z-10" />
    <div class="flex flex-col items-center flex-1 relative z-10">
      <h1 class="text-4xl font-extrabold text-green-900 mb-4 tracking-tight">¡JUEGA, GANA Y CELEBRA!</h1>
      <p class="text-gray-700 mb-6 max-w-xl mx-auto text-lg">
        Recarga <span class="font-bold text-blue-700">(1 USD)</span> y obtén <span class="font-bold text-orange-500">(1000)</span> créditos para ganar tickets para tus juegos de Rifa.
      </p>
      <div class="flex justify-center items-center gap-4 mb-2">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg">¡PARTICIPAR!</button>
        <div class="flex items-center gap-2">
          <button class="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2">
            RECARGAR $
            <span class="grid grid-cols-2 grid-rows-2 gap-1 ml-2">
              <i class="fab fa-cc-visa text-white text-base"></i>
              <i class="fab fa-cc-mastercard text-white text-base"></i>
              <i class="fab fa-cc-amex text-white text-base"></i>
              <i class="fab fa-cc-paypal text-white text-base"></i>
            </span>
          </button>
          <div class="grid grid-cols-4 grid-rows-2 gap-1 w-32 h-10 items-center">
            <i class="fab fa-cc-visa text-blue-700 text-base"></i>
            <i class="fab fa-cc-mastercard text-red-500 text-base"></i>
            <i class="fab fa-cc-amex text-green-500 text-base"></i>
            <i class="fab fa-cc-paypal text-yellow-500 text-base"></i>
            <i class="fab fa-cc-visa text-blue-700 text-base"></i>
            <i class="fab fa-cc-mastercard text-red-500 text-base"></i>
            <i class="fab fa-cc-amex text-green-500 text-base"></i>
            <i class="fab fa-cc-paypal text-yellow-500 text-base"></i>
          </div>
        </div>
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
