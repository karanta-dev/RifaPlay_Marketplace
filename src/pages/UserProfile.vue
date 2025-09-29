<template>
  <div class="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 min-h-screen text-yellow-400">
    <!-- Header -->
    <div class="bg-blue-950/80 p-4 flex items-center justify-between shadow-md">
      <button 
        @click="$router.back()" 
        class="px-3 py-1 rounded-lg bg-blue-900/60 hover:bg-cyan-600 text-cyan-300 hover:text-white transition shadow-md"
      >
        ←
      </button>
      <div class="flex items-center gap-2 text-xs sm:text-sm">
        <span class="opacity-80">Visto por última vez {{ user?.lastSeen }}</span>
        <button 
          class="px-3 py-1 rounded-lg bg-blue-900/60 hover:bg-cyan-600 text-cyan-300 hover:text-white transition shadow-md"
        >
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>

    <!-- User Info -->
    <div class="p-6 flex flex-col items-center text-center relative z-10" v-if="user">
<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg">
  <img
    v-if="user.avatar"
    :src="user.avatar"
    alt="avatar"
    class="w-full h-full object-cover"
  />
  <div
    v-else
    class="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl"
  >
    {{ user.name.charAt(0).toUpperCase() }}
  </div>
</div>
      <h2 class="mt-3 text-2xl font-extrabold text-yellow-300 drop-shadow-lg">
        {{ user.name }}
      </h2>

      <!-- Rating stars -->
      <div class="flex mt-2">
        <i
          v-for="n in 5"
          :key="n"
          class="fas"
          :class="n <= user.rating ? 'fa-star text-yellow-400' : 'fa-star text-gray-500'"
        ></i>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex justify-center gap-3 px-4 py-3 bg-blue-950/40 backdrop-blur-sm shadow-inner">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="[ 
          'px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm',
          currentTab === tab
            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
            : 'bg-blue-900/40 text-gray-300 hover:bg-blue-800/60 hover:text-cyan-300'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-4" v-if="user">
        <!-- Información -->
        <div v-if="currentTab === 'Información'" class="space-y-4">
    <!-- Info visual -->
    <div class="p-4 rounded-xl bg-blue-900/50 shadow-md">
      <h3 class="text-lg font-bold text-white mb-2">Categorías de rifas</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="cat in categories"
          :key="cat"
          class="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-xs font-semibold text-white shadow"
        >
          {{ cat }}
        </span>
      </div>
    </div>
  <!-- Datos generales -->
  <div class="p-4 bg-blue-900/50 rounded-xl shadow-md text-white">
    <p><strong>📅 Registrado:</strong> hace {{ user.registeredDays }} días</p>
    <p><strong>🎟️ Rifas publicadas:</strong> {{ userRifas.length }}</p>
    <p><strong>🔥 Rifas activas:</strong> {{ userRifas.filter(r => isActive(r.drawDate)).length }}</p>
    <p><strong>👥 Tickets vendidos:</strong> {{ totalTickets }}</p>
  </div>

  <!-- Estadísticas -->
  <div class="p-4 rounded-xl bg-blue-900/50 shadow-md space-y-2 text-white">
    <h3 class="text-lg font-bold text-white">Estadísticas</h3>
    <p><strong>⭐ Calificación:</strong> {{ user.rating }}/5</p>
    <p><strong>✅ Tasa de cumplimiento:</strong> 100% (todas las rifas entregadas)</p>
    <p><strong>👥 Participantes:</strong> {{ totalTickets }} boletos vendidos en total</p>
  </div>

</div>

      <!-- Rifas -->
      <div v-if="currentTab === 'Rifas'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="(rifa, i) in sortedRifas" :key="i">
          <!-- Rifas activas -->
          <ProductCard
            v-if="isActive(rifa.drawDate)"
            :image="rifa.images?.[0]"
            :title="rifa.title"
            :description="rifa.description"
            :progress="productProgress(rifa)"
            :drawDate="rifa.drawDate"
            @view-details="() => openDetails(rifa)"
            @participar="() => openParticipateModal(rifa)"
          />

          <!-- Rifas inactivas -->
          <div
            v-else
            class="p-4 rounded-xl shadow relative transition bg-gray-500/40 opacity-70 pointer-events-none"
          >
            <h3 class="font-bold text-white">{{ rifa.title }}</h3>
            <p class="text-sm text-white/90">{{ rifa.description }}</p>
            <span class="text-xs text-gray-300">
              Rifado el: {{ new Date(rifa.drawDate).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

    <!-- Comentarios -->
    <div v-if="currentTab === 'Comentarios'" class="space-y-4">
    <div
        v-for="(c, i) in user.comments"
        :key="i"
        class="p-4 rounded-xl bg-blue-900/60 shadow-md flex gap-3 items-start"
    >
        <!-- Avatar -->
        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow">
        <img
            v-if="c.avatar"
            :src="c.avatar"
            alt="avatar"
            class="w-full h-full object-cover rounded-full"
        />
        <span v-else>{{ c.user.charAt(0).toUpperCase() }}</span>
        </div>

        <!-- Contenido -->
        <div class="flex-1">
        <div class="flex justify-between items-center">
            <h4 class="font-semibold text-yellow-300">{{ c.user }}</h4>
            <span class="text-xs text-gray-400">{{ c.date }}</span>
        </div>

        <!-- Rating -->
        <div class="flex items-center mt-1">
            <i
            v-for="n in 5"
            :key="n"
            class="fas"
            :class="n <= c.rating ? 'fa-star text-yellow-400' : 'fa-star text-gray-600'"
            ></i>
        </div>

        <!-- Texto -->
        <p class="text-sm mt-2 text-white/90 leading-relaxed">{{ c.text }}</p>
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

    if (activeA !== activeB) return activeA ? -1 : 1; // Activas primero
    return new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime(); // Más nuevas primero
  });
});

// Saber si la rifa está activa
function isActive(drawDate: string) {
  return new Date(drawDate).getTime() > Date.now();
}

// --- Manejo de modales ---
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

// Total de tickets vendidos del usuario
const totalTickets = computed(() => {
  return userRifas.value.reduce((acc, r) => acc + (r.ticketsVendidos || 0), 0);
});

// Categorías únicas de ese usuario
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
button:focus {
  outline: none;
}
</style>
