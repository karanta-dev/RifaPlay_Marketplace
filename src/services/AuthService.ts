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
    return data;
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
    return data;
  },

  async getUserProfile(token: string) {
    const { data } = await apiClient.get('/auth/me', {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    return data;
  },

  async logout(token: string) {
    await apiClient.post('/auth/logout', {}, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      }
    });
  },
};
