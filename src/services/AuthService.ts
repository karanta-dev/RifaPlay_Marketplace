import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const AuthService = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    });

    // Normalizar respuesta para que el store pueda manejar distintos formatos
    // Backend puede devolver { succes: 'true', data: { ... , token } , message }
    // o { status: 'success', data: { ... } } o simplemente { data: {...} }
    const raw = data;

    // token puede venir en data.token o data.data.token
    const token = data?.token || data?.data?.token || data?.access_token || null;

    // user puede estar en data.data o data.data.user o data (si ya trae el objeto)
    const user = data?.data || data?.user || (typeof data === 'object' ? data : null);

    return { raw, token, user };
  },

  async register(payload: {
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    birth_date: string;
    document_number: string;
  }) {
    const { data } = await apiClient.post('/auth/client-register', payload);

    const raw = data;
    const token = data?.token || data?.data?.token || data?.access_token || null;
    const user = data?.data || data?.user || (typeof data === 'object' ? data : null);

    return { raw, token, user };
  },

  async getUserProfile(token: string) {
    const { data } = await apiClient.get('/auth/me', {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });

    // Normalizar para devolver siempre el objeto user
    return data?.data || data;
  },

  async logout(token: string) {
    await apiClient.post('/auth/logout', {}, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      }
    });
  },
};
