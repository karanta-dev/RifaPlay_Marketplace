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
  slug: string;
  description?: string;
  account_number?: string;
  bank_name?: string;
  bank_code?: string;
  holder_name?: string;
  document_number?: string;
  is_default?: boolean;
  original_data?: any; // Para mantener los datos originales
  logoUrl?: string;
  structured_data?: any; // Estructura dinámica que indica campos requeridos por el método
  is_active?: boolean;
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
    const response = await apiClient.post('/R4pago-movil-verify', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      },
    });
    if (response.status !== 200) {
      throw new Error('Error al verificar pago móvil');
    };
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
    const response = await apiClient.get('/my-payment-methods', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
      },
    });
    
    console.log('🔍 Respuesta de my-payment-methods:', response.data);
    
    const data = response.data;
    
    // El nuevo endpoint tiene una estructura diferente
    if (data.success !== true || !Array.isArray(data.data)) {
      console.error('❌ Formato de respuesta de my-payment-methods inválido:', data);
      throw new Error('Formato de respuesta de métodos de pago inválido.');
    }
    
    // Mapear la nueva estructura a la interfaz PaymentMethod
    const paymentMethods: PaymentMethod[] = data.data
      .filter((item: any) => item.is_active) // Solo métodos activos
      .map((item: any) => {
            // Preserve the original method_name from backend and also provide a machine-friendly variable name
            const methodNameRaw = item.method_name || 'Método de Pago';
            const variableName = (methodNameRaw || '').toString().toLowerCase().replace(/\s+/g, '_');

        // Generar slug basado en el method_name
        let slug = '';
        if (item.method_name?.toLowerCase().includes('pago movil')) {
          slug = 'pago-movil';
        } else if (item.method_name?.toLowerCase().includes('tarjeta')) {
          slug = 'tarjeta';
        } else if (item.method_name?.toLowerCase().includes('transferencia')) {
          slug = 'transferencia';
        } else if (item.method_name?.toLowerCase().includes('kontigo')) {
          slug = 'kontigo';
        } else if (item.method_name?.toLowerCase().includes('binance')) {
          slug = 'binance';
        } else if (item.method_name?.toLowerCase().includes('zelle')) {
          slug = 'zelle';
        } else {
          // Slug por defecto basado en el nombre
          slug = item.method_name?.toLowerCase().replace(/\s+/g, '-') || 'metodo-pago';
        }
        
        // Intentar extraer una URL de ícono/logo desde varias posibles propiedades.
        // El backend puede devolver:
        // - una URL absoluta (https://...)
        // - una ruta relativa que empieza con '/' (ej: '/48.../icon.png')
        // - un path relativo sin slash (ej: '48.../icon.png')
        // - un objeto images: [{ url, path }]
        // Normalizamos y construimos una `logoUrl` absoluta usando `apiClient.defaults.baseURL` cuando haga falta.
        let rawIcon: any = item.logo_url || item.icon || (item.images && Array.isArray(item.images) && item.images[0] && (item.images[0].url || item.images[0].path)) || item.image || null;
        let logoUrl = null as string | null;
        if (rawIcon) {
          try {
            // Si viene como objeto con { url } o { path }
            if (typeof rawIcon === 'object' && rawIcon !== null) {
              rawIcon = rawIcon.url || rawIcon.path || String(rawIcon);
            }

            if (typeof rawIcon === 'string') {
              rawIcon = rawIcon.trim();
              // Si es una URL absoluta, usarla tal cual
              if (/^https?:\/\//i.test(rawIcon)) {
                logoUrl = rawIcon;
              } else {
                // Construir URL absoluta relativa a apiClient.defaults.baseURL
                const base = apiClient.defaults.baseURL || '';
                try {
                  // normalizar entradas como 'path/to/file' o '/path/to/file'
                  // new URL manejará correctamente la concatenación
                  logoUrl = new URL(rawIcon.replace(/^\/*/, '/'), base).toString();
                } catch (err) {
                  // Fallback manual conservador
                  const baseTrim = (base || '').replace(/\/$/, '');
                  logoUrl = rawIcon.startsWith('/') ? `${baseTrim}${rawIcon}` : `${baseTrim}/${rawIcon}`;
                }
              }
            } else {
              // cualquier otro tipo, forzar a string
              logoUrl = String(rawIcon);
            }
          } catch (e) {
            logoUrl = String(rawIcon);
          }
        }

        // Procesar structured_data: puede venir como string JSON, objeto o null
        let structured = item.structured_data ?? item.fields ?? null
        if (typeof structured === 'string') {
          try {
            structured = JSON.parse(structured)
          } catch (e) {
            // Si no es JSON válido, dejar como string para mostrar como texto
            structured = structured
          }
        }

            return {
              uuid: item.uuid,
              name: methodNameRaw,
              method_name: methodNameRaw,
              variable_name: variableName,
          slug: slug,
          description: item.observation,
          account_number: item.account_number,
          bank_name: item.bank_name,
          bank_code: item.bank_code,
          holder_name: item.holder_name,
          document_number: item.document_number,
          is_default: item.is_default,
          // Mantener todos los campos originales por si acaso
          original_data: item,
          logoUrl: logoUrl,
          // Algunos endpoints devuelven structured_data como array u objeto o como JSON string
          structured_data: structured,
          is_active: item.is_active ?? true
        };
      })
      .sort((a: PaymentMethod, b: PaymentMethod) => {
        // Ordenar: primero los métodos por defecto, luego por nombre
        if (a.is_default && !b.is_default) return -1;
        if (!a.is_default && b.is_default) return 1;
        return a.name.localeCompare(b.name);
      });
    
    console.log('💳 Métodos de pago mapeados:', paymentMethods);
    return paymentMethods;
  } catch (error) {
    console.error('❌ Error al obtener métodos de pago del rifero:', error);
    throw new Error('No se pudieron cargar los métodos de pago del rifero.');
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