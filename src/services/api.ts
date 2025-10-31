
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Asegúrate de tener esta variable en tu .env

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;