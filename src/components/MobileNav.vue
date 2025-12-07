<template>
  <nav
    :class="[
      'fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 ease-out',
      'shadow-[0_-4px_20px_rgba(0,0,0,0.5)]',
      isVisible ? 'translate-y-0' : 'translate-y-full'
    ]"
    :style="{
      backgroundColor: colorStore.isRiferoPage ? colorStore.navbarBg : '#0f172a',
      borderTop: colorStore.isRiferoPage ? `1px solid ${colorStore.primary}30` : '1px solid rgba(255,255,255,0.1)'
    }"
    style="padding-bottom: env(safe-area-inset-bottom);"
  >
    <div class="flex justify-between items-end h-16 px-4 w-full relative">

      <!-- Inicio -->
      <button
        @click="goHome"
        class="flex-1 flex flex-col items-center justify-center pb-3 h-full bg-transparent border-none shadow-none focus:outline-none group"
      >
        <div class="relative flex flex-col items-center">
          <span v-if="isActive('home')" 
                class="absolute -top-3 w-8 h-[3px] rounded-full"
                :style="{
                  backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff',
                  boxShadow: colorStore.isRiferoPage ? `0 0 12px ${colorStore.textPrimary}` : '0 0 12px rgba(255,255,255,0.8)'
                }"></span>
          
          <i class="fas fa-home text-2xl mb-1 transition-all duration-300 group-hover:scale-110"
             :class="{
               'scale-110': isActive('home')
             }"
             :style="{
               color: isActive('home') 
                 ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                 : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
               filter: isActive('home') && colorStore.isRiferoPage ? `drop-shadow(0 0 6px ${colorStore.textPrimary})` : 'none'
             }"></i>
          <span class="text-[11px] font-bold tracking-wide transition-all duration-300 group-hover:font-extrabold"
                :style="{
                  color: isActive('home')
                    ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                    : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
                  textShadow: isActive('home') && colorStore.isRiferoPage ? `0 0 8px ${colorStore.textPrimary}` : 'none'
                }">
            Inicio
          </span>
        </div>
      </button>

      <!-- Buscar -->
      <button
        @click="goSearch"
        class="flex-1 flex flex-col items-center justify-center pb-3 h-full bg-transparent border-none shadow-none focus:outline-none group"
      >
        <div class="relative flex flex-col items-center">
          <span v-if="isActive('search')" 
                class="absolute -top-3 w-8 h-[3px] rounded-full"
                :style="{
                  backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff',
                  boxShadow: colorStore.isRiferoPage ? `0 0 12px ${colorStore.textPrimary}` : '0 0 12px rgba(255,255,255,0.8)'
                }"></span>

          <i class="fas fa-search text-2xl mb-1 transition-all duration-300 group-hover:scale-110"
             :class="{
               'scale-110': isActive('search')
             }"
             :style="{
               color: isActive('search')
                 ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                 : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
               filter: isActive('search') && colorStore.isRiferoPage ? `drop-shadow(0 0 6px ${colorStore.textPrimary})` : 'none'
             }"></i>
          <span class="text-[11px] font-bold tracking-wide transition-all duration-300 group-hover:font-extrabold"
                :style="{
                  color: isActive('search')
                    ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                    : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
                  textShadow: isActive('search') && colorStore.isRiferoPage ? `0 0 8px ${colorStore.textPrimary}` : 'none'
                }">
            Buscar
          </span>
        </div>
      </button>

      <!-- Mis Tickets -->
      <button
        @click="goTickets"
        class="flex-1 flex flex-col items-center justify-center pb-3 h-full bg-transparent border-none shadow-none focus:outline-none group"
      >
        <div class="relative flex flex-col items-center">
          <span v-if="isActive('my-tickets') || route.path.includes('/tickets')" 
                class="absolute -top-3 w-8 h-[3px] rounded-full"
                :style="{
                  backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff',
                  boxShadow: colorStore.isRiferoPage ? `0 0 12px ${colorStore.textPrimary}` : '0 0 12px rgba(255,255,255,0.8)'
                }"></span>

          <i class="fas fa-ticket-alt text-2xl mb-1 transition-all duration-300 group-hover:scale-110"
             :class="{
               'scale-110': (isActive('my-tickets') || route.path.includes('/tickets'))
             }"
             :style="{
               color: (isActive('my-tickets') || route.path.includes('/tickets'))
                 ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                 : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
               filter: (isActive('my-tickets') || route.path.includes('/tickets')) && colorStore.isRiferoPage ? `drop-shadow(0 0 6px ${colorStore.textPrimary})` : 'none'
             }"></i>
          <span class="text-[11px] font-bold tracking-wide transition-all duration-300 group-hover:font-extrabold"
                :style="{
                  color: (isActive('my-tickets') || route.path.includes('/tickets'))
                    ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                    : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
                  textShadow: (isActive('my-tickets') || route.path.includes('/tickets')) && colorStore.isRiferoPage ? `0 0 8px ${colorStore.textPrimary}` : 'none'
                }">
             Tickets
          </span>
        </div>
      </button>

      <!-- Soporte -->
      <div class="flex-1 relative h-full flex items-end justify-center pb-3">
        <button 
          @click="toggleSupport"
          class="w-full h-full flex flex-col items-center justify-center bg-transparent border-none shadow-none focus:outline-none group"
        >
          <div class="relative flex flex-col items-center">
            <span v-if="supportOpen" 
                  class="absolute -top-3 w-8 h-[3px] rounded-full"
                  :style="{
                    backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff',
                    boxShadow: colorStore.isRiferoPage ? `0 0 12px ${colorStore.textPrimary}` : '0 0 12px rgba(255,255,255,0.8)'
                  }"></span>

            <i class="fas fa-life-ring text-2xl mb-1 transition-all duration-300 group-hover:scale-110"
               :class="{
                 'scale-110': supportOpen
               }"
               :style="{
                 color: supportOpen
                   ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                   : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
                 filter: supportOpen && colorStore.isRiferoPage ? `drop-shadow(0 0 6px ${colorStore.textPrimary})` : 'none'
               }"></i>
            <span class="text-[11px] font-bold tracking-wide transition-all duration-300 group-hover:font-extrabold"
                  :style="{
                    color: supportOpen
                      ? (colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff')
                      : (colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0'),
                    textShadow: supportOpen && colorStore.isRiferoPage ? `0 0 8px ${colorStore.textPrimary}` : 'none'
                  }">
              Soporte
            </span>
          </div>
        </button>

        <transition name="pop-up">
          <div
            v-if="supportOpen"
            class="absolute bottom-[4.5rem] -right-2 w-64 rounded-2xl shadow-2xl p-2 z-50 origin-bottom-right"
            :style="{
              backgroundColor: colorStore.isRiferoPage ? colorStore.cardBg : '#1e293b',
              border: colorStore.isRiferoPage ? `2px solid ${colorStore.textPrimary}` : '2px solid #ffffff',
              boxShadow: colorStore.isRiferoPage 
                ? `0 10px 40px rgba(0,0,0,0.3), 0 0 30px ${colorStore.textPrimary}40`
                : '0 10px 40px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.3)'
            }"
          >
            <div class="absolute -bottom-2 right-8 w-4 h-4 rotate-45"
                 :style="{
                   backgroundColor: colorStore.isRiferoPage ? colorStore.cardBg : '#1e293b',
                   borderRight: colorStore.isRiferoPage ? `2px solid ${colorStore.textPrimary}` : '2px solid #ffffff',
                   borderBottom: colorStore.isRiferoPage ? `2px solid ${colorStore.textPrimary}` : '2px solid #ffffff'
                 }"></div>

            <div class="flex flex-col gap-1 relative z-10">
              <button @click="goToSupport" 
                      class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left bg-transparent border-none w-full hover:scale-[1.02] active:scale-[0.98]"
                      :style="{
                        backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary + '15' : 'rgba(255, 255, 255, 0.1)'
                      }">
                <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                     :style="{ 
                       backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff',
                       boxShadow: colorStore.isRiferoPage ? `0 0 10px ${colorStore.textPrimary}` : '0 0 10px rgba(255, 255, 255, 0.8)'
                     }">
                  <i class="fas fa-question text-sm"
                     :style="{ color: colorStore.isRiferoPage ? colorStore.cardBg : '#1e293b' }"></i>
                </div>
                <div>
                  <p class="text-sm font-bold leading-none"
                     :style="{ color: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff' }">Ayuda</p>
                  <p class="text-[10px] mt-1"
                     :style="{ color: colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0' }">Preguntas frecuentes</p>
                </div>
              </button>
              
              <button @click="openWhatsApp" 
                      class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left bg-transparent border-none w-full hover:scale-[1.02] active:scale-[0.98]"
                      :style="{
                        backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary + '15' : 'rgba(255, 255, 255, 0.1)'
                      }">
                <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                     :style="{ 
                       backgroundColor: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff',
                       boxShadow: colorStore.isRiferoPage ? `0 0 10px ${colorStore.textPrimary}` : '0 0 10px rgba(255, 255, 255, 0.8)'
                     }">
                  <i class="fab fa-whatsapp text-sm"
                     :style="{ color: colorStore.isRiferoPage ? colorStore.cardBg : '#1e293b' }"></i>
                </div>
                <div>
                  <p class="text-sm font-bold leading-none"
                     :style="{ color: colorStore.isRiferoPage ? colorStore.textPrimary : '#ffffff' }">WhatsApp</p>
                  <p class="text-[10px] mt-1"
                     :style="{ color: colorStore.isRiferoPage ? colorStore.textPrimary + 'CC' : '#e2e8f0' }">Chat directo</p>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </div>

    </div>

    <div
      v-if="supportOpen"
      class="fixed inset-0 top-0 left-0 bg-black/50 z-[-1] backdrop-blur-[1px]"
      @click="supportOpen = false"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from '@/stores/useAuthStore'
