<template>
  <nav class="bg-gradient-to-r from-blue-950 via-blue-900 to-yellow-900 shadow-xl flex items-center justify-between px-4 sm:px-8 py-2 casino-navbar relative">
    <!-- Iconos casino flotantes -->
    <i class="fas fa-coins text-yellow-400 absolute left-4 top-2 opacity-30 text-lg casino-float"></i>
    <i class="fas fa-dice text-green-400 absolute right-4 top-2 opacity-30 text-lg casino-float"></i>
    <div class="flex items-center gap-3 cursor-pointer" @click="goHome">
      <span class="flex items-center gap-2">
        <img src="/rifaLogo.png" alt="Logo" class="h-16 sm:h-20 w-auto drop-shadow-lg casino-logo" />
      </span>
    </div>
    <div class="flex items-center gap-3 sm:gap-6">
      <span class="text-yellow-400 font-bold text-lg sm:text-2xl hidden sm:inline">Rifas</span>
      <div class="bg-blue-900 px-4 sm:px-12 py-2 sm:py-3 rounded-full flex flex-col items-center shadow-lg border-4 border-yellow-400 casino-counter">
        <span class="text-xl sm:text-3xl font-extrabold text-yellow-400 tracking-wide w-full text-center animate-casino-count">
          <i class="fas fa-ticket-alt mr-1"></i>
          {{ ticketStore.ticketsVendidos.toLocaleString() }}
        </span>
        <span class="text-xs text-white font-semibold w-full text-center uppercase">
          Tickets vendidos
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <!-- Lupa visible solo en desktop -->
      <button class="hidden sm:flex flex-col items-center text-sm text-white hover:text-yellow-400 bg-transparent focus:outline-none casino-btn" @click="goSearch">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <!-- Botón iniciar sesión -->
      <button class="bg-white text-blue-900 font-bold px-3 sm:px-5 py-2 rounded-xl shadow-xl hover:bg-yellow-300 transition flex items-center gap-1 sm:gap-2 casino-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
        <span class="hidden sm:inline">Iniciar sesión</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useTicketStore } from '@/stores/useTicketStore'
import { useRouter } from "vue-router";

const router = useRouter();

const ticketStore = useTicketStore()

const goSearch = () => {
  router.push({ name: "search" });
};
const goHome = () => {
  router.push({ name: "home" });
};

</script>

<style scoped>
.casino-navbar {
  box-shadow: 0 0 24px 4px #ffd70033, 0 0 8px 2px #00336699;
}
.casino-title {
  text-shadow: 0 2px 8px #ffd70099;
  animation: casinoTitlePulse 2s infinite alternate;
}
@keyframes casinoTitlePulse {
  0% { text-shadow: 0 2px 8px #ffd70099; }
  100% { text-shadow: 0 4px 16px #00ff0099; }
}
.casino-logo {
  filter: drop-shadow(0 0 12px #ffd70088);
}
.casino-counter {
  box-shadow: 0 0 12px 2px #ffd70055;
}
.animate-casino-count {
  animation: casinoCountPulse 1.2s infinite alternate;
}
@keyframes casinoCountPulse {
  0% { color: #ffd700; }
  100% { color: #fffbe6; }
}
.casino-btn {
  animation: casinoBtnPulse 1.2s infinite alternate;
}
@keyframes casinoBtnPulse {
  0% { box-shadow: 0 0 8px 2px #ffd70099; }
  100% { box-shadow: 0 0 16px 4px #00ff0099; }
}
.casino-float {
  animation: floatCasino 8s linear infinite;
}
@keyframes floatCasino {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 0.5; }
  100% { transform: translateY(-20px) scale(1); opacity: 0.3; }
}
</style>
