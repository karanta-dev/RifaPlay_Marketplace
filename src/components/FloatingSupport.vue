<template>
  <div class="fixed bottom-6 right-6 z-50 hidden sm:block">
    <!-- Botón flotante principal -->
    <button
      @click="toggleSupport"
      class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-yellow-300 hover:scale-110 transition-all duration-300 group relative"
      :class="{ 'ring-4 ring-yellow-400/50': isOpen }"
    >
      <i class="fas fa-headphones text-white text-xl group-hover:scale-110 transition-transform"></i>
      <!-- Efecto de pulso -->
      <div class="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20"></div>
    </button>

  <!-- Menú desplegable -->
  <transition name="support-fade">
    <div
      v-if="isOpen"
      class="absolute bottom-16 right-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 border border-yellow-400/30 w-64 backdrop-blur-sm z-50"
    >
        <!-- Encabezado -->
        <div class="text-center mb-3">
          <h3 class="text-white font-bold text-lg">Soporte</h3>
          <p class="text-gray-300 text-sm">¿Necesitas ayuda?</p>
        </div>

        <!-- Opciones de soporte -->
        <div class="space-y-2">
          <button
            @click="goToSupport"
            class="w-full flex items-center gap-3 p-3 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-colors group border border-gray-600"
          >
            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i class="fas fa-question-circle text-blue-400 text-sm"></i>
            </div>
            <span class="text-sm font-medium">Centro de Ayuda</span>
          </button>

          <!-- <button
            @click="openChat"
            class="w-full flex items-center gap-3 p-3 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-colors group border border-gray-600"
          >
            <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i class="fas fa-comments text-green-400 text-sm"></i>
            </div>
            <span class="text-sm font-medium">Chat en Vivo</span>
          </button>

          <button
            @click="sendEmail"
            class="w-full flex items-center gap-3 p-3 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-colors group border border-gray-600"
          >
            <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i class="fas fa-envelope text-purple-400 text-sm"></i>
            </div>
            <span class="text-sm font-medium">Email</span>
          </button> -->

          <button
            @click="openWhatsApp"
            class="w-full flex items-center gap-3 p-3 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-xl transition-colors group border border-gray-600"
          >
            <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i class="fab fa-whatsapp text-green-400 text-sm"></i>
            </div>
            <span class="text-sm font-medium">WhatsApp</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Overlay para cerrar al hacer clic fuera -->
<transition name="fade">
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30"
    @click="isOpen = false"
  ></div>
</transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

// Alternar menú de soporte
const toggleSupport = () => {
  isOpen.value = !isOpen.value
}

// Navegar a la página de soporte (puedes crear esta ruta después)
const goToSupport = () => {
  isOpen.value = false
  // Aquí puedes redirigir a una página de soporte cuando la crees
  router.push('/support')
  alert('Redirigiendo al Centro de Ayuda - Página en desarrollo')
}

// // Abrir chat en vivo
// const openChat = () => {
//   isOpen.value = false
//   alert('Iniciando chat en vivo...')
//   // Aquí integrarías tu servicio de chat
// }

// // Enviar email
// const sendEmail = () => {
//   isOpen.value = false
//   window.location.href = 'mailto:soporte@rifaplay.com?subject=Soporte RifaPlay&body=Hola, necesito ayuda con...'
// }

// Abrir WhatsApp
const openWhatsApp = () => {
  isOpen.value = false
  const message = 'Hola, necesito ayuda con RifaPlay'
  const phoneNumber = '1234567890' // Reemplaza con tu número
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
}

// Cerrar menú al presionar Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

// Cerrar menú al hacer scroll
const handleScroll = () => {
  if (isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
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

/* Efecto de pulso suave */
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>