import { useColorStore } from '@/stores/useColorStore'

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const colorStore = useColorStore();

const isVisible = ref(true);
const supportOpen = ref(false);
let lastScrollY = window.scrollY;

const isActive = (routeName: string) => {
  if (routeName === 'my-tickets' && route.path.includes('/tickets')) return true;
  return route.name === routeName;
};

// Cerrar menú al cambiar ruta
watch(() => route.fullPath, () => {
  supportOpen.value = false;
});

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (Math.abs(currentScrollY - lastScrollY) < 10) return;
  
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    isVisible.value = false;
    supportOpen.value = false;
  } else if (currentScrollY < lastScrollY) {
    isVisible.value = true;
  }
  lastScrollY = currentScrollY;
};

const goHome = () => { if(route.name !== 'home') router.push({ name: "home" }); };
const goSearch = () => { if(route.name !== 'search') router.push({ name: "search" }); };
const goTickets = () => {
  const userId = authStore.user?.id ?? 'guest'
  router.push({ name: 'my-tickets', params: { userId } });
};

const toggleSupport = () => { supportOpen.value = !supportOpen.value; };

const goToSupport = () => {
  supportOpen.value = false;
  router.push({ name: 'support' });
};

const openWhatsApp = () => {
  supportOpen.value = false;
  window.open('https://wa.me/123456789', '_blank');
};

onMounted(() => { 
  window.addEventListener("scroll", handleScroll); 
});

onUnmounted(() => { 
  window.removeEventListener("scroll", handleScroll); 
});
</script>

<style scoped>
/* Asegura que no haya estilos globales de botones interfiriendo */
button {
  background-color: transparent;
}

.pop-up-enter-active,
.pop-up-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-up-enter-from,
.pop-up-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

/* Efecto hover para los botones */
.group:hover i {
  transform: scale(1.1);
}

.group:hover span {
  font-weight: 900;
}

/* Efecto glow para iconos activos */
i {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto de pulso para indicadores activos */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.absolute span {
  animation: pulse-glow 2s infinite ease-in-out;
}

/* Mejorar el contraste de los iconos */
i, span {
  transition: all 0.3s ease;
}

/* Hover más suave */
.group:hover i {
  opacity: 1;
}

.group:hover span {
  opacity: 1;
}
</style>