
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-ID': 'rifaplay-maket',
  },
});

export default apiClient;