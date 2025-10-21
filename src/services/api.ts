// src/services/api.ts

import axios from "axios";

// Acceder a la URL de entorno
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * ✅ Interceptor de Solicitudes: Adjunta el token de autenticación a cada petición saliente.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Usar 'auth_token' como clave consistente
    const token = localStorage.getItem('auth_token'); 

    // Si el token existe, adjuntarlo al encabezado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;