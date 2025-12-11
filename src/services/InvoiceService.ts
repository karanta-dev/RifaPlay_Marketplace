// src/services/InvoiceService.ts
import apiClient from "./api";

// Interfaces basadas en la respuesta real del backend
export interface Payment {
  uuid: string;
  original_amount: string;
  current_currency_amount: string;
  exchange_rate: string;
  payment_date: string;
  status: string;
  transaction_id: string;
  payment_method?: {
    uuid: string;
    method_name: string;
    currency?: {
      name: string;
      short_name: string;
    };
  };
}

export interface TicketDetail {
  uuid: string;
  number: string;
  raffle_ticket_id: string;
}

export interface Itemable {
  uuid: string;
  ticket_number: string;
  raffle_id: string;
  is_winner?: boolean;
  status: string; // Este campo SÍ existe en la respuesta
  details: TicketDetail[];
}

export interface Invoiceable {
  uuid: string;
  name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  phone: string;
}

export interface Invoice {
  uuid: string;
  invoice_number: string;
  amount: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  itemable: Itemable;
  invoiceable: Invoiceable;
  payments?: Payment[]; // Este campo SÍ existe en la respuesta
}

export interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
  message: string;
}

export const InvoiceService = {
  /**
   * Obtener las facturas/tickets del usuario cliente logueado
   */
  async getMyInvoices(): Promise<Invoice[]> {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
      }
      
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
      
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("Error en la respuesta del servidor:", response.data.message);
        throw new Error(response.data.message || "Error al obtener las facturas");
      }
    } catch (error: any) {
      console.error("Error detallado al obtener las facturas:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        } else if (error.response.status === 403) {
          throw new Error("No tienes permisos para acceder a esta información.");
        } else if (error.response.status === 404) {
          throw new Error("El recurso solicitado no fue encontrado.");
        }
      } else if (error.request) {
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