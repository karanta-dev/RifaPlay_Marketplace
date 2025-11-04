// src/stores/useGridStore.ts
import { defineStore } from 'pinia';
import { RaffleService } from "@/services/RaffleService";
// Asegúrate de importar el servicio de pago aquí
import { PaymentFlowService, type Currency, type PaymentMethod, type Bank } from '@/services/PaymentFlow';

interface GridState {
    products: any[];
    isLoadingList: boolean;
    pagination: any | null;
    selectedProduct: any | null;
    isParticipateModalOpen: boolean;
    availableTickets: number | null;
    
    // --- ESTADO AÑADIDO PARA LOS DATOS DEL MODAL ---
    bcvRate: number;
    banks: Bank[];
    paymentMethods: PaymentMethod[];
    currencies: Currency[];
    isLoadingModalData: boolean; // El cerrojo definitivo
    modalDataLoaded: boolean;    // Para no recargar si ya tenemos los datos
}

export const useGridStore = defineStore('grid', {
    state: (): GridState => ({
        products: [], 
        isLoadingList: false, 
        pagination: null,
        selectedProduct: null,
        isParticipateModalOpen: false,
        availableTickets: null,
        
        // --- VALORES INICIALES PARA EL NUEVO ESTADO ---
        bcvRate: 0,
        banks: [],
        paymentMethods: [],
        currencies: [],
        isLoadingModalData: false,
        modalDataLoaded: false,
    }),
    actions: {
        async fetchProductList(page = 1, perPage = 16) {
          // ... tu función original no cambia ...
          this.isLoadingList = true;
          try {
            const response = await RaffleService.getAll(page, perPage);
            if (!response || !Array.isArray(response.data)) {
                this.products = []; return;
            }
            this.products = response.data.map(/*...tu map...*/);
            this.pagination = response.meta || null;
          } catch (error) {
            console.error("Error al cargar la lista de productos:", error);
          } finally {
            this.isLoadingList = false;
          }
        },

        async fetchAvailableTickets(raffleId: string) {
            // ... tu función original no cambia ...
        },

        async fetchProductProgress(productUuid: string) {
            // ... tu función original no cambia ...
        },

        // --- ACCIÓN NUEVA Y CENTRALIZADA PARA CARGAR DATOS ---
        async loadModalData() {
            if (this.isLoadingModalData || this.modalDataLoaded) {
                return; // Si ya estamos cargando o ya cargamos, no hacer nada.
            }

            this.isLoadingModalData = true;
            console.log('STORE: Cerrojo puesto. Iniciando carga de datos...');

            try {
                const [bcvResponse, methods, banksList, currenciesData] = await Promise.all([
                    fetch('https://bcv-api.karanta.dev/rates/'),
                    PaymentFlowService.fetchPaymentMethods(),
                    PaymentFlowService.fetchBanks(),
                    PaymentFlowService.fetchCurrencies(),
                ]);
                
                const bcvJson = await bcvResponse.json();
                
                this.bcvRate = bcvJson.bcv || 0;
                this.paymentMethods = methods;
                this.banks = banksList;
                this.currencies = currenciesData?.currencies ?? [];
                
                this.modalDataLoaded = true;
                console.log('STORE: Datos cargados y guardados en el store.');
            } catch (error) {
                console.error('STORE: Error al cargar datos', error);
            } finally {
                this.isLoadingModalData = false;
                console.log('STORE: Cerrojo quitado.');
            }
        },

        // --- ACCIONES DEL MODAL MODIFICADAS ---
        openParticipateModal(product: any) {
          this.selectedProduct = product;
          this.availableTickets= null; 
          this.isParticipateModalOpen = true;
          this.fetchAvailableTickets(product.uuid); 
          
          // ¡AQUÍ ESTÁ LA MAGIA!
          // Al abrir el modal, llamamos a nuestra acción de carga.
          // El cerrojo dentro de la acción se encargará de que solo se ejecute una vez.
          this.loadModalData();
        },

        closeParticipateModal() {
          this.isParticipateModalOpen = false;
          // Reseteamos la bandera para que la próxima vez que se abra, sí cargue los datos.
          this.modalDataLoaded = false;
        }
    }
});