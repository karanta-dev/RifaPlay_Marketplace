import apiClient from "./api";

export interface Raffle {
  uuid: string;
  name: string;
  description: string;
  ticket_price: number;
  tickets_sold: number;
  start_sell_at: number;
  end_sell_at: number;
  initial_range: number;
  end_range: number;
  raffle_date: string;
  status: string;
  images?: { url: string }[];
  categories?: { name: string }[];
  created_by?: { name: string };
  seller?: {
    uuid: string;
    name: string;
    last_name: string;
    photo: string | null;
  };
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

export interface Prize {
  uuid: string;
  name: string;
  description: string;
  specifications?: string;
  prize_order: number;
  prize_amount: number;
  category_id: string;
  is_approved?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PrizeResponse {
  status: string;
  data: Prize[];
}

export interface TicketsCountResponse {
  success: boolean;
  data: {
    count: number;
  };
  message: string;
}
// O MEJOR AÚN, usa esta estructura más limpia:
export interface SoldTicketsData {
  tickets: { [key: string]: string }; // Solo los tickets como strings
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export interface SoldTicketsResponse {
  success: boolean;
  data: SoldTicketsData;
  message: string;
}

export const RaffleService = {
  async getAll(page = 1, perPage = 10): Promise<PaginatedResponse<Raffle>> {
    try {
      const token = localStorage.getItem("token");
      console.log(`🔍 [RaffleService] Obteniendo rifas - Página: ${page}, Por página: ${perPage}`);

      const response = await apiClient.get('/raffles', {
        params: { page, perPage: perPage, paginated: true },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log(`✅ [RaffleService] Respuesta recibida:`, response.data);

      const raffles = response.data?.data || [];
      const meta = response.data?.meta || response.data?.pagination || null;

      console.log(`📊 [RaffleService] ${raffles.length} rifas encontradas`);

      const formattedRaffles = raffles.map((r: any) => ({
        uuid: r.uuid,
        name: r.name,
        description: r.description,
        ticket_price: Number(r.ticket_price),
        tickets_sold: r.tickets_sold ?? 0,
        start_sell_at: r.start_sell_at ?? 0,
        end_sell_at: r.end_sell_at ?? 0,
        initial_range: r.initial_range ?? 0,
        end_range: r.end_range ?? 0,
        raffle_date: r.raffle_date,
        status: r.status,
        images: r.images ?? [],
        categories: r.categories ?? [],
        prizes: r.prizes ?? [], // ✅ AÑADIDO AQUÍ
        created_by: r.created_by ?? {},
        seller: r.seller ? {
          uuid: r.seller.uuid,
          name: r.seller.name,
          last_name: r.seller.last_name,
          photo: r.seller.photo
        } : undefined
      }));

      console.log(`🎯 [RaffleService] Rifas formateadas:`, formattedRaffles);

      return { data: formattedRaffles, meta };
    } catch (error) {
      console.error("❌ [RaffleService] Error al obtener rifas:", error);
      throw error;
    }
  },

  /**
   * Obtiene la cantidad de tickets vendidos para una rifa específica
   */
  async getSoldTicketsCount(raffleUuid: string): Promise<number> {
    try {
      const token = localStorage.getItem("token");
      console.log(`🎫 [RaffleService] Obteniendo tickets vendidos para rifa: ${raffleUuid}`);

      const response = await apiClient.get(`/count-sold-tickets/${raffleUuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log(`📈 [RaffleService] Respuesta de tickets vendidos:`, response.data);

      const responseData = response.data as TicketsCountResponse;
      
      if (responseData.success) {
        console.log(`✅ [RaffleService] Tickets vendidos para ${raffleUuid}: ${responseData.data.count}`);
        return responseData.data.count;
      } else {
        console.error("❌ [RaffleService] Error en la respuesta del servidor:", responseData);
        return 0;
      }
    } catch (error) {
      console.error("❌ [RaffleService] Error al obtener cantidad de tickets vendidos:", error);
      throw error;
    }
  },
  async getSoldTickets(raffleUuid: string, page = 1, perPage = 100): Promise<number[]> {
    try {
      const token = localStorage.getItem("token");
      console.log(`🎫 [RaffleService] INICIANDO - Obteniendo tickets vendidos para: ${raffleUuid}`);

      // ✅ VERIFICACIÓN: ¿Se está ejecutando esta línea?
      console.log(`🔍 [RaffleService] URL que se intentará: /sold-tickets/${raffleUuid}`);
      console.log(`🔍 [RaffleService] Token disponible: ${!!token}`);
      console.log(`🔍 [RaffleService] Parámetros: page=${page}, per_page=${perPage}`);

      const response = await apiClient.get(`/sold-tickets/${raffleUuid}`, {
        params: { page, per_page: perPage },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log(`📋 [RaffleService] RESPUESTA CRUDA:`, response);
      console.log(`📋 [RaffleService] Status: ${response.status}`);
      console.log(`📋 [RaffleService] Headers:`, response.headers);

      const responseData = response.data;
      
      if (responseData.success) {
        const soldTickets: number[] = [];
        const data = responseData.data;
        
        for (const key in data) {
          if (/^\d+$/.test(key)) {
            const ticketNumber = parseInt(data[key], 10);
            if (!isNaN(ticketNumber)) {
              soldTickets.push(ticketNumber);
            } else {
              console.warn(`⚠️ [RaffleService] Número de ticket inválido: ${data[key]}`);
            }
          }
        }

        console.log(`✅ [RaffleService] COMPLETADO - ${soldTickets.length} tickets procesados`);
        return soldTickets;
      } else {
        console.error("❌ [RaffleService] ERROR - Respuesta no exitosa:", responseData);
        return [];
      }
    } catch (error: any) {
      console.error("❌ [RaffleService] ERROR - Excepción:", error);
      console.error("❌ [RaffleService] Mensaje de error:", error.message);
      console.error("❌ [RaffleService] Stack:", error.stack);
      
      if (error.response) {
        console.error("❌ [RaffleService] Respuesta de error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error("❌ [RaffleService] No se recibió respuesta:", error.request);
      }
      
      throw error;
    }
  },

async searchSoldTickets(raffleUuid: string, numbers: number[]): Promise<number[]> {
  try {
    const token = localStorage.getItem("token");

    // Convertimos a formato "0003,0005,9999"
    const formatted = numbers.map(n => String(n).padStart(4, "0")).join(",");

    console.log(`🔍 [RaffleService] Buscando tickets vendidos:`, formatted);

    const response = await apiClient.get(`/sold-tickets/${raffleUuid}/searchNumber=${formatted}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    console.log(`📋 [RaffleService] Respuesta searchSoldTickets:`, response.data);

    const data = response.data?.data ?? {};
    const soldTickets: number[] = [];

    for (const key in data) {
      if (/^\d+$/.test(key)) {
        const ticket = parseInt(data[key], 10);
        if (!isNaN(ticket)) soldTickets.push(ticket);
      }
    }

    console.log(`✅ [RaffleService] Tickets vendidos encontrados:`, soldTickets);
    return soldTickets;
  } catch (error) {
    console.error("❌ [RaffleService] Error en searchSoldTickets:", error);
    return [];
  }
},

  /**
   * Obtiene los detalles de un premio específico
   */
  async getPrizeDetails(prizeUuid: string): Promise<Prize> {
    try {
      const token = localStorage.getItem("token");

      const response = await apiClient.get(`/prizes/${prizeUuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Error al obtener detalles del premio:", error);
      throw error;
    }
  },
};

export const PrizeService = {
  /**
   * Obtiene todos los premios de un sorteo específico
   */
  async getRafflePrizes(raffleUuid: string): Promise<Prize[]> {
    try {
      const response = await apiClient.get(`/raffles/${raffleUuid}/prizes`);

      const responseData = response.data as PrizeResponse;
      
      if (responseData.status === "success") {
        return responseData.data || [];
      } else {
        console.error("❌ Error en la respuesta del servidor:", responseData);
        return [];
      }
    } catch (error) {
      console.error("❌ Error al obtener premios del sorteo:", error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un premio específico
   */
  async getPrizeDetails(prizeUuid: string): Promise<Prize> {
    try {
      const token = localStorage.getItem("token");

      const response = await apiClient.get(`/prizes/${prizeUuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Error al obtener detalles del premio:", error);
      throw error;
    }
  },
};