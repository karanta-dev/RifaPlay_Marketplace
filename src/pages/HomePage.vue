
<template>
  <div class="bg-gradient-to-b from-green-50 via-blue-50 to-white min-h-screen py-8 px-2 flex flex-col items-center">
    <Banner />
    <ProductGrid />
  </div>
</template>

<script setup lang="ts">
import Banner from '../components/Banner.vue'
import ProductGrid from '../components/ProductGrid.vue'
</script>
