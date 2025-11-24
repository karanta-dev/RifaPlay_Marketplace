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
    // NUEVO: Estado para tickets reservados en tiempo real
    realTimeReservedTickets: Set<string>;
    currentRaffleId: string | null; // Para rastrear la rifa actual en escucha
}

export const useGridStore = defineStore('grid', {
    state: (): GridState => ({
        products: [] as any[], 
        isLoadingList: false, 
        pagination: null as any,
        selectedProduct: null as any | null,
        isParticipateModalOpen: false,
        availableTickets: null,
        // NUEVO: Estado para WebSockets
        realTimeReservedTickets: new Set<string>(),
        currentRaffleId: null
    }),

    getters: {
        // NUEVO: Getter para verificar si un ticket está reservado
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
            // Verificar que Echo esté disponible
            if (!window.Echo) {
                console.warn('⚠️ Laravel Echo no está disponible. Verifica la configuración en echo.js');
                return;
            }

            // Si ya estábamos escuchando otra rifa, detener primero
            if (this.currentRaffleId && this.currentRaffleId !== raffleId) {
                this.stopListeningToTickets();
            }

            console.log(`🎯 Iniciando escucha WebSocket para rifa: ${raffleId}`);
            this.currentRaffleId = raffleId;

            try {
                // Suscribirse al canal y escuchar eventos
                window.Echo.channel('rifaplay-booked-number.channel')
                    .listen('.BookedNumberBroadcast', (event: any) => {
                        console.log('📡 Evento WebSocket recibido:', event);
                        
                        // Verificar que el evento sea para la rifa actual
                        if (event.raffle_id === raffleId && Array.isArray(event.number)) {
                            this.handleReservedTickets(event.number);
                        }
                    });

                console.log('✅ Suscrito correctamente al canal WebSocket');

            } catch (error) {
                console.error('❌ Error al suscribirse al canal WebSocket:', error);
            }
        },

        /**
         * Maneja los tickets reservados recibidos via WebSocket
         */
        handleReservedTickets(ticketNumbers: string[]) {
            if (!ticketNumbers || !Array.isArray(ticketNumbers)) {
                console.warn('⚠️ Formato de tickets reservados inválido:', ticketNumbers);
                return;
            }

            console.log(`🔄 Procesando ${ticketNumbers.length} tickets reservados:`, ticketNumbers);

            // Agregar tickets reservados al Set (formateados a 4 dígitos)
            ticketNumbers.forEach((ticketNumber: string) => {
                const formattedNumber = String(ticketNumber).padStart(4, '0');
                this.realTimeReservedTickets.add(formattedNumber);
            });

            console.log('✅ Tickets reservados actualizados. Total:', this.realTimeReservedTickets.size);
            
            // Actualizar contador de tickets disponibles
            this.updateAvailableTicketsCount(ticketNumbers.length);
        },

        /**
         * Actualiza el contador de tickets disponibles
         */
        updateAvailableTicketsCount(reservedCount: number) {
            if (this.availableTickets !== null && this.availableTickets > 0) {
                this.availableTickets = Math.max(0, this.availableTickets - reservedCount);
                console.log(`📊 Tickets disponibles actualizados: ${this.availableTickets}`);
            }
        },

        /**
         * Detiene la escucha de WebSockets
         */
        stopListeningToTickets() {
            if (!window.Echo) {
                return;
            }

            console.log('🛑 Deteniendo escucha WebSocket');
            
            try {
                window.Echo.leave('rifaplay-booked-number.channel');
                this.realTimeReservedTickets.clear();
                this.currentRaffleId = null;
                console.log('✅ Escucha WebSocket detenida correctamente');
            } catch (error) {
                console.error('❌ Error al detener escucha WebSocket:', error);
            }
        },

        /**
         * Limpia tickets reservados específicos (usado cuando liberas tickets)
         */
        clearReservedTickets(ticketNumbers: string[]) {
            if (!ticketNumbers || !Array.isArray(ticketNumbers)) {
                return;
            }

            console.log(`🧹 Limpiando ${ticketNumbers.length} tickets reservados:`, ticketNumbers);

            ticketNumbers.forEach(number => {
                const formattedNumber = String(number).padStart(4, '0');
                this.realTimeReservedTickets.delete(formattedNumber);
            });

            console.log('✅ Tickets liberados. Total reservados:', this.realTimeReservedTickets.size);
        },

        /**
         * Obtiene la cantidad de tickets reservados en tiempo real
         */
        getReservedTicketsCount(): number {
            return this.realTimeReservedTickets.size;
        },

        /**
         * Obtiene la lista de todos los tickets reservados
         */
        getReservedTicketsList(): string[] {
            return Array.from(this.realTimeReservedTickets);
        }
    }
});

// NUEVO: Extender la interfaz Window para incluir Echo
declare global {
    interface Window {
        Echo: any;
        Pusher: any;
    }
}