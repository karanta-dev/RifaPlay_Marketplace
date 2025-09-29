<template>
  <!-- Mobile Navigation Bar -->
  <nav
    :class="[
      'fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-950 via-blue-900 to-yellow-900 text-white shadow-xl sm:hidden transition-transform duration-300 z-40 casino-mobile-nav',
      isVisible ? 'translate-y-0' : 'translate-y-full'
    ]"
  >
    <!-- Iconos casino flotantes -->
    <i class="fas fa-coins text-yellow-400 absolute left-4 top-2 opacity-30 text-lg casino-float"></i>
    <i class="fas fa-dice text-green-400 absolute right-4 top-2 opacity-30 text-lg casino-float"></i>
    <i class="fas fa-ticket-alt text-orange-400 absolute left-1/2 top-2 opacity-30 text-lg casino-float"></i>
    <div class="flex justify-around items-center py-0">
      <!-- Home -->
      <button
        @click="goHome"
        class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none casino-btn"
      >
        <i class="fas fa-home text-yellow-300 mb-1 text-xl"></i>
        Inicio
      </button>

      <!-- Search -->
      <button
        @click="goSearch"
        class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none casino-btn"
      >
        <i class="fas fa-search text-green-300 mb-1 text-xl"></i>
        Buscar
      </button>

            <!-- Search -->
      <button
        @click="goTickets"
        class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none casino-btn"
      >
        <i class="fas fa-ticket text-green-300 mb-1 text-xl"></i>
        Mis Tickets
      </button>

      <!-- Support -->
      <button class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none casino-btn">
        <i class="fas fa-life-ring text-orange-300 mb-1 text-xl"></i>
        Soporte
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter();
const authStore = useAuthStore();

const isVisible = ref(true);
let lastScrollY = window.scrollY;

const handleScroll = () => {
  if (window.scrollY > lastScrollY) {
    isVisible.value = false;
  } else if (window.scrollY < lastScrollY) {
    isVisible.value = true;
  }
  lastScrollY = window.scrollY;
};

// Métodos de navegación
const goHome = () => {
  router.push({ name: "home" });
};

const goSearch = () => {
  router.push({ name: "search" });
};

const goTickets = () => {
  // Route requires a userId param. If the user is authenticated, use their id.
  // Otherwise fallback to 'guest' so navigation succeeds and the page shows no tickets.
  const userId = authStore.user?.id ?? 'guest'
  router.push({ name: 'my-tickets', params: { userId } });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.casino-mobile-nav {
  box-shadow: 0 0 24px 4px #ffd70033, 0 0 8px 2px #00336699;
}
.casino-btn {
  animation: casinoBtnPulse 1.2s infinite alternate;
}

.casino-float {
  position: absolute;
  animation: floatCasino 8s linear infinite;
}
@keyframes floatCasino {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 0.5; }
  100% { transform: translateY(-20px) scale(1); opacity: 0.3; }
}
</style>
