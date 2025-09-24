<template>
  <nav class="bg-blue-800 shadow flex items-center justify-between px-4 sm:px-8 py-4">
    <div class="flex items-center gap-3">
      <span class="flex items-center gap-2">
        <img src="/rifaLogo.png" alt="Logo" class="h-16 sm:h-20 w-auto drop-shadow-lg" />
      </span>
    </div>

    <div class="flex items-center gap-3 sm:gap-6">
      <span class="text-yellow-400 font-bold text-lg sm:text-2xl hidden sm:inline">Rifas</span>

      <div
        class="bg-green-900 px-4 sm:px-12 py-2 sm:py-3 rounded-full flex flex-col items-center shadow-lg border-4 border-yellow-400"
      >
        <span
          class="text-xl sm:text-3xl font-extrabold text-yellow-400 tracking-wide w-full text-center"
        >
          {{ ticketStore.ticketsVendidos.toLocaleString() }}
        </span>
        <span
          class="text-xs text-white font-semibold w-full text-center uppercase"
        >
          Tickets vendidos
        </span>
      </div>
    </div>

    <button
      class="bg-white text-blue-900 font-bold px-3 sm:px-5 py-2 rounded-xl shadow hover:bg-yellow-300 transition flex items-center gap-1 sm:gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 sm:w-8 sm:h-8"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
        />
      </svg>
      <span class="hidden sm:inline">Iniciar sesion</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useTicketStore } from '@/stores/useTicketStore'
const ticketStore = useTicketStore()
</script>