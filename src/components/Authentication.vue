<template>
  <!-- Fondo del modal -->
  <div 
    class="fixed inset-0 backdrop-blur-md backdrop-saturate-150 z-50 flex items-center justify-center p-4"
    @click.self="handleBackdropClick"
  >
    <!-- Contenido del modal -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden p-6 animate-fade-in">
      
      <!-- Cerrar - Solo mostrar si está autenticado -->
      <button 
        v-if="isAuthenticated" 
        @click="$emit('close')" 
        class="absolute top-3 right-3 text-gray-600 hover:text-red-500"
      >
        ✕
      </button>

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="/rifaLogo.png" alt="Logo" class="h-16 drop-shadow-lg" />
      </div>

      <!-- Login -->
      <transition name="fade" mode="out-in">
        <div v-if="mode === 'login'" key="login">
          <h2 class="text-xl font-bold text-center mb-4">Iniciar sesión</h2>
            <form class="flex flex-col gap-4 " @submit.prevent="handleLogin">
                <div>
                  <input 
                    v-model="email" 
                    type="email" 
                    placeholder="Correo electrónico" 
                    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    :class="{'border-red-500': loginErrors.email}"
                  />
                  <p v-if="loginErrors.email" class="text-red-500 text-xs mt-1">{{ loginErrors.email }}</p>
                </div>
                <div>
                  <input 
                    v-model="password" 
                    type="password" 
                    placeholder="Contraseña" 
                    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    :class="{'border-red-500': loginErrors.password}"
                  />
                  <p v-if="loginErrors.password" class="text-red-500 text-xs mt-1">{{ loginErrors.password }}</p>
                </div>
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="bg-blue-900 text-white font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                </button>
            </form>
          <div class="flex justify-between mt-4 text-sm">
            <a href="#" class="text-blue-600 hover:underline">Olvidé mi contraseña</a>
          <button @click="mode = 'register'; clearErrors()" class="text-blue-600 hover:underline">Registrarse</button> 
          </div>
        </div>

        <!-- Registro -->
        <div v-else key="register">
          <h2 class="text-xl font-bold text-center mb-4">Crear cuenta</h2>
            <form class="flex flex-col gap-3" @submit.prevent="handleRegister">
            <div class="flex gap-2">
              <div class="flex-1">
                <input 
                  v-model="name" 
                  type="text" 
                  placeholder="Nombre" 
                  class="input w-full border rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  :class="{'border-red-500': errors.name}"
                  @input="clearFieldError('name')"
                />
                <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
              </div>
              <div class="flex-1">
                <input 
                  v-model="last_name" 
                  type="text" 
                  placeholder="Apellido" 
                  class="input w-full border rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  :class="{'border-red-500': errors.last_name}"
                  @input="clearFieldError('last_name')"
                />
                <p v-if="errors.last_name" class="text-red-500 text-xs mt-1">{{ errors.last_name }}</p>
              </div>
            </div>
            
            <div>
              <input 
                v-model="email" 
                type="email" 
                placeholder="Correo electrónico" 
                class="input w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                :class="{'border-red-500': errors.email}"
                @input="clearFieldError('email')"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>
            
            <div>
              <input 
                v-model="password" 
                type="password" 
                placeholder="Contraseña" 
                class="input w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                :class="{'border-red-500': errors.password}"
                @input="clearFieldError('password'); validatePassword()"
              />
              <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
              <p v-if="password && !errors.password" class="text-green-600 text-xs mt-1">
                ✓ La contraseña debe tener 8-16 caracteres, mayúscula, minúscula, número y carácter especial
              </p>
            </div>
            
            <div>
              <input 
                v-model="confirmPassword" 
                type="password" 
                placeholder="Confirmar contraseña" 
                class="input w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                :class="{'border-red-500': errors.confirmPassword}"
                @input="clearFieldError('confirmPassword'); validatePasswordMatch()"
              />
              <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
            </div>
            
            <div>
              <div class="flex gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500"
                :class="{'border-red-500': errors.phone}">
                <select class="w-24 outline-none bg-transparent">
                  <option value="+58">🇻🇪 +58</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>
                <input 
                  v-model="phone" 
                  type="tel" 
                  placeholder="Teléfono (ej: 04141234567)" 
                  class="input flex-1 outline-none bg-transparent"
                  @input="clearFieldError('phone'); formatPhone()"
                />
              </div>
              <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
              <p v-if="phone && !errors.phone" class="text-gray-500 text-xs mt-1">
                Formato: 0414, 0424, 0412, 0422, 0416, 0426 seguido de 7 dígitos
              </p>
            </div>
            
            <div class="flex gap-2">
              <select 
                v-model="idType" 
                class="input w-20 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                :class="{'border-red-500': errors.idType}"
              >
                <option value="V">V</option>
                <option value="J">J</option>
                <option value="E">E</option>
              </select>
              <div class="flex-1">
                <input 
                  v-model="document_number" 
                  type="text" 
                  placeholder="Cédula de identidad" 
                  class="input w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  :class="{'border-red-500': errors.document_number}"
                  @input="clearFieldError('document_number')"
                />
                <p v-if="errors.document_number" class="text-red-500 text-xs mt-1">{{ errors.document_number }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Fecha de nacimiento</label>
              <input 
                v-model="birth_date" 
                type="date" 
                class="input w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                :class="{'border-red-500': errors.birth_date}"
                :max="maxBirthDate"
                @input="clearFieldError('birth_date')"
              />
              <p v-if="errors.birth_date" class="text-red-500 text-xs mt-1">{{ errors.birth_date }}</p>
              <p v-if="birth_date && !errors.birth_date" class="text-gray-500 text-xs mt-1">
                Debes tener al menos 18 años
              </p>
            </div>
            
            <select class="input border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option disabled selected>¿Cómo nos conociste?</option>
                <option>Publicidad</option>
                <option>Amigos</option>
                <option>Redes sociales</option>
            </select>
            
            <button 
              type="submit" 
              :disabled="isLoading"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-blue-900 text-white font-bold py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              {{ isLoading ? 'Registrando...' : 'Registrarse' }}
            </button>
            </form>

          <p class="text-sm text-center mt-3">
            ¿Ya tienes cuenta? 
            <button @click="mode = 'login'; clearErrors()" class="text-blue-600 hover:underline">Inicia sesión</button>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "vue-toastification";

const toast = useToast();
const mode = ref<"login" | "register">("login");
const authStore = useAuthStore();
const emit = defineEmits(["close", "login-success"]);

// Computed para verificar autenticación
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Formularios
const email = ref("");
const password = ref("");
const name = ref("");
const last_name = ref(""); 
const confirmPassword = ref(""); 
const phone = ref("");
const idType = ref("V");
const document_number = ref("");
const birth_date = ref("");
const promoCode = ref("");
const isLoading = ref(false);

// Errores
const errors = ref<Record<string, string>>({});
const loginErrors = ref<Record<string, string>>({});

const maxBirthDate = computed(() => {
  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return minAgeDate.toISOString().split('T')[0];
});

// Función para cerrar al hacer clic fuera
const handleBackdropClick = () => {
  authStore.showLoginModal = false; // Cierra el modal
};


// Opcional: Cerrar con tecla Escape
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

// Limpiar errores
const clearErrors = () => {
  errors.value = {};
  loginErrors.value = {};
};

const clearFieldError = (field: string) => {
  if (mode.value === 'register') {
    delete errors.value[field];
  } else {
    delete loginErrors.value[field];
  }
};

// Formatear teléfono
const formatPhone = () => {
  // Remover caracteres no numéricos
  phone.value = phone.value.replace(/\D/g, '');
  
  // Limitar a 11 caracteres máximo (código + 7 dígitos)
  if (phone.value.length > 11) {
    phone.value = phone.value.substring(0, 11);
  }
};

// Validar contraseña
const validatePassword = () => {
  if (!password.value) return;
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[\w\W]{8,16}$/;
  
  if (password.value.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (password.value.length > 16) {
    errors.value.password = 'La contraseña no debe exceder 16 caracteres';
  } else if (!passwordRegex.test(password.value)) {
    errors.value.password = 'Debe incluir mayúscula, minúscula, número y carácter especial';
  } else {
    delete errors.value.password;
  }
};

// Validar coincidencia de contraseñas
const validatePasswordMatch = () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden';
  } else {
    delete errors.value.confirmPassword;
  }
};

