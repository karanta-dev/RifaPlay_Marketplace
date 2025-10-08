import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<null | {
    id: number;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    avatar?: string;
  }>(JSON.parse(localStorage.getItem("user") || "null"));

  const isAuthenticated = computed(() => !!user.value);

  const login = async (email: string, password: string) => {
    if (email && password) {
      user.value = {
        id: 1,
        name: "Juan Pérez",
        email,
        avatar: "https://i.pravatar.cc/150?img=3",
      };
      return true;
    }
    return false;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    country: string;
    idType: string;
    idNumber: string;
    promoCode?: string;
  }) => {
    user.value = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      avatar: "https://i.pravatar.cc/150?img=5",
    };
    return true;
  };

  const logout = () => {
    user.value = null;
  };

  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  }, { deep: true });

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});


// Service Authenticate
// import { defineStore } from "pinia";
// import { ref, computed, watch } from "vue";
// import { AuthService } from "@/services/AuthService";
// import axios from "axios";

// export const useAuthStore = defineStore("auth", () => {
//   const user = ref<any>(JSON.parse(localStorage.getItem("user") || "null"));
//   const token = ref<string | null>(localStorage.getItem("token"));
//   const isAuthenticated = computed(() => !!token.value);

//   // ✅ Login con la API real
//   const login = async (email: string, password: string) => {
//     try {
//       const response = await AuthService.login(email, password);
//       token.value = response.token;
//       user.value = response.user;
//       localStorage.setItem("token", token.value);
//       localStorage.setItem("user", JSON.stringify(user.value));

//       // 🔧 Configurar axios para incluir el token automáticamente
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
//       return true;
//     } catch (err: any) {
//       console.error("❌ Error de login:", err.response?.data || err);
//       return false;
//     }
//   };

//   // ✅ Registro
//   const register = async (data: Record<string, any>) => {
//     try {
//       const response = await AuthService.register(data);
//       token.value = response.token;
//       user.value = response.user;
//       localStorage.setItem("token", token.value);
//       localStorage.setItem("user", JSON.stringify(user.value));

//       axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
//       return true;
//     } catch (err: any) {
//       console.error("❌ Error en el registro:", err.response?.data || err);
//       return false;
//     }
//   };

//   // ✅ Cargar perfil actual
//   const loadUserProfile = async () => {
//     if (!token.value) return;
//     try {
//       const profile = await AuthService.getUserProfile(token.value);
//       user.value = profile;
//       localStorage.setItem("user", JSON.stringify(user.value));
//     } catch (err) {
//       console.error("⚠️ Error al cargar perfil:", err);
//       logout();
//     }
//   };

//   // ✅ Logout
//   const logout = async () => {
//     if (token.value) {
//       try {
//         await AuthService.logout(token.value);
//       } catch {
//         console.warn("⚠️ Error cerrando sesión en el servidor");
//       }
//     }

//     user.value = null;
//     token.value = null;
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   // 🔁 Reactividad con persistencia local
//   watch(token, (val) => {
//     if (val) localStorage.setItem("token", val);
//     else localStorage.removeItem("token");
//   });

//   return { user, token, isAuthenticated, login, register, logout, loadUserProfile };
// });
