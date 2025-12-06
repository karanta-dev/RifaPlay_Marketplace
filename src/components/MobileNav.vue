<template>
  <!-- Mobile Navigation Bar -->
  <nav
    :class="[
      'fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 text-white shadow-xl sm:hidden transition-transform duration-300 z-40 casino-mobile-nav',
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

      <!-- Tickets -->
      <button
        @click="goTickets"
        class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none casino-btn"
      >
        <i class="fas fa-ticket text-green-300 mb-1 text-xl"></i>
        Mis Tickets
      </button>

      <!-- Support -->
      <div class="relative">
        <button 
          @click="toggleSupport"
          class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none casino-btn"
        >
          <i class="fas fa-life-ring text-orange-300 mb-1 text-xl"></i>
          Soporte
        </button>

        <!-- Menú desplegable de soporte - Z-INDEX CORREGIDO -->
        <transition name="support-fade">
          <div
            v-if="supportOpen"
            class="fixed bottom-16 left-4 right-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 border border-yellow-400/30 backdrop-blur-sm z-50 mx-auto max-w-sm"
          >
            <!-- Encabezado -->
            <div class="text-center mb-3">
              <h3 class="text-white font-bold text-sm">Soporte</h3>
              <p class="text-gray-300 text-xs">¿Necesitas ayuda?</p>
            </div>

            <!-- Opciones de soporte -->
            <div class="space-y-2">
              <button
                @click="goToSupport"
                class="w-full flex items-center gap-3 p-3 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-colors group border border-gray-600 text-sm"
              >
                <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <i class="fas fa-question-circle text-blue-400 text-sm"></i>
                </div>
                <span class="text-sm font-medium">Centro de Ayuda</span>
              </button>

              <button
                @click="openWhatsApp"
                class="w-full flex items-center gap-3 p-3 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-colors group border border-gray-600 text-sm"
              >
                <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <i class="fab fa-whatsapp text-green-400 text-sm"></i>
                </div>
                <span class="text-sm font-medium">WhatsApp</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Overlay para cerrar soporte - Z-INDEX CORREGIDO -->
    <transition name="fade">
      <div
        v-if="supportOpen"
        class="fixed inset-0 z-40"
        @click="supportOpen = false"
      ></div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter();
const authStore = useAuthStore();

const isVisible = ref(true);
const supportOpen = ref(false);
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
  supportOpen.value = false;
};

const goSearch = () => {
  router.push({ name: "search" });
  supportOpen.value = false;
};

const goTickets = () => {
  const userId = authStore.user?.id ?? 'guest'
  router.push({ name: 'my-tickets', params: { userId } });
  supportOpen.value = false;
};

// Funciones de soporte
const toggleSupport = () => {
  supportOpen.value = !supportOpen.value;
};

const goToSupport = () => {
  supportOpen.value = false;
  alert('Redirigiendo al Centro de Ayuda - Página en desarrollo');
};

const openWhatsApp = () => {
  supportOpen.value = false;
  const message = 'Hola, necesito ayuda con RifaPlay';
  const phoneNumber = '1234567890';
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
};

// Cerrar soporte al presionar Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && supportOpen.value) {
    supportOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener('keydown', handleEscape);
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

/* Animaciones para el menú desplegable */
.support-fade-enter-active,
.support-fade-leave-active {
  transition: all 0.3s ease;
}

.support-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.support-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

/* Animación para el overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>