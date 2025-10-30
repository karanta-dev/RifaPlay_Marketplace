<template>
  <div class="min-h-screen bg-primary">
    <!-- TU CÓDIGO ORIGINAL SE QUEDA IGUAL -->
    <Navbar />
    <RouterView />
    <ToastContainer />
    <MobileNav />
    <FloatingSupport /> 
    <SiteFooter />
    <ParticipateModal 
      :open="gridStore.isParticipateModalOpen"
      @close="gridStore.closeParticipateModal()"
      @confirmed="handleModalConfirmation"
    />
    <AuthenticationModal
      v-if="authStore.showLoginModal"
      @close="authStore.showLoginModal = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/useAuthStore';
import ToastContainer from '@/components/ToastContainer.vue';
import AuthenticationModal from './components/Authentication.vue'; // IMPORTANTE: Asegúrate de que esta ruta a tu modal es correcta
import Navbar from './components/Navbar.vue'
import MobileNav from './components/MobileNav.vue'
import FloatingSupport from './components/FloatingSupport.vue' 
import SiteFooter from './components/SiteFooter.vue'
import { useGridStore } from './stores/useGridStore';
import ParticiparModal from './components/ParticipateModal.vue';

const authStore = useAuthStore();
const gridStore = useGridStore();

const handleModalConfirmation = (data: any) => {

gridStore.closeParticipateModal();
console.log("Modal confirmado con datos:", data);
}
</script>