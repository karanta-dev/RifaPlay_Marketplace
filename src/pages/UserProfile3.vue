<template>
  <div class="user-profile-container">
    <nav class="navbar" :style="{ backgroundColor: navbarBg }">
      <div class="top-accent-line" :style="{ 
        backgroundColor: primary,
        boxShadow: `0 0 10px ${primary}` 
      }"></div>
      
      <div class="nav-content">
        <div class="logo-container">
          <router-link 
            :to="riferoProfileLink" 
            class="logo-text"
            :style="{ 
              background: `linear-gradient(to bottom, ${textPrimary}, #999)`,
              backgroundClip: 'text'
            }"
          >
            <span v-if="loadingProfile">Cargando...</span>
            <span v-else>{{ sellerName }}</span>
          </router-link>
        </div>

        <ul class="nav-links hidden-mobile">
          <li>
            <router-link to="/" class="nav-link" :style="{ color: textPrimary }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              INICIO
            </router-link>
          </li>
          <li>
            <a href="#" class="nav-link" :style="{ color: textPrimary }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              CUENTAS DE PAGO
            </a>
          </li>
          <li>
            <a href="#" class="nav-link" :style="{ color: textPrimary }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A9.948 9.948 0 0110 5a9.95 9.95 0 014.793 9.39A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
              </svg>
              CONTACTO
            </a>
          </li>
        </ul>

        <button 
          class="btn-boletos" 
          :style="{ 
            backgroundColor: buttonBg,
            color: buttonText,
            boxShadow: `0 0 15px ${buttonBg}40`
          }"
        >
          LISTA DE BOLETOS
        </button>
      </div>
    </nav>

    <div class="main-content">
      <div class="catalog-header">
        <h1 class="catalog-title" :style="{ color: primary }">
          DISPONIBLES
        </h1>
      </div>

      <div v-if="loadingRaffles" class="text-center py-10">
        <p class="text-xl font-bold text-gray-500">Cargando rifas...</p>
      </div>

      <div v-else-if="filteredRaffles.length === 0" class="text-center py-10">
        <p class="text-xl font-bold text-gray-500">Este usuario no tiene rifas activas en este momento.</p>
      </div>

      <div v-else class="raffles-grid">
        <div 
          v-for="raffle in filteredRaffles" 
          :key="raffle.uuid" 
          class="raffle-card"
          :style="{ backgroundColor: cardBg }"
        >
          <div class="top-bar" :style="{ 
            background: `linear-gradient(90deg, ${primary}, ${secondary})` 
          }"></div>
          
          <div class="raffle-image-container">
            <img 
              :src="getImageUrl(raffle)" 
              :alt="raffle.name" 
              class="raffle-image"
            />
          </div>
          <div class="raffle-header">
            <h2 class="raffle-name" :style="{ color: textSecondary }">{{ raffle.name }}</h2>
            <div class="raffle-date" :style="{ color: textSecondary }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="date-icon" :style="{ color: primary }">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              {{ formatDate(raffle.raffle_date) }}
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-container">
              <div 
                class="progress-bar-gradient" 
                :style="{ 
                  width: calculateProgress(raffle) + '%',
                  background: `linear-gradient(90deg, ${progressStart}, ${progressEnd})`
                }"
              >
                <span class="progress-text">{{ calculateProgress(raffle) }}%</span>
              </div>
            </div>
          </div>

          <button 
            class="btn-tickets" 
            @click="handleTicketButtonClick(raffle)"
            :style="{ 
              background: `linear-gradient(135deg, ${primary}, ${secondary})`,
              boxShadow: `0 4px 15px ${primary}50`
            }"
          >
            {{ isAuthenticated ? 'BOLETOS DISPONIBLES' : 'INICIA SESIÓN' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="site-footer" :style="{ backgroundColor: footerBg }">
      <div class="footer-content">
        <div class="footer-text">
          <h3 :style="{ color: textPrimary }">
            Nuestro objetivo es <span class="highlight" :style="{ color: textPrimary }">premiarte!</span>
          </h3>
        </div>
        
        <div class="footer-sections">
          <div class="footer-section">
            <h4 :style="{ color: textPrimary }">BOLIDOS RIFAS</h4>
            <ul>
              <li><a href="#" :style="{ color: textPrimary }">SORTEOS - PREMIOS🍀</a></li>
              <li><a href="#" :style="{ color: textPrimary }">Nuestro objetivo es premiarte!</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 :style="{ color: textPrimary }">SECCIONES</h4>
            <ul>
              <li><a href="#" :style="{ color: textPrimary }">Inicio</a></li>
              <li><a href="#" :style="{ color: textPrimary }">Premios</a></li>
              <li><a href="#" :style="{ color: textPrimary }">Verificar mis Boletos</a></li>
              <li><a href="#" :style="{ color: textPrimary }">Preguntas Frecuentes</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 :style="{ color: textPrimary }">CONTACTO</h4>
            <ul>
              <li><a href="mailto:info@bolidosrifas.com" :style="{ color: textPrimary }">www.bolidorifas.com/</a></li>
              <li><a href="https://www.bolidosrifas.com" :style="{ color: textPrimary }">+573205477340</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 :style="{ color: textPrimary }">SIGUENOS</h4>
            <ul>
              <li>
                <a href="https://www.instagram.com/bolidosrifas/" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="textPrimary">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>      
        </div>
      </div>
      
      <div class="footer-bottom">
        <p :style="{ color: textPrimary }">&copy; 2023 Bólidos Rifas. Todos los derechos reservados.</p>
      </div>
    </footer>
    
    <!-- Selector de colores (opcional, puedes agregarlo donde quieras) -->
    <div v-if="showColorSelector" class="color-selector">
      <div class="color-options">
        <button 
          v-for="scheme in availableSchemes" 
          :key="scheme.name"
          @click="selectColorScheme(scheme.name)"
          class="color-option"
          :style="{ backgroundColor: scheme.colors.primary }"
          :title="scheme.name"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useColorStore } from '@/stores/useColorStore'; // Importar el store de colores
import { RaffleService, UserService, type UserProfile } from "@/services/RaffleService"; 

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const colorStore = useColorStore(); // Instanciar el store de colores

// Estados
const userProfile = ref<UserProfile | null>(null);
const raffles = ref<any[]>([]);
const loadingProfile = ref(true);
const loadingRaffles = ref(true);
const showColorSelector = ref(true); // Control para mostrar/ocultar el selector

// Obtener colores del store
const primary = computed(() => colorStore.primary);
const secondary = computed(() => colorStore.secondary);
const navbarBg = computed(() => colorStore.navbarBg);
const footerBg = computed(() => colorStore.footerBg);
const textPrimary = computed(() => colorStore.textPrimary);
const textSecondary = computed(() => colorStore.textSecondary);
const buttonBg = computed(() => colorStore.buttonBg);
const buttonText = computed(() => colorStore.buttonText);
const progressStart = computed(() => colorStore.progressStart);
const progressEnd = computed(() => colorStore.progressEnd);
const cardBg = computed(() => colorStore.cardBg);

// Obtener esquemas disponibles
const availableSchemes = computed(() => colorStore.getAvailableSchemes());

// Computed property para verificar autenticación
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated;
});

