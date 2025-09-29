<template>
  <div class="min-h-screen bg-primary">
    <Navbar />
    <RouterView />
    <MobileNav />

  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import MobileNav from './components/MobileNav.vue'

</script>
