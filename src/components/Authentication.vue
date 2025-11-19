<template>
  <div class="fixed inset-0 backdrop-blur-md backdrop-saturate-150 z-50 flex items-center justify-center p-4">
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
                <input v-model="email" type="email" placeholder="Correo electrónico" class=" border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                <input v-model="password" type="password" placeholder="Contraseña" class=" border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
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
            <!-- <button @click="mode = 'register'" class="text-blue-600 hover:underline">Registrarse</button> -->
          </div>
        </div>

        <!-- Registro -->
        <div v-else key="register">
          <h2 class="text-xl font-bold text-center mb-4">Crear cuenta</h2>
            <form class="flex flex-col gap-3" @submit.prevent="handleRegister">
            <div class="flex gap-2">
              <input v-model="name" type="text" placeholder="Nombre" class="input flex-1" />
              <input v-model="last_name" type="text" placeholder="Apellido" class="input flex-1" />
            </div>
            <input v-model="email" type="email" placeholder="Correo electrónico" class="input" />
            <input v-model="password" type="password" placeholder="Contraseña" class="input" />
            <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" class="input" />
            
            <div class="flex gap-2">
                <select class="input w-24">
                <option value="+58">🇻🇪 +58</option>
                <option value="+57">🇨🇴 +57</option>
                <option value="+1">🇺🇸 +1</option>
                </select>
                <input v-model="phone" type="tel" placeholder="Teléfono" class="input flex-1" />
            </div>
            
            <div class="flex gap-2">
                <select v-model="idType" class="input w-20">
                <option value="V">V</option>
                <option value="J">J</option>
                <option value="E">E</option>
                </select>
                <input v-model="document_number" type="text" placeholder="Cédula de identidad" class="input flex-1" />
            </div>
            
            <div>
              <label class="block text-sm text-gray-600 mb-1">Fecha de nacimiento</label>
              <input 
                v-model="birth_date" 
                type="date" 
                class="input w-full"
                :max="maxBirthDate"
              />
            </div>
            
            <select class="input">
                <option disabled selected>¿Cómo nos conociste?</option>
                <option>Publicidad</option>
                <option>Amigos</option>
                <option>Redes sociales</option>
            </select>
            
            <input v-model="promoCode" type="text" placeholder="Promo Code (opcional)" class="input" />
            <button 
              type="submit" 
              :disabled="isLoading"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Registrando...' : 'Registrarse' }}
            </button>
            </form>

          <p class="text-sm text-center mt-3">
            ¿Ya tienes cuenta? 
            <button @click="mode = 'login'" class="text-blue-600 hover:underline">Inicia sesión</button>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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

const maxBirthDate = computed(() => {
  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return minAgeDate.toISOString().split('T')[0];
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error("❌ Por favor completa todos los campos", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
    return;
  }

  isLoading.value = true;
  
  try {
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      toast.success("✅ Sesión iniciada correctamente", {
        toastClassName: "bg-blue-900 text-white font-bold rounded-lg shadow-lg",
      });
      
      // ✅ RECARGAR LA PÁGINA COMPLETA DESPUÉS DE UN LOGIN EXITOSO
      // Esto asegura que todos los servicios se recarguen con el token de autenticación
      setTimeout(() => {
        window.location.reload();
      }, 10); // Pequeño delay para que el usuario vea el mensaje de éxito
      
    } else {
      toast.error("❌ Error al iniciar sesión. Verifica tus credenciales", {
        toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
      });
    }
  } catch (error) {
    toast.error("❌ Error de conexión", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  // Validaciones
  if (!name.value || !last_name.value || !email.value || !password.value || 
      !confirmPassword.value || !phone.value || !document_number.value || !birth_date.value) {
    toast.error("❌ Por favor completa todos los campos obligatorios", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast.error("❌ Las contraseñas no coinciden", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
    return;
  }

  if (password.value.length < 6) {
    toast.error("❌ La contraseña debe tener al menos 6 caracteres", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
    return;
  }

  // Validar edad
  const birthDate = new Date(birth_date.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 18) {
    toast.error("❌ Debes ser mayor de 18 años para registrarte", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
    return;
  }

  isLoading.value = true;

  try {
    const success = await authStore.register({
      name: name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      idType: idType.value,
      document_number: document_number.value,
      birth_date: birth_date.value,
      promoCode: promoCode.value
    });

    if (success) {
      toast.success("🎉 Registro exitoso. ¡Ya puede iniciar sesión!", {
        toastClassName: "bg-blue-900 text-white font-bold rounded-lg shadow-lg",
      });
      
      // Cambiar a modo login después del registro exitoso
      mode.value = "login";
      
      // Limpiar formulario de registro
      name.value = "";
      last_name.value = "";
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
  } catch (error) {
    toast.error("❌ Error de conexión durante el registro", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Estilos mantienen igual */
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