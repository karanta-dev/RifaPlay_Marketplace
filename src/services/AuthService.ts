import axios from "axios";

const API_URL = "http://192.168.1.17:8000/api/v1";

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
