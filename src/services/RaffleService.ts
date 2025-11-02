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
  created_by_id?: string;
  created_name_by?: string | null;
  updated_by_id?: string;
  updated_name_by?: string | null;
  raffle_id?: string;
  deleted_at?: string | null;
  has_winner?: boolean;
  is_claimed?: boolean;
  lottery_draw_id?: string | null;
  number_winner?: string | null;
  status?: string;
  status_history?: string | null;
  ticket_winner?: string | null;
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
export interface SoldTicketsData {
  tickets: { [key: string]: string };
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

// INTERFAZ ARREGLADA: 'number' ahora es un 'string'
export interface RaffleGridTicket {
  number: string;
  status: 'sold' | 'reserved' | 'available';
}

export interface PaginatedGridResponse {
  data: RaffleGridTicket[];
  meta: PaginationMeta;
}

// Interfaz para el perfil de usuario (rifero)
export interface UserProfile {
  uuid: string;
  name: string;
  member_since: string;
  profile: {
    type: string;
    data: {
      first_name: string | null;
      last_name: string | null;
      city: string | null;
      state: string | null;
    };
  };
  raffles: Raffle[]; // Usamos la interfaz Raffle que ya tenemos
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
}

export const RaffleService = {
  async getAll(page = 1, perPage = 10): Promise<PaginatedResponse<Raffle>> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get('/raffles', {
        params: { page, perPage: perPage, paginated: true },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const raffles = response.data?.data || [];
      const meta = response.data?.meta || response.data?.pagination || null;
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
      return { data: formattedRaffles, meta };
    } catch (error) {
      console.error("Error al obtener rifas:", error);
      throw error;
    }
  },

  async getSoldTicketsCount(raffleUuid: string): Promise<number> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(`/count-sold-tickets/${raffleUuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const responseData = response.data as TicketsCountResponse;
      if (responseData.success) {
        return responseData.data.count;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error al obtener cantidad de tickets vendidos:", error);
      throw error;
    }
  },
  
  async getSoldTickets(raffleUuid: string, page = 1, perPage = 100): Promise<number[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(`/sold-tickets/${raffleUuid}`, {
        params: { page, per_page: perPage },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const responseData = response.data;
      if (responseData.success) {
        const soldTickets: number[] = [];
        const data = responseData.data;
        for (const key in data) {
          if (/^\d+$/.test(key)) {
            const ticketNumber = parseInt(data[key], 10);
            if (!isNaN(ticketNumber)) soldTickets.push(ticketNumber);
          }
        }
        return soldTickets;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error("ERROR en getSoldTickets:", error);
      throw error;
    }
  },

  async searchSoldTickets(raffleUuid: string, numbers: number[]): Promise<number[]> {
    try {
      const token = localStorage.getItem("token");
      const formatted = numbers.map(n => String(n).padStart(4, "0")).join(",");
      const response = await apiClient.get(`/sold-tickets/${raffleUuid}/searchNumber=${formatted}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = response.data?.data ?? {};
      const soldTickets: number[] = [];
      for (const key in data) {
        if (/^\d+$/.test(key)) {
          const ticket = parseInt(data[key], 10);
          if (!isNaN(ticket)) soldTickets.push(ticket);
        }
      }
      return soldTickets;
    } catch (error) {
      console.error("Error en searchSoldTickets:", error);
      return [];
    }
  },

  async getPrizeDetails(prizeUuid: string): Promise<Prize> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(`/prizes/${prizeUuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error al obtener detalles del premio:", error);
      throw error;
    }
  },

  async getRaffleGrid(raffleId: string, page = 1, perPage = 50): Promise<PaginatedGridResponse> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(`/get-raffle-grid/${raffleId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { page, perPage}
      });

      const apiData = response.data.data;

      const formattedResponse: PaginatedGridResponse = {
        data: apiData.grid,
        meta: {
          current_page: apiData.current_page,
          last_page: apiData.last_page,
          per_page: apiData.per_page,
          total: apiData.total_numbers
        }
      };
      
      return formattedResponse;
    } catch (error) {
      console.error(`Error al obtener la grilla paginada de la rifa:`, error);
      throw error;
    }
  },

  /**
   * Reserva uno o más tickets para un usuario.
   * @param raffleId - El UUID de la rifa.
   * @param documentType - Tipo de documento del usuario (ej: "V").
   * @param documentNumber - Número de documento del usuario.
   * @param ticketNumbers - Un array de strings con los números a reservar.
   */
  async bookTickets(raffleId: string, documentType: string, documentNumber: string, ticketNumbers: string[]): Promise<any> {
    const payload = {
      document_type: documentType,
      document_number: documentNumber,
      book_numbers: ticketNumbers,
    };
    const { data } = await apiClient.post(`/raffles/${raffleId}/book-tickets`, payload, 
      { headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
     }}
     ) ;
    return data;
  },

  /**
   * Libera la reserva de uno o más tickets.
   */
 async unbookTickets(raffleId: string, docType: string, docNumber: string, ticketNumbers: string[]): Promise<any> {
    const payload = {
      document_type: docType,
      document_number: docNumber,
      book_numbers: ticketNumbers,
    };

    const { data } = await apiClient.post(`/raffles/${raffleId}/unbook-tickets`, payload, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (data?.status === false) {
      throw new Error(`Los siguientes tickets no pudieron ser liberados: ${data.data.join(', ')}`);
    }
    return data;
  }
};


export const PrizeService = {
  async getRafflePrizes(raffleUuid: string): Promise<Prize[]> {
    try {
      const response = await apiClient.get(`/raffles/${raffleUuid}/prizes`);
      const responseData = response.data as PrizeResponse;
      if (responseData.status === "success") {
        return responseData.data || [];
      } else {
        console.error("Error en la respuesta del servidor:", responseData);
        return [];
      }
    } catch (error) {
      console.error("Error al obtener premios del sorteo:", error);
      throw error;
    }
  },

  async getPrizeDetails(prizeUuid: string): Promise<Prize> {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(`/prizes/${prizeUuid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error al obtener detalles del premio:", error);
      throw error;
    }
  },
};
// Servicio para obtener el perfil público del usuario
export const UserService = {
  async getPublicProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get(`/users/public/${userId}`);
      const responseData = response.data as UserProfileResponse;
      if (responseData.success) {
        return responseData.data;
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error("Error al obtener el perfil público:", error);
      throw error;
    }
  },
};