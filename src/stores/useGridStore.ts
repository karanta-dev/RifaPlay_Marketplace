// src/stores/useGridStore.ts
import { defineStore } from 'pinia';
import { RaffleService } from "@/services/RaffleService";

interface GridState {
    products: any[];
    isLoadingList: boolean;
    pagination: any | null;
    selectedProduct: any | null;
    isParticipateModalOpen: boolean;
    availableTickets: number | null;
    realTimeReservedTickets: Set<string>;
    currentRaffleId: string | null;
}

export const useGridStore = defineStore('grid', {
    state: (): GridState => ({
        products: [] as any[], 
        isLoadingList: false, 
        pagination: null as any,
        selectedProduct: null as any | null,
        isParticipateModalOpen: false,
        availableTickets: null,
        realTimeReservedTickets: new Set<string>(),
        currentRaffleId: null
    }),

    getters: {
        isTicketReserved: (state) => {
            return (ticketNumber: string) => {
                const formattedNumber = String(ticketNumber).padStart(4, '0');
                return state.realTimeReservedTickets.has(formattedNumber);
            };
        }
    },

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
                    ticketsVendidos: 0,
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
                const count = await RaffleService.getAvailableTickets(raffleId);
                this.availableTickets = count;
            } catch (error) {
                console.error("Error al obtener tickets disponibles:", error);
                this.availableTickets = 0;
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
            this.availableTickets = null; 
            this.isParticipateModalOpen = true;
            this.fetchAvailableTickets(product.uuid);
            // NUEVO: Iniciar escucha WebSocket cuando se abre el modal
            this.startListeningToTickets(product.uuid);
        },

        closeParticipateModal() {
            this.isParticipateModalOpen = false;
            // NUEVO: Detener escucha WebSocket cuando se cierra el modal
            this.stopListeningToTickets();
        },

        // ==================== NUEVOS MÉTODOS PARA WEBSOCKETS ====================

        /**
         * Inicia la escucha de WebSockets para una rifa específica
         */
      startListeningToTickets(raffleId: string) {
            if (!window.Echo) return;

            if (this.currentRaffleId && this.currentRaffleId !== raffleId) {
                this.stopListeningToTickets();
            }

            console.log(`🎯 Escuchando tickets para rifa: ${raffleId}`);
            this.currentRaffleId = raffleId;

            try {
                const channel = window.Echo.channel('rifaplay-booked-number.channel');

                // 1. Escuchar cuando se RESERVA (Booked)
                channel.listen('.BookedNumberBroadcast', (event: any) => {
                    console.log('🔒 WebSocket Booked:', event);
                    
                    // CORRECCIÓN: Usar 'booked_numbers' según tu log de consola
                    const numbers = event.booked_numbers || event.number;
                    
                    if (event.raffle_id === raffleId && Array.isArray(numbers)) {
                        this.handleReservedTickets(numbers);
                    }
                });

                // 2. Escuchar cuando se LIBERA (Freed/Unbooked)
                // Esto soluciona que si deseleccionas, se limpie el estado para todos
                channel.listen('.FreedNumberBroadcast', (event: any) => {
                     console.log('🔓 WebSocket Freed:', event);
                     // Asumimos que la estructura es similar, ajusta si tu backend usa otro nombre
                     const numbers = event.freed_numbers || event.booked_numbers || event.number;
                     
                     if (event.raffle_id === raffleId && Array.isArray(numbers)) {
                         this.clearReservedTickets(numbers);
                     }
                });

            } catch (error) {
                console.error('❌ Error WebSocket:', error);
            }
        },

handleReservedTickets(ticketNumbers: string[]) {
            ticketNumbers.forEach((ticketNumber: string) => {
                const formattedNumber = String(ticketNumber).padStart(4, '0');
                this.realTimeReservedTickets.add(formattedNumber);
            });
            // Actualizar contador aproximado
            this.updateAvailableTicketsCount(ticketNumbers.length);
        },

        clearReservedTickets(ticketNumbers: string[]) {
            ticketNumbers.forEach(number => {
                const formattedNumber = String(number).padStart(4, '0');
                this.realTimeReservedTickets.delete(formattedNumber);
            });
        },

        updateAvailableTicketsCount(change: number) {
            if (this.availableTickets !== null) {
                // Si reservan, restamos. Si liberan, deberíamos sumar (lógica simplificada aquí)
                this.availableTickets = Math.max(0, this.availableTickets - change);
            }
        },

        stopListeningToTickets() {
            if (!window.Echo) return;
            window.Echo.leave('rifaplay-booked-number.channel');
            this.realTimeReservedTickets.clear();
            this.currentRaffleId = null;
        }
    }
});

declare global {
    interface Window {
        Echo: any;
        Pusher: any;
    }
}