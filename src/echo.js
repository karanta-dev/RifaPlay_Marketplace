import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Pusher debe estar disponible globalmente
window.Pusher = Pusher;

// Configuración de conexión con el servidor WebSockets
window.Echo = new Echo({
    broadcaster: import.meta.env.VITE_ECHO_BROADCASTER,
    key: import.meta.env.VITE_ECHO_KEY,
    wsHost: import.meta.env.VITE_ECHO_WS_HOST,
    wsPort: Number(import.meta.env.VITE_ECHO_WS_PORT),
    wssPort: Number(import.meta.env.VITE_ECHO_WSS_PORT),
    forceTLS: import.meta.env.VITE_ECHO_FORCE_TLS === 'true',
    disableStats: import.meta.env.VITE_ECHO_DISABLE_STATS === 'true',
    enabledTransports: import.meta.env.VITE_ECHO_ENABLED_TRANSPORTS.split(','),
});