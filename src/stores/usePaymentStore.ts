// src/stores/usePaymentStore.ts
import { defineStore } from 'pinia'
import { PaymentFlowService } from '@/services/PaymentFlow'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    currencies: [] as any[],
    defaultCurrencyId: null as string | null,
    paymentMethods: [] as any[],
    banks: [] as any[],
    bcvRate: 0,          // Tasa para VES
    copRate: 0,          // Nueva: Tasa para COP
    loadingRates: false, // Cambiamos loadingBcv por loadingRates
    isLoaded: false
  }),


  actions: {
    async loadPaymentDataOnce() {
      if (this.isLoaded) return;
      try {
        const { currencies, defaultCurrencyId } = await PaymentFlowService.fetchCurrencies();
        this.currencies = currencies;
        this.defaultCurrencyId = defaultCurrencyId ?? null;
        this.paymentMethods = await PaymentFlowService.fetchPaymentMethods();
        this.banks = await PaymentFlowService.fetchBanks();
        this.isLoaded = true;
      } catch (error) {
        console.error("❌ Error cargando datos globales de pagos:", error);
      }
    },

    // ✅ Función para obtener todas las tasas
    async fetchAllRates() {
      this.loadingRates = true;
      try {
        const response = await fetch('https://bcv-api.karanta.dev/rates/all');
        const data = await response.json();
        
        // Buscamos las tasas para VES y COP
        const vesRate = data.find((item: any) => item.moneda === 'VES');
        const copRate = data.find((item: any) => item.moneda === 'COP');
        
        this.bcvRate = vesRate ? vesRate.oficial : 0;
        this.copRate = copRate ? copRate.oficial : 0;
      } catch (error) {
        console.error('❌ Error obteniendo tasas:', error);
      } finally {
        this.loadingRates = false;
      }
    }
  }
});