<template>
 <nav
    class="shadow-2xl flex items-center justify-between px-4 sm:px-8 py-1 casino-navbar relative z-40"
    :class="{
      'bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800': !colorStore.isRiferoPage
    }"
    :style="colorStore.isRiferoPage ? { 
      backgroundColor: colorStore.navbarBg,
      'box-shadow': `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px ${colorStore.primary}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
    } : {}"
  >

    <!-- Iconos casino flotantes -->
    <i
      class="fas fa-coins text-yellow-400 absolute left-4 top-2 opacity-30 text-lg casino-float"
    ></i>
    <i
      class="fas fa-dice text-green-400 absolute right-4 top-2 opacity-30 text-lg casino-float"
    ></i>

    <!-- Logo -->
    <div class="flex items-center gap-3 cursor-pointer" @click="goHome">
      <span class="flex items-center gap-2">
        <img
          src="/rifaLogo.png"
          alt="Logo"
          class="h-14 sm:h-20 w-auto drop-shadow-lg casino-logo"
        />
      </span>
    </div>

    <!-- Contador tickets -->
    <div class="flex items-center gap-4 z-10">
      <!-- Contador Jackpot -->
      <div 
        class="casino-jackpot" 
        v-if="authStore.isAuthenticated"
        :class="{
          'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500': !colorStore.isRiferoPage
        }"
        :style="colorStore.isRiferoPage ? {
          background: `linear-gradient(135deg, ${colorStore.primary}20 0%, ${colorStore.secondary}20 50%, ${colorStore.primary}30 100%)`,
          border: `1px solid ${colorStore.primary}30`,
          'box-shadow': `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px ${colorStore.primary}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
        } : {}"
      >
        <JackpotCounter :value="ticketStore.userTicketsCount(authStore.user?.id ?? 0)" />
      </div>
    </div>

    <!-- Botón búsqueda + autenticación -->
    <div class="flex items-center gap-3">
      <!-- Botón de búsqueda -->
      <button
        class="hidden sm:flex items-center gap-2 px-4 py-4 rounded-xl transition-all duration-300 group"
        :class="{
          'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30': !colorStore.isRiferoPage
        }"
        :style="colorStore.isRiferoPage ? {
          background: `${colorStore.buttonBg}20`,
          border: `1px solid ${colorStore.buttonBg}30`,
        } : {}"
        @mouseenter="hoverSearch = true"
        @mouseleave="hoverSearch = false"
        @click="goSearch"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transition-transform"
          :class="{
            'text-yellow-400': !colorStore.isRiferoPage
          }"
          :style="colorStore.isRiferoPage ? { 
            color: hoverSearch ? colorStore.buttonBg : colorStore.textPrimary 
          } : {}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span 
          class="font-semibold text-sm hidden lg:inline"
          :class="{
            'text-yellow-400': !colorStore.isRiferoPage
          }"
          :style="colorStore.isRiferoPage ? { 
            color: hoverSearch ? colorStore.buttonBg : colorStore.textPrimary 
          } : {}"
        >BUSCAR</span>
      </button>
      
      <!-- Si no está logueado -->
      <button
        v-if="!authStore.isAuthenticated"
        @click="showAuthModal = true"
        class="font-bold px-3 sm:px-5 py-2 rounded-xl shadow-xl transition flex items-center gap-1 sm:gap-2 casino-btn"
        :class="{
          'bg-white text-blue-900 hover:bg-yellow-300': !colorStore.isRiferoPage
        }"
        :style="colorStore.isRiferoPage ? {
          backgroundColor: colorStore.buttonBg,
          color: colorStore.buttonText,
          boxShadow: `0 0 16px ${colorStore.buttonBg}40`
        } : {}"
        @mouseenter="hoverAuth = true"
        @mouseleave="hoverAuth = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 sm:w-8 sm:h-8"
          viewBox="0 0 24 24"
          :fill="colorStore.isRiferoPage ? colorStore.buttonText : 'currentColor'"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
          />
        </svg>
        <span class="hidden sm:inline">Iniciar sesión</span>
      </button>

      <!-- Si ya está logueado -->
      <div v-else class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="focus:outline-none bg-transparent p-0 border-none shadow-none group z-50"
        >
          <img
            :src="userAvatar" 
            alt="avatar"
            class="w-12 h-12 rounded-full border-2 shadow-md transition duration-300"
            :class="{
              'border-yellow-400 group-hover:shadow-[0_0_16px_4px_rgba(255,215,0,0.8)]': !colorStore.isRiferoPage
            }"
            :style="colorStore.isRiferoPage ? {
              borderColor: colorStore.primary,
              boxShadow: showDropdown ? `0 0 16px 4px ${colorStore.primary}80` : '',
            } : {}"
          />
        </button>

        <!-- Menú desplegable -->
        <transition name="fade">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-2 z-[9999] border"
            :class="{
              'bg-white border-gray-200': !colorStore.isRiferoPage
            }"
            :style="colorStore.isRiferoPage ? {
              backgroundColor: colorStore.cardBg,
              borderColor: colorStore.primary + '20',
              boxShadow: `0 10px 40px rgba(0,0,0,0.2), 0 0 20px ${colorStore.primary}20`
            } : {}"
          >
            <button
              @click="goMyTickets"
              class="block w-full text-left px-4 py-2 transition-colors duration-150"
              :class="{
                'text-gray-800 hover:bg-blue-100': !colorStore.isRiferoPage
              }"
              :style="colorStore.isRiferoPage ? {
                color: colorStore.textSecondary,
                '&:hover': {
                  backgroundColor: colorStore.primary + '10'
                }
              } : {}"
            >
              Mis tickets
            </button>
            <button
              @click="goProfile"
              class="block w-full text-left px-4 py-2 transition-colors duration-150"
              :class="{
                'text-gray-800 hover:bg-blue-100': !colorStore.isRiferoPage
              }"
              :style="colorStore.isRiferoPage ? {
                color: colorStore.textSecondary,
                '&:hover': {
                  backgroundColor: colorStore.primary + '10'
                }
              } : {}"
            >
              Ver mi perfil
            </button>
            <button
              @click="authStore.logout"
              class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition-colors duration-150"
            >
              Cerrar sesión
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Modal de autenticación -->
    <Authentication v-if="showAuthModal" @close="showAuthModal = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { useTicketStore } from "@/stores/useTicketStore";
