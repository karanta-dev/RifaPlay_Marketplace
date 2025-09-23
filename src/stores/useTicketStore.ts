// src/stores/useTicketStore.ts
import { defineStore } from 'pinia'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    ticketsVendidos: 1134283,
    formData: null as any | null,
    ticketNumber: null as number | null,
  }),
  actions: {
    // Método que esperas llamar desde el modal
    generateTicket(form: any) {
      this.formData = { ...form }
      this.ticketNumber = Math.floor(100000 + Math.random() * 900000)
      // actualiza contador
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
