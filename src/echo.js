import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Pusher debe estar disponible globalmente
window.Pusher = Pusher;

// Configuración de conexión con el servidor WebSockets
window.Echo = new Echo({
    broadcaster: 'reverb', // Usa Reverb como broadcaster
    key: '27frrudim8hyah2rd0i4', // API Key de tu aplicación (cambiar en producción)
    wsHost: 'api-rifplay.karanta.dev', // Host de tu servidor WebSockets
    wsPort: 443, // Puerto WebSocket seguro
    wssPort: 443,
    forceTLS: true, // Forzar conexión segura
    disableStats: true, // Mejor rendimiento
    enabledTransports: ['ws', 'wss'] // Protocolos habilitados
});