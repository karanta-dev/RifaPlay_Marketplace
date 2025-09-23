// src/stores/useTicketStore.ts
import { defineStore } from 'pinia'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    ticketsVendidos: 1134283,
    formData: null as any | null,
    ticketNumber: null as number | null,

    // Lista de productos con limite de tickets
    topProducts: [
      {
        title: 'Toyota Corolla 2025',
        image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80',
        ticketsVendidos: 723,
        ticketsMax: 1000,
      },
      {
        title: 'iPhone Desbloqueado',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        ticketsVendidos: 1450,
        ticketsMax: 2000,
      },
      {
        title: '$30,000 en efectivo',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
        ticketsVendidos: 800,
        ticketsMax: 2000,
      },
      {
        title: 'Tu casa nueva',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        ticketsVendidos: 1700,
        ticketsMax: 2000,
      },
    ],
  }),
  getters: {
    // Calcular progreso en %
    productProgress: (state) => {
      return (product: { ticketsVendidos: number; ticketsMax: number }) =>
        Math.min(100, Math.round((product.ticketsVendidos / product.ticketsMax) * 100))
    },
    // Detectar si ya está en el último 30% (>=70%)
    productAlmostSoldOut: (state) => {
      return (product: { ticketsVendidos: number; ticketsMax: number }) =>
        (product.ticketsVendidos / product.ticketsMax) >= 0.7
    },
  },
  actions: {
    generateTicket(form: any) {
      this.formData = { ...form }
      this.ticketNumber = Math.floor(100000 + Math.random() * 900000)
      this.venderTickets(form.tickets ?? 1)
    },
    venderTickets(cantidad: number) {
      this.ticketsVendidos += Number(cantidad || 0)
    },
    reset() {
      this.formData = null
      this.ticketNumber = null
    },
  },
})