// Computed property para el enlace del perfil del rifero actual
const riferoProfileLink = computed(() => {
  const userId = route.params.id as string;
  if (userId) {
    return { 
      name: 'user-profile', 
      params: { id: userId } 
    };
  }
  return '/';
});

// Computed para obtener el nombre del vendedor (Rifero)
const sellerName = computed(() => {
  if (userProfile.value) {
    const firstName = userProfile.value.name || '';
    const lastName = userProfile.value.profile?.data?.last_name || ''; 
    
    if (!firstName && !lastName) return 'Perfil de Usuario';
    
    return `${firstName} ${lastName}`.trim().toUpperCase();
  }
  return 'BOLIDOS RIFAS'; // Fallback inicial mientras carga
});

// CORRECCIÓN APLICADA AQUÍ: Se añade la validación Array.isArray()
const filteredRaffles = computed(() => {
  // Verificación defensiva para evitar el error 'length' si raffles.value es null/undefined.
  if (!Array.isArray(raffles.value)) {
    return [];
  }
  
  return raffles.value.filter(raffle => 
    raffle.status && raffle.status.toLowerCase() === 'aprobada'
  );
});

// Helper para formatear fecha
const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha por definir';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

// Helper para calcular progreso
const calculateProgress = (raffle: any) => {
  const totalTickets = (raffle.end_range - raffle.initial_range + 1) || 100;
  const soldTickets = raffle.tickets_sold || 0;
  const percentage = (soldTickets / totalTickets) * 100;
  
  return percentage.toFixed(1).replace('.', ',');
};

// Helper para obtener imagen
const getImageUrl = (raffle: any) => {
  if (raffle.images && raffle.images.length > 0) {
    return raffle.images[0].url;
  }
  return 'https://via.placeholder.com/800x600?text=Sorteo'; 
};

// Función para manejar el clic en el botón de boletos
const handleTicketButtonClick = (raffle: any) => {
  if (isAuthenticated.value) {
    // Si está autenticado, navega a la rifa
    goToRaffle(raffle);
  } else {
    // Si no está autenticado, abre el modal de autenticación
    openLoginModal();
  }
};

// Función para seleccionar esquema de colores
const selectColorScheme = (schemeName: string) => {
  colorStore.setColorScheme(schemeName);
};

