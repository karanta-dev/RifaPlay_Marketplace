import { defineStore } from 'pinia';
import { RaffleService } from "@/services/RaffleService";

// ... (las interfaces ApiRaffle, ApiMeta, y GridProduct van aquí, como las definimos antes) ...

export const useGridStore = defineStore('grid', {
    state: () => ({
        products: [] as any[], // Usamos 'any' para evitar más putos errores de tipos
        isLoadingList: false, // Un loading para la lista principal
        pagination: null as any,
    }),

    actions: {
        // ✅ 1. ACCIÓN PARA LA LISTA. RÁPIDA.
        async fetchProductList(page = 1, perPage = 16) {
          this.isLoadingList = true;
          try {
            const { data, meta } = await RaffleService.getAll(page, perPage) as any;
            
            this.products = data.map((r: any) => ({
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
              ticketsVendidos: null, // Dato clave: 'null' significa que el progreso no se ha pedido
              isProgressLoading: false, // Flag para el spinner pequeño
            }));

            this.pagination = meta || null;
          } catch (error) {
            console.error("Error al cargar la lista de productos:", error);
          } finally {
            this.isLoadingList = false;
          }
        },
        
        // ✅ 2. ACCIÓN PARA EL PROGRESO INDIVIDUAL
        async fetchProductProgress(productUuid: string) {
            const productIndex = this.products.findIndex(p => p.uuid === productUuid);
            if (productIndex === -1 || this.products[productIndex].ticketsVendidos !== null) {
                return;
            }

            try {
                this.products[productIndex].isProgressLoading = true;
                const realTicketsSold = await RaffleService.getSoldTicketsCount(productUuid);
                this.products[productIndex].ticketsVendidos = realTicketsSold;
            } catch (error) {
                console.error(`Error al obtener progreso para ${productUuid}:`, error);
                this.products[productIndex].ticketsVendidos = 0;
            } finally {
                if (this.products[productIndex]) {
                   this.products[productIndex].isProgressLoading = false;
                }
            }
        },
    }
});