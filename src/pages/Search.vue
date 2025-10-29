<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8 px-4 relative overflow-hidden">
    <!-- Efectos de fondo -->
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="absolute top-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <!-- Header con título -->
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
          EXPLORAR RIFAS
        </h1>
        <p class="text-gray-300 text-lg max-w-2xl mx-auto">
          Descubre oportunidades increíbles y participa por premios espectaculares
        </p>
      </div>

      <!-- 🔍 Barra de búsqueda premium -->
      <div class="max-w-2xl mx-auto mb-8 relative">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Buscar rifas, productos, categorías..."
            class="w-full p-4 pl-12 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-cyan-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 shadow-lg"
          />
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          
          <!-- Contador de resultados -->
          <div v-if="searchQuery" class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <span class="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
              {{ filteredAndSortedProducts.length }}
            </span>
          </div>
        </div>
      </div>

      <!-- 📌 Filtros de categorías estilo casino -->
      <div class="mb-8">
        <div class="flex flex-wrap justify-center gap-3">
          <!-- Botón "Todas" -->
          <button
            @click="selectedCategory = null"
            :class="[
              'group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm min-w-[120px]',
              !selectedCategory
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border-cyan-400 scale-105'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white border-gray-600 hover:border-cyan-400/30'
            ]"
          >
            <span class="relative z-10">🎯 Todas</span>
            <div v-if="!selectedCategory" class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur-sm opacity-50"></div>
          </button>

          <!-- Botones de categorías -->
          <button
            v-for="cat in ticketStore.allCategories"
            :key="cat"
            @click="toggleCategory(cat)"
            :class="[
              'group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm min-w-[120px]',
              selectedCategory === cat
                ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg shadow-yellow-500/25 border-yellow-400 scale-105'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white border-gray-600 hover:border-yellow-400/30'
            ]"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              <span class="text-sm">{{ getCategoryIcon(cat) }}</span>
              {{ cat }}
            </span>
            <div v-if="selectedCategory === cat" class="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl blur-sm opacity-50"></div>
          </button>
        </div>

        <!-- Indicador de filtro activo -->
        <div v-if="selectedCategory" class="text-center mt-4">
          <div class="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
            <span class="text-yellow-400 text-sm">Filtro activo:</span>
            <span class="text-white font-semibold">{{ selectedCategory }}</span>
            <button 
              @click="selectedCategory = null"
              class="text-yellow-400 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 📦 Grid de productos -->
      <div v-if="filteredAndSortedProducts.length > 0">
        <!-- Header de resultados -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 gap-4">
          <h2 class="text-xl font-semibold text-white">
            {{ filteredAndSortedProducts.length }} 
            {{ filteredAndSortedProducts.length === 1 ? 'rifa encontrada' : 'rifas encontradas' }}
          </h2>
          
          <!-- Ordenamiento -->
          <div class="flex items-center gap-3">
            <!-- Filtro de estado -->
            <div class="flex items-center gap-2">
              <span class="text-gray-400 text-sm">Estado:</span>
              <select 
                v-model="statusFilter"
                class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 min-w-[140px]"
              >
                <option value="all">Todas</option>
                <option value="active">Solo activas</option>
                <option value="finished">Finalizadas</option>
              </select>
            </div>

            <!-- Ordenamiento -->
            <div class="flex items-center gap-2">
              <span class="text-gray-400 text-sm">Ordenar por:</span>
              <select 
                v-model="sortBy"
                class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 min-w-[180px]"
              >
                <option value="popularity">Más populares</option>
                <option value="endingSoon">Próximo a terminar</option>
                <option value="newest">Más recientes</option>
                <option value="priceLow">Precio: Menor a mayor</option>
                <option value="priceHigh">Precio: Mayor a menor</option>
                <option value="progress">Progreso de venta</option>
                <option value="title">Nombre A-Z</option>
              </select>
            </div>

            <!-- Dirección del orden -->
            <button
              @click="toggleSortDirection"
              class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white transition-all duration-300"
              :title="sortDirection === 'asc' ? 'Orden ascendente' : 'Orden descendente'"
            >
              <svg 
                class="w-4 h-4 transition-transform duration-300" 
                :class="{ 'rotate-180': sortDirection === 'desc' }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Indicadores de filtros activos -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4 px-4">
          <div 
            v-if="statusFilter !== 'all'"
            class="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30"
          >
            <span class="text-blue-400 text-xs">Estado:</span>
            <span class="text-white text-xs font-medium">
              {{ statusFilter === 'active' ? 'Activas' : 'Finalizadas' }}
            </span>
            <button 
              @click="statusFilter = 'all'"
              class="text-blue-400 hover:text-white transition-colors"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="inline-flex items-center gap-2 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">
            <span class="text-cyan-400 text-xs">Orden:</span>
            <span class="text-white text-xs font-medium">{{ getSortLabel(sortBy) }}</span>
            <span class="text-cyan-300 text-xs">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </div>

          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="inline-flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-full border border-red-500/30 text-red-400 hover:text-white text-xs transition-all duration-300"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
            Limpiar todo
          </button>
        </div>

        <ProductGrid :products="filteredAndSortedProducts" />
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center border border-gray-600">
            <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">No se encontraron rifas</h3>
          <p class="text-gray-400 mb-6">
            {{
              searchQuery || selectedCategory || statusFilter !== 'all'
                ? 'Intenta con otros términos de búsqueda o filtros'
                : 'Pronto tendremos nuevas rifas disponibles'
            }}
          </p>
          <button
            v-if="searchQuery || selectedCategory || statusFilter !== 'all'"
            @click="clearAllFilters"
            class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ProductGrid from "../components/ProductGrid.vue";
