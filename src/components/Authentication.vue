<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden p-6 animate-fade-in">
      
      <!-- Cerrar -->
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-600 hover:text-red-500">
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
            <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
                <input v-model="email" type="email" placeholder="Correo electrónico" class="input" />
                <input v-model="password" type="password" placeholder="Contraseña" class="input" />
                <button type="submit" class="btn-primary">Iniciar sesión</button>
            </form>
          <div class="flex justify-between mt-4 text-sm">
            <a href="#" class="text-blue-600 hover:underline">Olvidé mi contraseña</a>
            <button @click="mode = 'register'" class="text-blue-600 hover:underline">Registrarse</button>
          </div>
        </div>

        <!-- Registro -->
        <div v-else key="register">
          <h2 class="text-xl font-bold text-center mb-4">Crear cuenta</h2>
            <form class="flex flex-col gap-3" @submit.prevent="handleRegister">
            <input v-model="name" type="text" placeholder="Nombre completo" class="input" />
            <input v-model="email" type="email" placeholder="Correo electrónico" class="input" />
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
                <input v-model="idNumber" type="text" placeholder="Cédula de identidad" class="input flex-1" />
            </div>
            <input v-model="country" type="text" placeholder="País" class="input" />
            <select class="input">
                <option disabled selected>¿Cómo nos conociste?</option>
                <option>Publicidad</option>
                <option>Amigos</option>
                <option>Redes sociales</option>
            </select>
            <input v-model="promoCode" type="text" placeholder="Promo Code (opcional)" class="input" />
            <button type="submit" class="btn-primary">Registrarse</button>
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
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "vue-toastification";

const toast = useToast();

const mode = ref<"login" | "register">("login");
const authStore = useAuthStore();
const emit = defineEmits(["close"]);

// Formularios
const email = ref("");
const password = ref("");
const name = ref("");
const phone = ref("");
const country = ref("");
const idType = ref("V");
const idNumber = ref("");
const promoCode = ref("");

// Funciones
const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    toast.success("✅ Sesión iniciada correctamente", {
      toastClassName: "bg-blue-900 text-white font-bold rounded-lg shadow-lg",
    });
    emit("close");
  } else {
    toast.error("❌ Error al iniciar sesión", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
  }
};

// Service
// const handleLogin = async () => {
//   const success = await authStore.login(email.value, password.value);
//   if (success) {
//     await authStore.loadUserProfile(); // ✅ Carga perfil desde el backend
//     toast.success("✅ Sesión iniciada correctamente");
//     emit("close");
//   } else {
//     toast.error("❌ Error al iniciar sesión");
//   }
// };

const handleRegister = async () => {
  const success = await authStore.register({
    name: name.value,
    email: email.value,
    phone: phone.value,
    country: country.value,
    idType: idType.value,
    idNumber: idNumber.value,
    promoCode: promoCode.value,
  });
  if (success) {
    toast.success("🎉 Registro exitoso", {
      toastClassName: "bg-blue-900 text-white font-bold rounded-lg shadow-lg",
    });
    emit("close");
  } else {
    toast.error("❌ Error en el registro", {
      toastClassName: "bg-red-900 text-white font-bold rounded-lg shadow-lg",
    });
  }
};
</script>

<style scoped>
.input {
  @apply border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none;
}
.btn-primary {
  @apply bg-blue-900 text-white font-bold py-2 rounded-lg hover:bg-yellow-500 transition;
}
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
