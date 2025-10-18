// PaymentFlow.ts

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
export interface Currency {
  uuid: string;
  name: string;
  short_name: string;
  symbol: string | null;
}

// Interfaz para métodos de pago
export interface PaymentMethod {
  uuid: string;
  name: string;
  slug?: string;
  description?: string;
  account_number?: string;
  bank_name?: string;
  [key: string]: any;
}
export const PaymentFlowService = {
  /**
   * Obtiene la lista de monedas desde el endpoint /currencies
   * @returns {Promise<Currency[]>} Una promesa que resuelve con la lista de monedas.
   */
  fetchCurrencies: async (): Promise<{ currencies: Currency[]; defaultCurrencyId?: string }> => {
    try {
      const response = await apiClient.get('/currencies');
      const data = response.data;
      if (data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('Formato de respuesta de monedas inválido.');
      }
      const currencies: Currency[] = data.data;
      const bolivares = currencies.find(c => c.name.toLowerCase().includes('bolívar') || c.short_name.toLowerCase().includes('ves'));
      return {
        currencies,
        defaultCurrencyId: bolivares ? bolivares.uuid : undefined
      };
    } catch (error) {
      console.error('Error al obtener monedas:', error);
      throw new Error('No se pudieron cargar las monedas.');
    }
  },

  /**
   * Verifica pago móvil enviando { phone, monto } al endpoint /R4pago-movil-verify
   * @param phone - Teléfono a verificar
   * @param monto - Monto a verificar
   * @returns {Promise<any>} Respuesta del backend
   */
  async verifyPagoMovil(phone: string, monto: number): Promise<any> {
    try {
      const response = await apiClient.post('/R4pago-movil-verify', { phone, monto });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject({ message: String(error) });
    }
  },

  /**
   * Obtiene la lista de métodos de pago, la ordena alfabéticamente por 'name' y maneja errores.
   * Endpoint: GET /payment-methods
   * @returns {Promise<PaymentMethod[]>} Una promesa que resuelve con la lista de métodos de pago ordenados.
   */
  fetchPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await apiClient.get('/payment-methods');
      const data = response.data;
      if (data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('Formato de respuesta de métodos de pago inválido.');
      }
      return data.data.sort((a: PaymentMethod, b: PaymentMethod) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw new Error('No se pudieron cargar los métodos de pago.');
    }
  },
  /**
   * Crea una venta (POST /sales).
   * payload debe seguir la estructura que el backend espera (detalle, pago, invoice_data, etc.)
   * Devuelve el body de la respuesta en caso de éxito.
   */
  async createSale(payload: any, idempotencyKey?: string) {
    try {
      const headers: Record<string, string> = {};
      if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

      const response = await apiClient.post('/sales', payload, { headers });

      // Caso idempotencia: el servidor puede devolver 200 con mensaje
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }

      // Creación exitosa
      if (response.status === 201) {
        return { status: 201, data: response.data };
      }

      // Otros códigos
      return { status: response.status, data: response.data };
    } catch (error: any) {
      // Axios error con payload de validación
      if (axios.isAxiosError(error) && error.response) {
        const resp = error.response;
        // Pasar el cuerpo del error al llamador
        return Promise.reject({ status: resp.status, data: resp.data });
      }
      return Promise.reject({ status: 500, data: { message: String(error) } });
    }
  }
};