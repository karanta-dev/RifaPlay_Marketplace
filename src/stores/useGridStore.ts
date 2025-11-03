// src/stores/useGridStore.ts
import { defineStore } from 'pinia';
import { RaffleService } from "@/services/RaffleService";

interface GridState {
    products: any[];
    isLoadingList: boolean;
    pagination: any | null;
    selectedProduct: any | null;
    isParticipateModalOpen: boolean;
    availableTickets: number | null; // <-- AQUÍ LE DICES A TYPESCRIPT QUE ESTA MIERDA EXISTE
}

export const useGridStore = defineStore('grid', {
    state: (): GridState => ({
        products: [] as any[], 
        isLoadingList: false, 
        pagination: null as any,
        selectedProduct: null as any | null,
        isParticipateModalOpen: false,
        availableTickets: null
    }),
    actions: {
        async fetchProductList(page = 1, perPage = 16) {
          this.isLoadingList = true;
          try {
            const response = await RaffleService.getAll(page, perPage);
            
            if (!response || !Array.isArray(response.data)) {
                console.error("Respuesta de API inválida al buscar productos:", response);
                this.products = [];
                return;
            }

            this.products = response.data
              .filter(r => r && r.uuid)
              .map((r: any) => ({
                uuid: r.uuid,
                title: r.name,
                description: r.description,
                ticketsMax: r.end_range,
                drawDate: r.raffle_date,
                ticketPrice: parseFloat(r.ticket_price),
                rifero: r.seller ? `${r.seller.name} ${r.seller.last_name}`.trim() : "Anónimo",
                images: r.images?.map((img: any) => img.url) ?? [],
                categories: r.prizes?.[0]?.category ? [r.prizes[0].category.name] : [],
                status: r.status,
                ticketsVendidos: null,
                isProgressLoading: false,
              }));

            this.pagination = response.meta || null;

          } catch (error) {
            console.error("Error al cargar la lista de productos:", error);
            this.products = [];
          } finally {
            this.isLoadingList = false;
          }
        },
        async fetchAvailableTickets(raffleId: string) {
            try {
                // Asumo que tu RaffleService tiene un método para esto. Si no, créalo.
                const count = await RaffleService.getAvailableTickets(raffleId);
                this.availableTickets = count;
            } catch (error) {
                console.error("Error al obtener tickets disponibles:", error);
                this.availableTickets = 0; // Ponemos 0 en caso de error
            }
        },
        async fetchProductProgress(productUuid: string) {
            const product = this.products.find(p => p.uuid === productUuid);
            if (!product || product.ticketsVendidos !== null) {
                return;
            }
            try {
                product.isProgressLoading = true;
                const realTicketsSold = await RaffleService.getSoldTicketsCount(productUuid);
                product.ticketsVendidos = realTicketsSold;
            } catch (error) {
                console.error(`Error al obtener progreso para ${productUuid}:`, error);
                product.ticketsVendidos = 0;
            } finally {
                if (product) {
                   product.isProgressLoading = false;
                }
            }
        },

        openParticipateModal(product: any) {
          this.selectedProduct = product;
          this.availableTickets= null; 
          this.isParticipateModalOpen = true;
          this.fetchAvailableTickets(product.uuid); 

        },

        closeParticipateModal() {
          this.isParticipateModalOpen = false;
        }
    }
});