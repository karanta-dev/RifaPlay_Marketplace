<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-blue-800 to-purple-900 text-white relative overflow-hidden">
    <!-- Patrón de fondo elegante -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-300/3 to-red-400/5"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
    
    <!-- Header Premium -->
    <div class="relative bg-gradient-to-r from-sky-900/90 to-purple-900/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-blue-500/30 shadow-2xl">
      <button 
        @click="$router.back()" 
        class="px-4 py-2 rounded-xl bg-blue-800/60 hover:bg-blue-700 text-purple-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i>
        <span class="hidden sm:inline">Volver</span>
      </button>
      <div class="flex items-center gap-3 text-sm">
        <div class="flex items-center gap-2 bg-blue-800/40 px-3 py-1 rounded-full">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-blue-200">En línea {{ user?.lastSeen }}</span>
        </div>
        <button class="p-2 rounded-lg bg-blue-800/40 hover:bg-blue-700/60 text-blue-200 transition-all">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="relative p-6 flex flex-col items-center text-center z-10" v-if="user">
      <div class="relative">
        <div class="w-28 h-28 rounded-full overflow-hidden shadow-2xl border-4 border-blue-400/80 relative">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold"
          >
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <!-- Badge verificado -->
        <div class="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-sky-600 rounded-full p-2 shadow-lg border-2 border-white">
          <i class="fas fa-check text-white text-xs"></i>
        </div>
      </div>
      
      <h1 class="mt-4 text-3xl font-bold text-white drop-shadow-lg">
        {{ user.name }}
      </h1>
      <p class="text-blue-200 mt-1 text-sm">Rifero Premium Verificado</p>

      <!-- Rating con estilo premium -->
      <div class="flex items-center gap-3 mt-3 bg-blue-900/40 px-4 py-2 rounded-full border border-blue-500/30">
        <div class="flex">
          <i
            v-for="n in 5"
            :key="n"
            class="fas text-lg"
            :class="n <= user.rating ? 'fa-star text-yellow-400' : 'fa-star text-yellow-700'"
          ></i>
        </div>
        <span class="text-blue-200 text-sm font-semibold">{{ user.rating }}/5</span>
      </div>
    </div>

    <!-- Tabs Elegantes -->
    <div class="relative flex justify-center gap-2 px-4 py-4 bg-blue-900/30 backdrop-blur-sm border-y border-blue-500/20">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="[ 
          'px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border',
          currentTab === tab
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/50 scale-105 border-blue-400/50'
            : 'bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 hover:text-white border-blue-700/30'
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
        <div class="bg-gradient-to-br from-blue-800/60 to-purple-800/60 rounded-2xl p-6 shadow-2xl border border-blue-500/30 backdrop-blur-sm">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-gem text-blue-400"></i>
            Categorias manejadas
          </h3>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="cat in categories"
              :key="cat"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-semibold text-white shadow-lg border border-blue-400/30"
            >
              {{ cat }}
            </span>
          </div>
        </div>

        <!-- Estadísticas Premium -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-800/40 rounded-xl p-4 text-center border border-blue-500/20 backdrop-blur-sm">
            <div class="text-2xl font-bold text-white">{{ userRifas.length }}</div>
            <div class="text-blue-200 text-sm mt-1">Rifas Publicadas</div>
          </div>
          <div class="bg-purple-800/40 rounded-xl p-4 text-center border border-purple-500/20 backdrop-blur-sm">
            <div class="text-2xl font-bold text-white">{{ totalTickets }}</div>
            <div class="text-purple-200 text-sm mt-1">Tickets Vendidos</div>
          </div>
        </div>

        <!-- Información Detallada -->
        <div class="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-2xl p-6 shadow-xl border border-blue-500/20">
          <h3 class="text-lg font-bold text-white mb-4">Información del Rifero</h3>
          <div class="space-y-3 text-blue-100">
            <div class="flex justify-between items-center py-2 border-b border-blue-700/30">
              <span class="font-semibold">📅 Miembro desde</span>
              <span class="text-white">hace {{ user.registeredDays }} días</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-blue-700/30">
              <span class="font-semibold">🔥 Rifas Activas</span>
              <span class="text-white">{{ userRifas.filter(r => isActive(r.drawDate)).length }}</span>
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
            :product="rifa"
            v-if="isActive(rifa.drawDate)"
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
            class="p-6 rounded-2xl bg-gradient-to-br from-blue-800/40 to-purple-800/40 border border-blue-700/30 shadow-xl opacity-70"
          >
            <h3 class="font-bold text-white text-lg">{{ rifa.title }}</h3>
            <p class="text-blue-200 mt-2">{{ rifa.description }}</p>
            <div class="mt-3 px-3 py-1 bg-blue-900/60 rounded-full text-blue-300 text-sm inline-block">
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
          class="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-2xl p-6 shadow-xl border border-blue-500/20 backdrop-blur-sm"
        >
          <div class="flex gap-4 items-start">
            <!-- Avatar -->
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
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
                        class="fas text-blue-400"
                        :class="n <= c.rating ? 'fa-star' : 'fa-star text-blue-700'"
                      ></i>
                    </div>
                  </div>
                </div>
                <span class="text-blue-300 text-sm bg-blue-900/40 px-2 py-1 rounded-full">{{ c.date }}</span>
              </div>
              <p class="text-blue-100 leading-relaxed">{{ c.text }}</p>
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
const userInitialTickets = ref(0);
const purchasedTicketsCount = ref(0);

