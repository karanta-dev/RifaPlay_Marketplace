// src/services/AuthService.ts - MODIFICADO

import  apiClient  from "./api";

export const AuthService = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const raw = data;
    const token = data?.token || data?.data?.token || data?.access_token || null;
    const user = data?.data || data?.user || (typeof data === 'object' ? data : null);

    // El store se encargará de guardar el token.
    
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

    // El store se encargará de guardar el token.
    
    return { raw, token, user };
  },

  async getUserProfile() {
    // NO SE NECESITAN CAMBIOS AQUÍ.
    const { data } = await apiClient.get('/admin/me');
    return data;
  },

  async uploadAvatar(userId: string | number, avatarFile: File) {
    // NO SE NECESITAN CAMBIOS AQUÍ.
    const formData = new FormData();
    formData.append('photo', avatarFile);

    const { data } = await apiClient.post(`/admin/upload-avatar/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },
  
  async logout() {
    try {
      await apiClient.post('/auth/logout'); 
    } catch (error) {
      console.warn("No se pudo notificar al servidor el cierre de sesión. Limpiando localmente.");
    }
  },
};