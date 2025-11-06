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
import { onMounted } from 'vue';
import { useAuthStore } from './stores/useAuthStore';
import ToastContainer from '@/components/ToastContainer.vue';
import AuthenticationModal from './components/Authentication.vue'; 
import Navbar from './components/Navbar.vue'
import MobileNav from './components/MobileNav.vue'
import FloatingSupport from './components/FloatingSupport.vue' 
import SiteFooter from './components/SiteFooter.vue'
import { useGridStore } from './stores/useGridStore';
import ParticipateModal from '@/components/ParticipateModal.vue';
import { usePaymentStore } from './stores/usePaymentStore'; 

const authStore = useAuthStore();
const gridStore = useGridStore();
const paymentStore = usePaymentStore(); // ✅ Instancia

onMounted(() => {
  paymentStore.loadPaymentDataOnce(); // ✅ Se ejecuta solo una vez en toda la app
  paymentStore.fetchBcvRate();
});

const handleModalConfirmation = (data: any) => {

gridStore.closeParticipateModal();
console.log("Modal confirmado con datos:", data);
}
</script>