import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './echo' // 👈 Importa la configuración de Echo

const app = createApp(App)
app.use(createPinia()) // 👈 Habilita Pinia
app.mount('#app')