// Carrusel de banners
const currentBannerIndex = ref(0);
const banners = ref([
  {
    id: 1,
    title: "Bono del +500% en tus primeros 4 depósitos",
    description: "Free Money - Sorteamos un Ferrari F8 Spider y otros premios",
    buttonText: "DEPOSITAR AHORA",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "Cashback del 15% todas las semanas",
    description: "Recupera parte de tus pérdidas cada semana sin condiciones",
    buttonText: "OBTENER CASHBACK",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
  },
  {
    id: 3,
    title: "Rifa Especial: iPhone 15 Pro Max + $5,000",
    description: "Participa por el último iPhone y un premio en efectivo",
    buttonText: "PARTICIPAR AHORA",
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
  },
  {
    id: 4,
    title: "Torneo de Slots: $50,000 en Premios",
    description: "Demuestra tus habilidades y gana grandes premios en efectivo",
    buttonText: "UNIRME AL TORNEO",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
]);

// Función para cargar rifas populares
// Función para cargar rifas populares DEL USUARIO ACTUAL
const loadPopularRaffles = async () => {
  loadingPopularRaffles.value = true;
  try {
    // Obtener todas las rifas
    const response = await RaffleService.getAll(1, 50);
    
    if (response && Array.isArray(response.data)) {
      const userId = route.params.id as string;
      
      // Filtrar solo rifas activas del usuario actual
      const now = new Date();
      const userActiveRaffles = response.data.filter(raffle => {
        if (!raffle || !raffle.uuid) return false;
        
        // Verificar que la rifa pertenezca al usuario actual
        if (raffle.seller && raffle.seller.uuid !== userId) {
          return false; // Excluir rifas de otros usuarios
        }
        
        // Verificar si la rifa ya fue sorteada (fecha de sorteo en el pasado)
        if (raffle.raffle_date) {
          const raffleDate = new Date(raffle.raffle_date);
          if (raffleDate < now) return false; // Excluir rifas sorteadas
        }
        
        // Verificar estado de la rifa
        if (raffle.status && raffle.status.toLowerCase() === 'completed') {
          return false; // Excluir rifas completadas
        }
        
        return true;
      });

      // Ordenar por tickets vendidos (de mayor a menor) y tomar las primeras 4
      const sortedRaffles = userActiveRaffles
        .sort((a, b) => (b.tickets_sold || 0) - (a.tickets_sold || 0))
        .slice(0, 4);

      // Transformar al formato necesario para ProductCard
      popularRaffles.value = sortedRaffles.map(raffle => ({
        uuid: raffle.uuid,
        title: raffle.name,
        description: raffle.description,
        ticketPrice: Number(raffle.ticket_price) || 0,
        ticketsVendidos: raffle.tickets_sold || 0,
        ticketsMax: (raffle.end_range - raffle.initial_range + 1) || 100,
        images: raffle.images?.map(img => img.url) || [],
        rifero: fullName.value,
        category: raffle.categories?.[0]?.name || "General",
        progress: calculateProgress(raffle),
        drawDate: raffle.raffle_date,
        isProgressLoading: false,
        initial_range: raffle.initial_range,
        end_range: raffle.end_range,
        raffle_date: raffle.raffle_date,
        status: raffle.status
      }));
    }
  } catch (error) {
    console.error("Error al cargar rifas populares:", error);
    popularRaffles.value = [];
  } finally {
    loadingPopularRaffles.value = false;
  }
};

// Función para cambiar al siguiente banner
const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length;
};

// Función para cambiar al banner anterior
const prevBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.value.length) % banners.value.length;
};

// Configurar el cambio automático cada 3 segundos
let bannerInterval: number;

// Computed para el nombre completo (name + last_name)
const fullName = computed(() => {
  if (userProfile.value) {
    const firstName = userProfile.value.name || '';
    const lastName = userProfile.value.profile.data.last_name || '';
    return `${firstName} ${lastName}`.trim();
  }
  
  // Fallback al store si no hay perfil cargado
  const userData = userStore.getUserById(route.params.id as string);
  return userData?.name || 'Usuario';
});

// Transformar las rifas del usuario al formato de Product que espera ProductCard
const userRafflesAsProducts = computed(() => {
  return userRaffles.value.map(raffle => ({
    uuid: raffle.uuid,
    title: raffle.name,
    description: raffle.description,
    ticketPrice: Number(raffle.ticket_price) || 0,
    ticketsVendidos: raffle.tickets_sold || 0,
    ticketsMax: (raffle.end_range - raffle.initial_range + 1) || 100,
    images: raffle.images?.map(img => img.url) || [],
    rifero: fullName.value,
    category: raffle.categories?.[0]?.name || "General",
    progress: calculateProgress(raffle),
    drawDate: raffle.raffle_date,
    isProgressLoading: false,
    initial_range: raffle.initial_range,
    end_range: raffle.end_range,
    raffle_date: raffle.raffle_date,
    status: raffle.status
  }));
});

// Modal handlers
const handleShowJackpot = () => {
  showConfirm.value = false;
  showJackpot.value = true;
};

const handleJackpotClose = () => {
  showJackpot.value = false;
  setTimeout(() => ticketStore.reset(), 500);
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