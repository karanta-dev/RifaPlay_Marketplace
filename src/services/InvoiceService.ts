// src/services/InvoiceService.ts
import apiClient from "./api";

export interface Invoice {
  uuid: string;
  invoice_number: string;
  amount: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  raffle_id?: string;
  ticket_numbers?: string[];
  payment_method?: string;
  payment_reference?: string;
  payment_status?: string;
  raffle?: {
    uuid?: string;
    name?: string;
    description?: string;
    raffle_date?: string;
    ticket_price?: string;
    images?: { url: string }[];
    categories?: { name: string }[];
    prizes?: any[];
    seller?: {
      uuid: string;
      name: string;
      last_name: string;
      photo: string | null;
    };
  };
  tickets?: Array<{
    uuid: string;
    number: string;
    is_winner?: boolean;
    created_at: string;
  }>;
}

export interface InvoicesResponse {
  status: string;
  data: Invoice[];
  message: string;
}

export const InvoiceService = {
  /**
   * Obtener las facturas/tickets del usuario cliente logueado
   * NOTA: El endpoint requiere que el usuario esté autenticado como CLIENTE
   */
  async getMyInvoices(): Promise<Invoice[]> {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
      }
      
      console.log("Token encontrado:", token ? "Sí" : "No");
      
      const response = await apiClient.get<InvoicesResponse>(
        "/invoices/my-invoices/client",
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Respuesta del servidor:", response.data);
      
      if (response.data.status === "success") {
        return response.data.data;
      } else {
        console.error("Error en la respuesta del servidor:", response.data.message);
        throw new Error(response.data.message || "Error al obtener las facturas");
      }
    } catch (error: any) {
      console.error("Error detallado al obtener las facturas:", error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.error("Respuesta del servidor (error):", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        
        if (error.response.status === 401) {
          throw new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        } else if (error.response.status === 403) {
          throw new Error("No tienes permisos para acceder a esta información.");
        } else if (error.response.status === 404) {
          throw new Error("El recurso solicitado no fue encontrado.");
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error("No se recibió respuesta del servidor:", error.request);
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      }
      
      throw error;
    }
  },


  /**
   * Obtener detalles de una factura específica
   */
  async getInvoiceDetails(invoiceUuid: string): Promise<Invoice | null> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `/invoices/${invoiceUuid}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error al obtener detalles de la factura ${invoiceUuid}:`, error);
      throw error;
    }
  },

  /**
   * Descargar PDF de una factura
   */
  async downloadInvoicePDF(invoiceUuid: string): Promise<Blob> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `/invoices/${invoiceUuid}/download`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          responseType: 'blob'
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error al descargar PDF de la factura ${invoiceUuid}:`, error);
      throw error;
    }
  }
};