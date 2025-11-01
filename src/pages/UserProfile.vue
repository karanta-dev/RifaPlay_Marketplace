<template>
  <div class="min-h-screen bg-[#0f1923] text-white">
    <!-- Header estilo 1Win con perfil de usuario -->
    <div class="bg-[#1a2a37] border-b border-[#2a3b4a] p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="$router.back()" 
            class="px-4 py-2 rounded-lg bg-[#2a3b4a] hover:bg-[#34495e] text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <i class="fas fa-arrow-left"></i>
            <span class="hidden sm:inline">Volver</span>
          </button>
        </div>
        
        <!-- Perfil del usuario -->
<div class="flex items-center gap-3">
  <div class="flex items-center gap-3">
    <!-- Avatar del usuario -->
    <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00d8a7]">
      <img
        v-if="userAvatar" 
        :src="userAvatar" 
        alt="avatar"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-r from-[#00d8a7] to-[#00c797] flex items-center justify-center text-white font-bold"
      >
        {{ fullName.charAt(0).toUpperCase() }}
      </div>
    </div>
    
    <!-- Información del usuario -->
    <div>
      <div class="text-white font-bold">
        {{ fullName }}
      </div>
      <div class="text-gray-400 text-xs" v-if="userProfile">
        Miembro desde {{ formatDate(userProfile.member_since) }}
      </div>
    </div>
  </div>
  
  <button class="p-2 rounded-lg bg-[#2a3b4a] hover:bg-[#34495e] text-gray-300 transition-all">
    <i class="fas fa-share-alt"></i>
  </button>
</div>
      </div>
    </div>

    <!-- Navegación Mejorada -->
    <div class="bg-[#1a2a37] border-b border-[#2a3b4a]">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-center space-x-1 py-2">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="currentTab = tab"
            :class="[
              'px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300',
              currentTab === tab 
                ? 'bg-[#00d8a7] text-[#0f1923] shadow-lg shadow-[#00d8a7]/20' 
                : 'bg-[#2a3b4a] text-gray-300 hover:bg-[#34495e] hover:text-white'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </div>

    <!-- Carrusel de Banners -->
    <div class="relative h-60 overflow-hidden">
      <!-- Banner activo -->
      <div 
        v-for="(banner, index) in banners" 
        :key="banner.id"
        v-show="currentBannerIndex === index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{ 'opacity-100': currentBannerIndex === index, 'opacity-0': currentBannerIndex !== index }"
      >
        <div class="h-full w-full bg-cover bg-center" :style="{ backgroundImage: `url(${banner.image})` }">
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
          <div class="relative h-full flex items-center">
            <div class="max-w-6xl mx-auto px-6 w-full">
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ banner.title }}</h1>
              <p class="text-gray-300 mb-4 text-lg">{{ banner.description }}</p>
              <button class="bg-[#00d8a7] text-[#0f1923] px-6 py-3 rounded-lg font-bold hover:bg-[#00c797] transition-colors">
                {{ banner.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicadores del carrusel -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(banner, index) in banners"
          :key="banner.id"
          @click="currentBannerIndex = index"
          class="w-3 h-3 rounded-full transition-all"
          :class="currentBannerIndex === index ? 'bg-[#00d8a7]' : 'bg-white bg-opacity-50'"
        ></button>
      </div>
      
      <!-- Controles de navegación -->
      <button 
        @click="prevBanner" 
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button 
        @click="nextBanner" 
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Sección Inicio -->
      <div v-if="currentTab === 'Inicio'" class="space-y-8">
        <!-- Promociones Destacadas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="promo in promociones" 
            :key="promo.id"
            class="bg-[#1a2a37] rounded-xl border border-[#2a3b4a] overflow-hidden hover:border-[#00d8a7] transition-colors"
          >
            <div class="h-40 bg-gradient-to-r from-[#2a3b4a] to-[#1a2a37] flex items-center justify-center">
              <i :class="promo.icon" class="text-4xl text-[#00d8a7]"></i>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-white text-lg mb-2">{{ promo.title }}</h3>
              <p class="text-gray-400 text-sm mb-4">{{ promo.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-[#00d8a7] text-sm font-bold">{{ promo.bonus }}</span>
                <button class="bg-[#00d8a7] text-[#0f1923] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#00c797] transition-colors">
                  PARTICIPAR
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Rifas Populares -->
        <div>
          <h2 class="text-2xl font-bold text-white mb-6">Rifas Populares</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="rifa in rifasPopulares" 
              :key="rifa.id"
              class="bg-[#1a2a37] rounded-xl border border-[#2a3b4a] p-4 hover:border-[#00d8a7] transition-colors"
            >
              <div class="h-32 bg-gradient-to-r from-[#2a3b4a] to-[#1a2a37] rounded-lg mb-4 flex items-center justify-center">
                <i :class="rifa.icon" class="text-3xl text-[#00d8a7]"></i>
              </div>
              <h4 class="font-bold text-white text-sm mb-2">{{ rifa.title }}</h4>
              <p class="text-gray-400 text-xs mb-3">{{ rifa.prize }}</p>
              
              <div class="mb-3">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-400">Progreso</span>
                  <span class="text-white font-bold">{{ rifa.progress }}%</span>
                </div>
                <div class="w-full bg-[#2a3b4a] rounded-full h-2">
                  <div 
                    class="bg-[#00d8a7] h-2 rounded-full" 
                    :style="{ width: rifa.progress + '%' }"
                  ></div>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-gray-400 text-xs">{{ rifa.date }}</span>
                <button class="bg-[#00d8a7] text-[#0f1923] px-3 py-1 rounded text-xs font-bold hover:bg-[#00c797] transition-colors">
                  JUGAR
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Todos los Juegos -->
        <div>
          <h2 class="text-2xl font-bold text-white mb-6">Todos las categorias</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="juego in juegos" 
              :key="juego.id"
              class="bg-[#1a2a37] rounded-lg border border-[#2a3b4a] p-4 text-center hover:border-[#00d8a7] transition-colors cursor-pointer"
            >
              <i :class="juego.icon" class="text-2xl text-[#00d8a7] mb-2"></i>
              <p class="text-white text-sm">{{ juego.name }}</p>
            </div>
          </div>
        </div>
      </div>

     <!-- Sección Rifas -->
      <div v-if="currentTab === 'Rifas'" class="space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="main-spinner"></div>
          <p class="text-white mt-4">Cargando rifas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <i class="fas fa-exclamation-triangle text-3xl text-yellow-500 mb-4"></i>
          <p class="text-gray-400">{{ error }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="userRafflesAsProducts.length === 0" class="text-center py-8">
          <i class="fas fa-ticket-alt text-3xl text-gray-500 mb-4"></i>
          <p class="text-gray-400">Este usuario no tiene rifas activas</p>
        </div>

        <!-- Rifas Grid -->
        <div v-else class="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          <ProductCard
            v-for="product in userRafflesAsProducts"
            :key="product.uuid"
            :product="product"
            @view-details="openDetails(product)"
          />
        </div>
      </div>

      <!-- Sección Comentarios -->
      <div v-if="currentTab === 'Comentarios'" class="space-y-6">
        <div class="bg-[#1a2a37] rounded-xl border border-[#2a3b4a] p-6">
          <h2 class="text-2xl font-bold text-white mb-6">Comentarios de Usuarios</h2>
          
          <div class="space-y-4">
            <div 
              v-for="comentario in comentarios" 
              :key="comentario.id"
              class="border-b border-[#2a3b4a] pb-4 last:border-b-0"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-[#00d8a7] rounded-full flex items-center justify-center text-[#0f1923] font-bold">
                  {{ comentario.user.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h4 class="font-bold text-white">{{ comentario.user }}</h4>
                      <div class="flex items-center gap-1 mt-1">
                        <i 
                          v-for="n in 5" 
                          :key="n"
                          class="fas fa-star text-xs"
                          :class="n <= comentario.rating ? 'text-yellow-400' : 'text-gray-600'"
                        ></i>
                      </div>
                    </div>
                    <span class="text-gray-400 text-sm">{{ comentario.date }}</span>
                  </div>
                  <p class="text-gray-300 text-sm">{{ comentario.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-[#1a2a37] border-t border-[#2a3b4a] mt-12 p-6">
      <div class="max-w-6xl mx-auto text-center text-gray-400 text-sm">
        <!-- <p>© 2024 TWIN. Todos los derechos reservados.</p> -->
      </div>
    </div>

    <!-- Modales -->
    <JackpotAnimation 
      :show="showJackpot" 
      :initial-tickets="userInitialTickets" 
      :purchased-tickets="purchasedTicketsCount" 
      @close="handleJackpotClose"
    />
    <ProductModal 
      :isOpen="showProductModal" 
      :category="selectedCategory" 
      @close="showProductModal = false" 
      @participar="openParticipateModalThroughStore"
    />
    <ConfirmacionModal 
      :open="showConfirm" 
      :selectedProduct="selectedProduct" 
      @close="showConfirm = false" 
      @showJackpot="handleShowJackpot"
    />
    <DetailsModal 
      :open="showDetails" 
      :product="selectedProduct" 
      @close="showDetails = false" 
      @buy="openParticipateModalThroughStore"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { useTicketStore } from "@/stores/useTicketStore";
import { UserService, type UserProfile, type Raffle } from "@/services/RaffleService";

// Components
import ProductCard from "@/components/ProductCard.vue";
import ConfirmacionModal from "@/components/ConfirmationModal.vue";
import DetailsModal from "@/components/ProductDetailsModal.vue";
import ProductModal from "@/components/ProductModal.vue";
import JackpotAnimation from "@/components/JackpotAnimation.vue";

const userStore = useUserStore();
const ticketStore = useTicketStore();
const route = useRoute();

// Tabs de navegación
const tabs = ["Inicio", "Rifas", "Comentarios"];
const currentTab = ref("Inicio");

// Perfil del usuario cargado desde el endpoint
const userProfile = ref<UserProfile | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal states
const showConfirm = ref(false);
const showJackpot = ref(false);
const showProductModal = ref(false);
const selectedCategory = ref<string | null>(null);
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
    ticketPrice: Number(raffle.ticket_price) || 0, // ✅ Convertir a número
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

const openParticipateModalThroughStore = (product: any) => {
  selectedProduct.value = product;
  showDetails.value = false;
  showConfirm.value = true;
};

onMounted(() => {
  bannerInterval = setInterval(nextBanner, 3000);
});

onUnmounted(() => {
  if (bannerInterval) {
    clearInterval(bannerInterval);
  }
});
// Cargar perfil del usuario
onMounted(async () => {
  const userId = route.params.id as string;
  try {
    userProfile.value = await UserService.getPublicProfile(userId);
    
  } catch (error) {
    console.error("Error al cargar el perfil del usuario:", error);
  } finally {
    loading.value = false;
  }
});
// Datos de promociones
const promociones = ref([
  {
    id: 1,
    title: "Bono de Bienvenida",
    description: "+500% en tus primeros 4 depósitos",
    bonus: "+500% BONUS",
    icon: "fas fa-gift"
  },
  {
    id: 2,
    title: "Free Money",
    description: "Sorteamos Ferrari F8 Spider",
    bonus: "FREE MONEY",
    icon: "fas fa-money-bill-wave"
  },
  {
    id: 3,
    title: "Cashback Semanal",
    description: "Hasta 15% de cashback todas las semanas",
    bonus: "15% CASHBACK",
    icon: "fas fa-chart-line"
  }
]);

// Rifas populares (simuladas)
const rifasPopulares = ref([
  {
    id: 1,
    title: "Ferrari F8",
    prize: "Superdeportivo Italiano",
    progress: 65,
    date: "15/12/2023",
    icon: "fas fa-car"
  },
  {
    id: 2,
    title: "iPhone 15 Pro",
    prize: "512GB Negro Espacial",
    progress: 82,
    date: "20/12/2023",
    icon: "fas fa-mobile-alt"
  },
  {
    id: 3,
    title: "MacBook Pro",
    prize: "M2 Max 1TB SSD",
    progress: 45,
    date: "10/01/2024",
    icon: "fas fa-laptop"
  },
  {
    id: 4,
    title: "PlayStation 5",
    prize: "Edición Digital + Juegos",
    progress: 78,
    date: "05/01/2024",
    icon: "fas fa-gamepad"
  }
]);

// Todos los juegos
const juegos = ref([
  { id: 1, name: "Slots", icon: "fas fa-dice" },
  { id: 2, name: "Blackjack", icon: "fas fa-club" },
  { id: 3, name: "Ruleta", icon: "fas fa-circle" },
  { id: 4, name: "Póker", icon: "fas fa-spade" },
  { id: 5, name: "Baccarat", icon: "fas fa-heart" },
  { id: 6, name: "Dados", icon: "fas fa-dice-six" },
  { id: 7, name: "Deportes", icon: "fas fa-football-ball" },
  { id: 8, name: "Live", icon: "fas fa-video" },
  { id: 9, name: "Virtual", icon: "fas fa-robot" },
  { id: 10, name: "Rifas", icon: "fas fa-ticket-alt" },
  { id: 11, name: "Promos", icon: "fas fa-gift" },
  { id: 12, name: "VIP", icon: "fas fa-crown" }
]);

// Comentarios
const comentarios = ref([
  {
    id: 1,
    user: "Carlos Rodríguez",
    rating: 5,
    date: "hace 2 días",
    text: "Excelente plataforma, muy confiable. Gané un iPhone en la última rifa y todo fue transparente y rápido."
  },
  {
    id: 2,
    user: "Ana Martínez",
    rating: 4,
    date: "hace 1 semana",
    text: "Muy buena experiencia, aunque el sorteo se retrasó un poco. Pero al final todo salió perfecto."
  },
  {
    id: 3,
    user: "Miguel Sánchez",
    rating: 5,
    date: "hace 3 semanas",
    text: "Participé en 3 rifas diferentes y en todas tuve una experiencia excelente. Muy recomendable."
  },
  {
    id: 4,
    user: "Laura González",
    rating: 5,
    date: "hace 1 mes",
    text: "Increíble! Gané el Ferrari F8 Spider! No podía creerlo cuando me llamaron. Servicio impecable."
  }
]);

// Cargar perfil del usuario
onMounted(async () => {
  const userId = route.params.id as string;
  try {
    userProfile.value = await UserService.getPublicProfile(userId);
  } catch (error) {
    console.error("Error al cargar el perfil del usuario:", error);
  } finally {
    loading.value = false;
  }
});

// Computed para las rifas del usuario
const userRaffles = computed(() => {
  return userProfile.value?.raffles || [];
});


// Computed para el avatar (asegura que sea string o undefined, nunca null)
const userAvatar = computed(() => {
  const userData = userStore.getUserById(route.params.id as string);
  return userData?.avatar || undefined; // Convierte null a undefined
});


// Función para calcular el progreso de una rifa
const calculateProgress = (raffle: Raffle) => {
  const totalTickets = raffle.end_range - raffle.initial_range + 1;
  const soldTickets = raffle.tickets_sold;
  return Math.round((soldTickets / totalTickets) * 100);
};

// Función para formatear la fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
</script>

<style scoped>
/* Estilos adicionales para mejorar la apariencia */
body {
  background-color: #0f1923;
  font-family: 'Inter', sans-serif;
}

/* Efectos hover mejorados */
.hover\:border-\[\#00d8a7\]:hover {
  border-color: #00d8a7;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a2a37;
}

::-webkit-scrollbar-thumb {
  background: #00d8a7;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00c797;
}

/* Transiciones suaves para el carrusel */
.transition-opacity {
  transition: opacity 1s ease-in-out;
}
</style>