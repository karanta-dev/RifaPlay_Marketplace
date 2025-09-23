<script setup lang="ts">
import { useTicketStore } from '@/stores/useTicketStore'

const ticketStore = useTicketStore()
</script>

<template>
  <nav
    class="bg-blue-800 shadow flex items-center justify-between px-8 py-4 "
  >
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <span class="flex items-center gap-2">
        <img src="/rifaLogo.png" alt="Logo" class="h-20 w-auto drop-shadow-lg" />
      </span>
    </div>

    <!-- Contenedor Rifas + Tickets -->
    <div class="flex items-center gap-6">
      <span class="text-yellow-400 font-bold text-2xl">Rifas</span>

      <div
        class="bg-green-900 px-12 py-3 rounded-full flex flex-col items-center shadow-lg border-4 border-yellow-400"
      >
        <!-- Número dinámico -->
        <span
          class="text-3xl font-extrabold text-yellow-400 tracking-wide w-full text-center"
        >
          {{ ticketStore.ticketsVendidos.toLocaleString() }}
        </span>
        <span
          class="text-xs text-white font-semibold w-full text-center uppercase"
        >
          Tickets Comercializadas
        </span>
      </div>
    </div>

    <!-- Botón con ícono usuario -->
    <button
      class="bg-white-400 text-blue-900 font-bold px-5 py-2 rounded-xl shadow hover:bg-yellow-300 transition flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 text-blue-900"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a3 3 0 110 6 3 3 0 010-6zm-6.93 13c.64-2.47 3.02-4 6.93-4s6.29 1.53 6.93 4H5.07z"
          clip-rule="evenodd"
        />
      </svg>
      Iniciar sesión
    </button>
  </nav>
</template>
