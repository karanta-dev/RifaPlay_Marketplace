import apiClient from "./api";

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

// ✅ CRÍTICO: Guardar el token para que el Interceptor pueda leerlo
    if (token) {
        localStorage.setItem('auth_token', token);
    }
    
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

// ✅ CRÍTICO: Guardar el token al registrarse
    if (token) {
        localStorage.setItem('auth_token', token);
    }
    
    return { raw, token, user };
  },

  async getUserProfile() {
    // ✅ Ahora el Interceptor se encarga de adjuntar el token
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  // ✅ Añadir una función para limpiar al cerrar sesión
  logout() {
    localStorage.removeItem('auth_token');
    // Opcional: Llamar al endpoint de logout del backend
    // apiClient.post('/auth/logout'); 
  }

  // async getUserProfile(token: string) {
  //   const { data } = await apiClient.get('/auth/me', {
  //     headers: { 
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });

  //   // Normalizar para devolver siempre el objeto user
  //   return data?.data || data;
  // },

  // async logout(token: string) {
  //   await apiClient.post('/auth/logout', {}, {
  //     headers: { 
  //       'Authorization': `Bearer ${token}`,
  //     }
  //   });
  // },
};
