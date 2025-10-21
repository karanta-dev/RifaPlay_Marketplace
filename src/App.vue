<template>
  <div class="min-h-screen bg-primary">
    <Navbar />
    <RouterView />
    <MobileNav />
    <FloatingSupport />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import MobileNav from './components/MobileNav.vue'
import FloatingSupport from './components/FloatingSupport.vue' 
import SiteFooter from './components/SiteFooter.vue'
</script>