// Navegación a la rifa
const goToRaffle = (raffle: any) => {
  console.log("Navegar a rifa:", raffle.name);
  router.push({ name: 'user-profile-juan', params: { id: raffle.uuid } }); 
};

// Función para abrir el modal de autenticación
const openLoginModal = () => {
  authStore.showLoginModal = true;
  console.log("Abriendo modal de autenticación");
};

// Cargar Datos
const fetchUserData = async () => {
  const userId = route.params.id as string;
  if (!userId) {
    loadingProfile.value = false;
    loadingRaffles.value = false;
    return;
  }

  loadingProfile.value = true;
  loadingRaffles.value = true;

  try {
    // 1. Cargar Perfil del Usuario para el nombre del logo
    const profileResponse = await UserService.getPublicProfile(userId);
    userProfile.value = profileResponse;
    
    // 2. Cargar todas las rifas y filtrar en el frontend
    const rafflesResponse = await RaffleService.getAll(1, 100);
    
    if (rafflesResponse && Array.isArray(rafflesResponse.data)) {
      raffles.value = rafflesResponse.data.filter((r: any) => {
        return r.seller && r.seller.uuid === userId;
      });
    }

  } catch (error) {
    console.error("Error cargando datos del perfil:", error);
    raffles.value = []; // Asegurarse de que sea un array en caso de fallo
  } finally {
    loadingProfile.value = false;
    loadingRaffles.value = false;
  }
};

// Inicializar el store de colores
onMounted(() => {
  colorStore.initialize(); // Cargar esquema guardado
  fetchUserData();
});
</script>

<style scoped>
.user-profile-container {
  font-family: 'Montserrat', Arial, sans-serif;
  background-color: #fff;
  color: #000;
  width: 100%;
  min-height: 100vh;
}

/* Navbar Styles */
.lgtangueta-container .navbar {
  z-index: 30 !important;
}

/* O también puedes hacer: */
.navbar {
  background-color: #111;
  padding-bottom: 10px;
  position: sticky;
  top: 0;
  z-index: 30 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
.top-accent-line {
  width: 100%;
  height: 4px;
  box-shadow: 0 0 10px currentColor;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px 5px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 20px;
  letter-spacing: -1px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  cursor: pointer;
  text-transform: uppercase;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 25px;
  font-size: 13px;
  font-weight: 800;
  margin: 0;
  padding: 0;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.btn-boletos {
  border: none;
  padding: 10px 25px;
  border-radius: 9999px;
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.btn-boletos:hover {
  transform: scale(1.05);
}

/* Main Content Styles */
.main-content {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}

.catalog-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.catalog-title {
  font-size: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.raffles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.raffle-card {
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--card-bg-light) 100%);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.raffle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.raffle-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.raffle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.raffle-card:hover .raffle-image {
  transform: scale(1.05);
}

.raffle-header {
  margin-bottom: 25px;
  padding: 20px 30px 0;
}

.raffle-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.3;
  text-transform: uppercase;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.9rem; 
}

.raffle-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
}

.date-icon {
  width: 18px;
  height: 18px;
}

.progress-section {
  margin-bottom: 25px;
  padding: 0 30px;
}

.progress-container {
  background-color: #e9ecef;
  border-radius: 10px;
  height: 24px;
  overflow: hidden;
  position: relative;
}

.progress-bar-gradient {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  position: relative;
  min-width: 60px;
}

.progress-text {
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.btn-tickets {
  width: calc(100% - 60px);
  margin: 0 30px 30px;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-tickets:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* Footer Styles */
.site-footer {
  padding: 40px 20px 20px;
  margin-top: 50px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-text h3 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.highlight {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.footer-sections {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 20px;
}

.footer-section {
  text-align: left;
}

.footer-section h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  text-decoration: none;
  transition: opacity 0.3s;
  font-size: 14px;
}

.footer-section a:hover {
  opacity: 0.8;
}

.footer-bottom {
  max-width: 1200px;
  margin: 30px auto 0;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
  opacity: 0.8;
}

/* Color Selector */
.color-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.color-options {
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .catalog-title {
    font-size: 2rem;
  }
  
  .raffles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 15px;
  }
  
  .raffle-card {
    padding: 0;
  }
  
  .raffle-header {
    padding: 15px 20px 0;
  }
  
  .progress-section {
    padding: 0 20px;
  }
  
  .raffle-name {
    font-size: 1.3rem;
  }
  
  .btn-tickets {
    width: calc(100% - 40px);
    margin: 0 20px 20px;
  }

  .nav-links {
    display: none;
  }
  
  .progress-container {
    height: 20px;
  }
  
  .progress-text {
    font-size: 0.7rem;
  }
  
  .footer-sections {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-text h3 {
    font-size: 22px;
  }
  
  .color-selector {
    bottom: 10px;
    right: 10px;
  }
  
  .color-options {
    flex-wrap: wrap;
    max-width: 120px;
  }
}
</style>