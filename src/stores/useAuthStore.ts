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

  // 👀 Persistencia automática en localStorage
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