// Agregar y remover event listener para Escape
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
});

const handleLogin = async () => {
  loginErrors.value = {};
  
  if (!email.value) {
    loginErrors.value.email = "El correo electrónico es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    loginErrors.value.email = "El correo electrónico no es válido";
  }
  
  if (!password.value) {
    loginErrors.value.password = "La contraseña es requerida";
  }
  
  if (Object.keys(loginErrors.value).length > 0) {
    return;
  }

  isLoading.value = true;
  
  try {
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      toast.success("✅ Sesión iniciada correctamente", {
        toastClassName: "bg-blue-900 text-white font-bold rounded-lg shadow-lg",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 10);
      
    } else {
      // Si authStore.login devuelve false pero no lanza error
      toast.error("❌ Error al iniciar sesión. Verifica tus credenciales", {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
    }
  } catch (error: any) {
    console.error('❌ Login error in component:', error);
    
    // Manejar errores del backend para login
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      const backendMessage = error.response.data.message;
      
      // Mapear errores del backend a campos de login
      Object.keys(backendErrors).forEach(key => {
        const errorMessage = Array.isArray(backendErrors[key]) 
          ? backendErrors[key][0] 
          : backendErrors[key];
        
        loginErrors.value[key] = errorMessage;
      });
      
      // Mostrar mensaje general
      if (backendMessage) {
        toast.error(`❌ ${backendMessage}`, {
          toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
        });
      }
      
    } else if (error.response?.status === 401) {
      toast.error("❌ Credenciales incorrectas", {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
      
    } else if (error.response?.status === 400 || error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || 'Error en el servidor';
      toast.error(`❌ ${errorMessage}`, {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
      
    } else {
      toast.error("❌ Error de conexión", {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  clearErrors();
  let hasErrors = false;

  // Validar nombre
  if (!name.value.trim()) {
    errors.value.name = "El nombre es requerido";
    hasErrors = true;
  } else if (name.value.length < 2) {
    errors.value.name = "El nombre debe tener al menos 2 caracteres";
    hasErrors = true;
  } else if (name.value.length > 255) {
    errors.value.name = "El nombre no debe exceder 255 caracteres";
    hasErrors = true;
  }

  // Validar apellido
  if (!last_name.value.trim()) {
    errors.value.last_name = "El apellido es requerido";
    hasErrors = true;
  } else if (last_name.value.length < 2) {
    errors.value.last_name = "El apellido debe tener al menos 2 caracteres";
    hasErrors = true;
  } else if (last_name.value.length > 255) {
    errors.value.last_name = "El apellido no debe exceder 255 caracteres";
    hasErrors = true;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.value.email = "El correo electrónico es requerido";
    hasErrors = true;
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = "El correo electrónico no es válido";
    hasErrors = true;
  } else if (email.value.length > 255) {
    errors.value.email = "El correo electrónico no debe exceder 255 caracteres";
    hasErrors = true;
  }

  // Validar teléfono
  const phoneRegex = /^(0414|0424|0412|0422|0416|0426)\d{7}$/;
  if (!phone.value.trim()) {
    errors.value.phone = "El teléfono es requerido";
    hasErrors = true;
  } else if (!phoneRegex.test(phone.value)) {
    errors.value.phone = "El teléfono debe comenzar con 0414, 0424, 0412, 0422, 0416 o 0426 seguido de 7 dígitos";
    hasErrors = true;
  } else if (phone.value.length > 255) {
    errors.value.phone = "El teléfono no debe exceder 255 caracteres";
    hasErrors = true;
  }

  // Validar contraseña
  validatePassword();
  if (!password.value) {
    errors.value.password = "La contraseña es requerida";
    hasErrors = true;
  }

  // Validar confirmación de contraseña
  validatePasswordMatch();
  if (!confirmPassword.value) {
    errors.value.confirmPassword = "Debes confirmar tu contraseña";
    hasErrors = true;
  }

  // Validar documento
  if (!document_number.value.trim()) {
    errors.value.document_number = "El número de documento es requerido";
    hasErrors = true;
  } else if (document_number.value.length > 255) {
    errors.value.document_number = "El número de documento no debe exceder 255 caracteres";
    hasErrors = true;
  }

  // Validar fecha de nacimiento
  if (!birth_date.value) {
    errors.value.birth_date = "La fecha de nacimiento es requerida";
    hasErrors = true;
  } else {
    const birthDate = new Date(birth_date.value);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
    if (birthDate > minDate) {
      errors.value.birth_date = "Debes tener al menos 18 años de edad";
      hasErrors = true;
    }
  }

  if (hasErrors || Object.keys(errors.value).length > 0) {
    return;
  }

  isLoading.value = true;

   try {
    const success = await authStore.register({
      name: name.value.trim(),
      last_name: last_name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      phone: phone.value,
      idType: idType.value,
      document_number: document_number.value.trim(),
      birth_date: birth_date.value,
      promoCode: promoCode.value
    });

    if (success) {
      toast.success("🎉 Registro exitoso. ¡Ya puede iniciar sesión!", {
        toastClassName: "bg-blue-900 text-white font-bold rounded-lg shadow-lg",
      });
      
      mode.value = "login";
      
      // Limpiar formulario de registro
      name.value = "";
      last_name.value = "";
      email.value = "";
      password.value = "";
      confirmPassword.value = "";
      phone.value = "";
      document_number.value = "";
      birth_date.value = "";
      promoCode.value = "";
      
    } else {
      toast.error("❌ Error en el registro. Intenta nuevamente", {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
    }
  } catch (error: any) {
    console.error('❌ Registration error in component:', error);
    
    // Manejar errores del backend para registro
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      const backendMessage = error.response.data.message;
      
      console.log('🔧 Backend validation errors:', backendErrors);
      console.log('🔧 Backend message:', backendMessage);
      
      // Mapear errores del backend a los campos del formulario
      Object.keys(backendErrors).forEach(key => {
        // Si el backend devuelve un array de errores, tomar el primero
        const errorMessage = Array.isArray(backendErrors[key]) 
          ? backendErrors[key][0] 
          : backendErrors[key];
        
        // Mapear campos del backend a campos del frontend si es necesario
        const fieldMap: Record<string, string> = {
          'email': 'email',
          'phone': 'phone',
          'document_number': 'document_number',
          'password': 'password',
          'name': 'name',
          'last_name': 'last_name',
          'birth_date': 'birth_date'
        };
        
        const frontendField = fieldMap[key] || key;
        errors.value[frontendField] = errorMessage;
      });
      
      // Mostrar mensaje general del backend en toast
      if (backendMessage) {
        toast.error(`❌ ${backendMessage}`, {
          toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
          timeout: 5000 // 5 segundos para que el usuario pueda leerlo
        });
      } else {
        toast.error("❌ Error de validación en el registro", {
          toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
        });
      }
      
    } else if (error.response?.status === 400 || error.response?.status === 500) {
      // Otros errores del backend (400, 500, etc.)
      const errorMessage = error.response?.data?.message || 'Error en el servidor';
      toast.error(`❌ ${errorMessage}`, {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
      
    } else if (error.message && error.message.includes('18 años')) {
      // Error de validación de edad desde el store
      errors.value.birth_date = error.message;
      toast.error(`❌ ${error.message}`, {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
      
    } else {
      // Error de red u otro error
      toast.error("❌ Error de conexión durante el registro", {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
      console.error('Network or other error:', error);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>