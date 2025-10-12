<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-yellow-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-lg">Mi Perfil</h1>
        <p class="text-white/80 text-lg">Gestiona tu información personal y preferencias</p>
      </div>

      <!-- Card principal del perfil -->
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 border border-yellow-400/30 backdrop-blur-sm">
        <!-- Sección de foto de perfil -->
        <div class="flex flex-col items-center mb-8">
          <div class="relative group cursor-pointer mb-4" @click="triggerFileInput">
            <!-- Foto de perfil -->
            <img
              :src="userAvatar"
              alt="Foto de perfil"
              class="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-2xl object-cover transition-all duration-300 group-hover:border-yellow-300 group-hover:scale-105"
            />
            
            <!-- Overlay con icono de cámara -->
            <div class="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div class="bg-yellow-400/90 w-12 h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <i class="fas fa-camera text-gray-900 text-xl"></i>
              </div>
            </div>
            
            <!-- Input file oculto -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
          </div>
          
          <!-- Nombre del usuario -->
          <h2 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">{{ user?.name || 'Usuario' }}</h2>
          <p class="text-gray-300 text-lg">{{ user?.email || 'usuario@ejemplo.com' }}</p>
        </div>

        <!-- Opciones de configuración -->
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-white mb-6 text-center drop-shadow-lg">Configuración de la cuenta</h3>
          
          <!-- Información personal - ACORDEÓN -->
          <div class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-green-500/50 transition-all duration-300 overflow-hidden shadow-lg">
            <button 
              @click="toggleSection('personalInfo')"
              class="w-full flex items-center justify-between p-6 text-left bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-user-edit text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-lg">Información Personal</div>
                  <div class="text-gray-400 text-sm">Edita tu nombre y correo electrónico</div>
                </div>
              </div>
              <i 
                class="fas text-gray-500 text-lg transition-transform duration-300"
                :class="openSection === 'personalInfo' ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>
            
            <!-- Contenido expandible -->
            <div 
              v-if="openSection === 'personalInfo'"
              class="px-6 pb-6 border-t border-gray-600 pt-4 animate-fade-in bg-gray-750"
            >
              <div class="space-y-4">
                <!-- Nombre -->
                <div>
                  <label class="block text-white font-semibold mb-2">Nombre completo</label>
                  <input
                    v-model="personalInfo.name"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                
                <!-- Email -->
                <div>
                  <label class="block text-white font-semibold mb-2">Correo electrónico</label>
                  <input
                    v-model="personalInfo.email"
                    type="email"
                    class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
                    placeholder="Ingresa tu email"
                  />
                </div>
                
                <!-- Botón guardar -->
                <button
                  @click="savePersonalInfo"
                  class="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-green-500/30"
                >
                  <i class="fas fa-save mr-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <!-- Cambiar contraseña - ACORDEÓN -->
          <div class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-lg">
            <button 
              @click="toggleSection('changePassword')"
              class="w-full flex items-center justify-between p-6 text-left bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-lock text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-lg">Seguridad</div>
                  <div class="text-gray-400 text-sm">Cambia tu contraseña de acceso</div>
                </div>
              </div>
              <i 
                class="fas text-gray-500 text-lg transition-transform duration-300"
                :class="openSection === 'changePassword' ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>
            
            <!-- Contenido expandible -->
            <div 
              v-if="openSection === 'changePassword'"
              class="px-6 pb-6 border-t border-gray-600 pt-4 animate-fade-in bg-gray-750"
            >
              <div class="space-y-4">
                <!-- Contraseña actual -->
                <div>
                  <label class="block text-white font-semibold mb-2">Contraseña actual</label>
                  <input
                    v-model="passwordData.currentPassword"
                    type="password"
                    class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>
                
                <!-- Nueva contraseña -->
                <div>
                  <label class="block text-white font-semibold mb-2">Nueva contraseña</label>
                  <input
                    v-model="passwordData.newPassword"
                    type="password"
                    class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    placeholder="Ingresa nueva contraseña"
                  />
                </div>
                
                <!-- Confirmar contraseña -->
                <div>
                  <label class="block text-white font-semibold mb-2">Confirmar contraseña</label>
                  <input
                    v-model="passwordData.confirmPassword"
                    type="password"
                    class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                
                <!-- Botón cambiar contraseña -->
                <button
                  @click="changePassword"
                  class="w-full bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-blue-500/30"
                >
                  <i class="fas fa-key mr-2"></i>
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>

          <!-- Cerrar sesión -->
          <div class="bg-gradient-to-br from-red-900/80 to-red-800/80 rounded-2xl border border-red-700 hover:border-red-500 transition-all duration-300 mt-8 shadow-lg">
            <button 
              @click="handleLogout"
              class="w-full flex items-center justify-between p-6 text-left bg-red-900/40 hover:bg-red-800/40 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-700 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-sign-out-alt text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-lg">Cerrar Sesión</div>
                  <div class="text-gray-300 text-sm">Salir de tu cuenta de forma segura</div>
                </div>
              </div>
              <i class="fas fa-chevron-right text-gray-500 text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const fileInput = ref<HTMLInputElement | null>(null)
const openSection = ref<string | null>(null)

// Datos del formulario
const personalInfo = reactive({
  name: '',
  email: ''
})

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed properties para los datos del usuario
const user = computed(() => authStore.user)
const userAvatar = computed(() => user.value?.avatar || '/default-avatar.png')

// Inicializar datos del usuario
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }
  
  // Cargar datos del usuario en el formulario
  if (user.value) {
    personalInfo.name = user.value.name || ''
    personalInfo.email = user.value.email || ''
  }
})

// Funciones
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    console.log('Nueva imagen seleccionada:', file.name)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      if (user.value) {
        user.value.avatar = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// Sistema de acordeón
const toggleSection = (section: string) => {
  openSection.value = openSection.value === section ? null : section
}

// Guardar información personal
const savePersonalInfo = () => {
  if (!personalInfo.name.trim() || !personalInfo.email.trim()) {
    alert('Por favor completa todos los campos')
    return
  }
  
  // Aquí iría la lógica para guardar en el backend
  console.log('Guardando información personal:', personalInfo)
  
  // Actualizar en el store
  if (user.value) {
    user.value.name = personalInfo.name
    user.value.email = personalInfo.email
  }
  
  alert('Información personal actualizada correctamente')
}

// Cambiar contraseña
const changePassword = () => {
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    alert('Por favor completa todos los campos de contraseña')
    return
  }
  
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    alert('Las contraseñas nuevas no coinciden')
    return
  }
  
  if (passwordData.newPassword.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres')
    return
  }
  
  // Aquí iría la lógica para cambiar contraseña en el backend
  console.log('Cambiando contraseña:', passwordData)
  
  // Limpiar formulario
  passwordData.currentPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
  
  alert('Contraseña cambiada correctamente')
  openSection.value = null
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    authStore.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Color personalizado para el fondo de contenido expandido */
.bg-gray-750 {
  background-color: #374151;
}

/* Mejoras visuales para los inputs */
input:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Efecto de brillo en hover para las secciones */
.bg-gradient-to-br:hover {
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
}
</style>