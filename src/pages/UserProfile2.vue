<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white relative overflow-hidden">
    <!-- Patrón de fondo elegante -->
    <div class="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-orange-300/3 to-red-400/5"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
    
    <!-- Header Premium -->
    <div class="relative bg-gradient-to-r from-amber-900/90 to-orange-900/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-amber-500/30 shadow-2xl">
      <button 
        @click="$router.back()" 
        class="px-4 py-2 rounded-xl bg-amber-800/60 hover:bg-amber-700 text-amber-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-amber-500/25 flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i>
        <span class="hidden sm:inline">Volver</span>
      </button>
      <div class="flex items-center gap-3 text-sm">
        <div class="flex items-center gap-2 bg-amber-800/40 px-3 py-1 rounded-full">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-amber-200">En línea {{ user?.lastSeen }}</span>
        </div>
        <button class="p-2 rounded-lg bg-amber-800/40 hover:bg-amber-700/60 text-amber-200 transition-all">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="relative p-6 flex flex-col items-center text-center z-10" v-if="user">
      <div class="relative">
        <div class="w-28 h-28 rounded-full overflow-hidden shadow-2xl border-4 border-amber-400/80 relative">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold"
          >
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <!-- Badge verificado -->
        <div class="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full p-2 shadow-lg border-2 border-white">
          <i class="fas fa-check text-white text-xs"></i>
        </div>
      </div>
      
      <h1 class="mt-4 text-3xl font-bold text-white drop-shadow-lg">
        {{ user.name }}
      </h1>
      <p class="text-amber-200 mt-1 text-sm">Rifero Premium Verificado</p>

      <!-- Rating con estilo premium -->
      <div class="flex items-center gap-3 mt-3 bg-amber-900/40 px-4 py-2 rounded-full border border-amber-500/30">
        <div class="flex">
          <i
            v-for="n in 5"
            :key="n"
            class="fas text-lg"
            :class="n <= user.rating ? 'fa-star text-amber-400' : 'fa-star text-amber-700'"
          ></i>
        </div>
        <span class="text-amber-200 text-sm font-semibold">{{ user.rating }}/5</span>
      </div>
    </div>

    <!-- Tabs Elegantes -->
    <div class="relative flex justify-center gap-2 px-4 py-4 bg-amber-900/30 backdrop-blur-sm border-y border-amber-500/20">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="[ 
          'px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border',
          currentTab === tab
            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/50 scale-105 border-amber-400/50'
            : 'bg-amber-900/40 text-amber-200 hover:bg-amber-800/60 hover:text-white border-amber-700/30'
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
        <div class="bg-gradient-to-br from-amber-800/60 to-orange-800/60 rounded-2xl p-6 shadow-2xl border border-amber-500/30 backdrop-blur-sm">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-gem text-amber-400"></i>
            Especialización en Autos de Lujo
          </h3>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="cat in categories"
              :key="cat"
              class="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-sm font-semibold text-white shadow-lg border border-amber-400/30"
            >
              {{ cat }}
            </span>
          </div>
        </div>

        <!-- Estadísticas Premium -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-amber-800/40 rounded-xl p-4 text-center border border-amber-500/20 backdrop-blur-sm">
            <div class="text-2xl font-bold text-amber-300">{{ userRifas.length }}</div>
            <div class="text-amber-200 text-sm mt-1">Rifas Publicadas</div>
          </div>
          <div class="bg-orange-800/40 rounded-xl p-4 text-center border border-orange-500/20 backdrop-blur-sm">
            <div class="text-2xl font-bold text-orange-300">{{ totalTickets }}</div>
            <div class="text-orange-200 text-sm mt-1">Tickets Vendidos</div>
          </div>
        </div>

        <!-- Información Detallada -->
        <div class="bg-gradient-to-br from-amber-800/50 to-orange-800/50 rounded-2xl p-6 shadow-xl border border-amber-500/20">
          <h3 class="text-lg font-bold text-white mb-4">Información del Rifero</h3>
          <div class="space-y-3 text-amber-100">
            <div class="flex justify-between items-center py-2 border-b border-amber-700/30">
              <span class="font-semibold">📅 Miembro desde</span>
              <span class="text-amber-300">hace {{ user.registeredDays }} días</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-amber-700/30">
              <span class="font-semibold">🔥 Rifas Activas</span>
              <span class="text-amber-300">{{ userRifas.filter(r => isActive(r.drawDate)).length }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="font-semibold">✅ Tasa de Éxito</span>
              <span class="text-green-400 font-bold">100%</span>
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
            class="p-6 rounded-2xl bg-gradient-to-br from-amber-800/40 to-orange-800/40 border border-amber-700/30 shadow-xl opacity-70"
          >
            <h3 class="font-bold text-white text-lg">{{ rifa.title }}</h3>
            <p class="text-amber-200 mt-2">{{ rifa.description }}</p>
            <div class="mt-3 px-3 py-1 bg-amber-900/60 rounded-full text-amber-300 text-sm inline-block">
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
          class="bg-gradient-to-br from-amber-800/50 to-orange-800/50 rounded-2xl p-6 shadow-xl border border-amber-500/20 backdrop-blur-sm"
        >
          <div class="flex gap-4 items-start">
            <!-- Avatar -->
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
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
                        class="fas text-amber-400"
                        :class="n <= c.rating ? 'fa-star' : 'fa-star text-amber-700'"
                      ></i>
                    </div>
                  </div>
                </div>
                <span class="text-amber-300 text-sm bg-amber-900/40 px-2 py-1 rounded-full">{{ c.date }}</span>
              </div>
              <p class="text-amber-100 leading-relaxed">{{ c.text }}</p>
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

<style scoped>
/* Efectos adicionales para el tema ámbar/naranja */
</style>