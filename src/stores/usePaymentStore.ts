// src/stores/usePaymentStore.ts
import { defineStore } from 'pinia'
import { PaymentFlowService } from '@/services/PaymentFlow'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    currencies: [] as any[],
    defaultCurrencyId: null as string | null,

    paymentMethods: [] as any[],
    banks: [] as any[],

    bcvRate: 0,          // ✅ Tasa BCV
    loadingBcv: false,   // ✅ Loader de la tasa BCV

    isLoaded: false // <-- evita recargar datos globales repetidamente
  }),

  actions: {
    async loadPaymentDataOnce() {
      if (this.isLoaded) return; // ✅ evita llamadas repetidas

      try {
        const { currencies, defaultCurrencyId } = await PaymentFlowService.fetchCurrencies();
        this.currencies = currencies;
        this.defaultCurrencyId = defaultCurrencyId ?? null;

        this.paymentMethods = await PaymentFlowService.fetchPaymentMethods();
        this.banks = await PaymentFlowService.fetchBanks();

        this.isLoaded = true; // ✅ marcamos como cargado
      } catch (error) {
        console.error("❌ Error cargando datos globales de pagos:", error);
      }
    },

    // ✅ Función para obtener la tasa BCV
    async fetchBcvRate() {
      this.loadingBcv = true;
      try {
        const response = await fetch('https://bcv-api.karanta.dev/rates/');
        const data = await response.json();
        this.bcvRate = data.bcv || 0;
      } catch (error) {
        console.error('❌ Error obteniendo tasa BCV:', error);
      } finally {
        this.loadingBcv = false;
      }
    }
  }
});
