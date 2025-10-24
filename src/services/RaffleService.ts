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

export const RaffleService = {
  async getAll(page = 1, perPage = 10): Promise<PaginatedResponse<Raffle>> {
    try {
      const token = localStorage.getItem("token");

const response = await apiClient.get('/raffles', {        params: { page, perPage: perPage, paginated: true },
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
        created_by: r.created_by ?? {},
      }));

      return { data: formattedRaffles, meta };
    } catch (error) {
      console.error("❌ Error al obtener rifas:", error);
      throw error;
    }
  },
    /**
   * Obtiene los detalles de un premio específico
   */
  async getPrizeDetails(prizeUuid: string): Promise<Prize> {
    try {

    const response = await apiClient.get(`/prizes/${prizeUuid}`);
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
