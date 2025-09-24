// src/stores/useTicketStore.ts
import { defineStore } from 'pinia'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    ticketsVendidos: 1134283,
    formData: null as any | null,
    ticketNumber: null as number | null,

    // Lista de rifas (productos) con varios premios
    topProducts: [
      {
        title: 'Toyota Corolla 2025',
        rifero: 'Juan Pérez',
        categories: ['Autos'],
        description: 'Un carro nuevo, directo de agencia. Incluye audio premium.',
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
        ],
        ticketPrice: 10,
        ticketsVendidos: 723,
        ticketsMax: 1000,
        drawDate: '2025-11-25T10:00:00'
      },
      {
        title: 'iPhone + AirPods',
        rifero: 'Tech Store',
        categories: ['Electrodomésticos', 'Moviles'],
        description: 'Paquete con iPhone desbloqueado + AirPods Pro.',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        ],
        ticketPrice: 5,
        ticketsVendidos: 1450,
        ticketsMax: 2000,
        drawDate: '2025-11-28T12:30:00'
      },
      {
        title: 'Viaje a París',
        rifero: 'TravelRaffle',
        categories: ['Viajes', 'Experiencias'],
        description: 'Vuelo ida y vuelta + 5 noches en hotel 4 estrellas para 2 personas.',
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
        ],
        ticketPrice: 15,
        ticketsVendidos: 320,
        ticketsMax: 500,
        drawDate: '2025-12-05T09:00:00'
      },
      {
        title: 'PlayStation 5 + Juegos',
        rifero: 'Game World',
        categories: ['Electrodomésticos', 'Gaming'],
        description: 'Consola PS5 edición estándar + 3 juegos a elegir.',
        images: [
          'https://images.unsplash.com/photo-1606813907299-98c7d4d50ebd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1606813907505-9a74a9ffb1ac?auto=format&fit=crop&w=800&q=80'
        ],
        ticketPrice: 8,
        ticketsVendidos: 900,
        ticketsMax: 1200,
        drawDate: '2025-11-30T18:00:00'
      },
      {
        title: 'Smart TV Samsung 65"',
        rifero: 'ElectroShop',
        categories: ['Electrodomésticos'],
        description: 'Pantalla 4K UHD Smart TV, ideal para cine en casa.',
        images: [
          'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'
        ],
        ticketPrice: 6,
        ticketsVendidos: 250,
        ticketsMax: 400,
        drawDate: '2025-12-02T14:00:00'
      },
      {
        title: 'MacBook Air M2',
        rifero: 'Apple Lovers',
        categories: ['Electrodomésticos', 'Computadoras'],
        description: 'Laptop ultraligera con chip M2 y 512GB SSD.',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
        ],
        ticketPrice: 12,
        ticketsVendidos: 600,
        ticketsMax: 1000,
        drawDate: '2025-12-10T11:00:00'
      },
      {
        title: 'Carro Honda CBR500R',
        rifero: 'Carros Club',
        categories: ['Autos'],
        description: 'Carro deportivo, modelo 2025, lista para carretera.',
        images: [
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80'
        ],
        ticketPrice: 20,
        ticketsVendidos: 180,
        ticketsMax: 300,
        drawDate: '2025-12-15T16:00:00'
      }
    ]
  }),
  getters: {
    productProgress: (state) => {
      return (product: { ticketsVendidos: number; ticketsMax: number }) =>
        Math.min(100, Math.round((product.ticketsVendidos / product.ticketsMax) * 100))
    },
    productAlmostSoldOut: (state) => {
      return (product: { ticketsVendidos: number; ticketsMax: number }) =>
        (product.ticketsVendidos / product.ticketsMax) >= 0.7
    },

    // ✅ Ahora filtra considerando arrays de categorías
    productsByCategory: (state) => {
      return (category: string) =>
        state.topProducts.filter(p => p.categories.includes(category))
    },

    // ✅ Extrae todas las categorías únicas
    allCategories: (state) => {
      return [...new Set(state.topProducts.flatMap(p => p.categories))]
    }
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
    }
  }
})