import { useTicketStore } from "@/stores/useTicketStore";

const ticketStore = useTicketStore();

// 📝 Búsqueda
const searchQuery = ref("");

// 📌 Categoría seleccionada
const selectedCategory = ref<string | null>(null);

// 🎯 Filtro de estado
const statusFilter = ref<"all" | "active" | "finished">("all");

// 🔄 Ordenamiento - CORREGIDO: incluir "endingSoon" en el tipo
const sortBy = ref<"popularity" | "endingSoon" | "newest" | "priceLow" | "priceHigh" | "progress" | "title">("popularity");
const sortDirection = ref<"asc" | "desc">("desc");

const toggleCategory = (cat: string) => {
  selectedCategory.value = selectedCategory.value === cat ? null : cat;
};

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
};

const clearAllFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = null;
  statusFilter.value = "all";
  sortBy.value = "popularity";
  sortDirection.value = "desc";
};

// 🔎 Filtrar productos
const filteredProducts = computed(() => {
  return ticketStore.topProducts.filter((product: any) => {
    const title = product.title?.toLowerCase?.() || "";
    const description = product.description?.toLowerCase?.() || "";
    const categories = Array.isArray(product.categories) ? product.categories : [];

    const matchesSearch =
      title.includes(searchQuery.value.toLowerCase()) ||
      description.includes(searchQuery.value.toLowerCase()) ||
      categories.some((cat: string) =>
        cat?.toLowerCase?.().includes(searchQuery.value.toLowerCase())
      );

    const matchesCategory = selectedCategory.value
      ? categories.includes(selectedCategory.value)
      : true;

    const isActive = new Date(product.drawDate).getTime() > Date.now();
    const matchesStatus =
      statusFilter.value === "all"
        ? true
        : statusFilter.value === "active"
        ? isActive
        : !isActive;

    return matchesSearch && matchesCategory && matchesStatus;
  });
});


// 📊 Productos filtrados y ordenados - LÓGICA CORREGIDA
const filteredAndSortedProducts = computed(() => {
  const products = [...filteredProducts.value];
  
  return products.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy.value) {
      case "popularity":
        aValue = a.ticketsVendidos || 0;
        bValue = b.ticketsVendidos || 0;
        break;
        
      case "endingSoon":
        // Para "ending soon", manejamos la lógica completa aquí
        aValue = new Date(a.drawDate).getTime();
        bValue = new Date(b.drawDate).getTime();
        // Las que terminan primero van primero (ascendente por defecto)
        if (sortDirection.value === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
        
      case "newest":
        // Asumiendo que no tenemos fecha de creación, usamos drawDate como referencia
        aValue = new Date(a.drawDate).getTime();
        bValue = new Date(b.drawDate).getTime();
        break;
        
      case "priceLow":
        aValue = a.ticketPrice || 0;
        bValue = b.ticketPrice || 0;
        break;
        
      case "priceHigh":
        aValue = a.ticketPrice || 0;
        bValue = b.ticketPrice || 0;
        break;
        
      case "progress":
        const progressA = ticketStore.productProgress(a);
        const progressB = ticketStore.productProgress(b);
        aValue = progressA;
        bValue = progressB;
        break;
        
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
        
      default:
        aValue = a.ticketsVendidos || 0;
        bValue = b.ticketsVendidos || 0;
    }
    
    // Ordenamiento normal para todos los casos excepto endingSoon
    // (endingSoon ya retornó en el case anterior)
    if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
    
    return 0;
  });
});

// 🎯 Iconos por categoría
const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'Autos': '🚗',
    'Electrodomésticos': '📺',
    'Móviles': '📱',
    'Viajes': '✈️',
    'Experiencias': '🎯',
    'Gaming': '🎮',
    'Computadoras': '💻',
    'Tecnología': '🔌'
  };
  return icons[category] || '🎁';
};

// 🏷️ Etiquetas para el ordenamiento
const getSortLabel = (sortType: string) => {
  const labels: { [key: string]: string } = {
    'popularity': 'Popularidad',
    'endingSoon': 'Próximo a terminar',
    'newest': 'Más recientes',
    'priceLow': 'Precio menor',
    'priceHigh': 'Precio mayor',
    'progress': 'Progreso',
    'title': 'Nombre'
  };
  return labels[sortType] || 'Popularidad';
};

// 📍 Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return searchQuery.value !== "" || selectedCategory.value !== null || statusFilter.value !== "all";
});
</script>

<style scoped>
/* Animaciones mejoradas */
.animate-casino-fade {
  animation: casinoFadeIn 0.8s ease-out;
}

@keyframes casinoFadeIn {
  0% { 
    opacity: 0; 
    transform: translateY(20px) scale(0.98); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #06b6d4, #3b82f6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0891b2, #2563eb);
}
</style>