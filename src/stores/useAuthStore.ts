import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { AuthService } from "@/services/AuthService";
import axios from "axios";

// Función auxiliar para obtener el usuario de forma segura... (sin cambios)
const getInitialUser = () => {
  const userString = localStorage.getItem('user');
  if (!userString || userString === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error al parsear el usuario desde localStorage, limpiando dato corrupto:", error);
    localStorage.removeItem('user'); 
    return null;
  }
};

export const useAuthStore = defineStore("auth", () => {
  // Ahora usamos la función segura para inicializar el estado
  const user = ref<any>(getInitialUser()); 
  const token = ref<string | null>(localStorage.getItem("token"));
  const isAuthenticated = computed(() => !!token.value);

  // Ensure axios default header is set on startup if token exists
  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  // ✅ Login mejorado con más logs
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login with:', { email });
      
      const response = await AuthService.login(email, password);
      console.log('✅ Login response:', response);
      
      // ----------------------------------------------------
      // 👇 INICIO DE LA MODIFICACIÓN (REEMPLAZA EL BLOQUE ANTERIOR)
      // ----------------------------------------------------
      
      // AuthService returns { raw, token, user }
      const responseToken = response.token || response.raw?.token || null;
      const responseUser = response.user || response.raw?.data || response.raw || null;

      if (!responseUser) {
        console.error('❌ Invalid login response structure: Missing User Data.', response);
        return false;
      }

      // If token exists, save it and set axios header
      if (responseToken) {
        token.value = responseToken;
        localStorage.setItem("token", token.value as string);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      }

      // Save user (strip token if present)
  const userToStore = { ...responseUser };
  if (userToStore.token) delete userToStore.token;
  // Normalize id field for components expecting `id`
  if (!userToStore.id && userToStore.uuid) userToStore.id = userToStore.uuid;
  user.value = userToStore;
  localStorage.setItem("user", JSON.stringify(userToStore));
      
      // ----------------------------------------------------
      // 👆 FIN DE LA MODIFICACIÓN
      // ----------------------------------------------------

      console.log('✅ Login successful, user:', user.value);
      return true;
      
    } catch (err: any) {
      console.error("❌ Login error:", err);
      
      // Mostrar error específico al usuario
      const errorMessage = err.response?.data?.message || err.message || 'Error de conexión';
      console.error("🔧 Error details:", errorMessage);
      
      return false;
    }
  };

  // ✅ Registro mejorado con validación de edad
  const register = async (data: {
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    idType: string;
    birth_date: string;
    document_number: string;
    promoCode?: string;
  }) => {
    try {
      // Validar edad mínima
      const birthDate = new Date(data.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        console.error('❌ User must be at least 18 years old');
        return false;
      }

      // Transformar datos al formato del endpoint
      const payload = {
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        birth_date: data.birth_date,
        document_number: data.document_number
      };

      console.log('📤 Sending registration payload:', payload);

      const response = await AuthService.register(payload);
      console.log('✅ Registration response:', response);

      const responseToken = response.token || response.raw?.token || null;
      const responseUser = response.user || response.raw?.data || response.raw || null;

      // If backend returns token, log the user in
      if (responseToken) {
        token.value = responseToken;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
        localStorage.setItem("token", token.value as string);
      }

      if (responseUser) {
  const userToStore = { ...responseUser };
  if (userToStore.token) delete userToStore.token;
  if (!userToStore.id && userToStore.uuid) userToStore.id = userToStore.uuid;
  user.value = userToStore;
  localStorage.setItem("user", JSON.stringify(userToStore));
      }

      // If the backend didn't return a token but provided a user, attempt to fetch profile
      if (!token.value && user.value) {
        // try to get tokenless profile or prompt user to login — for now return true since user created
        console.warn('⚠️ Registration succeeded but no token returned. User created, please login.');
      }
      
      console.log('✅ Registration successful, user:', user.value);
      return true;
      
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error de conexión';
      console.error('🔧 Error details:', errorMessage);
      
      return false;
    }
  };

  // Resto del código permanece igual...
  const loadUserProfile = async () => {
    if (!token.value) return;
    try {
      const profile = await AuthService.getUserProfile(token.value);
      user.value = profile;
      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (err) {
      console.error("⚠️ Error al cargar perfil:", err);
      logout();
    }
  };

  const logout = async () => {
    if (token.value) {
      try {
        await AuthService.logout(token.value);
      } catch {
        console.warn("⚠️ Error cerrando sesión en el servidor");
      }
    }

    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const userAge = computed(() => {
    if (!user.value?.birth_date) return null;
    
    const birthDate = new Date(user.value.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  });

  const isAdult = computed(() => {
    return userAge.value !== null && userAge.value >= 18;
  });

  watch(token, (val) => {
    if (val) localStorage.setItem("token", val);
    else localStorage.removeItem("token");
  });

  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  }, { deep: true });

  return { 
    user, 
    token, 
    isAuthenticated, 
    userAge,
    isAdult,
    login, 
    register, 
    logout, 
    loadUserProfile 
  };
});