import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { createPinia } from 'pinia';
import { router } from './router';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css"

const app = createApp(App);

// Usamos Pinia y Router
app.use(createPinia());
app.use(router);

// Configuración 
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

app.mount('#app');
