<template>
  <div class="bg-primary-to-b from-green-50 via-blue-50 to-white min-h-screen py-8 px-2 flex flex-col items-center">
    <Banner />
    <TopProductsCarousel />
    <ProductGrid />
    <MobileNav />

  </div>
</template>

<script setup lang="ts">
import Banner from '../components/Banner.vue'
import ProductGrid from '../components/ProductGrid.vue'
import TopProductsCarousel from '../components/TopProductsCarousel.vue'
import MobileNav from '../components/MobileNav.vue'


// Importar el store aquí para inicializarlo (queda disponible en todos los hijos también si usan el mismo)
import { useTicketStore } from '@/stores/useTicketStore'

const ticketStore = useTicketStore()
</script>
