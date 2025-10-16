<template>
  <div class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen pb-8 px-2 flex flex-col items-center animate-casino-fade">
    <Banner />
    <TopProductsCarousel />
    <ProductGrid />

  </div>
</template>

<script setup lang="ts">
import Banner from '../components/Banner.vue'
import ProductGrid from '../components/ProductGrid.vue'
import TopProductsCarousel from '../components/TopProductsCarousel.vue'




// Importar el store aquí para inicializarlo (queda disponible en todos los hijos también si usan el mismo)
// import { useTicketStore } from '@/stores/useTicketStore'

// const ticketStore = useTicketStore()
</script>

<style scoped>
.animate-casino-fade {
  animation: casinoFadeIn 1.2s ease;
}
@keyframes casinoFadeIn {
  0% { opacity: 0; transform: scale(0.98); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
