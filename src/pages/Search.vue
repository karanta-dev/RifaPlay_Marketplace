<template>
  <div class="bg-primary-to-b from-green-50 via-blue-50 to-white min-h-screen py-8 px-2 flex flex-col items-center">
    <!-- 🔍 Barra de búsqueda -->
    <div class="w-full max-w-lg flex items-center mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar Rifas..."
        class="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 📌 Botones de categorías dinámicos -->
    <div class="flex flex-wrap justify-center gap-2 mb-6">
      <button
        v-for="cat in ticketStore.allCategories"
        :key="cat"
        @click="toggleCategory(cat)"
        :class="[
          'px-4 py-2 rounded-full border text-sm font-medium transition',
          selectedCategory === cat
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 📦 Grid de productos filtrados -->
    <div v-if="filteredProducts.length > 0" class="w-full">
      <ProductGrid :products="filteredProducts" />
    </div>
    <div v-else class="text-gray-600 text-center mt-10">
      🚫 No se encontraron productos con los filtros seleccionados.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ProductGrid from "../components/ProductGrid.vue";
import { useTicketStore } from "@/stores/useTicketStore";

const ticketStore = useTicketStore();

// 📝 Barra de búsqueda
const searchQuery = ref("");

// 📌 Categoría seleccionada
const selectedCategory = ref<string | null>(null);

const toggleCategory = (cat: string) => {
  selectedCategory.value = selectedCategory.value === cat ? null : cat;
};

// 🔎 Filtrar productos
const filteredProducts = computed(() => {
  return ticketStore.topProducts.filter((product: any) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesCategory = selectedCategory.value
      ? product.categories.includes(selectedCategory.value)
      : true;

    return matchesSearch && matchesCategory;
  });
});
</script>
