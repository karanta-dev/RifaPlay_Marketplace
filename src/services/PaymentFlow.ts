// PaymentFlow.ts

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Definición de apiClient sin el tipo explícito AxiosInstance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interfaz para la estructura de un método de pago.
 */
export interface PaymentMethod {
  uuid: string;
  name: string;
  slug: string;
}

/**
 * Interfaz para la respuesta exitosa de la API.
 */
interface ApiResponse {
  status: 'success' | 'error';
  data: PaymentMethod[];
}

export const PaymentFlowService = {
  /**
   * Obtiene la lista de métodos de pago desde el endpoint,
   * la ordena alfabéticamente por 'name' y maneja errores.
   * Endpoint: GET /payment-methods
   * @returns {Promise<PaymentMethod[]>} Una promesa que resuelve con la lista de métodos de pago ordenados.
   */
  async fetchPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      // Uso de apiClient para la llamada GET
      const { data } = await apiClient.get<ApiResponse>('/payment-methods');
      
      // Normalización y verificación de la respuesta
      if (data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('Formato de respuesta de métodos de pago inválido.');
      }
      
      const methods = data.data;
      
      // Ordenar alfabéticamente por 'name' (ya están listados)
      const sortedMethods = methods.sort((a, b) => a.name.localeCompare(b.name));
      
      return sortedMethods;

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error HTTP al obtener métodos de pago:', error.response.status, error.response.data);
      } else {
        console.error('Error al obtener métodos de pago:', error);
      }
      throw new Error('No se pudieron cargar los métodos de pago.');
    }
  },
};