// PaymentFlow.ts

import axios from "axios";
import apiClient from "./api";


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

// Interfaz para bancos
export interface Bank {
  uuid: string;
  name: string;
  code?: string;
  originalName?: string; // Opcional: para mantener el nombre sin código
  [key: string]: any;
}
export const PaymentFlowService = {
  /**
   * Obtiene la lista de monedas desde el endpoint /currencies
   * @returns {Promise<Currency[]>} Una promesa que resuelve con la lista de monedas.
   */
  fetchCurrencies: async (): Promise<{ currencies: Currency[]; defaultCurrencyId?: string }> => {
    try {
      const response = await apiClient.get('/currencies', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
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
async verifyPagoMovil(payload: { phone: string; monto: number; exchange_rate?: number }): Promise<any> {
  try {
    const response = await apiClient.post('/R4pago-movil-verify', payload);
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
      const response = await apiClient.get('/payment-methods', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
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
  },

  async verifyPagoMovilManual(payload: { [key: string]: any }): Promise<any> {
    try {
      // Usamos la URL completa que especificaste
      const response = await apiClient.post('/payments-movil', payload);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject({ message: String(error) });
    }
  },

fetchBanks: async (): Promise<Bank[]> => {
  try {
    const response = await apiClient.get('/banks', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      },
    });
    const data = response.data;
    
    console.log('🔍 Respuesta completa de /banks:', data);
    
    if (data.success !== true || !Array.isArray(data.data)) {
      console.error('❌ Formato de respuesta inválido:', data);
      throw new Error('Formato de respuesta de bancos inválido.');
    }
    
    // MODIFICACIÓN: Agregar el código como prefijo al nombre
    const banks: Bank[] = data.data.map((bankData: any) => ({
      uuid: bankData.code,
      name: `${bankData.code} - ${bankData.bank}`, // ← AQUÍ EL CAMBIO
      code: bankData.code,
      originalName: bankData.bank // Mantener el nombre original por si acaso
    })).sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
    
    console.log('🏦 Bancos mapeados con código como prefijo:', banks);
    return banks;
  } catch (error) {
    console.error('❌ Error al obtener bancos:', error);
    throw new Error('No se pudieron cargar los bancos.');
  }
},
};