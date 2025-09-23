

<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-transform hover:scale-105">
  <img :src="image" alt="Premio" class="w-full h-40 sm:h-56 object-cover mb-3 rounded-xl border" />
  <h3 class="font-bold text-base sm:text-lg text-gray-800 mb-1 text-center">{{ title }}</h3>
  <p class="text-gray-600 text-xs sm:text-sm mb-2 text-center">{{ description }}</p>
    <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
      <div class="bg-blue-800 h-3 rounded-full" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="text-xs text-gray-500 mb-2 text-center">{{ progress }}% vendido</p>
  <button
    class="bg-blue-800 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-full w-full font-bold text-sm sm:text-base shadow border-4"
    @click="$emit('participar')"
  >
    PARTICIPAR
  </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  image: String,
  title: String,
  description: String,
  progress: Number
})
</script>
