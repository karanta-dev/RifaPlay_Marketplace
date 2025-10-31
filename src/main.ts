// src/main.ts - TU CÓDIGO + EL INTERCEPTOR AÑADIDO

import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { createPinia } from 'pinia';
import { router } from './router';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css"

import apiClient from './services/api';
import { useAuthStore } from './stores/useAuthStore';
const app = createApp(App);

const pinia = createPinia(); 
app.use(pinia); 
app.use(router);

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es buena (2xx), no hagas nada.
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);
app.mount('#app');