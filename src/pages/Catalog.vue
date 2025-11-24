<template>
  <div class="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen pb-8 px-2 flex flex-col items-center animate-casino-fade">
    <Banner />
    <TopProductsCarousel />
    <ProductGrid />
    
    <!-- Botón para ir a UserProfile2 -->
    <div class="mt-8">
      <router-link 
        :to="{ name: 'user-profile-juan', params: { id: '123' } }" 
        class="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span>Ir a Perfil de Usuario</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import Banner from '../components/Banner.vue'
import ProductGrid from '../components/ProductGrid.vue'
import TopProductsCarousel from '../components/TopProductsCarousel.vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()

// Opcional: método programático para navegar
// const goToUserProfile = () => {
//   router.push({ name: 'user-profile-juan', params: { id: '123' } })
// }
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