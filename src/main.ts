import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

import "@fortawesome/fontawesome-free/css/all.min.css"

// Importamos Pinia y Router
import { createPinia } from 'pinia';
import { router } from './router';

const app = createApp(App);

// Usamos Pinia y Router
app.use(createPinia());
app.use(router);

app.mount('#app');
