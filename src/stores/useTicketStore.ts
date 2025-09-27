// src/stores/useTicketStore.ts
import { defineStore } from 'pinia'

// Key for localStorage persistence
const PERSIST_KEY = 'rifa_ticket_store_v1'

// Try to read persisted state
let persisted: any = null
try {
  const raw = localStorage.getItem(PERSIST_KEY)
  if (raw) persisted = JSON.parse(raw)
} catch (e) {
  persisted = null
}

interface Product {
  title: string
  rifero: string
  categories: string[]
  description: string
  images: string[]
  ticketPrice: number
  ticketsVendidos: number
  ticketsMax: number
  drawDate: string
  winnerTicketNumber?: number | null
}

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    ticketsVendidos: 1134283,
    formData: null as any | null,
    ticketNumber: null as number | null,
    lastAssignedTickets: [] as number[],

    // Tickets individuales asociados a usuario/producto
    tickets: (persisted?.tickets ?? []) as Array<{
      ticketNumber: number
      productId: string
      userId: number | string | null
      createdAt: string
      quantity?: number
      isWinner?: boolean
    }>,

    // Lista de rifas (productos) con varios premios
    topProducts: (persisted?.topProducts ?? [
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
        title: 'Meru 2025',
        rifero: 'Juan Pérez',
        categories: ['Autos'],
        description: 'Un carro usado pero que se ve como nuevo, directo de agencia. Incluye audio premium.',
        images: [
          'https://th.bing.com/th/id/R.5c7b5fea0c9a271bcb34bed0baa006aa?rik=c5nFsW2lrYoDng&riu=http%3a%2f%2ftopcarspecs.com%2fmanufacturers%2ftoyota%2ftoyota-meru%2ftoyota-meru-3.jpg&ehk=dtsNxgJbGz%2fh2D7vu9kkZF8nA%2b5GrkFN7pYcxOmL85U%3d&risl=&pid=ImgRaw&r=0',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
        ],
        ticketPrice: 10,
        ticketsVendidos: 723,
        ticketsMax: 1000,
        drawDate: '2025-09-25T10:00:00'
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
        ticketsVendidos: 1000,
        ticketsMax: 1000,
        drawDate: '2025-09-26T11:00:00'
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
        drawDate: '2025-09-25T15:00:00'
      }
    ]) as Product[],
  }),
  getters: {
    productProgress: () => {
      return (product: { ticketsVendidos: number; ticketsMax: number }) =>
        Math.min(100, Math.round((product.ticketsVendidos / product.ticketsMax) * 100))
    },
    productAlmostSoldOut: () => {
      return (product: { ticketsVendidos: number; ticketsMax: number }) =>
        (product.ticketsVendidos / product.ticketsMax) >= 0.7
    },

    // ✅ Ahora filtra considerando arrays de categorías
    productsByCategory: (state) => {
      return (category: string) =>
        state.topProducts.filter((p: Product) => p.categories.includes(category))
    },

    // ✅ Extrae todas las categorías únicas
    allCategories: (state) => {
      return [...new Set(state.topProducts.flatMap((p: Product) => p.categories))]
    },
    
    // ✅ NUEVO GETTER: Devuelve una lista de todos los tickets NO vendidos para un producto.
    availableTicketsForProduct: (state) => {
      return (productId: string): number[] => {
        const p = state.topProducts.find((t: any) => t.title === productId)
        if (!p) return []
        const ticketsMax = Number(p?.ticketsMax ?? 0)
        const usedSet = new Set<number>(state.tickets.filter(t => t.productId === productId).map(t => Number(t.ticketNumber)))

        // Generar todos los números de ticket disponibles (1 hasta ticketsMax, excluyendo vendidos)
        const available: number[] = []
        for (let i = 1; i <= ticketsMax; i++) {
          if (!usedSet.has(i)) {
            available.push(i)
          }
        }
        return available
      }
    }
  },
  actions: {
    // Helper: generate a unique 6-digit number (mapped if ticketsMax smaller)
    _generateUnique6Digit(usedSet: Set<number>, ticketsMax: number) {
      const MAX_ATTEMPTS = 2000
      let attempts = 0
      while (attempts < MAX_ATTEMPTS) {
        const rand6 = Math.floor(100000 + Math.random() * 900000)
        // map into 1..ticketsMax if ticketsMax is small
        const candidate = ticketsMax < 900000 ? ((rand6 % ticketsMax) + 1) : rand6
        if (!usedSet.has(candidate)) return candidate
        attempts++
      }
      // fallback linear scan
      for (let i = 1; i <= ticketsMax; i++) if (!usedSet.has(i)) return i
      throw new Error('No ticket numbers available')
    },

    // Persist minimal state to localStorage
    _savePersist() {
      try {
        const data = {
          tickets: this.tickets,
          topProducts: this.topProducts
        }
        localStorage.setItem(PERSIST_KEY, JSON.stringify(data))
      } catch (e) {
        // ignore
      }
    },

    // Genera tickets vinculados a un producto y a un usuario (usa 6-dígitos únicos por producto)
    // optional selectedNumbers: if provided, the store will use those ticket numbers first (if available)
    generateTicket(form: any, product: any, userId: number | string | null = null, selectedNumbers?: number[]) {
      this.formData = { ...form }
      const cantidadRequested = selectedNumbers?.length ?? Math.max(1, Number(form.tickets ?? 1)) // Usa la cantidad de manuales si existen
      const p = this.topProducts.find((t: any) => t.title === (product?.title ?? product))
      const ticketsMax = Number(p?.ticketsMax ?? Infinity)
      const sold = Number(p?.ticketsVendidos ?? 0)
      const available = Math.max(0, ticketsMax - sold)

      // Si estamos en modo manual, la cantidad a comprar es la cantidad seleccionada.
      // Si estamos en modo automático, la cantidad a comprar es la cantidad solicitada, limitada por la disponibilidad.
      const cantidad = selectedNumbers?.length ?? Math.min(cantidadRequested, available)
      
      if (cantidad <= 0) {
        this.ticketNumber = null
        return
      }

      const productId = p?.title ?? (product?.title ?? 'unknown')
      const used = new Set<number>(this.tickets.filter(t => t.productId === productId).map(t => Number(t.ticketNumber)))

      const assigned: number[] = []

      // If user provided manual selections, validate and use them first
      if (Array.isArray(selectedNumbers) && selectedNumbers.length > 0) {
        for (const num of selectedNumbers) {
          if (assigned.length >= cantidad) break
          const n = Number(num)
          if (!Number.isFinite(n)) continue
          if (n < 1 || n > ticketsMax) continue
          if (used.has(n)) continue // already taken
          // use this number
          this.tickets.push({
            ticketNumber: n,
            productId,
            userId: userId ?? null,
            createdAt: new Date().toISOString(),
            quantity: 1,
            isWinner: false,
          })
          assigned.push(n)
          used.add(n)
        }
      }

      // If still need tickets (only for auto mode, as manual mode stops after processing selectedNumbers), auto-generate the rest
      for (let i = assigned.length; i < cantidad; i++) {
        const newNum = this._generateUnique6Digit(used, ticketsMax)
        this.tickets.push({
          ticketNumber: newNum,
          productId,
          userId: userId ?? null,
          createdAt: new Date().toISOString(),
          quantity: 1,
          isWinner: false,
        })
        this.ticketNumber = newNum
        assigned.push(newNum)
        used.add(newNum)
      }

      this.lastAssignedTickets = assigned
      this.venderTickets(product, assigned.length)
      this._savePersist()
    },
    venderTickets(product: any, cantidad: number) {
      this.ticketsVendidos += Number(cantidad || 0)
      const p = this.topProducts.find((t: any) => t.title === (product?.title ?? product))
      if (p) p.ticketsVendidos = (p.ticketsVendidos || 0) + Number(cantidad || 0)
    },
    // Reset temporary data (ticketNumber, formData)
    reset() {
      this.formData = null
      this.ticketNumber = null
    }
  }
})