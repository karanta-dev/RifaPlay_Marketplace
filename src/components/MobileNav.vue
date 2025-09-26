<template>
  <!-- Mobile Navigation Bar -->
  <nav
    :class="[
      'fixed bottom-0 left-0 w-full bg-blue-800 text-white shadow-lg sm:hidden transition-transform duration-300 z-50',
      isVisible ? 'translate-y-0' : 'translate-y-full'
    ]"
  >
    <div class="flex justify-around items-center py-0">
      <!-- Home -->
      <button
        @click="goHome"
        class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
            d="M3 12l9-9 9 9M4 10v10h6v-6h4v6h6V10" />
        </svg>
        Inicio
      </button>

      <!-- Search -->
      <button
        @click="goSearch"
        class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar
      </button>

      <!-- Support -->
      <button class="flex flex-col items-center text-sm hover:text-yellow-400 bg-transparent focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0" />
        </svg>
        Soporte
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isVisible = ref(true);
let lastScrollY = window.scrollY;

const handleScroll = () => {
  if (window.scrollY > lastScrollY) {
    isVisible.value = false;
  } else if (window.scrollY < lastScrollY) {
    isVisible.value = true;
  }
  lastScrollY = window.scrollY;
};

// Métodos de navegación
const goHome = () => {
  router.push({ name: "home" });
};

const goSearch = () => {
  router.push({ name: "search" });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
