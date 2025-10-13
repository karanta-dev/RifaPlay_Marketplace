import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthService = {
  async login(email: string, password: string) {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return data; // Espera un token y el usuario
  },

  async register(payload: Record<string, any>) {
    const { data } = await axios.post(`${API_URL}/auth/register`, payload);
    return data;
  },

  async getUserProfile(token: string) {
    const { data } = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async logout(token: string) {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};
