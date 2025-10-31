<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
    <!-- Patrón de fondo tecnológico -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(120,119,198,0.1),_transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(56,189,248,0.03)_50%,_transparent_52%)] bg-[length:20px_20px]"></div>
    
    <!-- Header Tecnológico -->
    <div class="relative bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-cyan-500/30 shadow-2xl">
      <button 
        @click="$router.back()" 
        class="px-4 py-2 rounded-xl bg-blue-800/60 hover:bg-cyan-700 text-cyan-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i>
        <span class="hidden sm:inline">Volver</span>
      </button>
      <div class="flex items-center gap-3 text-sm">
        <div class="flex items-center gap-2 bg-blue-800/40 px-3 py-1 rounded-full">
          <i class="fas fa-store text-cyan-400 text-xs"></i>
          <span class="text-cyan-200">Tienda Oficial</span>
        </div>
        <button class="p-2 rounded-lg bg-blue-800/40 hover:bg-cyan-700/60 text-cyan-200 transition-all">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="relative p-6 flex flex-col items-center text-center z-10" v-if="user">
      <div class="relative">
        <div class="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl border-4 border-cyan-400/80 relative bg-gradient-to-br from-cyan-500 to-blue-600">
          <div class="w-full h-full flex items-center justify-center text-white">
            <i class="fas fa-store text-4xl"></i>
          </div>
        </div>
        <!-- Badge tienda oficial -->
        <div class="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-2 shadow-lg border-2 border-white">
          <i class="fas fa-certificate text-white text-xs"></i>
        </div>
      </div>
      
      <h1 class="mt-4 text-3xl font-bold text-white drop-shadow-lg">
        {{ user.name }}
      </h1>
      <p class="text-cyan-200 mt-1 text-sm">Tienda Oficial de Tecnología</p>

      <!-- Rating con estilo tecnológico -->
      <div class="flex items-center gap-3 mt-3 bg-blue-900/40 px-4 py-2 rounded-full border border-cyan-500/30">
        <div class="flex">
          <i
            v-for="n in 5"
            :key="n"
            class="fas text-lg"
            :class="n <= user.rating ? 'fa-star text-cyan-400' : 'fa-star text-cyan-700'"
          ></i>
        </div>
        <span class="text-cyan-200 text-sm font-semibold">{{ user.rating }}/5</span>
      </div>
    </div>

    <!-- Tabs Tecnológicos -->
    <div class="relative flex justify-center gap-2 px-4 py-4 bg-blue-900/30 backdrop-blur-sm border-y border-cyan-500/20">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="[ 
          'px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border',
          currentTab === tab
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/50 scale-105 border-cyan-400/50'
            : 'bg-blue-900/40 text-cyan-200 hover:bg-cyan-800/60 hover:text-white border-cyan-700/30'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Content -->
    <div class="relative p-6 space-y-6" v-if="user">
      <!-- Información -->
      <div v-if="currentTab === 'Información'" class="space-y-6">
        <!-- Tarjeta de Especialización -->
        <div class="bg-gradient-to-br from-blue-800/60 to-purple-800/60 rounded-2xl p-6 shadow-2xl border border-cyan-500/30 backdrop-blur-sm">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-microchip text-cyan-400"></i>
            Especialistas en Tecnología
          </h3>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="cat in categories"
              :key="cat"
              class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-sm font-semibold text-white shadow-lg border border-cyan-400/30"
            >
              {{ cat }}
            </span>
          </div>
        </div>

        <!-- Estadísticas Tecnológicas -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-800/40 rounded-xl p-4 text-center border border-cyan-500/20 backdrop-blur-sm">
            <div class="text-2xl font-bold text-cyan-300">{{ userRifas.length }}</div>
            <div class="text-cyan-200 text-sm mt-1">Productos Activos</div>
          </div>
          <div class="bg-purple-800/40 rounded-xl p-4 text-center border border-purple-500/20 backdrop-blur-sm">
            <div class="text-2xl font-bold text-purple-300">{{ totalTickets }}</div>
            <div class="text-purple-200 text-sm mt-1">Tickets Vendidos</div>
          </div>
        </div>

        <!-- Información de la Tienda -->
        <div class="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-2xl p-6 shadow-xl border border-cyan-500/20">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-info-circle text-cyan-400"></i>
            Información de la Tienda
          </h3>
          <div class="space-y-3 text-cyan-100">
            <div class="flex justify-between items-center py-2 border-b border-cyan-700/30">
              <span class="font-semibold">🏪 Tipo</span>
              <span class="text-cyan-300">Tienda Oficial</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-cyan-700/30">
              <span class="font-semibold">📅 Registrada</span>
              <span class="text-cyan-300">hace {{ user.registeredDays }} días</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-cyan-700/30">
              <span class="font-semibold">🔥 Productos Activos</span>
              <span class="text-cyan-300">{{ userRifas.filter(r => isActive(r.drawDate)).length }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="font-semibold">✅ Garantía</span>
              <span class="text-green-400 font-bold">100% Oficial</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rifas -->
      <div v-if="currentTab === 'Rifas'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="(rifa, i) in sortedRifas" :key="i">
          <ProductCard
            v-if="isActive(rifa.drawDate)"
            :product="rifa"
            :image="rifa.images?.[0]"
            :title="rifa.title"
            :description="rifa.description"
            :progress="productProgress(rifa)"
            :drawDate="rifa.drawDate"
            @view-details="() => openDetails(rifa)"
            @participar="() => openParticipateModal(rifa)"
          />
          <div
            v-else
            class="p-6 rounded-2xl bg-gradient-to-br from-blue-800/40 to-purple-800/40 border border-cyan-700/30 shadow-xl opacity-70"
          >
            <h3 class="font-bold text-white text-lg">{{ rifa.title }}</h3>
            <p class="text-cyan-200 mt-2">{{ rifa.description }}</p>
            <div class="mt-3 px-3 py-1 bg-blue-900/60 rounded-full text-cyan-300 text-sm inline-block">
              Finalizado: {{ new Date(rifa.drawDate).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Comentarios -->
      <div v-if="currentTab === 'Comentarios'" class="space-y-4">
        <div
          v-for="(c, i) in user.comments"
          :key="i"
          class="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-2xl p-6 shadow-xl border border-cyan-500/20 backdrop-blur-sm"
        >
          <div class="flex gap-4 items-start">
            <!-- Avatar -->
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              <img
                v-if="c.avatar"
                :src="c.avatar"
                alt="avatar"
                class="w-full h-full object-cover rounded-2xl"
              />
              <span v-else>{{ c.user.charAt(0).toUpperCase() }}</span>
            </div>

            <!-- Contenido -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-bold text-white text-lg">{{ c.user }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="flex">
                      <i
                        v-for="n in 5"
                        :key="n"
                        class="fas text-cyan-400"
                        :class="n <= c.rating ? 'fa-star' : 'fa-star text-cyan-700'"
                      ></i>
                    </div>
                  </div>
                </div>
                <span class="text-cyan-300 text-sm bg-blue-900/40 px-2 py-1 rounded-full">{{ c.date }}</span>
              </div>
              <p class="text-cyan-100 leading-relaxed">{{ c.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <ParticiparModal
      :open="showForm"
      :product="selectedProduct"
      @close="showForm = false"
      @confirmed="handleConfirmed"
    />

    <ConfirmacionModal
      :open="showConfirm"
      @close="showConfirm = false"
    />

    <DetailsModal
      :open="showDetails"
      :product="selectedProduct"
      @close="showDetails = false"
      @buy="openParticipateModal"
    />
  </div>
</template>

<script setup lang="ts">
// Mismo script que UserProfileJuan.vue, solo cambia el diseño
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { useTicketStore } from "@/stores/useTicketStore";

import ProductCard from "@/components/ProductCard.vue";
import ParticiparModal from "@/components/ParticipateModal.vue";
import ConfirmacionModal from "@/components/ConfirmationModal.vue";
import DetailsModal from "@/components/ProductDetailsModal.vue";

const route = useRoute();
const userStore = useUserStore();
const ticketStore = useTicketStore();

const user = computed(() => userStore.getUserById(route.params.id as string));
const userRifas = computed(() =>
  user.value ? userStore.getUserProducts(user.value.name) : []
);

const { productProgress } = ticketStore;

// Tabs
const tabs = ["Información", "Rifas", "Comentarios"];
const currentTab = ref("Información");

// Ordenar rifas (activas primero, más nuevas antes)
const sortedRifas = computed(() => {
  return [...userRifas.value].sort((a, b) => {
    const activeA = isActive(a.drawDate);
    const activeB = isActive(b.drawDate);

    if (activeA !== activeB) return activeA ? -1 : 1;
    return new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime();
  });
});

function isActive(drawDate: string) {
  return new Date(drawDate).getTime() > Date.now();
}

// Modales
const showForm = ref(false);
const showConfirm = ref(false);
const showDetails = ref(false);
const selectedProduct = ref<any | null>(null);

const handleConfirmed = () => {
  showForm.value = false;
  showConfirm.value = true;
};

const openDetails = (product: any) => {
  selectedProduct.value = product;
  showDetails.value = true;
};

const totalTickets = computed(() => {
  return userRifas.value.reduce((acc, r) => acc + (r.ticketsVendidos || 0), 0);
});

const categories = computed(() => {
  const all = userRifas.value.flatMap(r => r.categories || []);
  return [...new Set(all)];
});

function openParticipateModal(product: any) {
  selectedProduct.value = product;
  showDetails.value = false;
  showForm.value = true;
}
</script>