import { useAuthStore } from "@/stores/useAuthStore"; 
import { useColorStore } from "@/stores/useColorStore";
import Authentication from "@/components/Authentication.vue"; 
import JackpotCounter from "@/components/JackpotCounter.vue";

const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const colorStore = useColorStore();

const dropdownRef = ref<HTMLElement | null>(null);
const showDropdown = ref(false);
const showAuthModal = ref(false);
const hoverSearch = ref(false);
const hoverAuth = ref(false);

const goSearch = () => {
  router.push({ name: "search" });
};

const goHome = () => {
  router.push({ name: "home" });
};

const goProfile = () => {
  if (authStore.user?.id) {
    router.push({ name: 'my-profile', params: { userId: authStore.user.id } });
    showDropdown.value = false;
  }
};

const goMyTickets = () => {
  if (authStore.user?.id) {
    router.push({ name: 'my-tickets', params: { userId: authStore.user.id } });
    showDropdown.value = false;
  }
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Detectar clic fuera del dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

const userAvatar = computed(() => {
  return authStore.userPhoto || '/default-avatar.png';
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
    colorStore.setRiferoPage(true);

});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
    colorStore.setRiferoPage(false);

});
</script>

<style scoped>
/* Asegurar que el menú desplegable esté por encima de todo */
.absolute {
  position: absolute;
}

.z-\[9999\] {
  z-index: 9999 !important;
}

/* Mejorar la transición del dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilos específicos para el dropdown */
.casino-navbar {
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 40;
}

.casino-navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent);
}

.casino-title {
  text-shadow: 0 2px 8px #001fa899;
  animation: casinoTitlePulse 2s infinite alternate;
}

@keyframes casinoTitlePulse {
  0% {
    text-shadow: 0 2px 8px #7700ffca;
  }
  100% {
    text-shadow: 0 4px 16px #2f00ff99;
  }
}

.casino-logo {
  filter: drop-shadow(0 0 12px #a200ff88);
}

.casino-counter {
  box-shadow: 0 0 14px 2px #2507a955;
}

.animate-casino-count {
  animation: casinoCountPulse 1.2s infinite alternate;
}

@keyframes casinoCountPulse {
  0% {
    color: #ffd700;
  }
  100% {
    color: #fffbe6;
  }
}

.casino-btn {
  animation: casinoBtnPulse 1.2s infinite alternate;
}

@keyframes casinoBtnPulse {
  0% {
    box-shadow: 0 0 8px 2px #7700ff99;
  }
  100% {
    box-shadow: 0 0 16px 4px #4000ff99;
  }
}

.casino-float {
  animation: floatCasino 8s linear infinite;
}

@keyframes floatCasino {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-20px) scale(1);
    opacity: 0.3;
  }
}

/* Bloque envolvente del jackpot dentro del navbar */
.casino-jackpot {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%);
  border-radius: 12px;
  padding: 8px 15px;
  border: 1px solid rgba(49, 0, 227, 0.3);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 200px;
  position: relative;
  overflow: hidden;
}

.casino-jackpot::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shimmer 3s infinite;
}

/* Brillo suave estilo casino */
@keyframes casinoGlow {
  0% { box-shadow: 0 0 16px 4px rgba(47, 0, 255, 0.35), inset 0 0 8px rgba(255,255,255,0.1); }
  100% { box-shadow: 0 0 24px 6px rgba(157, 0, 255, 0.55), inset 0 0 12px rgba(255,255,255,0.15); }
}

/* Patrón de fondo para el navbar */
.bg-casino-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Estilos adicionales para asegurar que el dropdown se vea bien */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Asegurar que el botón del avatar tenga un z-index alto para que el menú se abra por encima */
.group.z-50 {
  position: relative;
  z-index: 50;
}

/* Aumentar la especificidad del z-index del dropdown */
div[class*="z-\\[9999\\]"] {
  z-index: 9999 !important;
}
</style>