<template>
  <div class="min-h-screen bg-gray-50">
    <div class="-mt-8">
      <Navbar />
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>