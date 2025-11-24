<template>
  <div class="user-profile-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="top-accent-line"></div>
      
      <div class="nav-content">
        <div class="logo-container">
          <router-link to="/" class="logo-text">
            Bolidos Rifas
          </router-link>
        </div>

        <ul class="nav-links hidden-mobile">
          <li>
            <router-link to="/" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              INICIO
            </router-link>
          </li>
          <li>
            <a href="#" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              CUENTAS DE PAGO
            </a>
          </li>
          <li>
            <a href="#" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A9.948 9.948 0 0110 5a9.95 9.95 0 014.793 9.39A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
              </svg>
              CONTACTO
            </a>
          </li>
        </ul>

        <button class="btn-boletos">LISTA DE BOLETOS</button>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="main-content">
      <!-- Header -->
      <div class="catalog-header">
        <h1 class="catalog-title">DISPONIBLES</h1>
      </div>

      <!-- Grid de Rifas -->
      <div class="raffles-grid">
        <!-- Rifa 1: La Tanqueta -->
        <div class="raffle-card">
          <div class="raffle-image-container">
            <img 
              src="https://www.reporteextra.com/wp-content/uploads/2020/10/toyota-rojo-1024x681.jpg" 
              alt="Toyota Tanqueta Roja" 
              class="raffle-image"
            />
          </div>
          <div class="raffle-header">
            <h2 class="raffle-name">LA TANQUETA DE BÓLIDOS 2.0</h2>
            <div class="raffle-date">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="date-icon">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              30 Noviembre, 2025
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-container">
              <div class="progress-bar-gradient" :style="{ width: '48.6%' }">
                <span class="progress-text">48,6%</span>
              </div>
            </div>
          </div>

          <button class="btn-tickets">
            BOLETOS DISPONIBLES
          </button>
        </div>

        <!-- Rifa 2: Los Aguinaldos -->
        <div class="raffle-card">
          <div class="raffle-image-container">
            <img 
              src="https://paultan.org/image/2016/03/2016-Toyota-Hilux-preview.jpg" 
              alt="Toyota Hilux" 
              class="raffle-image"
            />
          </div>
          <div class="raffle-header">
            <h2 class="raffle-name">LOS AGUINALDOS DE BÓLIDOS</h2>
            <div class="raffle-date">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="date-icon">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              26 Noviembre, 2025
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-container">
              <div class="progress-bar-gradient" :style="{ width: '8.1%' }">
                <span class="progress-text">8,1%</span>
              </div>
            </div>
          </div>

          <button class="btn-tickets">
            BOLETOS DISPONIBLES
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lógica del componente si es necesaria
</script>

<style scoped>
.user-profile-container {
  font-family: 'Montserrat', Arial, sans-serif;
  background-color: #fff;
  color: #000;
  width: 100%;
  min-height: 100vh;
}

/* Navbar Styles (igual al original) */
.navbar {
  background-color: #111;
  padding-bottom: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.top-accent-line {
  width: 100%;
  height: 4px;
  background-color: #ff3366;
  box-shadow: 0 0 10px #ff3366;
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
  color: #fff;
  font-size: 20px;
  letter-spacing: -1px;
  background: linear-gradient(to bottom, #fff, #999);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  cursor: pointer;
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
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ff3366;
}

.btn-boletos {
  background-color: #ff4757;
  color: #000;
  border: none;
  padding: 10px 25px;
  border-radius: 9999px;
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
}

.btn-boletos:hover {
  background-color: #ff3366;
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
  color: #ff3366;
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
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
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

.raffle-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff3366, #ff6b9c);
}

.raffle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 51, 102, 0.2);
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
  color: #333;
  margin-bottom: 10px;
  line-height: 1.3;
  text-transform: uppercase;
}

.raffle-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-weight: 600;
  font-size: 0.95rem;
}

.date-icon {
  width: 18px;
  height: 18px;
  color: #ff3366;
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
  background: linear-gradient(90deg, #ff8fa3 0%, #ff4757 100%);
  border-radius: 10px;
  transition: width 0.8s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  position: relative;
  min-width: 60px; /* Asegura que siempre haya espacio para el texto */
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
  background: linear-gradient(135deg, #ff3366, #ff6b9c);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3);
}

.btn-tickets:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 51, 102, 0.4);
  background: linear-gradient(135deg, #e62e5c, #ff5a8c);
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
}
</style>